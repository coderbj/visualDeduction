import {
  IGraphsData,
  IDefaultRectData,
  IDefaultStarData,
} from './types'


// 左侧图形数据
const graphsData: IGraphsData[] = [
  {
    'resourceName': '矩形',
    'tag': 'Rect',
    'icon': 'icon-rect',
    'describe': '矩形是一种常见的几何图形，有四条边，四个角，对角线相等，相邻边垂直。'
  },
  {
    'resourceName': '星形',
    'tag': 'Star',
    'icon': 'icon-star',
    'describe': '星形是一种常见的几何图形，有五个角，五条边，对角线相等，相邻边垂直。'
  },
  {
    'resourceName': '圆形',
    'tag': 'Ellipse',
    'icon': 'icon-circle',
    'describe': '圆形是一种常见的几何图形，有一个圆心，半径相等，任意两点到圆心的距离相等。'
  },
  {
    'resourceName': '直线',
    'tag': 'Line',
    'icon': 'icon-line',
    'describe': '直线是一种常见的几何图形，有无数个点，无宽度，无厚度，无弯曲，无端点。'
  },
  {
    'resourceName': '多边形',
    'tag': 'Polygon',
    'icon': 'icon-polygon',
    'describe': '多边形是一种常见的几何图形，有多个角，多条边，对角线相等，相邻边垂直。'
  },
  {
    'resourceName': '箭头',
    'tag': 'Arrow',
    'icon': 'icon-arrow',
    'describe': '箭头是一种常见的几何图形，有一个尾部，一个头部，有一个方向，有一个长度。'
  },
]

// 图形
const defaultRectData: IDefaultRectData = {
  tag: 'Rect',
  width: 100,
  height: 100,
  fill: '#ec5a53',
  stroke: '#a40000',
  strokeWidth: 1,
  draggable: true,
  editable: true,
  around: 'center',
  cornerRadius: 0,
  opacity: 1,
  strokeJoin: 'miter',
}
const defaultStarData: IDefaultStarData = {
  tag: 'Star',
  width: 100,
  height: 100,
  fill: '#fae167',
  stroke: '#b89e1c',
  strokeWidth: 1,
  innerRadius: 0.5,
  corners: 5,
  cornerRadius: 1,
  draggable: true,
  editable: true,
  around: 'center',
  opacity: 1,
  strokeJoin: 'miter',
}
const defaultEllipseData = {
  tag: 'Ellipse',
  width: 100,
  height: 100,
  fill: '#f3b349',
  stroke: '#c89135',
  strokeWidth: 1,
  draggable: true,
  editable: true,
  around: 'center',
  opacity: 1,
  strokeJoin: 'miter',
}
const defaultLineData = {
  tag: 'Line',
  width: 100,
  stroke: '#72c87a',
  strokeWidth: 10,
  draggable: true,
  editable: true,
  opacity: 1,
  strokeJoin: 'miter',
}
const defaultPolygonData = {
  tag: 'Polygon',
  width: 100,
  height: 100,
  sides: 3,
  fill: '#8cc95f',
  stroke: '#4e851f',
  strokeWidth: 1,
  draggable: true,
  editable: true,
  around: 'center',
  opacity: 1,
  strokeJoin: 'miter',
}
const defaultArrowData = {
  tag: 'Arrow',
  endArrow: 'triangle',
  strokeWidth: 5,
  stroke: '#57bde5',
  draggable: true,
  editable: true,
  opacity: 1,
  strokeJoin: 'miter',
}
// 工具
const defaultToolData = {
  'draggable': true,
  'editable': true,
  'lockRatio': true
}
// 防护
const defaultShieldData = {
  'draggable': true,
  'editable': true,
  'lockRatio': true
}
// 人员
const defaultPersonData = {
  'draggable': true,
  'editable': true,
  'lockRatio': true
}

// 车辆
const defaultCarData = {
  'className': 'Car',
  'draggable': true,
  'editable': true,
  'lockRatio': true,
}

// 隐患
const defaultDangerData = {
  'draggable': true,
  'editable': true,
  'lockRatio': true,
}

export {
  // 基础数据
  graphsData,
  // 图形-默认数据
  defaultRectData,
  defaultStarData,
  defaultEllipseData,
  defaultLineData,
  defaultPolygonData,
  defaultArrowData,
  // 工具-默认数据
  defaultToolData,
  // 防护-默认数据
  defaultShieldData,
  // 人员-默认数据
  defaultPersonData,
  // 车辆-默认数据
  defaultCarData,
  // 隐患-默认数据
  defaultDangerData,
}