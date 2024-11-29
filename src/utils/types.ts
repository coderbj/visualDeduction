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
  title:string
  icon:string
}

export interface IToolData {
  tag: string
  resourceName: string
  width: number
  height: number
  stroke: string
  strokeWidth: number
  fill: string
  corners?: number
  draggable: boolean
  editable: boolean,
  around?: string,
  cornerRadius?: number,
  opacity?: number,
  dashPattern?: number[],
  strokeJoin?: string,
  plugins?: any[],
  description?: string
}

export interface ICarData {
  tag: string
  width: number
  height: number
  resourceName: string
  draggable: boolean
  editable: boolean
  children: Record<string, any>
}

export interface IPersonData {
  tag: string
  resourceName: string
  draggable: boolean
  editable: boolean,
  lockRatio: boolean,
  children: Record<string, any>,
  event?: Record<string, any>
}

export interface IToolOptions {
  icon:string
  title:string
  name?:string
  notMove?:boolean
  cursor?:string
  fontSize?:number
  fill?:string
  createdFactory?:(x:number, y:number, e?:any) => any
}