import {hyRequest} from '@/service'
// 获取最后一条推演数据
export function drillInfo(params) {
  return hyRequest.post({
    url: '/api/drill/info',
    data:{
      bianhao: params.task_data_bianhao
    }
  })
}
// 添加推演数据
export function addDrillInfo(params) {
  return hyRequest.post({
    url: '/api/drill/insert',
    data: {
      task_bianhao: params.task_bianhao,
      data: params.data
    }
  })
}