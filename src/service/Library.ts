import {hyRequest} from '@/service'
// 要素库列表
interface ILibraryList {
  PageIndex: number
  PageSize: number
  name?: string
  bianhao?: string
  zuoyetype?: string
}
export function list(payload:ILibraryList) {
  return hyRequest.post({
    url:'/api/library/list',
    data:payload
  })
}
// 添加要素库
interface ILibraryInsert {
  name: string
  zuoyetype: string
  icon: string
}
export function libraryInsert(payload:ILibraryInsert) {
  return hyRequest.post({
    url:'/api/library/insert',
    data:{
      name: payload.name,
      zuoyetype: payload.zuoyetype,
      icon: payload.icon
    }
  })
}
// 修改要素库
interface ILibraryUpdate {
  bianhao: string
  name: string
  zuoyetype: string
  icon: string
}
export function libraryUpdate(payload:ILibraryUpdate) {
  return hyRequest.post({
    url:'/api/library/update',
    data:{
      bianhao: payload.bianhao,
      name: payload.name,
      zuoyetype: payload.zuoyetype,
      icon: payload.icon
    }
  })
}
// 删除要素库
interface ILibraryDelete {
  bianhao: string
}
export function libraryDelete(payload:ILibraryDelete) {
  return hyRequest.post({
    url:'/api/library/delete',
    data:{
      bianhao: payload.bianhao
    }
  })
}



// 要素列表
interface IMaterialList {
  PageIndex: number
  PageSize: number
  name?: string
  bianhao?: string
  zuoyetype?: string
  library_bianhao: string
}
export function materialList(payload:IMaterialList) {
  return hyRequest.post({
    url:'/api/material/list',
    data:payload
  })
}
// 图片上传 没用到，直接用的表单的action
export function uploadImgFile(payload) {
  return hyRequest.post({
    url:'/api/FileLoad/UploadImgFile',
    data:payload
  })
}
// 添加要素 /api/material/insert
interface IMaterialInsert {
  name: string
  zuoyetype?: string
  library_bianhao: string
  length: string
  width: string
  height: string
  describe: string
  imgurl: string
}
export function materialInsert(payload:IMaterialInsert) {
  return hyRequest.post({
    url:'/api/material/insert',
    data:payload
  })
}
// 修改要素 /api/material/update
interface IMaterialUpdate {
  bianhao: string
  name: string
  zuoyetype: string
  library_bianhao: string
  length: string
  width: string
  height: string
  describe: string
  imgurl: string
}
export function materialUpdate(payload:IMaterialUpdate) {
  return hyRequest.post({
    url:'/api/material/update',
    data:payload
  })
}
// 删除要素
interface IMaterialDelete {
  bianhao: number
}
export function materialDelete(payload:IMaterialDelete) {
  return hyRequest.post({
    url:'/api/material/delete',
    data:payload
  })
}

// 批量上传-导入excel 没用到，直接用的表单的action
export function uploadExcelFile(payload) {
  return hyRequest.post({
    url:'/api/FileLoad/UploadExcelFile',
    data:payload
  })
}
// 批量上传-导入数据 /api/material/insertresource
interface IInsertResource {
  library_bianhao: string
  excelfile: string
}
export function insertResource(payload:IInsertResource) {
  return hyRequest.post({
    url:'/api/material/insertresource',
    data:payload
  })
}

// 导出接口
export type {
  IInsertResource,
  IMaterialInsert
}