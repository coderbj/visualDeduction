import {Platform, Rect} from 'leafer-editor'
import { Flow } from '@leafer-in/flow'
import App from './App.ts'


const svg:string = '<svg id="_图层_1" data-name="图层 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><defs><style>.cls-1 {fill: #fff;}.cls-2 {fill: #d6d6d6;}.cls-3 {fill: #bc0105;}.cls-4 {fill: #ed0606;}.cls-5 {fill: #fff100;}.cls-6 {fill: #8dcaf5;}</style></defs><rect class="cls-1" x="58.18" y="45.68" width="3.73" height="45.37"/><g><polygon class="cls-4" points="48.1 46.06 48.1 27.83 60.05 12.56 71.95 27.83 71.95 46.06 48.1 46.06"/><path class="cls-5" d="M60.05,13.17l11.53,14.79v17.73h-23.1V27.96l11.58-14.79m0-1.22l-.59,.76-11.58,14.79-.16,.2v18.73h24.6V27.7l-.16-.2-11.53-14.79-.59-.76h0Z"/></g><polygon class="cls-1" points="52.58 91.06 47.54 107.53 72.51 107.53 67.47 91.06 52.58 91.06"/><g><path class="cls-6" d="M60.02,74.36c-3.56,0-6.45-2.89-6.45-6.45s2.89-6.45,6.45-6.45,6.45,2.89,6.45,6.45-2.89,6.45-6.45,6.45Z"/><path class="cls-1" d="M60.02,61.97c3.29,0,5.95,2.66,5.95,5.95s-2.66,5.95-5.95,5.95-5.95-2.66-5.95-5.95,2.66-5.95,5.95-5.95m0-1c-3.83,0-6.95,3.12-6.95,6.95s3.12,6.95,6.95,6.95,6.95-3.12,6.95-6.95-3.12-6.95-6.95-6.95h0Z"/></g><polygon class="cls-3" points="60.08 45.68 71.6 45.68 71.6 27.96 60.08 13.17 60.08 13.17 60.08 45.68"/><polygon class="cls-2" points="60 107.53 72.46 107.53 67.42 91.06 60 91.06 60 107.53"/></svg>'
const svgN:string = '<svg id="_图层_1" data-name="图层 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><defs><style>.cls-1 {fill: #fff;}.cls-2 {fill: #d6d6d6;}.cls-3 {fill: #bc0105;}.cls-4 {fill: #8dcaf5;}.cls-5 {fill: #fd0000;}</style></defs><circle class="cls-4" cx="60" cy="58.16" r="33.3"/><path class="cls-1" d="M82.43,85.22l5.5,.92-.92-5.5c10.8-12.97,10.8-31.89,0-44.86l.92-5.5-5.5,.92c-12.97-10.8-31.89-10.8-44.86,0l-5.5-.92,.92,5.5c-10.8,12.97-10.8,31.89,0,44.86l-.92,5.5,5.5-.92c12.97,10.8,31.89,10.8,44.86,0Zm-45.38-4.05c-12.68-12.68-12.68-33.23,0-45.9s33.23-12.68,45.9,0,12.68,33.23,0,45.9-33.23,12.68-45.9,0Z"/><g><polygon class="cls-5" points="48.04 58.21 60 15.53 71.96 58.21 48.04 58.21"/><polygon class="cls-1" points="71.96 58.22 60 100.9 48.04 58.22 71.96 58.22"/><polygon class="cls-3" points="60 15.53 60 58.21 71.96 58.21 60 15.53"/><polygon class="cls-2" points="60 100.91 60 58.22 71.96 58.22 60 100.91"/></g><path class="cls-1" d="M66.17,1.19c-1.22-.17-1.77,.65-1.64,2.47V13.02h-1.33l-6.89-10.18v7.02c-.13,1.77,.46,2.59,1.77,2.47v.63h-4.24v-.63c1.22,.13,1.77-.7,1.64-2.47V3.22c.13-1.48-.4-2.15-1.58-2.02V.37h3.54l6.26,9.36V3.66c.13-1.86-.46-2.68-1.77-2.47V.37h4.24v.82Z"/><path class="cls-1" d="M63.29,109.63c-.83-2.77-1.97-4.13-3.43-4.09-1.22,.05-1.92,.78-2.12,2.19-.2,1.07,.83,2.09,3.06,3.06,2.63,1.17,3.92,2.7,3.87,4.6-.1,2.77-1.75,4.18-4.96,4.23-.34,0-.71-.05-1.09-.15-.39-.05-.68-.1-.88-.15-.73-.15-1.44-.12-2.12,.07l-.22-4.67,.8-.29c.58,2.87,1.75,4.28,3.5,4.23,1.61,0,2.43-.7,2.48-2.12,.1-1.26-1.14-2.43-3.72-3.5-2.19-.92-3.24-2.31-3.14-4.16,.15-2.77,1.65-4.21,4.52-4.3,.53,0,1.05,.07,1.53,.22,.19,.05,.34,.07,.44,.07h.15c.44,.15,.75,.19,.95,.15,.15,0,.44-.1,.88-.29l.29,4.52-.8,.36Z"/></svg>'

function handleWindDirection(direction: string) {
  // 先移除之前的风向
  App.drawingBoardInstance.removeWindDirection()
  // 定义风向到角度的映射（顺时针，北为0度）
  const directionMap: Record<string, number> = {
    '北风': 0,
    '东北风': 45,
    '东风': 90,
    '东南风': 135,
    '南风': 180,
    '西南风': 225,
    '西风': 270,
    '西北风': 315
  };

  // 获取对应角度，默认0度（处理无效输入）
  const angle = directionMap[direction.toUpperCase()] ?? 0

  const group = new Flow({ // Flow 组件支持padding
    x: 40,
    y: 30,
    id: 'windDirectionGroup',
    draggable: true,
    fill: 'rgba(0,0,0,.5)',
    cornerRadius: 5,
    padding:10,
  })
  // 创建风向图标
  const rect = new Rect({
    x: 40,
    y: 0,
    width: 60,
    height: 60,
    id: 'windDirection',
    fill: {
      type: 'image',
      url: Platform.toURL(svg, 'svg'),
      mode: 'stretch'
    },
    draggable: false,
    origin:'center',
    padding:20
  })
  // 创建指北针图标
  const compass = new Rect({
    x: 0,
    y: 0,
    width: 60,
    height: 60,
    id: 'compass',
    fill: {
      type: 'image',
      url: Platform.toURL(svgN, 'svg'),
      mode: 'stretch'
    },
    draggable: false,
    origin:'center',
    padding:20
  })

  // 设置旋转角度
  rect.rotation = angle
  group.add(compass)
  group.add(rect)


  App.drawingBoardInstance.leaferInstanceReadonly.sky.add(group)
}

export default handleWindDirection