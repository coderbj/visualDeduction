<script setup lang="ts">
import {ref, Ref} from 'vue'
import {ISideMenus, IToolData, ICarData} from '../utils/types'
import {toolsData, carsData, personsData} from '../utils/Resource.ts'
import App from '../utils/App.ts'

const sideMenuRef: Ref<null | HTMLElement> = ref(null)
const wrapperRef: Ref<null | HTMLElement> = ref(null)
const isCollapsed: Ref<boolean> = ref(false)
const currentMenuIndex: Ref<number> = ref(0)
// 侧边栏菜单数据
const sideMenus: ISideMenus[] = [
  {
    icon: 'icon-tool',
    title: '工具',
  },
  {
    icon: 'icon-truck',
    title: '车辆',
  },
  {
    icon: 'icon-user',
    title: '人员',
  }
]


const dragStart = (e:DragEvent, item: IToolData | ICarData) => {
  e.dataTransfer!.setData('data', JSON.stringify(item))
  // 保存菜单数据
  console.log(toolsData[currentMenuIndex.value].data)
}

const changeSideMenu = (index: number) => {
  currentMenuIndex.value = index
  App.drawingBoardInstance!.activeResourceIndex.value = index
}

const collapseMenu = () => {
  isCollapsed.value = !isCollapsed.value
  if (isCollapsed.value) {
    wrapperRef.value!.style.width = '0'
    //sideMenuRef.value!.style.width = '60px'
  } else {
    wrapperRef.value!.style.width = '230px'
    //sideMenuRef.value!.style.width = '290px'
    //document.querySelector('.drawing-board-wrapper')!.style.width = 'calc(100% - 290px)'
  }
}
</script>

<template>
  <div class="side-menu" ref="sideMenuRef">
    <div class="fixed">
      <template v-for="(item,index) in sideMenus">
        <div class="btn" @click="changeSideMenu(index)" :class="index === currentMenuIndex? 'active':''">
          <i class="icon" :class="item.icon"></i>
          <div class="text">{{ item.title }}</div>
        </div>
      </template>
      <div class="collapse-btn" @click="collapseMenu">
        <i class="icon" :class="isCollapsed ? 'icon-chevron-right':'icon-chevron-left'"></i>
      </div>
    </div>
    <div class="wrapper" ref="wrapperRef">
      <div class="container" v-show="currentMenuIndex === 0 && !isCollapsed">
        <div class="title">工具</div>
        <div class="content">
          <template v-for="item in toolsData">
            <div @dragstart="dragStart($event, item)" draggable="true">{{item.resourceName}}</div>
          </template>
        </div>
      </div>
      <div class="container" v-show="currentMenuIndex === 1 && !isCollapsed">
        <div class="title">车辆</div>
        <div class="content">
          <template v-for="item in carsData">
            <div @dragstart="dragStart($event, item)" draggable="true">{{item.resourceName}}</div>
          </template>
        </div>
      </div>
      <div class="container" v-show="currentMenuIndex === 2 && !isCollapsed">
        <div class="title">人员</div>
        <div class="content">
          <template v-for="item in personsData">
            <div @dragstart="dragStart($event, item)" draggable="true">{{item.toolName}}</div>
          </template>
        </div>
      </div>
    </div>
    <!--收起按钮 -->

  </div>
</template>

<style scoped lang="scss">
.side-menu {
  display: flex;
  //position: relative;
  box-sizing: border-box;
  //width: 290px;

  .fixed {
    position: relative;
    padding: 20px 0;
    border-right: 1px solid #eee;
    box-sizing: border-box;
    width: 60px;
    background: white;

    .btn {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 60px;
      text-align: center;
      cursor: pointer;
      user-select: none;
      color: #333;

      .icon {
        font-size: 24px;
      }

      .text {
        font-size: 14px;
      }

      &.active {
        color: #0448f4;
      }
    }

    .collapse-btn {
      z-index: 9;
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      left: 15px;
      bottom: 30px;
      width: 30px;
      height: 30px;
      background: rgba(0, 0, 0, 0.5);
      border-radius: 6px;

      .icon {
        font-size: 20px;
        color: white;
      }
    }
  }

  .wrapper {
    width: 230px;
    background: white;
    overflow: hidden;
    transition: width 0.3s ease;

    .container {
      width: 100%;
      height: 100%;

      .title {
        text-align: left;
        padding: 10px 10px;
        box-sizing: border-box;
        font-size: 16px;
        font-weight: bold;
        border-bottom: 1px solid #f0f0f0;
        color: #333;
      }

      .content {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 10px;
        padding: 10px;
        box-sizing: border-box;
        overflow: hidden;
        width: 100%;

        div {
          height: 100px;
          background: #f0f0f0;
          border-radius: 6px;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 14px;
          color: #333;
          user-select: none;
        }
      }
    }
  }

}
</style>