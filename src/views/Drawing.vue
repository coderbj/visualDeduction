<script setup lang="ts">
import App from '../utils/App.ts'
import {onMounted, onUnmounted, reactive} from 'vue'
import SideMenu from '@/components/SideMenu.vue'
import AppHeader from '@/components/AppHeader.vue'
import SelectImage from '@/components/SelectImage.vue'
import {storeToRefs} from 'pinia'
import {useGlobalStore} from '@/store/global.ts'
const {isShowRemarkDialog} = storeToRefs(useGlobalStore())



onMounted(() => {
  App.init({
    domId: 'drawing-board-container',
  })
})

const weatherData = reactive({
  weather: '',
  windScale: '',
  windDirection: '',
})

const form = reactive({
  remark: ''
})
const handleConfirmRemark = () => {
  App.drawingBoardInstance!.addRemark(form.remark)
  form.remark = ''
  isShowRemarkDialog.value = false
}

const ondragOver = (e: MouseEvent) => {
  App.drawingBoardInstance!.dragover(e)
}

// 仅PC端拖拽
/*const onDrop = (e) => {
  const point = App.drawingBoardInstance.leaferInstanceReadonly.getPagePointByClient({
    clientX: e.clientX,
    clientY: e.clientY
  }, true)
  App.drawingBoardInstance.drop(point)
}*/

// 传递天气数据
const onUpdateWeatherData = (data) => {
  weatherData.weather = data.weather
  weatherData.windScale = data.windScale
  weatherData.windDirection = data.windDirection
}

onUnmounted(() => {
  App.destroy()
})
</script>

<template>
  <div class="my-app">
    <AppHeader :weatherData="weatherData"/>
    <main class="app-main">
      <SideMenu class="side"></SideMenu>
      <div class="drawing-board-wrapper">
        <div class="select-image-wrapper">
          <SelectImage @update:weatherData="onUpdateWeatherData"></SelectImage>
        </div>
        <!--        <div id="drawing-board-container" @dragover="ondragOver" @mousedown="onDrop"></div>-->
        <div id="drawing-board-container" @dragover="ondragOver"></div>

        <el-dialog v-model="isShowRemarkDialog" title="添加备注" width="500">
          <el-form :model="form">
            <el-form-item>
              <el-input type="textarea" v-model="form.remark" autocomplete="off" />
            </el-form-item>
          </el-form>
          <template #footer>
            <div class="dialog-footer">
              <el-button @click="isShowRemarkDialog = false">取消</el-button>
              <el-button type="primary" @click="handleConfirmRemark">确定</el-button>
            </div>
          </template>
        </el-dialog>
      </div>
    </main>
  </div>
</template>

<style scoped lang="scss">
.my-app {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100%;

  .app-main {
    display: flex;
    flex-direction: row;
    flex: 1;
    height: calc(100% - 40px);

    .drawing-board-wrapper {
      position: relative;
      box-sizing: border-box;
      flex: 1;
      width: calc(100% - 290px);
      background: #f1f2f4;

      .select-image-wrapper {
        display: grid;
        place-items: center;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
      }

      #drawing-board-container {
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        pointer-events: auto;
        flex-grow: 1;
      }
    }
  }
}
</style>