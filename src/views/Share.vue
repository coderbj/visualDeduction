<script setup lang="ts">
import {onMounted, onUnmounted, ref} from 'vue'
import {useRoute} from 'vue-router'
import SmoothSignature from 'smooth-signature'
import PageHeader from '@/components/PageHeader.vue'
import {ArrowLeftBold, Delete} from '@element-plus/icons-vue'
import {deleteSign, taskInfo, updateSign} from '@/service/Share.ts'
import {ElMessage} from 'element-plus'
import {useDebounceFn} from '@vueuse/core'
import {$generateUrl} from '@/utils/RegisterGlobalFunctions.ts'

const route = useRoute()

const imageOne = ref('')
const imageTwo = ref('')
const canvasOneRef = ref(null)
const canvasTwoRef = ref(null)
const personRef = ref(null)
let ss1 = null
let ss2 = null

// 创建 Canvas 尺寸状态管理
const canvasState = ref({
  width: 0,
  height: 0
})

// 防抖处理（300ms间隔）
const debouncedResize = useDebounceFn(updateCanvasSize, 300)

// 核心尺寸更新方法
function updateCanvasSize() {
  // 获取父容器尺寸
  const containerRect = personRef.value?.getBoundingClientRect()
  if (!containerRect) return

  // 计算签名区域尺寸（保留 20px 边距）
  canvasState.value = {
    width: containerRect.width - 40, // 两边各 20px 内边距
    height: 400 // 固定高度或按比例计算
  }
  // 重新初始化 Canvas
  initCanvases()
}

// 统一初始化方法
function initCanvases() {
  // 销毁旧实例
  ss1?.clear()
  ss2?.clear()
  ss1 = null
  ss2 = null

  // 创建新实例
  ss1 = new SmoothSignature(canvasOneRef.value, {
    width: canvasState.value.width,
    height: canvasState.value.height,
    bgColor: '#fff'
  })

  ss2 = new SmoothSignature(canvasTwoRef.value, {
    width: canvasState.value.width,
    height: canvasState.value.height,
    bgColor: '#fff'
  })
}

// 生命周期
onMounted(() => {
  updateCanvasSize()
  window.addEventListener('resize', debouncedResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', debouncedResize)
})

// 保存多个交底人签名
const personSigns = ref([])
// 保存多个接受交底的人员签名
const acceptSigns = ref([])
// 获取当前推演的信息
const taskDetail: any = ref({})
const getTaskInfo = async (bianhao) => {
  const res = await taskInfo({bianhao})
  if (res.code === 1) {
    taskDetail.value = res.data[0]
    if (res.data[0].sign_jiaodi) {
      personSigns.value = res.data[0].sign_jiaodi.split(',')
    } else {
      personSigns.value = []
    }
    if(res.data[0].sign_beijiaodi) {
      acceptSigns.value = res.data[0].sign_beijiaodi.split(',')
    } else {
      acceptSigns.value = []
    }

  } else {
    ElMessage.warning(res.msg)
  }
}
getTaskInfo(route.query.bianhao)

// 签名上传
const postUpdateSign = async (base64: string, flag: string) => {
  base64 = base64.split(',')[1]
  const res = await updateSign({
    bianhao: route.query.bianhao,
    img_base: base64,
    jiaodi: flag
  })
  if (res.code === 1) {
    ElMessage.success(res.msg)
    await getTaskInfo(route.query.bianhao)
  } else {
    ElMessage.error(res.msg)
  }
}
const onSubmitPersonOne = () => {
  if (ss1.isEmpty()) {
    ElMessage.warning('请签名后再提交')
    return
  }
  imageOne.value = ss1.getPNG()
  personSigns.value.push(imageOne.value)
  // 上传签名
  postUpdateSign(imageOne.value, '1')
  onClearOne()
}
const onSubmitPersonTwo = () => {
  if (ss2.isEmpty()) {
    ElMessage.warning('请签名后再提交')
    return
  }
  imageTwo.value = ss2.getPNG()
  acceptSigns.value.push(imageTwo.value)
  postUpdateSign(imageTwo.value, '2')
  onClearTwo()
}
const onClearOne = () => {
  ss1.clear()
}
const onClearTwo = () => {
  ss2.clear()
}
const onUndoOne = () => {
  ss1.undo()
}
const onUndoTwo = () => {
  ss2.undo()
}

// 删除签名
const handleSignDelete = async (img_url:string, flag:string) => {
  const res = await deleteSign({
    bianhao: route.query.bianhao,
    img_url,
    jiaodi: flag
  })
  if (res.code === 1) {
    ElMessage.success(res.msg)
    await getTaskInfo(route.query.bianhao)
  } else {
    ElMessage.error(res.msg)
  }
}

</script>

<template>
  <div class="my-app">
    <div class="header">
      <div class="back" @click="() => $router.go(-1)">
        <el-button :icon="ArrowLeftBold" circle/>
      </div>
      <span class="task-name">{{ taskDetail.name }}</span>
    </div>
    <div class="wrapper">
      <div class="content">
        <PageHeader title="推演信息" :back="false"/>
        <div class="detail-descriptions">
          <el-descriptions
              border
          >
            <el-descriptions-item label="作业名称">{{ taskDetail.name }}</el-descriptions-item>
            <el-descriptions-item label="作业类型">{{ taskDetail.zuoye_type }}</el-descriptions-item>
            <el-descriptions-item label="作业等级">{{ taskDetail.zuoye_level ? taskDetail.zuoye_level : '无' }}
            </el-descriptions-item>
            <el-descriptions-item label="作业时间">{{ taskDetail.zuoye_date }}</el-descriptions-item>
            <el-descriptions-item label="天气">{{ taskDetail.weather ? taskDetail.weather : '无' }}
            </el-descriptions-item>
            <el-descriptions-item label="推演人">{{ taskDetail.username }}</el-descriptions-item>
          </el-descriptions>
        </div>
      </div>
      <div class="content">
        <PageHeader title="交底信息" :back="false"/>
        <div class="info-descriptions">
          <el-descriptions border :column="1" direction="vertical">
            <el-descriptions-item label="作业描述">{{ taskDetail.describe }}</el-descriptions-item>
            <el-descriptions-item label="作业内容">{{ taskDetail.content }}</el-descriptions-item>
            <el-descriptions-item label="风险点">{{ taskDetail.dangers }}</el-descriptions-item>
            <el-descriptions-item label="注意事项">{{ taskDetail.notice }}</el-descriptions-item>
          </el-descriptions>
        </div>
      </div>
      <div class="content">
        <PageHeader title="交底签字" :back="false"/>
        <div class="signature-descriptions">
          <div class="person" ref="personRef">
            <div class="subhead">交底人</div>
            <canvas ref="canvasOneRef" class="canvas"></canvas>
            <div class="footer">
              <el-button @click="onClearOne">清空</el-button>
              <el-button @click="onUndoOne">撤销</el-button>
              <el-button type="primary" @click="onSubmitPersonOne">确认</el-button>
            </div>
            <div class="image-wrapper" v-for="item in personSigns" >
              <el-button @click="handleSignDelete(item, '1')" class="btn-delete" type="danger" :icon="Delete" circle />
              <img :src="$generateUrl(item)" alt="" >
            </div>
          </div>
          <div class="person">
            <div class="subhead">接受交底相关人员</div>
            <canvas ref="canvasTwoRef" class="canvas"></canvas>
            <div class="footer">
              <el-button @click="onClearTwo">清空</el-button>
              <el-button @click="onUndoTwo">撤销</el-button>
              <el-button type="primary" @click="onSubmitPersonTwo">确认</el-button>
            </div>
            <div class="image-wrapper" v-for="item in acceptSigns" >
              <el-button @click="handleSignDelete(item, '2')" class="btn-delete" type="danger" :icon="Delete" circle />
              <img :src="$generateUrl(item)" alt="" >
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped lang="scss">
.my-app {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;

  .header {
    position: sticky;
    text-align: center;
    line-height: 60px;
    width: 100%;
    height: 60px;
    background: rgba(255, 255, 255, .2);
    box-shadow: 0 0 5px 0 rgba(0, 0, 0, .2);

    .task-name {
      font-size: 24px;
      font-weight: bold;
      color: $black;
    }

    .back {
      position: absolute;
      left: 20px;
      top: 50%;
      transform: translateY(-50%);
    }
  }

  .wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow-y: auto;

    .content {
      width: 100%;

      .detail-descriptions {
        box-sizing: border-box;
        padding: 0 20px;
        margin-bottom: 20px;


        .list {
          width: 100%;

          .item {
            line-height: 36px;
          }
        }
      }

      .info-descriptions {
        padding: 0 20px;
        box-sizing: border-box;
        margin-bottom: 20px;
      }

      .signature-descriptions {
        display: flex;
        justify-content: space-around;
        margin-bottom: 30px;
        width: 100%;


        .person {
          display: flex;
          flex-direction: column;
          width: 45%;
          padding: 20px;
          background: #f7f8f8;
          box-sizing: border-box;

          .subhead {
            height: 40px;
            font-size: 18px;
            font-weight: bold;
          }

          .canvas {
            width: 100%;
            background: #fff;
          }

          .footer {
            display: flex;
            justify-content: end;
            margin: 20px 0;
          }

          .image-wrapper {
            position: relative;
            display: flex;
            flex-direction: column;
            width: 100%;
            margin-top: 20px;

            .btn-delete {
              position: absolute;
              right: 10px;
              top: 10px;
            }
          }
        }
      }
    }
  }
}
</style>