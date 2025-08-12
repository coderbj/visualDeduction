import {hyRequest} from '@/service'

// 获取单条作业任务详情
export function taskInfo(params: any) {
  return hyRequest.post({
    url: '/api/task/info',
    data: {
      bianhao: params.bianhao
    }
  })
}

// 交底签名上传
export function updateSign(params: any) {
  return hyRequest.post({
    url: '/api/task/updatesign',
    data: {
      bianhao: params.bianhao,
      img_base: params.img_base,
      jiaodi: params.jiaodi
    },
  })
}
// 签名删除
export function deleteSign(params: any) {
  return hyRequest.post({
    url: '/api/task/deletesign',
    data: {
      bianhao: params.bianhao,
      img_url: params.img_url,
      jiaodi: params.jiaodi
    }
  })
}

// 交底信息列表
export function getShareInfoList(params: any) {
  return hyRequest.post({
    url: '/api/jiaodi/list',
    data: {
      bianhao: params.bianhao,
      PageIndex: params.PageIndex,
      PageSize: params.PageSize,
      zuoye_type: params.zuoye_type,
      starttime: params.starttime,
      endtime: params.endtime,
    }
  })
}
// 获取单条交底信息详情
export function getShareInfo(bianhao: string) {
  return hyRequest.post({
    url: '/api/jiaodi/info',
    data: {
      bianhao
    }
  })
}
// 设置交底信息
export function setShareInfo(params: any) {
  return hyRequest.post({
    url: '/api/jiaodi/insert',
    data: {
      name: params.name,
      zuoye_type: params.zuoye_type,
      zuoye_date: params.zuoye_date,
      describe: params.describe,
      content: params.content,
      dangers: params.dangers,
      notice: params.notice,
    }
  })
}

// 删除交底信息
export function deleteShareInfo(params: any) {
  return hyRequest.post({
    url: '/api/jiaodi/delete',
    data: {
      bianhao: params.bianhao
    }
  })
}
// 修改交底信息
export function updateShareInfo(params: any) {
  return hyRequest.post({
    url: '/api/jiaodi/update',
    data: {
      bianhao: params.bianhao,
      name: params.name,
      zuoye_type: params.zuoye_type,
      zuoye_date: params.zuoye_date,
      describe: params.describe,
      content: params.content,
      dangers: params.dangers,
      notice: params.notice,
    }
  })
}