import {boundsType, dataProcessor, Group, GroupData, registerUI} from 'leafer-editor'
import {IGroupInputData, IGroupData} from 'leafer-editor'

// 1. 在数据接口中添加属性
export interface IResGroupInputData extends IGroupInputData {
  parentIndex?: string
  resourceName?: string
  description?: string
  remark?: string
}

// 数据处理（计算数据）接口, 需定义为可选项，比如: width?: number
export interface IResGroupCustomData extends IGroupData {
  parentIndex?: string
  resourceName?: string
  description?: string
  remark?: string
}

export class CustomData extends GroupData implements IResGroupCustomData {

}

@registerUI()
export class CustomResGroup extends Group {
  public get __tag() {return 'CustomResGroup'}

  @dataProcessor(CustomData)
  declare public __:IResGroupCustomData

  @boundsType('')
  declare public parentIndex:string
  @boundsType('')
  declare public resourceName:string
  @boundsType('')
  declare public description:string
  @boundsType('')
  declare public remark:string
  constructor(data: IResGroupInputData) {
    super(data)
  }

  // 添加初始化方法
  public init(
    parentIndex: string,
    resourceName: string,
    description: string,
    remark: string = ''
  ) {
    this.parentIndex = parentIndex;
    this.resourceName = resourceName;
    this.description = description;
    this.remark = remark;
  }
}
