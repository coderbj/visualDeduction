import {hyRequest} from '@/service'
// 登录和用户

// 密码验证
interface ILoginVerify {
  username: string
  password: string
}
export function verify(payload:ILoginVerify) {
  return hyRequest.post({
    url:'/api/user/verify',
    data:payload
  })
}

// 用户列表
interface ILoginList {
  PageIndex: number
  PageSize: number
}
export function list(payload:ILoginList) {
  return hyRequest.post({
    url:'/api/user/list',
    data:payload
  })
}

// 添加
interface ILoginInsert {
  username: string
  password: string
  name: string
}
export function insert(payload:ILoginInsert) {
  return hyRequest.post({
    url:'/api/user/insert',
    data:payload
  })
}

// 修改
interface ILoginUpdate {
  username: string
  password: string
  name: string
  BianHao: string
}
export function update(payload:ILoginUpdate) {
  return hyRequest.post({
    url:'/api/user/update',
    data:payload
  })
}

// 删除
interface ILoginDelete {
  BianHao: string
}
export function deleteuser(payload:ILoginDelete) {
  return hyRequest.post({
    url:'/api/user/delete',
    data:payload
  })
}