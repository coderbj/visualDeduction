<script setup lang="ts">
import App from './utils/App.ts'
import {onMounted, onUnmounted} from 'vue'
import SideMenu from './components/SideMenu.vue'
import AppHeader from './components/AppHeader.vue'

onMounted(() => {
  App.init({
    domId: 'drawing-board-container',
  })
})

const ondragOver = (e:MouseEvent) => {
  App.drawingBoardInstance!.dragover(e)
}

const onDrop = (e:DragEvent) => {
  App.drawingBoardInstance!.drop(e)
}

onUnmounted(() => {
  App.destroy()
})
</script>

<template>
  <div class="my-app">
    <AppHeader/>
    <main class="app-main">
      <SideMenu class="side"></SideMenu>
      <div class="drawing-board-wrapper">
        <div id="drawing-board-container" @dragover="ondragOver" @drop="onDrop"></div>
      </div>
    </main>
  </div>
</template>

<style scoped lang="scss">
.my-app {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;

  .app-main {
    display: flex;
    flex-direction: row;
    flex: 1;

    .drawing-board-wrapper {
      position: relative;
      padding: 20px;
      box-sizing: border-box;
      flex: 1;
      background: #f1f2f4;
      //width: calc(100% - 290px);
      #drawing-board-container {
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        overflow-x: hidden;
        pointer-events: auto;
      }
    }
  }
}

</style>
