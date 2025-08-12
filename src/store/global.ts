import {defineStore} from 'pinia'
import {Ref, ref, computed, ComputedRef} from 'vue'
import { IPictureInfo } from '../utils/types'
import {useSessionStorage} from '@vueuse/core'
export const useGlobalStore = defineStore('global', ()=> {
  const pictureInfo:Ref<IPictureInfo> = ref({}) // 图片信息
  const isPicture = ref(false) // 是否是图片
  const animation = ref('') // 动画
  const enabledRuler = ref(true) // 是否启用标尺
  const taskIdStorage = useSessionStorage('taskId', '')
  const taskId: Ref<string> = ref(taskIdStorage.value) // 任务id
  const taskTypeStorage = useSessionStorage('taskType', '')
  const taskType: Ref<string> = ref(taskTypeStorage.value) // 作业类型
  const isShowRemarkDialog = ref(false) // 是否显示弹窗
  const zoomValue = ref(1)
  const scaleStorage = useSessionStorage('g_scale', '')
  const g_scale = ref(scaleStorage.value) // 飞行高度
  const windDirection = ref('') // 风向
  const isLock = ref(false) // 是否锁定界面、锁定元素
  // 设置图片信息
  const setPictureInfo = (info:IPictureInfo) => {
    isPicture.value = true
    pictureInfo.value = info
  }
  // 清除图片信息
  const clearPictureInfo = () => {
    isPicture.value = false
    pictureInfo.value = {}
  }
  // 设置是否启用标尺
  const setEnabledRuler = (enabled:boolean) => {
    enabledRuler.value = enabled
  }
  // 设置任务id
  const setTaskId = (id:string) => {
    taskIdStorage.value = id
    taskId.value = id
  }
  // 设置作业类型
  const setTaskType = (type:string) => {
    taskTypeStorage.value = type
    taskType.value = type
  }
  // 清除任务id
  const clearTaskId = () => {
    taskIdStorage.value = ''
    taskId.value = ''
  }
  // 设置缩放值
  const setScale = (scale:string) => {
    scaleStorage.value = scale
    g_scale.value = scale
  }
  // 设置风向
  const setWindDirection = (direction:string) => {
    windDirection.value = direction
  }
  // 计算属性，计算米转像素
  const meterToPixel:ComputedRef<number> = computed(()=> {
    return 1 / Number(g_scale.value)
  })
  // 设置锁定
  const setLock = (lock:boolean) => {
    isLock.value = lock
  }


  return {
    isPicture,
    pictureInfo,
    animation,
    enabledRuler,
    taskId,
    taskType,
    isShowRemarkDialog,
    zoomValue,
    g_scale,
    windDirection,
    meterToPixel,
    isLock,
    setPictureInfo,
    clearPictureInfo,
    setEnabledRuler,
    setTaskId,
    setTaskType,
    clearTaskId,
    setScale,
    setWindDirection,
    setLock,
  }
})