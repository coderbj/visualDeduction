import {hyRequest} from '@/service'
// 视频列表/api/video/list
export function getVideoList(payload: any) {
  return hyRequest.post({
    url: '/api/video/list',
    data: {
      PageIndex:payload.PageIndex,
      PageSize:payload.PageSize,
      name:payload.name,
      bianhao:payload.bianhao,
      zuoye_type:payload.zuoye_type,
    }
  })
}