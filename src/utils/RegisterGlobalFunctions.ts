import { ElMessage } from 'element-plus'
export function checkPicture (isPicture: boolean) {
  if (!isPicture) {
    ElMessage({
      message: '请先选择一张图片',
      type: 'warning',
    });
    return false
  }
  return true
}

// 全局注册 generateUrl
export function $generateUrl(param:string):string {
    return `${BASE_URL}/${param}`;
}