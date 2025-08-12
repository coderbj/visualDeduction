import {IUI} from 'leafer-editor'
import DrawingBoard from './DrawingBoard.ts'

export interface IAppProps {
  domId:string
  onChange?:() => void
  config?:any
}

export interface IPluginProps {
  drawingBoard:DrawingBoard
}

export interface ISideMenus {
  id:number
  bianhao:string
  zuoyetype:string
  name:string
  icon:string
}

export interface IGraphsData {
  resourceName: string
  tag: string
  icon: string
  describe:string
}
export interface IResourceData {
  parentIndex?: number
  resourceName?: string
  imgurl?: string
  name?: string
  describe?: string
  tag?: string
  icon?: string
  width?: number
  height?: number
  length?: number
  zuoyeradius?: number
}

export interface IToolOptions {
  icon:string
  title:string
  name?:string
  notMove?:boolean
  cursor?:string
  fontSize?:number
  fill?:string,
  strokeWidth?:number
  stroke?:string
  createdFactory?:(x:number, y:number, e?:any) => any
  onMousemove?:(e?, point?:any) => void
}

export interface IDefaultRectData {
  tag: string
  width: number
  height: number
  fill: string
  stroke: string
  strokeWidth: number
  draggable: boolean
  editable: boolean
  around: string
  cornerRadius: number
  opacity: number
  strokeJoin: string
}
export interface IDefaultStarData {
  tag: string
  width: number
  height: number
  fill: string
  stroke: string
  strokeWidth: number
  innerRadius: number
  corners: number
  cornerRadius: number
  draggable: boolean
  editable: boolean
  around: string
  opacity: number
  strokeJoin: string
}

export interface IUIExtended extends IUI {
  parentIndex: number;
  resourceIndex: number;
}

export interface IPictureInfo {
  width?:number
  height?:number
  url?:string
  isPicture?:boolean
}


