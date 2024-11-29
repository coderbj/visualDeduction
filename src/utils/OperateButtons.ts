import {Box} from 'leafer-editor'
import App from './App.ts'
import '@leafer-in/state'
import {Group} from 'leafer-ui'

const button = new Group()

button.add(new Box({// 添加移除按钮
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
        url:'./images/icon-copy.svg',
      },
    },
  ]
}))
button.add(new Box({// 添加移除按钮
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
        url:'./images/icon-del.svg',
      },
    },
  ]
}))

export {
  button
}