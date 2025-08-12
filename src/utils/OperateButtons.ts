import {Box} from 'leafer-editor'
import App from './App.ts'
import '@leafer-in/state'
import {Group} from 'leafer-editor'


const button = new Group()

// 引入图片
import IconEdit from '../assets/images/icon-edit.svg'
import IconDel from '../assets/images/icon-del.svg'
import IconCopy from '../assets/images/icon-copy.svg'

// 添加copy按钮
button.add(new Box({
  tag: 'Box',
  around: 'center',
  fill: '#fefefe',
  stroke: '#dfdfdf',
  cornerRadius: 3,
  width: 30,
  height: 30,
  cursor: 'pointer',
  button: true,
  origin: 'center',
  hoverStyle: {
    fill: '#eee',
  },
  event:{
    tap:function () {
      App.drawingBoardInstance!.copySelectedGraphics()
    }
  },
  children: [
    {
      tag: 'Rect',
      width: 16,
      height: 16,
      x: 7,
      y: 7,
      padding:5,
      fill:{
        type:'image',
        url:IconCopy,
      },
    },
  ]
}))
// 添加移除按钮
button.add(new Box({
  tag: 'Box',
  around: 'center',
  fill: '#fefefe',
  stroke: '#dfdfdf',
  cornerRadius: 3,
  width: 30,
  height: 30,
  x:35,
  cursor: 'pointer',
  button: true,
  origin: 'center',
  hoverStyle: {
    fill: '#eee',
  },
  event:{
    tap:function () {
      App.drawingBoardInstance!.removeSelectedGraphics()
    }
  },
  children: [
    {
      tag: 'Rect',
      width: 16,
      height: 16,
      x: 7,
      y: 7,
      padding:5,
      fill:{
        type:'image',
        url:IconDel,
      },
    },
  ]
}))
// 添加编辑按钮
button.add(new Box({
  tag: 'Box',
  around: 'center',
  fill: '#fefefe',
  stroke: '#dfdfdf',
  cornerRadius: 3,
  width: 30,
  height: 30,
  x:-35,
  cursor: 'pointer',
  button: true,
  origin: 'center',
  hoverStyle: {
    fill: '#eee',
  },
  event:{
    tap:function () {
      App.drawingBoardInstance!.editSelectedGraphicsInfo()
    }
  },
  children: [
    {
      tag: 'Rect',
      width: 16,
      height: 16,
      x: 7,
      y: 7,
      padding:5,
      fill:{
        type:'image',
        url:IconEdit,
      },
    },
  ]
}))

export {
  button
}