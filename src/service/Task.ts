import {hyRequest} from '@/service'
// 获取作业任务列表
export function taskList(params: any) {
  return hyRequest.post({
    url: '/api/task/list',
    data: {
      PageIndex: params.PageIndex,
      PageSize: params.PageSize,
      name: params.name,
      bianhao: params.bianhao,
      zuoye_type: params.zuoye_type,
      zuoye_level: params.zuoye_level,
      starttime: params.starttime,
      endtime: params.endtime,
    }
  })
}

// 获取单条作业任务详情 /api/task/info
export function taskInfo(params: any) {
  return hyRequest.post({
    url: '/api/task/info',
    data: {
      bianhao: params.bianhao
    }
  })
}

// 添加任务
export function insertTask(params: any) {
  return hyRequest.post({
    url: '/api/task/insert',
    data: {
      name: params.name,
      username: params.username,
      user_bianhao: params.user_bianhao,
      zuoye_type: params.zuoye_type,
      zuoye_level: params.zuoye_level,
      zuoye_date: params.zuoye_date,
      weather: params.weather,
      wind_direction: params.wind_direction,
      wind_scale: params.wind_scale,
      height_img: params.height_img,
      jiaodi_bianhao: params.jiaodi_bianhao,
      upgrade: params.upgrade,
      around: params.around,
    }
  })
}

// 修改任务
export function updateTask(params: any) {
  return hyRequest.post({
    url: '/api/task/update',
    data: {
      bianhao: params.bianhao,
      name: params.name,
      username: params.username,
      user_bianhao: params.user_bianhao,
      zuoye_type: params.zuoye_type,
      zuoye_level: params.zuoye_level,
      zuoye_date: params.zuoye_date,
      weather: params.weather,
      wind_direction: params.wind_direction,
      wind_scale: params.wind_scale,
      height_img: params.height_img,
      describe: params.describe,
      content: params.content,
      dangers: params.dangers,
      notice: params.notice,
      upgrade: params.upgrade,
      around: params.around,
    }
  })
}
// 修改当前推演任务的交底信息
export function updateTaskJiaodi(params: any) {
  return hyRequest.post({
    url: '/api/task/updatejiaodi',
    data: {
      bianhao: params.bianhao,
      dangers: params.dangers,
      notice:params.notice,
      around:params.around
    }
  })
}

// 删除任务
export function deleteTask(params: any) {
  return hyRequest.post({
    url: '/api/task/delete',
    data: {
      bianhao: params.bianhao
    }
  })
}
// 背景图片上传
export function uploadBgImgFile() {
  return hyRequest.post({
    url: '/api/FileLoad/UploadBgImgFile',
  })
}
// 保存图片地址
export function updateImg(params: any) {
  return hyRequest.post({
    url: '/api/task/updateimg',
    data: {
      bianhao: params.bianhao,
      imgurl_bg: params.imgurl_bg,
      task_data_bianhao: params.task_data_bianhao,
    }
  })
}