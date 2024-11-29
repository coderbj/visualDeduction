import {IToolData, ICarData, IPersonData} from './types'
import LineSegmentSizePlugin from '../components/LineSegmentSizePlugin.tsx'
import ResourceDescriptionPlugin from '../components/ResourceDescriptionPlugin.tsx'

// 左侧工具数据
const toolsData: IToolData[] = [
  {
    'resourceName': '矩形',
    'tag': 'Rect',
    'width': 100,
    'height': 100,
    'fill': '#32cd79',
    'stroke': 'rgba(8,135,67,1)',
    'strokeWidth': 1,
    'draggable': true,
    'editable': true,
    'around': 'center',
    'cornerRadius': 0,
    'opacity': 1,
    'dashPattern':[0,0],
    'strokeJoin':'miter',
    'plugins':[LineSegmentSizePlugin,ResourceDescriptionPlugin],
    'description': '矩形'
  },
  {
    'resourceName': '星形',
    'tag': 'Star',
    'width': 100,
    'height': 100,
    'corners': 5,
    'stroke': 'rgba(8,135,67,1)',
    'strokeWidth': 1,
    'fill': 'rgb(50,205,121)',
    'draggable': true,
    'editable': true,
    'around': 'center',
    'plugins':[LineSegmentSizePlugin]
  }
]
// 左侧车辆数据
const carsData: ICarData[] = [
  {
    'resourceName': '吊车',
    'tag': 'Group',
    'width': 400,
    'height': 400,
    'draggable': true,
    'editable': true,
    'children': [
      {
        'tag': 'Ellipse',
        'width': 400,
        'height': 400,
        'fill': 'rgb(50,205,121, 0.5)',
        'stroke': 'rgba(8,135,67,1)',
        'strokeWidth': 2,
        'around': 'center',
      },
      {'tag': 'Image', 'width': 200, 'height': 200, 'url': '/images/icons_dc.svg','around': 'center',},
    ]
  },
]
// 左侧人员数据
const personsData: IPersonData[] = [
  {
    'resourceName': '作业人员',
    'tag': 'Group',
    'draggable': true,
    'editable': true,
    'lockRatio': true,
    'children':[
      {
        'tag': 'Image',
        'url': '/images/worker01.svg',
        'width': 100,
        'height': 100,
        'around': 'center',
      },
      {
        'tag': 'Text',
        'text': '作业人员',
        'fill': 'rgba(0,0,0,0.8)',
        'padding': [5, 5],
        'draggable': false,

      }
    ],
  },
]


export {
  toolsData,
  carsData,
  personsData,
}