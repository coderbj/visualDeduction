import '@leafer-in/editor'
import '@leafer-in/text-editor'
import {IAppProps} from './types.ts'
import {App, DragEvent as LeaferDragEvent, PointerEvent, Rect, Group} from 'leafer-editor'
import {EditorEvent} from '@leafer-in/editor'
import {Tools} from './Tools.ts'
import {button} from './OperateButtons.ts'
import {watch, ref, toRef, Ref} from 'vue'

class DrawingBoard {
  private leaferInstance: null | App = null
  private rootDom: null | HTMLElement = null
  private isSelect: boolean = false

  public tools: null | Tools = null
  public leaferInstanceReadonly: null | App = null
  //public selectedGraphic: null | any = null
  public selectedGraphics: Ref<null | any> = ref(null)
  // 记录当前资源的索引
  public activeResourceIndex = ref(0)


  constructor({domId}: IAppProps) {
    this.rootDom = document.getElementById(domId)
    if (!this.rootDom) {
      throw new Error('rootDom is not found')
    }
    this.leaferInstance = this.initApp(this.rootDom)
    this.leaferInstanceReadonly = this.leaferInstance
    this.initEvent(this.leaferInstance)

    // 分层
    this.leaferInstance.ground = this.leaferInstance.addLeafer()
    //this.setBgImage('./images/map.jpg', 1920, 1422)
    this.leaferInstance.tree = this.leaferInstance.addLeafer()
    this.leaferInstance.sky = this.leaferInstance.addLeafer()
    this.leaferInstance.sky.add(this.leaferInstance.editor)


    // 添加操作按钮
    this.leaferInstance.editor.buttons.add(button)
    const r = Rect.one({editable: true, fill: 'rgb(50,205,121)',resourceName:'111', cornerRadius: 30},100, 100)

    this.selectedGraphics.value = r
    this.leaferInstance.sky.add(r)
    this.leaferInstance.editor.target = r
    // 初始化工具
    this.tools = new Tools()

    // 监听this.tools.toolsActiveIndex的变化
    watch(() => this.tools!.toolsActiveIndex, (newVal) => {
      this.setEditorState(!newVal)
    })
  }

  // 初始化App实例
  private initApp(view: HTMLElement) {
    const app = new App({
      view,
      width:0,
      editor: {
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
    })
    return app
  }

  // 初始化事件
  private initEvent = (app: App) => {
    app.on(LeaferDragEvent.DOWN, this.mousedown)
    //app.on(LeaferDragEvent.MOVE, this.mousemove)
    app.on(LeaferDragEvent.UP, this.mouseup)
    app.editor.on(EditorEvent.SELECT, this.graphicsSelected)
  }

  private mousedown = (e: LeaferDragEvent) => {
    // 如果当前工具是选择，则不执行
    if (!this.tools!.toolsActiveIndex.value) return
    const {x, y} = e.getPage()
    const graphics = this.tools!.getActiveGraphics()
    const graph = graphics?.createdFactory!(x, y)
    this.leaferInstance!.sky.add(graph)

    if (graph.name === 'gaugeTool' || graph.name === 'markTool') {
      this.leaferInstance!.on(PointerEvent.MOVE, (moveEvent) => this.mousemove(moveEvent, graph, x, y))
      this.leaferInstance!.on(PointerEvent.UP, () => this.mouseup())
    }
  }


  private mousemove = (e: LeaferDragEvent, graph: Group, startX?, startY?) => {
    this.leaferInstance!.editor.target = []
    // 绘制距离标注
    this.tools?.drawMark(e, graph, startX, startY)
  }

  private mouseup = () => {
    if (this.isSelect) return
    this.tools!.toolsActiveIndex.value = 0

    this.leaferInstance!.off(PointerEvent.MOVE)
    this.leaferInstance!.off(PointerEvent.UP)

    if (this.tools?.toolsActiveIndex.value === 0) {
      this.leaferInstance!.findOne('.markTool')?.remove()
    }
  }

  public dragover = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }
  public drop = (e: DragEvent) => {
    const json = JSON.parse(e.dataTransfer!.getData('data'))
    json.x = e.offsetX
    json.y = e.offsetY
    this.leaferInstance!.sky.add(json)
  }

  // 销毁事件
  public destroy() {
    this.leaferInstance!.off(LeaferDragEvent.DOWN, this.mousedown)
    this.leaferInstance!.off(LeaferDragEvent.DRAG, this.mousemove)
    this.leaferInstance!.off(LeaferDragEvent.UP, this.mouseup)
    this.leaferInstance!.editor.off(EditorEvent.SELECT, this.graphicsSelected)
  }

  // 设置Editor的交互状态
  public setEditorState(state: boolean) {
    this.leaferInstance!.editor.cancel()
    this.leaferInstance!.editor.hittable = state
    this.leaferInstance!.editor.visible = state
  }

  // 选择图形
  private graphicsSelected = (e: EditorEvent) => {
    const {value} = e
    this.selectedGraphics.value = value
    console.log(value)
  }
  // 获取当前选择的图形
  public getSelectedGraphics = () => {
    return toRef(this.selectedGraphics.value ? this.selectedGraphics.value : null)
  }

  // 删除选中的图形
  public removeSelectedGraphics() {
    const target = this.selectedGraphics.value
    target && target.remove()
    this.leaferInstance!.editor.target = []
    this.selectedGraphics.value = null
  }
  // 复制选中的图形
  public copySelectedGraphics() {
    const target = this.selectedGraphics.value
    if (target) {
      const copy = target.clone()
      copy.set({x: target.x + 100, y: target.y + 100})
      this.leaferInstance!.sky.add(copy)
      this.leaferInstance.editor.select(copy)
      this.selectedGraphics.value = copy
    }
  }

  // 设置画布背景
  public setBgImage(url: string, width: number, height: number) {
    const bg = new Rect({
      width,
      height,
      x: this.leaferInstance!.ground.width! / 2 - this.leaferInstance!.ground.width! / 2,
      y: this.leaferInstance!.ground.height! / 2 - this.leaferInstance!.ground.height! / 2,
      fill: {
        type: 'image',
        url,
      },
    })
    this.leaferInstance!.ground.add(bg)
  }
}

export default DrawingBoard