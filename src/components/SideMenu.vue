<script setup lang="ts">
import {ref, Ref,} from 'vue'
import {storeToRefs} from 'pinia'
import {useRouter} from 'vue-router'
import {Grid, Search} from '@element-plus/icons-vue'
import {ISideMenus, IResourceData, IGraphsData} from '../utils/types'
import {graphsData,} from '../utils/Resource.ts'
import App from '../utils/App.ts'
import {useGlobalStore} from '../store/global.ts'
import {checkPicture, $generateUrl} from '../utils/RegisterGlobalFunctions.ts'
import {useResourceStore} from '@/store/resource.ts'
import {list, materialList} from '@/service/Library.ts'
import {ElMessage} from 'element-plus'
import NoDataBlock from '@/components/NoData.vue'

const router = useRouter()
const sideMenuRef: Ref<null | HTMLElement> = ref(null)
const wrapperRef: Ref<null | HTMLElement> = ref(null)
const isCollapsed: Ref<boolean> = ref(false) // 折叠时先隐藏内部元素，保证界面布局流畅
const {isPicture, animation, isLock, taskType, } = storeToRefs(useGlobalStore())
const {currentResourceIndex} = storeToRefs(useResourceStore())
const {setCreatingRes, setCurrentResourceIndex, setTabName} = useResourceStore()
const resourceSearchValue: Ref<string> = ref('')
const parentTitle: Ref<string> = ref('')
const sideMenuIndex = ref(0)
const activeResourceId: Ref<string> = ref('')



// 侧边栏菜单数据
const sideMenus: Ref<ISideMenus[]> = ref([])
const getSideMenus = async () => {
  const res = await list({PageIndex: 1, PageSize: 1000, zuoyetype:taskType.value})
  if (res.code === 1) {
    sideMenus.value = res.data
    // 添加图形
    sideMenus.value.unshift({
      id: 0,
      bianhao: '1',
      name: '图形',
      icon: 'icon-star1',
      zuoyetype: taskType.value,
    })
    getGraphsData(sideMenus.value[0]) // 默认加载第一个菜单的数据
  } else {
    ElMessage.error(res.msg)
  }
}
getSideMenus()
// 资源数据
const resourcesData = ref([])
const getMaterialList = async (library_bianhao:string, name = resourceSearchValue.value) => {
  const res = await materialList({
    PageIndex: 1,
    PageSize: 1000,
    name,
    library_bianhao,
    //zuoyetype: taskType.value,
  })
  if (res.code === 1) {
    resourcesData.value = res.data
  } else {
    ElMessage.error(res.msg)
  }
}

// 搜索资源-防抖
let timer: any = null
const handleSearch = () => {
  // 关键词改变取消要素选中效果
  setCurrentResourceIndex(-1)
  // 清空选中图形
  setCreatingRes({})
  clearTimeout(timer)
  timer = setTimeout(() => {
    if (sideMenuIndex.value === 0) {
      getGraphsData(sideMenus.value[0], resourceSearchValue.value)
      return
    }
    getMaterialList(activeResourceId.value)
  }, 500)
}

const touchStart = (item: IResourceData, index: number) => {
  if (!checkPicture(isPicture.value)) {
    animation.value = 'animate__shakeX'
    // 清除动画
    document.querySelector('.select-image').addEventListener('animationend', function () {
      animation.value = ''
    })
    return
  }
  // 保存到全局状态
  setCreatingRes(item)
  // 取消编辑状态，解决有选中的图形时，创建新图形属性菜单不正确的问题
  App.drawingBoardInstance!.leaferInstanceReadonly!.editor.cancel()
  App.drawingBoardInstance!.tools.toolsActiveIndex.value = 0 // 重置工具栏
  setCurrentResourceIndex(index)
}

// 默认加载第一个菜单的数据
const getGraphsData = (item:ISideMenus, name = '') => {
  let data: IGraphsData[]
  if (name) {
    // 过滤 graphsData 数组，只保留 resourceName 包含 name 的元素, 根据name进行搜索
    data = graphsData.filter((graphItem) => graphItem.resourceName.includes(name))
  } else {
    // 如果没有提供 name 参数，则使用原始的 graphsData 数组
    data = graphsData
  }
  resourcesData.value = data
  parentTitle.value = item.name
  setTabName(item.name)
}

// 切换侧边栏菜单
const changeSideMenu = (item:ISideMenus, index:number) => {
  if (!checkPicture(isPicture.value)) {
    animation.value = 'animate__shakeX'
    // 清除动画
    document.querySelector('.select-image')?.addEventListener('animationend', function () {
      animation.value = ''
    })
    return
  }
  resourceSearchValue.value = ''
  setTabName(item.name)
  setCurrentResourceIndex(-1)
  sideMenuIndex.value = index
  parentTitle.value = item.name
  App.drawingBoardInstance!.activeResourceIndex.value = item.id
  App.drawingBoardInstance!.leaferInstanceReadonly!.editor.cancel() // 取消编辑状态
  App.drawingBoardInstance!.tools.toolsActiveIndex.value = 0 // 重置工具栏
  if (item.name === '图形') {
    getGraphsData(item, resourceSearchValue.value)
    return
  }
  getMaterialList(item.bianhao)
  activeResourceId.value = item.bianhao
}

const collapseMenu = () => {
  isCollapsed.value = !isCollapsed.value
}

const toLibraryPage = () => {
  router.push('/library')
}
</script>

<template>
  <div class="side-menu" ref="sideMenuRef" v-if="!isLock">
    <div class="fixed">
      <template v-for="(item,index) in sideMenus">
        <div class="btn" @click="changeSideMenu(item, index)" :class="index === sideMenuIndex? 'active':''">
          <i class="icon" :class="item.icon"></i>
          <div class="text">{{ item.name }}</div>
        </div>
      </template>
      <div class="collapse-btn" @click="collapseMenu">
        <i class="icon" :class="isCollapsed ? 'icon-chevron-right':'icon-chevron-left'"></i>
      </div>
    </div>
    <div class="wrapper" ref="wrapperRef" :class="isCollapsed ? 'collapsed':'expanded'">
      <div class="resource-search" v-show="!isCollapsed">
        <el-input
            v-model="resourceSearchValue"
            placeholder="搜索要素"
            :suffix-icon="Search"
            @input="handleSearch"
        />
      </div>
      <div class="container">
        <div class="title">{{ parentTitle }}</div>
        <el-scrollbar style="height: calc(100% - 28px)">
          <div class="content" v-if="resourcesData.length">
            <template v-for="(item, index) in resourcesData">
              <div class="thumb" :class="currentResourceIndex === index ? 'active':''" @click="touchStart(item,index)"
                   :draggable="isPicture">
                <i class="icon" v-if="item.id">
                  <img :src="$generateUrl(item.imgurl)" alt=""/>
                </i>
                <i class="icon" :class="item.icon" v-else></i>
                <span class="description">{{ item.name || item.resourceName }}</span>
              </div>
            </template>
          </div>
          <NoDataBlock text="没有资源" :size="50" v-else/>
        </el-scrollbar>
      </div>
      <div class="bottom" v-show="!isCollapsed">
        <el-button :icon="Grid" type="primary" @click="toLibraryPage">要素库管理</el-button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.side-menu {
  display: flex;
  box-sizing: border-box;
  height: 100%;

  .fixed {
    position: relative;
    padding: 20px 0;
    border-right: 1px solid #eee;
    box-sizing: border-box;
    width: 40px;
    background: white;

    .btn {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 50px;
      text-align: center;
      cursor: pointer;
      user-select: none;
      color: #333;

      .icon {
        font-size: 20px;
      }

      .text {
        font-size: 12px;
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
      left: 5px;
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
    // 卡顿
    /*width: 200px;
    background: white;
    overflow: hidden;
    transition: width 0.3s ease;*/
    width: 200px;
    background: white;
    overflow: hidden;
    transition: transform 0.3s ease;
    will-change: transform;
    transform: translateZ(0);
    backface-visibility: hidden;
    position: relative;

    .resource-search {
      padding: 5px 10px;
      box-sizing: border-box;
    }

    .container {
      width: 100%;
      height: calc(100% - 85px);

      .title {
        text-align: left;
        padding: 5px 10px;
        box-sizing: border-box;
        font-size: 14px;
        font-weight: bold;
        border-bottom: 1px solid #f0f0f0;
        color: #333;
      }

      .content {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        align-content: start;
        gap: 10px;
        padding: 10px;
        box-sizing: border-box;
        width: 100%;


        .thumb {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          aspect-ratio: 1 / 1;
          background: #f0f0f0;
          border-radius: 6px;
          user-select: none;

          .icon {
            width: 45px;
            height: 45px;
            font-size: 45px;

            img {
              width: 100%;
              height: 100%;
            }
          }

          .description {
            text-align: center;
            padding: 0 3px;
            font-size: 12px;
            color: #333;

          }

          &.active {
            box-sizing: border-box;
            border: 3px solid #409eff;
          }
        }
      }
    }

    .bottom {
      padding: 5px 10px;
      box-sizing: border-box;
      border-top: 1px solid #f0f0f0;

      .el-button {
        width: 100%;
      }
    }
  }
  .collapsed {
    transform: translateX(-100%);
    width: 0;
  }
  .expanded {
    transform: translateX(0);
    width: 200px;
  }
}
</style>