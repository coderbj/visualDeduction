import {ref, Ref, nextTick, h, render} from 'vue'
import {Group, Text, Box, Pen, defineKey, DragEvent as LeaferDragEvent,} from 'leafer-editor'
import {Arrow} from '@leafer-in/arrow'
import {IToolOptions} from './types'
import Index from '../components/Index'
import {ExtendedIU} from '@/utils/InitCustomAttr.ts'
import {useGlobalStore} from '@/store/global.ts'
import {storeToRefs} from 'pinia'

const {meterToPixel} = storeToRefs(useGlobalStore())

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
        strokeWidth: 5,
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
        fontSize: 24,
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
      const group: ExtendedIU = new Group({
        draggable: true,
        editable: true,
      })
      group.name = 'gaugeTool'
      const arrow = new Arrow({
        x,
        y,
        startArrow: 'mark',
        endArrow: 'mark',
        strokeWidth: 5,
        stroke: 'rgb(255,255,0)',
      })
      const box = new Box({
        name: 'mark-box',
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
        text: '-1',
        fill: 'white',
        padding: [5, 5],
        draggable: false,
        fontSize: 24,
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
      group.parentIndex = '标注'
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
      const text: ExtendedIU = new Text({
        name: 'textTool',
        x: x - 5,
        y: y - 10,
        text: '请双击编辑内容',
        fontSize: this.fontSize,
        fill: this.fill,
        editable: true,
      })
      text.parentIndex = '文字'
      return text
    },
  },
  {
    icon: 'icon-warning-line',
    title: '警戒线',
    name: 'brushTool',
    createdFactory(x,y) {
      return new Pen({
        name: 'brushTool',
        x,
        y,
        editable: true,
      })
    },
  }
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
  public drawMark(contentFrame, e: LeaferDragEvent, graph: Group, startX: number, startY: number) {
    // 转换为父容器坐标系
    const localPoint = contentFrame.getInnerPoint(e)
    // 计算实际偏移量
    const deltaX = localPoint.x - startX!
    const deltaY = localPoint.y - startY!

    const arrow = graph.children[0]! as Arrow
    const box = graph.children[1]! as Arrow
    const text = box.findOne('.distance') as Text

    // 2. 计算真实距离（非箭头宽度）
    const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2) * meterToPixel.value
    text.text = distance.toFixed(2) + '米'

    // 3. 更新箭头终点（相对起点）
    arrow.toPoint = {x: deltaX, y: deltaY}

    // 4. 计算正确中点坐标（关键修正点）
    const midX = startX + deltaX / 2 - box.width / 2
    const midY = startY + deltaY / 2 - box.height / 2

    // 5. 设置位置和旋转
    box.set({
      x: midX,
      y: midY,
      rotation: arrow.rotation,
      origin: {
        x: 0.5,
        y: 0.5,
        type: 'percent'
      }
    })
  }
}


export {
  toolsOptions,
  Tools
}