import {Group, Text, Box, defineKey, DragEvent as LeaferDragEvent} from 'leafer-editor'
import {Arrow} from '@leafer-in/arrow'
import {IToolOptions} from './types'
import {ref, Ref, nextTick, h, render} from 'vue'

//import TopBar from '../components/TopBar'
//import GraphicsAttributeMenu from '../components/GraphicsAttributeMenu'
import Index from '../components/Index'

const toolsOptions: IToolOptions[] = [
  {
    icon: 'icon-pointer',
    title: '选择',
  },
  {
    icon: 'icon-mark',
    title: '测距',
    name: 'markTool',
    cursor: 'pointer',
    createdFactory(x: number, y: number) {
      const group = new Group()
      group.name = 'markTool'
      group.className = 'markTool'
      const arrow = new Arrow({
        x,
        y,
        startArrow: 'mark',
        endArrow: 'mark',
        strokeWidth: 2,
        stroke: 'rgb(255,84,217)',
      })
      const box = new Box({
        textBox: true,
        x,
        y,
        fill: 'rgba(0,0,0,0.8)',
        cornerRadius: 20,
        zIndex: 999,
      })

      const text = new Text({
        tag: 'Text',
        className: 'distance',
        text: '0',
        fill: 'white',
        padding: [5, 5],
        draggable: false,
      })
      defineKey(text, 'editConfig', {
        get() {
          return {moveable: false, selector: false,}
        },
      })
      defineKey(box, 'editConfig', {
        get() {
          return {moveable: false, resizeable: false, rotateable: false}
        },
      })
      box.add(text)
      group.add(arrow)
      group.add(box)
      return group
    },
  },
  {
    icon: 'icon-gauge',
    title: '标距',
    name: 'gaugeTool',
    cursor: 'pointer',
    createdFactory(x: number, y: number) {
      const group = new Group({
        draggable: true,
        editable: true,
      })
      group.name = 'gaugeTool'
      const arrow = new Arrow({
        x,
        y,
        startArrow: 'mark',
        endArrow: 'mark',
        strokeWidth: 2,
        stroke: 'rgb(50,205,121)',
      })
      const box = new Box({
        textBox: true,
        x,
        y,
        fill: 'rgba(0,0,0,0.8)',
        cornerRadius: 20,
        zIndex: 999,
        draggable: false,
        editable: true,
      })

      const text = new Text({
        tag: 'Text',
        className: 'distance',
        text: '0',
        fill: 'white',
        padding: [5, 5],
        draggable: false,
      })
      defineKey(text, 'editConfig', {
        get() {
          return {moveable: false, selector: false,}
        },
      })
      defineKey(box, 'editConfig', {
        get() {
          return {moveable: false, resizeable: false, rotateable: false}
        },
      })
      box.add(text)
      group.add(arrow)
      group.add(box)
      return group
    },
  },
  {
    icon: 'icon-text',
    title: '文字',
    name: 'textTool',
    notMove: true,
    cursor: 'text',
    fontSize: 24,
    fill: 'rgba(0, 0, 0, 1)',
    createdFactory(x: number, y: number) {
      return new Text({
        name: 'textTool',
        x: x - 5,
        width: 200,
        height: 35,
        y: y - 10,
        text: '请双击编辑内容',
        fontSize: this.fontSize,
        fill: this.fill,
        editable: true,
      })
    },
  },
]


class Tools {
  public toolsActiveIndex: Ref<number> = ref(0)

  constructor() {
    this.init()
  }

  private init() {
    const div = document.createElement('div')
    document.querySelector('.drawing-board-wrapper')!.append(div)
    // 必须使用nextTick，否则App.drawingBoardInstance未初始化完成
    nextTick(() => render(h(Index), div))
  }

  public getActiveGraphics() {
    return toolsOptions[this.toolsActiveIndex.value]
  }

  // 绘制标注
  public drawMark(e: LeaferDragEvent, graph: Group, startX: number, startY: number) {
    const arrow = graph.children[0]! as Arrow
    const box = graph.children[1]! as Arrow
    const text = box.findOne('.distance') as Text
    text.text = arrow.width?.toFixed(2) + '米'
    arrow.toPoint = {x: e.x - arrow.x!, y: e.y - arrow.y!}
    // 计算box的中心点
   /* let startX = graph.boxBounds.x
    let startY = graph.boxBounds.y
    let endX = startX! + graph.boxBounds.width
    let endY = startY! + graph.boxBounds.height


    box.x = (endX - startX) / 2 + startX - (box.width! / 2)
    box.y = (endY - startY) / 2 + startY - (box.height! / 2)

    box.origin = {x: box.width! / 2, y: box.height! / 2}
    box.rotation = arrow.rotation*/

    const endX = e.x
    const endY = e.y
    const midX = (endX + startX) / 2 - (box.width! / 2)
    const midY = (endY + startY) / 2 - (box.height! / 2)

    box.set({x: midX, y: midY})
    box.origin = {x:0.5, y:0.5, type: 'percent'}
    box.rotation = arrow.rotation

  }
}


export {
  toolsOptions,
  Tools
}