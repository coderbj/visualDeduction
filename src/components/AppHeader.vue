<script setup lang="ts">
import {computed, reactive, ref, onUnmounted} from 'vue'
import {
  FullScreen,
  Plus,
  Minus,
  Avatar,
  QuestionFilled,
  CircleCloseFilled,
  House,
  Setting,
  Brush,
  UserFilled,
  UploadFilled,
  Document,
  Suitcase, Reading, ChatLineSquare,
} from '@element-plus/icons-vue'
import {ElMessage, ElNotification} from 'element-plus'
import {useRouter} from 'vue-router'
import {useUserStore} from '@/store/user.ts'
import App from '../utils/App.ts'
import '@leafer-in/editor'
import {storeToRefs} from 'pinia'
import {addDrillInfo} from '@/service/Drill.ts'
import {useGlobalStore} from '@/store/global.ts'
import {taskInfo, updateTaskJiaodi} from '@/service/Task.ts'

const router = useRouter()
const props = defineProps<{
  weatherData?: {
    weather: string
    windScale: string
    windDirection: string
  }
}>()

const {userInfo} = storeToRefs(useUserStore())
const {taskId, isPicture, zoomValue, isLock} = storeToRefs(useGlobalStore())
const dialogUpdateVisible = ref(false)
const form = reactive({
  describe: '',
  content: '',
  dangers: '',
  notice: ''
})

// 缩放画布
const canvasZoom = computed(() => Math.round(zoomValue.value * 100) + '%')
const canvasZoomOptions = [200, 150, 100, 80, 50]
/*const handleZoomScale = (command: '+' | '-') => {
  //if(!App.drawingBoardInstance.contentFrame) return
  let percentage = Math.round(zoomValue.value * 100)
  const step = 5
  const max = 500
  const min = 10
  if (command === '+' && percentage <= max) {
    App.drawingBoardInstance.leaferInstanceReadonly.tree.zoom('in', 0, true)
    percentage += step
  }
  if (command === '-' && percentage >= min) {
    App.drawingBoardInstance.leaferInstanceReadonly.tree.zoom('out', 0, true)
    percentage -= step
  }
  zoomValue.value = App.drawingBoardInstance.leaferInstanceReadonly.tree.scale as number
}*/
const handleZoomScale = (command: '+' | '-') => {
  const leafer = App.drawingBoardInstance.leaferInstanceReadonly
  if (!leafer?.tree) return
  // 直接操作缩放值，避免快照问题
  const currentScale = leafer.tree.scale as number
  const currentPercentage = Math.round(currentScale * 100)

  const step = 5
  const max = 500
  const min = 10

  let newPercentage = currentPercentage

  if (command === '+' && currentPercentage <= max - step) {
    newPercentage = currentPercentage + step
  } else if (command === '-' && currentPercentage >= min + step) {
    newPercentage = currentPercentage - step
  } else {
    return // 超出范围时提前退出
  }

  // 应用实际缩放
  const newScale = newPercentage / 100
  leafer.tree.zoom(newScale, 0, true)

  // 同步状态
  zoomValue.value = newScale
}

// 应用画布缩放比例
const applyCanvasPresetScale = (value: number) => {
  // 判断如果leaferInstanceReadonly为空，说明画布未初始化完成，不执行缩放操作
  if (!App.drawingBoardInstance.contentFrame) return
  App.drawingBoardInstance.zoomCanvas(value / 100, 0)
  zoomValue.value = App.drawingBoardInstance.leaferInstanceReadonly.tree.scale as number
}
// 原始尺寸
const applyCanvasAdaptive = () => {
  App.drawingBoardInstance.zoomCanvas(1, 0)
  zoomValue.value = 1
}


// 引入本地图片
const avatarImage = () => {
  return new URL('@/assets/images/avatar.svg', import.meta.url).href
}
// 跳转到首页
const toEntryPage = () => {
  router.push({name: 'entry'})
}
// 跳转到环境设置
const toEnvSetupPage = () => {
  router.push({name: 'env-setup'})
}
// 跳转到画板
const toDrawingPage = () => {
  router.push({name: 'drawing'})
}
// 跳转到要素库
const toLibraryPage = () => {
  router.push({name: 'library'})
}
// 跳转到用户管理
const toUserPage = () => {
  router.push({name: 'user'})
}
// 跳转到操作说明
const toHelpPage = () => {
  router.push({name: 'help'})
}
// 跳转到登录页
const toLoginPage = () => {
  // 清除用户信息
  useUserStore().clearUserInfo()
  // 清除taskId
  useGlobalStore().clearTaskId()
  router.push({name: 'login'})
}
// 跳转到推演记录页
const toTaskRecordsPage = () => {
  router.push({name: 'task-records'})
}
// 修改查看交底信息
const toShareInfoPage = async () => {
  dialogUpdateVisible.value = true
  const res = await taskInfo({bianhao: taskId.value})
  if (res.code === 1) {
    const data = res.data[0]
    for (const key in form) {
      form[key] = data[key]
    }
  }
}
const handleUpdateCancel = () => {
  dialogUpdateVisible.value = false
}
const handleUpdateConfirm = async () => {
  const res = await updateTaskJiaodi({
    bianhao: taskId.value,
    describe: form.describe,
    content: form.content,
    dangers: form.dangers,
    notice: form.notice
  })
  if (res.code === 1) {
    ElMessage.success(res.msg)
  } else {
    ElMessage.error(res.msg)
  }
  dialogUpdateVisible.value = false
}

// 保存
const handleUpload = async (flag: boolean = true) => {
  const data = App.drawingBoardInstance.saveBoard()
  const res = await addDrillInfo({
    task_bianhao: taskId.value,
    data: JSON.stringify(data)
  })
  if (res.code === 1) {
    flag && ElNotification({
      title: '成功',
      message: res.msg,
      type: 'success',
    })
  } else {
    flag && ElNotification({
      title: '出错了～',
      message: res.msg,
      type: 'error',
    })
  }
}


// 交底
const handleShare = () => {
  if (!isPicture.value) {
    ElMessage.warning('请先完成推演！')
    return
  }
  handleUpload(false)
  router.push({name: 'share', query: {bianhao: taskId.value}})
}

// 组件销毁时重置缩放比例
onUnmounted(() => {
  zoomValue.value = 1
})
</script>

<template>
  <header class="app-header">
    <div class="system-logo">
      <div class="logo"></div>
      <div class="system-name">作业可视化推演系统</div>
    </div>
    <div class="header-tool">
      <div class="tool-item" @click="toEntryPage">
        <el-icon class="icon">
          <House/>
        </el-icon>
        <span class="text">首页</span>
      </div>
      <div class="tool-item" @click="toEnvSetupPage">
        <el-icon class="icon">
          <Setting/>
        </el-icon>
        <span class="text">环境设置</span>
      </div>
      <div class="tool-item" @click="toDrawingPage" v-if="($route.name !== 'task-records' && $route.name !== 'drawing' && $route.name !== 'share-list') && taskId">
        <el-icon class="icon">
          <Brush/>
        </el-icon>
        <span class="text">推演</span>
      </div>
      <div class="tool-item" @click="applyCanvasAdaptive" v-if="$route.name === 'drawing'">
        <el-icon class="icon">
          <FullScreen/>
        </el-icon>
        <span class="text">原始尺寸</span>
      </div>
      <div class="tool-item" v-if="$route.name === 'drawing'">
        <div class="zoom">
          <el-icon class="zoom-control" @click="handleZoomScale('-')">
            <Minus/>
          </el-icon>
          <el-popover
              placement="bottom"
              :width="100"
              trigger="click"
              :auto-close="2000"
          >
            <template #reference>
              <span class="text" ref="scaleRef">{{ canvasZoom }}</span>
            </template>
            <div class="viewport-size-preset">
              <div class="preset-item" v-for="item in canvasZoomOptions" :key="item"
                   @click="applyCanvasPresetScale(item)">{{ item }}%
              </div>
            </div>
          </el-popover>
          <el-icon class="zoom-control" @click="handleZoomScale('+')">
            <Plus/>
          </el-icon>
        </div>
      </div>
    </div>
    <div class="weather" v-if="$route.name === 'drawing'">
      <div class="item" v-if="weatherData.weather">
        <div class="icon icon-sun"></div>
        <div class="text">{{ props.weatherData.weather }}</div>
      </div>
      <div class="item" v-if="weatherData.windDirection">
        <div class="icon icon-navigation"></div>
        <div class="text">{{ props.weatherData.windDirection }}</div>
      </div>
      <div class="item" v-if="weatherData.windScale">
        <div class="icon icon-wind"></div>
        <div class="text">{{ props.weatherData.windScale }}级</div>
      </div>
    </div>
    <div class="buttons">
      <div class="button-item" @click="toShareInfoPage" v-if="$route.name === 'drawing'">
        <el-icon class="icon">
          <Reading/>
        </el-icon>
        <span class="text">交底信息</span>
      </div>
      <div class="button-item" @click="toTaskRecordsPage" v-if="$route.name === 'drawing'">
        <el-icon class="icon">
          <Document/>
        </el-icon>
        <span class="text">推演记录</span>
      </div>
      <div class="button-item" @click="toLibraryPage" v-if="$route.name === 'drawing' || $route.name === 'task-records'">
        <el-icon class="icon">
          <Suitcase/>
        </el-icon>
        <span class="text">要素库</span>
      </div>
      <div class="btn">
        <el-button
            size="small"
            type="primary"
            :icon="ChatLineSquare"
            @click="handleShare"
            v-if="$route.name === 'drawing' && !isLock"
            :disabled="!isPicture"
        >交底
        </el-button>

      </div>
      <div class="btn">
        <el-button
            size="small"
            type="success"
            :icon="UploadFilled"
            @click="handleUpload(true)"
            v-if="$route.name === 'drawing' && !isLock"
            :disabled="!isPicture"
        >保存
        </el-button>
      </div>
    </div>
    <div class="user">
      <el-dropdown placement="bottom-end" trigger="click">
        <el-avatar :size="24" :src="avatarImage()"/>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>
              <div class="_unscoped-item">
                <el-icon>
                  <Avatar/>
                </el-icon>
                <span>你好，{{ userInfo.username }}</span>
              </div>
            </el-dropdown-item>
            <el-dropdown-item>
              <div class="_unscoped-item" @click="toHelpPage">
                <el-icon>
                  <QuestionFilled/>
                </el-icon>
                <span>操作说明</span>
              </div>
            </el-dropdown-item>
            <el-dropdown-item>
              <div class="_unscoped-item" @click="toUserPage">
                <el-icon>
                  <UserFilled/>
                </el-icon>
                <span>用户管理</span>
              </div>
            </el-dropdown-item>
            <el-dropdown-item>
              <div class="_unscoped-item" @click="toLoginPage">
                <el-icon>
                  <CircleCloseFilled/>
                </el-icon>
                <span>退出登录</span>
              </div>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

    </div>
  </header>

  <!--交底信息弹窗-->
  <el-dialog
      v-model="dialogUpdateVisible"
      title="交底信息"
      :fullscreen="true"
  >
    <el-form
        :model="form"
        label-width="auto"
        size="large"
        ref="formRef"
        :disabled="isLock"
    >
      <el-form-item label="作业描述">
        <el-input v-model="form.describe" :autosize="true" type="textarea" placeholder="请输入作业描述"/>
      </el-form-item>
      <el-form-item label="作业内容">
        <el-input v-model="form.content" :autosize="true" type="textarea" placeholder="请输入作业内容"/>
      </el-form-item>
      <el-form-item label="风险点">
        <el-input v-model="form.dangers" :autosize="true" type="textarea" placeholder="请输入风险点"/>
      </el-form-item>
      <el-form-item label="注意事项">
        <el-input v-model="form.notice" :autosize="true" type="textarea" placeholder="请输入注意事项"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleUpdateCancel">取消</el-button>
        <el-button type="primary" @click="handleUpdateConfirm">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
.app-header {
  display: flex;
  align-items: center;
  width: 100%;
  height: 40px;
  border-bottom: 1px solid #eee;
  box-sizing: border-box;
  background: white;
  flex-shrink: 0;

  .system-logo {
    display: flex;
    align-items: center;
    padding: 0 20px;

    .logo {
      width: 20px;
      height: 20px;
      background: url('/images/logo.svg') no-repeat;
      background-size: 100% 100%;
    }

    .system-name {
      margin-left: 10px;
      font-weight: bold;
      font-size: 18px;
    }
  }

  .header-tool {
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;

    .tool-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: 0 5px;
      padding: 5px;
      box-sizing: border-box;
      user-select: none;
      cursor: pointer;

      &:hover {
        background: #f5f5f5;
      }

      .text {
        font-size: 12px;
      }

      .zoom {
        display: flex;
        align-items: center;
        height: 100%;

        .zoom-control {
          padding: 5px;

          &:hover {
            background: #f5f5f5;
          }
        }

        .text {
          text-align: center;
          min-width: 40px;
          padding: 0 5px;
          font-size: 14px;
          user-select: none;
        }
      }


      .preset-item {
        line-height: 1.8;
      }
    }

  }

  .weather {
    display: flex;

    .item {
      display: flex;
      align-items: center;
      padding: 0 5px;

      .icon {
        padding: 3px;
      }

      .text {
        font-size: 12px;
      }
    }
  }

  .buttons {
    display: flex;
    align-items: center;
    margin-left: 10px;

    .button-item {
      padding: 5px;
      box-sizing: border-box;
      margin: 0 5px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      user-select: none;
      &:hover {
        background: #f5f5f5;
      }

      .text {
        font-size: 12px;
      }
    }

    .btn {
      margin-left: 10px;
    }
  }

  .user {
    display: flex;
    align-items: center;
    padding: 0 20px;

    .el-dropdown-menu {
      .el-dropdown-menu__item {
        .item {
          display: flex;
          align-items: center;
        }
      }
    }
  }
}

.dialog-body {
  background: red;
}
</style>


<style>
._unscoped-item {
  display: flex;
  align-items: center;
}
</style>