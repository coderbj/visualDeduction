import {Ellipse, IUI, Rect, Star, Line,Polygon, Group, Text} from 'leafer-editor'
import { Arrow } from '@leafer-in/arrow'

export interface ExtendedIU extends IUI {
  parentIndex?: string
  resourceName?: string
  description?: string
  remark?: string
}

// 初始化自定义属性
export default function InitCustomAttr (){
  Rect.addAttr('parentIndex', '')
  Rect.addAttr('resourceName', '')
  Rect.addAttr('description', '')
  Rect.addAttr('remark', '')

  Star.addAttr('parentIndex', '')
  Star.addAttr('resourceName', '')
  Star.addAttr('description', '')
  Star.addAttr('remark', '')

  Ellipse.addAttr('parentIndex', '')
  Ellipse.addAttr('resourceName', '')
  Ellipse.addAttr('description', '')
  Ellipse.addAttr('remark', '')

  Line.addAttr('parentIndex', '')
  Line.addAttr('resourceName', '')
  Line.addAttr('description', '')
  Line.addAttr('remark', '')

  Polygon.addAttr('parentIndex', '')
  Polygon.addAttr('resourceName', '')
  Polygon.addAttr('description', '')
  Polygon.addAttr('remark', '')

  Arrow.addAttr('parentIndex', '')
  Arrow.addAttr('resourceName', '')
  Arrow.addAttr('description', '')
  Arrow.addAttr('remark', '')

  Group.addAttr('parentIndex', '')
  Group.addAttr('resourceName', '')
  Group.addAttr('remark', '')

  Text.addAttr('parentIndex', '')
  Text.addAttr('resourceName', '')
  Text.addAttr('remark', '')
}

