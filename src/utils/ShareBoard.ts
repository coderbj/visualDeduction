import {h, nextTick, ref, Ref, render, toRef,} from 'vue'
import {storeToRefs} from 'pinia'
import '@leafer-in/view'
import '@leafer-in/viewport'
import '@leafer-in/editor'
import '@leafer-in/text-editor'
import {Ruler} from 'leafer-x-ruler'
import {Platform} from 'leafer-editor'
import InitCustomAttr from './InitCustomAttr.ts'
import {
  App,
  Frame,
  EditorEvent,
  Rect,
} from 'leafer-editor'

import {IAppProps, IUIExtended} from './types.ts'
import {useResourceStore} from '../store/resource.ts'
import {useGlobalStore} from '../store/global.ts'
import ShareMenusIndex from '../components/ShareMenusIndex.tsx'


// 默认配置，未经服务端允许的跨域图片不能渲染。
Platform.image.crossOrigin = 'anonymous'

class DrawingBoard {
  public setParentIndex = useResourceStore().setParentIndex
  private leaferInstance: null | App = null
  private _contentFrame: null | Frame = null
  private rootDom: null | HTMLElement = null
  public leaferInstanceReadonly: null | App = null
  public selectedGraphics: Ref<null | any> = ref(null)
  private canvasOffsetX = 0
  private canvasOffsetY = 0
  // 标尺
  public ruler: Ruler


  constructor({domId}: IAppProps) {
    this.rootDom = document.getElementById(domId)
    if (!this.rootDom) {
      throw new Error('rootDom is not found')
    }
    // 初始化App实例
    this.leaferInstance = this.initApp(this.rootDom)
    // 初始化App实例的只读属性
    this.leaferInstanceReadonly = this.leaferInstance

    // 分层
    this.leaferInstance.ground = this.leaferInstance.addLeafer()
    this.leaferInstance.tree = this.leaferInstance.addLeafer({type: 'design'})
    this.leaferInstance.sky = this.leaferInstance.addLeafer()
    this.leaferInstance.sky.add(this.leaferInstance.editor)

    // 初始化事件
    this.initEvent(this.leaferInstance)

    this.initShareMenus()
  }

  private initShareMenus() {
    const div = document.createElement('div')
    document.querySelector('.share-board-wrapper')!.append(div)
    // 必须使用nextTick，否则App.drawingBoardInstance未初始化完成
    nextTick(() => render(h(ShareMenusIndex), div))
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
    })
  }

  // 创建基础画板
  public initPageEditor() {
    const {pictureInfo} = storeToRefs(useGlobalStore())
    this.canvasOffsetX = this.leaferInstance!.ground.width! / 2 - pictureInfo.value.width / 2
    this.canvasOffsetY = this.leaferInstance!.ground.height! / 2 - pictureInfo.value.height / 2
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

    this.contentFrame = frame
    this.leaferInstance!.tree.add(frame)
    this.setBgImage(pictureInfo.value.url, pictureInfo.value.width, pictureInfo.value.height)

    this.initRuler()
  }

  // 初始化标尺
  public initRuler() {
    this.ruler = new Ruler(this.leaferInstance, {
      enabled: storeToRefs(useGlobalStore()).enabledRuler.value,
      theme: 'light',
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

  // 初始化事件
  private initEvent = (app: App) => {
    app.editor.on(EditorEvent.SELECT, this.graphicsSelected)
  }

  // 销毁事件
  public destroy() {
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
    const {value} = e as any
    // 这里区分了工具和资源
    if (value && value.name === 'mark-box') {
      this.leaferInstance!.editor.target = value.parent
      this.selectedGraphics.value = value.parent
    } else {
      this.selectedGraphics.value = value as IUIExtended
      // 更新当前选中的资源索引
      if (value) {
        this.setParentIndex(value.parentIndex)
      }
    }
  }
  // 获取当前选择的图形
  public getSelectedGraphics = () => {
    return toRef(this.selectedGraphics.value ? this.selectedGraphics.value : null)
  }

  // 设置画布背景
  public setBgImage(url: string, width: number, height: number) {
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
    this.contentFrame!.add(bg)
  }

  // 回显元素到画板
  reviewElements(elements) {
    elements.forEach(item => {
      this.contentFrame!.add(item)
    })
  }
}

export default DrawingBoard