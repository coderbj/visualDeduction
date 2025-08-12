import {ref, Ref, toRef, watch,} from 'vue'
import {storeToRefs} from 'pinia'
import '@leafer-in/view'
import '@leafer-in/viewport'
import '@leafer-in/editor'
import '@leafer-in/text-editor'
import {Ruler} from 'leafer-x-ruler'
import {
  IUIJSONData,
  Platform,
  IZoomType,
  ImageEvent,
  Line,
  Polygon,
  ZoomEvent,
  Pen,
  Box,
  EditorScaleEvent,
} from 'leafer-editor'
import {CustomResGroup} from './CustomResGroup.ts'
import InitCustomAttr, {ExtendedIU} from './InitCustomAttr.ts'
import handleWindDirection from './WindDirection.ts'
import {ElMessage, ElMessageBox} from 'element-plus'
import {
  App,
  DragEvent as LeaferDragEvent,
  Group,
  PointerEvent,
  Frame,
  EditorEvent,
  Rect,
  Star,
  Ellipse,
  Image,
  Text,
} from 'leafer-editor'

import History from './History.ts'
import {IAppProps, IUIExtended} from './types.ts'
import {Tools} from './Tools.ts'
import {button} from './OperateButtons.ts'
import {useResourceStore} from '../store/resource.ts'
import {useGlobalStore} from '../store/global.ts'
import {
  defaultRectData,
  defaultStarData,
  defaultEllipseData,
  defaultLineData,
  defaultPolygonData,
  defaultArrowData,
  defaultToolData,
  defaultShieldData,
  defaultPersonData,
  defaultCarData,
  defaultDangerData,
} from '@/utils/Resource.ts'
import {IResourceData} from '@/utils/types.ts'

// 默认配置，未经服务端允许的跨域图片不能渲染。
Platform.image.crossOrigin = 'anonymous'
const {setCurrentResourceIndex,clearCreatingRes} = useResourceStore()
const {setLock} = useGlobalStore()
const {currentResourceIndex,creatingRes, tabName} = storeToRefs(useResourceStore())
const {isPicture, isShowRemarkDialog, zoomValue, meterToPixel,} = storeToRefs(useGlobalStore())
export enum EResourceType {
  Graph = '图形',
  Tool = '工器具',
  Shield = '防护',
  Person = '人员',
  Car = '车辆',
  Danger = '隐患',
}

class DrawingBoard {
  public setParentIndex = useResourceStore().setParentIndex
  public setTabName = useResourceStore().setTabName
  private leaferInstance: null | App = null
  private _contentFrame: null | Frame = null
  private rootDom: null | HTMLElement = null
  private isSelect: boolean = false
  private isDrawing: boolean = false
  private history: null | History = null
  public tools: null | Tools = null
  public leaferInstanceReadonly: null | App = null
  public selectedGraphics: Ref<null | any> = ref(null)
  // 记录当前资源的索引
  public activeResourceIndex = ref(0)
  private canvasOffsetX = 0
  private canvasOffsetY = 0
  // 标尺
  public ruler: Ruler
  // 当前选择的工具
  public currentTool: Ref<null | any> = ref(null)
  // 画笔
  private currentPen: Pen | null = null;
  private currentPenBg: Pen | null = null;
  private currentPenGroup: ExtendedIU | null = null;
  // 记录原始尺寸
  //private originalWidth: number = 0
  //private originalHeight: number = 0

  constructor({domId}: IAppProps) {
    this.rootDom = document.getElementById(domId)
    if (!this.rootDom) {
      throw new Error('rootDom is not found')
    }
    // 初始化App实例
    this.leaferInstance = this.initApp(this.rootDom)
    // 初始化App实例的只读属性
    this.leaferInstanceReadonly = this.leaferInstance
    // 初始化历史记录
    this.history = new History(this.leaferInstance)


    // 分层
    this.leaferInstance.ground = this.leaferInstance.addLeafer()
    this.leaferInstance.tree = this.leaferInstance.addLeafer({type: 'design'})
    this.leaferInstance.sky = this.leaferInstance.addLeafer()
    this.leaferInstance.sky.add(this.leaferInstance.editor)


    // 添加操作按钮
    this.leaferInstance.editor.buttons.add(button)

    // 初始化工具
    this.tools = new Tools()
    // 初始化事件
    this.initEvent(this.leaferInstance)
    // 监听this.tools.toolsActiveIndex的变化
    watch(() => this.tools!.toolsActiveIndex.value, () => {
      if(currentResourceIndex.value >= 0) {
        // 清空当前要创建的资源
        clearCreatingRes()
        // 重置currentResourceIndex
        setCurrentResourceIndex(-1)
        // 设置编辑框状态
        this.setEditorState()
      }
    })
  }

  // 初始化App实例
  private initApp(view: HTMLElement) {
    InitCustomAttr() // 初始化自定义属性
    return new App({
      view,
      editor: { // 设置图形编辑器
        buttonsDirection: 'top',
        buttonsFixed: false,
        around: 'center',
        circle: {
          cursor: 'pointer',
          width: 20,
          height: 20,
        },
        rotateGap: 0,
        boxSelect: false, // 禁止框选
      },
      mobile: true,
      move:{
        disabled: false,
        drag: 'auto',
      }
    })
  }

  // 创建基础画板
  public initPageEditor(loading) {
    const {pictureInfo, windDirection} = storeToRefs(useGlobalStore())
    // 画板居中
    const x = (this.viewSize.width - pictureInfo.value.width) / 2
    const y = (this.viewSize.height - pictureInfo.value.height) / 2
    const frame = new Frame({
      width: pictureInfo.value.width,
      height: pictureInfo.value.height,
      fill: [{
        type: 'solid',
        color: '#fff'
      }],
      x: this.canvasOffsetX,
      y: this.canvasOffsetY,
      overflow: 'hide',
    })
    this.leaferInstance.tree.zoomLayer.move(x, y)
    this.contentFrame = frame
    this.leaferInstance!.tree.add(frame)
    //this.leaferInstance.tree.zoom('fit')
    this.setBgImage(pictureInfo.value.url, pictureInfo.value.width, pictureInfo.value.height, loading)
    // 初始化风向
    if(windDirection.value) {
      handleWindDirection(windDirection.value)
    } else {
      this.removeWindDirection()
    }
  }

  // 初始化标尺
  public initRuler() {
    this.ruler = new Ruler(this.leaferInstance, {
      enabled: storeToRefs(useGlobalStore()).enabledRuler.value,
      theme: 'light',
      unit: 'm',
      conversionFactors: {
        m: {
          px: 1 / meterToPixel.value,  // * 像素转米 / 米转像素
          gaps: [1, 2],
          defaultGap: 5
        }
      }
    })
  }

  // 获取contentFrame
  get contentFrame(): Frame {
    return this._contentFrame
  }

  // 设置contentFrame
  set contentFrame(value: Frame) {
    this._contentFrame = value
  }

  // 获取视图宽高
  get viewSize() {
    return {
      width: this.rootDom.offsetWidth,
      height: this.rootDom.offsetHeight
    }
  }

  // 初始化事件
  private initEvent = (app: App) => {
    app.on(LeaferDragEvent.DOWN, this.mousedown)
    app.on(LeaferDragEvent.DRAG, this.drag)
    app.on(LeaferDragEvent.UP, this.mouseup)
    app.editor.on(EditorEvent.SELECT, this.graphicsSelected)
    app.editor.on(EditorScaleEvent.SCALE, this.graphicsScale)
    app.on(PointerEvent.DOWN, (e) => {
      this.drop(e)
    })
    app.tree.on(ZoomEvent.ZOOM, () => {
      if (!app) return
      zoomValue.value = app.tree.scale as number
    })
  }

  // 销毁事件
  public destroy() {
    this.leaferInstance!.off(LeaferDragEvent.DOWN, this.mousedown)
    this.leaferInstance!.off(LeaferDragEvent.DRAG, this.mousemove)
    this.leaferInstance!.off(LeaferDragEvent.UP, this.mouseup)
    this.leaferInstance!.editor.off(EditorEvent.SELECT, this.graphicsSelected)
  }

  private mousedown = (e) => {
    // 如果当前工具是选择，则不执行
    if (!this.tools!.toolsActiveIndex.value) return
    const {x, y} = e.getInnerPoint(this.contentFrame)
    const graphics = this.tools!.getActiveGraphics()
    const graph = graphics.createdFactory && graphics?.createdFactory!(x, y)
    this.currentTool.value = graph
    if (graph.name === 'gaugeTool' || graph.name === 'markTool') {
      this.lockCanvas() // 锁定画布
      this.leaferInstance!.on(PointerEvent.MOVE, (moveEvent) => this.mousemove(moveEvent, graph, x, y))
      this.leaferInstance!.on(PointerEvent.UP, () => this.mouseup())
    } else if (graph.name === 'brushTool') {
      this.lockCanvas() // 锁定画布
      // 创建新的绘图组和画笔实例
      this.currentPenGroup = new Group({
        name: 'brushTool',
        editable: true,
      })
      this.currentPenGroup.parentIndex = '警戒线'
      this.currentPen = new Pen({ editable: false, name: 'brushTool' });
      this.currentPenBg = new Pen({ editable: false, name: 'brushTool' });
      // 设置画笔样式
      this.currentPen.setStyle({
        strokeWidth: 8,
        stroke: '#f00',
        strokeJoin: 'miter',
        dashPattern: [20, 20],
      });

      this.currentPenBg.setStyle({
        strokeWidth: 8,
        stroke: '#ff0',
        strokeJoin: 'miter',
      });

      // 添加实例到画布
      this.contentFrame.add(this.currentPenGroup);
      this.currentPenGroup.add(this.currentPenBg);
      this.currentPenGroup.add(this.currentPen);

      // 记录起始点
      const point = this.contentFrame.getInnerPoint(e);
      this.currentPen.moveTo(point.x, point.y);
      this.currentPenBg.moveTo(point.x, point.y);
    } else {
      this.contentFrame.add(graph)
    }
  }
  private mousemove = (e: LeaferDragEvent, graph: Group, startX?: number, startY?: number) => {
    this.leaferInstance!.editor.target = []
    // 绘制距离标注
    this.isDrawing = true
    if (this.isDrawing) {
      this.contentFrame.add(graph)
    }
    this.tools?.drawMark(this.contentFrame, e, graph, startX, startY)
  }

  private drag = (e: LeaferDragEvent) => {
    if (!this.tools!.toolsActiveIndex.value) return  // 如果当前工具是选择，则不执行
    const graphics = this.tools!.getActiveGraphics()
    if (graphics.name === 'brushTool') { // 画笔
      const point = this.contentFrame.getInnerPoint(e) // 转换事件为 page 坐标 = pen.getPagePoint(e)
      this.currentPen.lineTo(point.x, point.y);
      this.currentPenBg.lineTo(point.x, point.y);
    }
  }

  private mouseup = () => {
    if (this.isSelect) return
    this.isDrawing = false
    this.tools!.toolsActiveIndex.value = 0
    this.leaferInstance!.off(PointerEvent.MOVE)
    if (this.tools?.toolsActiveIndex.value === 0) {
      this.contentFrame?.findOne('.markTool')?.remove()
    }
    // 清理当前绘图上下文
    this.currentPen = null
    this.currentPenBg = null
    this.currentPenGroup = null
    this.unlockCanvas() // 解锁画布
    // 考虑一下派发事件，this.app.tree.on监听实现保存？？？？？
    this.history.save(this.contentFrame?.toJSON()) // 此处的值，等于true/false
  }

  public dragover = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }
  public drop = (e) => {
    const json: IResourceData = creatingRes.value
    if (currentResourceIndex.value >= 0) {
      const {x, y} = e.getInnerPoint(this.contentFrame)
      switch (tabName.value) {
        case EResourceType.Graph:
          if (json.tag === 'Rect') {
            this.createRect(x, y, json.describe, json.resourceName, tabName.value)
          }
          if (json.tag === 'Star') {
            this.createStar(x, y, json.describe, json.resourceName, tabName.value)
          }
          if (json.tag === 'Ellipse') {
            this.createEllipse(x, y, json.describe, json.resourceName, tabName.value)
          }
          if (json.tag === 'Line') {
            this.createLine(x, y, json.describe, json.resourceName, tabName.value)
          }
          if (json.tag === 'Polygon') {
            this.createPolygon(x, y, json.describe, json.resourceName, tabName.value)
          }
          if (json.tag === 'Arrow') {
            this.createArrow(x, y, json.describe, json.resourceName, tabName.value)
          }
          break
        case EResourceType.Tool:
          this.createTool(x, y, json.imgurl, json.describe, tabName.value)
          break
        case EResourceType.Shield:
          this.createShield(x, y, json.imgurl, json.describe, tabName.value)
          break
        case EResourceType.Person:
          this.createPerson(x, y, json.imgurl, json.name, json.describe, tabName.value)
          break
        case EResourceType.Car:
          this.createCar(x, y, json.zuoyeradius, json.length, json.width, json.imgurl, json.describe, tabName.value)
          break
        case EResourceType.Danger:
          this.createDanger(x, y, json.imgurl, json.describe, tabName.value)
          break
      }
      // 更新tabName
      this.setTabName(tabName.value)
      // 清空当前要创建的资源
      clearCreatingRes()
      // 重置currentResourceIndex
      setCurrentResourceIndex(-1)
    }
  }

  // 图形创建
  // 创建矩形
  public createRect = (x: number, y: number, desc, resourceName, tName) => {
    const rect: ExtendedIU = Rect.one({...defaultRectData as any, x, y})
    rect.parentIndex = tName
    rect.resourceName = resourceName
    rect.description = desc
    this.contentFrame!.add(rect)
  }
  // 创建星形
  public createStar = (x: number, y: number, desc, resourceName, tName) => {
    const star: ExtendedIU = Star.one({...defaultStarData as any, x, y})
    star.parentIndex = tName
    star.resourceName = resourceName
    star.description = desc
    this.contentFrame!.add(star)
  }
  // 创建圆形
  public createEllipse = (x: number, y: number, desc:string, resourceName:string, tName:string) => {
    const ellipse: ExtendedIU = new Ellipse({...defaultEllipseData as any, x, y})
    ellipse.parentIndex = tName
    ellipse.resourceName = resourceName
    ellipse.description = desc
    this.contentFrame!.add(ellipse)
  }
  // 创建直线
  public createLine = (x: number, y: number, desc:string, resourceName:string, tName:string) => {
    const line: ExtendedIU = new Line({...defaultLineData as any, x, y})
    line.parentIndex = tName
    line.resourceName = resourceName
    line.description = desc
    this.contentFrame!.add(line)
  }
  // 创建多边形
  public createPolygon = (x: number, y: number, desc:string, resourceName:string, tName:string) => {
    const polygon: ExtendedIU = new Polygon({...defaultPolygonData as any, x, y})
    polygon.parentIndex = tName
    polygon.resourceName = resourceName
    polygon.description = desc
    this.contentFrame!.add(polygon)
  }
  // 创建箭头
  public createArrow = (x: number, y: number, desc:string, resourceName:string, tName:string) => {
    const arrow: ExtendedIU = new Line({...defaultArrowData as any, x, y})
    arrow.parentIndex = tName
    arrow.resourceName = resourceName
    arrow.description = desc
    this.contentFrame!.add(arrow)
  }
  // 创建工具
  public createTool = (x: number, y: number, url:string, desc:string, tName:string) => {
    const group = new CustomResGroup({...defaultToolData as any, x, y})
    const image = new Image({width: 100, height: 100, around: 'center', url: BASE_URL + '/' + url})
    group.add(image)
    group.init(tName, '工具', desc)
    this.contentFrame!.add(group)
  }
  // 创建防护
  public createShield = (x: number, y: number, url:string, desc:string, tName:string) => {
    const group = new CustomResGroup({...defaultShieldData as any, x, y})
    const image = new Image({width: 100, height: 100, around: 'center', url: BASE_URL + '/' + url})
    group.add(image)
    group.init(tName, '防护', desc)
    this.contentFrame!.add(group)
  }
  // 创建人员
  public createPerson = (x: number, y: number, url:string, text:string, desc:string, tName:string) => {
    const group = new CustomResGroup({...defaultPersonData as any, x, y})
    const image = new Image({width: 100, height: 100, around: 'center', url: BASE_URL + '/' + url})
    const box = new Box({
      x: 0,
      y: 60,
      fill: 'rgba(0,0,0,0.8)',
      around: 'center',
      cornerRadius: 5,
      resizeChildren: true,
      children:[{
        tag: 'Text',
        text: text,
        fill: 'rgba(255,255,255,1)',
        draggable: false,
        padding: [0, 2],
        around: 'center',
        resizeFontSize: true,
      }]
    })
    group.add(box)
    group.add(image)
    group.init(tName, '人员', desc)
    this.contentFrame!.add(group)
  }
  // 创建车辆
  public createCar = (x: number, y: number, radius:number, length:number, width:number, url:string, desc:string, tName:string) => {
    const group = new CustomResGroup({...defaultCarData as any, x, y})
    const ellipse = new Ellipse({
      width: (radius / meterToPixel.value) * 2,
      height: (radius / meterToPixel.value) * 2,
      around: 'center',
      fill: 'rgba(255,0,0,0.5)',
      stroke: 'rgba(255,0,0,1)',
      strokeWidth: 2
    })
    const radiusText = new Text({
      x: 0,
      y: (width / 2 / meterToPixel.value),
      text: 'R' + radius + '米',
      fontSize: 20,
      fill: 'rgba(255,255,255,1)',
      draggable: false,
      padding: [0, 2],
      textAlign: 'center',
      around: 'center',
      resizeFontSize: false,
      textWrap:'none'
    })
    const image = new Image({
      className:'carImage',
      width: length / meterToPixel.value,
      height: width / meterToPixel.value,
      around: 'center',
      url: BASE_URL + '/' + url,
    })

    radius && group.add(ellipse)
    group.add(image)
    radius && group.add(radiusText)
    group.init(tName, '车辆', desc)
    this.contentFrame!.add(group)
  }
  // 创建隐患
  public createDanger = (x: number, y: number, url, desc, tName) => {
    const group = new CustomResGroup({...defaultDangerData as any, x, y})
    const image = new Image({width: 100, height: 100, around: 'center', url: BASE_URL + '/' + url})
    group.add(image)
    group.init(tName, '隐患', desc)
    this.contentFrame!.add(group)
  }

  // 设置Editor的交互状态
  public setEditorState() {
    this.leaferInstance!.editor.cancel()
    //this.leaferInstance!.editor.hittable = state
    //this.leaferInstance!.editor.visible = state
  }

  // 选择图形
  private graphicsSelected = (e: EditorEvent) => {
    const {value} = e as any
    // 这里区分了工具和资源
    if (value && value.name === 'mark-box') {
      this.leaferInstance!.editor.target = value.parent
      this.selectedGraphics.value = value.parent
    } else {
      this.selectedGraphics.value = value as IUIExtended
      // 更新当前选中的资源索引
      if (value) {
        console.log(value)
        value.parentIndex && this.setParentIndex(value.parentIndex)
        /*if(value.className === 'Car') {
          const carImage = this.selectedGraphics.value.findOne('.carImage')
          this.originalWidth = carImage.width
          this.originalHeight = carImage.height
        }*/
      }
    }
  }
  // 获取当前选择的图形
  public getSelectedGraphics = () => {
    return toRef(this.selectedGraphics.value ? this.selectedGraphics.value : null)
  }

  // 缩放图形
  private graphicsScale = (e: EditorScaleEvent) => {
    // 当前选择的是车辆
    if(e.target.className === 'Car') {
      // 获取当前选中的图形中的Text
      const textEle = this.selectedGraphics.value.findOne('Text')
      //const carImage = this.selectedGraphics.value.findOne('.carImage')
      //carImage.width = this.originalWidth
      //carImage.height = this.originalHeight
      let num = e.target.boxBounds.width * meterToPixel.value
      if (textEle) {
        textEle.text = `R${num.toFixed(2)}米`
      }
    }
  }

  // 删除选中的图形
  public removeSelectedGraphics() {
    const target = this.selectedGraphics.value
    target && target.remove()
    this.leaferInstance!.editor.target = []
    this.selectedGraphics.value = null
    this.setParentIndex('')
  }

  // 复制选中的图形
  public copySelectedGraphics() {
    const target = this.selectedGraphics.value
    if (target) {
      const copy = target.clone()
      copy.set({x: target.x + 100, y: target.y + 100})
      this.contentFrame!.add(copy)
      this.leaferInstance.editor.select(copy)
      this.selectedGraphics.value = copy
    }
  }

  // 编辑选中的图形的信息
  public editSelectedGraphicsInfo() {
    isShowRemarkDialog.value = true
  }

  public addRemark(text: string) {
    const target = this.selectedGraphics.value
    if (target) {
      target.remark = text
    }
  }

  // 设置画布背景
  public setBgImage(url: string, width: number, height: number, loading) {
    const bg = new Rect({
      id: 'bg',
      width,
      height,
      x: 0,
      y: 0,
      fill: {
        type: 'image',
        url,
      },
    })
    bg.once(ImageEvent.LOADED, () => {
      loading.close()
      this.initRuler() // 注意：此处初始化标尺，需要在图片加载完成后执行
      this.history.save(this.contentFrame?.toJSON()) // 保存初始画板到历史记录，用于撤销
    })
    this.contentFrame!.add(bg) // 添加背景
  }

  // 清空画板
  public async clearBoard(): Promise<void> {
    try {
      // 显示确认对话框
      await ElMessageBox.confirm(
        '即将清空所有绘图内容，是否继续？',
        '操作确认',
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )

      // 获取相关实例引用
      const contentFrame = this.contentFrame
      const leafer = this.leaferInstance

      // 防御性检查
      if (!contentFrame?.children || !leafer?.editor) {
        console.error('实例未正确初始化')
        return
      }

      // 保留背景元素并过滤其他元素
      //const backgroundElements = contentFrame.children.filter(item => item.id === 'bg')
      const elementsToRemove = contentFrame.children.filter(item => item.id !== 'bg')

      // 使用批量移除优化性能
      elementsToRemove.forEach(element => element.remove())

      // 重置编辑器状态
      leafer.editor.cancel()

      // 调试日志（生产环境应移除）
      // console.debug('画板清理完成，剩余元素:', backgroundElements)

    } catch (error) {
      // 精确处理取消操作（根据Element Plus实现细节）
      if (error === 'cancel') {
        console.info('用户取消了清空操作')
      } else {
        console.error('清空画板时发生意外错误:', error)
      }
    }
  }

  // 重选图片
  public async changePicture() {
    try {
      await ElMessageBox.confirm(
        '这将会重新上传图片，是否继续？',
        '操作确认',
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
      // 用户确认后执行清除
      isPicture.value = false
      // 取消当前选中效果
      this.leaferInstance!.editor.cancel()
      // 清空画板
      this.contentFrame.clear()
      this.leaferInstance.tree.remove(this.contentFrame)
      this.setParentIndex('')
    } catch (error) {
      console.log('用户取消了重选操作')
    }
  }

  // 视图缩放
  public zoomCanvas(type: IZoomType, value?: number) {
    this.leaferInstance!.tree.zoom(type, value, true)
  }

  // 锁定画布
  public lockCanvas() {
    this.leaferInstance!.app.config.move.drag = false
  }
  // 解锁画布
  public unlockCanvas() {
    this.leaferInstance!.app.config.move.drag = 'auto'
  }

  // 移除风向标
  public removeWindDirection() {
    const windDirectionGroup = this.leaferInstance!.sky.findOne('#windDirectionGroup')
    windDirectionGroup && windDirectionGroup.remove()
  }

  // 历史记录
  setJson = (json: IUIJSONData | null) => {
    if (!json) return
    this.contentFrame.set({children: json.children})
  }
  historyBack = () => {
    const json = this.history.getBackJson()
    if (json) {
      this.setJson(json)
    } else {
      ElMessage.warning('已无更多可撤销数据')
    }
  }
  historyUnBack = () => {
    this.setJson(this.history.getUnBackJson())
  }

  // 保存画板，导出json
  saveBoard() {
    const json = this.contentFrame!.toJSON()
    // 返回json.children中除了第一条画板之外的所有图形
    return json.children.slice(1)
  }

  // 回显元素到画板
  reviewElements(elements) {
    elements.forEach(item => {
      this.contentFrame!.add(item)
    })
  }

  // 锁定元素
  lockElements() {
    this.contentFrame.children.forEach(item => {
      item.locked = true
    })
    setLock(true)
  }
  // 解锁元素
  unlockElements() {
    // 解锁画板元素时可能不存在contentFrame
    if(this.contentFrame && this.contentFrame.children.length) {
      this.contentFrame.children.forEach(item => {
        item.locked = false
      })
    }
    setLock(false)
  }
}

export default DrawingBoard