<script setup lang="ts">
import {ref} from 'vue'
import {useGlobalStore} from '../store/global.ts'
import {storeToRefs} from 'pinia'
import {ElMessage} from 'element-plus'
import App from '../utils/App.ts'
import {UploadFilled} from '@element-plus/icons-vue'
import {updateImg, taskInfo} from '@/service/Task'
import {drillInfo} from '@/service/Drill.ts'
import { ElLoading } from 'element-plus'
import handleWindDirection from '@/utils/WindDirection.ts'

const uploadLoading = ref<ReturnType<typeof ElLoading.service>>()
const globalStore = useGlobalStore()
const {isPicture, animation, taskId, windDirection} = storeToRefs(useGlobalStore())
const action = BASE_URL + '/api/FileLoad/UploadBgImgFile'

// 派发事件传递天气数据
const emits = defineEmits(['update:weatherData'])
// 上传前置处理
const handleBeforeUpload = () => {
  uploadLoading.value = ElLoading.service({
    lock: true,
    text: '图片上传中...',
    background: 'rgba(0, 0, 0, 0.7)',
    target:'.drawing-board-wrapper'
  })
}
// 上传错误处理
const handleUploadError = () => {
  uploadLoading.value?.close()
  ElMessage.error('图片上传失败')
}

// 上传图片成功，保存图片信息到数据库
const handleSuccessUpload = async (response: any) => {
  uploadLoading.value?.close()
  if (response.code === 1) {
    // 创建保存专用 Loading 实例
    const saveLoading = ElLoading.service({
      lock: true,
      text: '保存图片信息中...',
      background: 'rgba(0, 0, 0, 0.7)',
      target:'.drawing-board-wrapper'
    })
    const res = await updateImg({
      bianhao: taskId.value,
      imgurl_bg: response.url,
      task_data_bianhao: ''
    })
    if (res.code === 1) {
      const data = res.data
      saveLoading.setText('正在初始化画板...')
      globalStore.setPictureInfo({
        width: data.img_width,
        height: data.img_length,
        url: BASE_URL + '/' + data.imgurl_bg
      })
      App.drawingBoardInstance.initPageEditor(saveLoading)
      // 保存setScale到全局用于计算尺寸转换系数
      globalStore.setScale(data.scale)
    }
  } else {
    ElMessage.error(response.msg)
  }
}


// 如果有taskId，再回显数据
// 如果有imgurl_bg，说明已经上传过图片，直接创建画板
const review = async () => {
  if (taskId.value) {
    // 根据taskId获取任务，拿到图片信息
    const res = await taskInfo({bianhao: taskId.value})
    const data = res.data[0]
    if (res.code === 1) {
      if (data.imgurl_bg) {
        // 创建回显专用 Loading 实例
        const reviewLoading = ElLoading.service({
          lock: true,
          text: '正在回显数据...',
          background: 'rgba(0, 0, 0, 0.7)',
          target:'.drawing-board-wrapper'
        })
        globalStore.setPictureInfo({
          width: data.img_width,
          height: data.img_length,
          url: BASE_URL + '/' + data.imgurl_bg
        })
        App.drawingBoardInstance.initPageEditor(reviewLoading)
        // 保存setScale到全局用于计算尺寸转换系数
        globalStore.setScale(data.scale)

      } else {
        isPicture.value = false
        ElMessage.info('请上传一张图片')
      }
      // 设置作业类型
      globalStore.setTaskType(data.zuoye_type)
      if(data.wind_direction) {
        globalStore.setWindDirection(data.wind_direction)
        windDirection.value && handleWindDirection(windDirection.value)
      } else {
        globalStore.setWindDirection('')
        App.drawingBoardInstance.removeWindDirection()
      }
      if(data.weather) {
        emits('update:weatherData', {
          weather: data.weather,
          windScale: data.wind_scale,
          windDirection: data.wind_direction
        })
      }


      // 回显已绘制的要素
      const resLast = await drillInfo({task_data_bianhao: data.task_data_bianhao})
      if (resLast.code === 1) { // code可能为0或1
        const jsonData = JSON.parse(resLast.data.data)
        if(jsonData.length) {
          App.drawingBoardInstance.reviewElements(jsonData)
        }
      }
      if(data.sign_beijiaodi) {
        App.drawingBoardInstance.lockElements()
      } else {
        App.drawingBoardInstance.unlockElements()
      }
    }
  }
}
review()


</script>

<template>
  <div class="select-image" v-if="!isPicture" :class="['animate__animated', animation]">
    <div class="area">
      <el-upload
          class="upload-custom"
          drag
          :action="action"
          :show-file-list="false"
          :on-success="handleSuccessUpload"
          :before-upload="handleBeforeUpload"
          :on-error="handleUploadError"
      >
        <el-icon class="el-icon--upload">
          <upload-filled/>
        </el-icon>
        <div class="el-upload__text">请选择一张图片</div>
      </el-upload>
    </div>
  </div>
</template>

<style scoped lang="scss">
.select-image {
  position: absolute;
  z-index: 9;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

  .area {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 15px;
    width: 200px;
    height: 150px;
    background: #fafafa;


    .upload-custom {
      display: flex;
      flex-direction: column;
      justify-content: center;
      width: 100%;
      height: 100%;

      :deep(.el-upload) {
        width: 100%;
        height: 100%;
      }

      // 定义css变量
      :deep(.el-upload-list--picture-card) {
        width: 100%;
        height: 100%;
      }

      :deep(.el-upload--picture-card) {
        width: 100%;
        height: 100%;
      }

      :deep(.el-upload-dragger) {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 0;
        width: 100%;
        height: 100%;
      }
    }


    .icon {
      font-size: 36px;
      color: #666;
    }

    .text {
      margin-top: 16px;
      font-size: 14px;
      color: #666;
    }
  }
}
</style>