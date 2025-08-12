<script setup lang="ts">
import { ref, } from 'vue'
import App from '../utils/App.ts'
import {onMounted, onUnmounted} from 'vue'
import {useRoute} from 'vue-router'
import SmoothSignature from "smooth-signature"
//import {taskInfo} from '@/service/Task.ts'
//import {drillInfo} from '@/service/Drill.ts'
//import {useGlobalStore} from '@/store/global.ts'
//import {ElMessage} from 'element-plus'
//import {storeToRefs} from 'pinia'
import PageHeader from '@/components/PageHeader.vue'
import {ArrowLeftBold} from '@element-plus/icons-vue'
//const globalStore = useGlobalStore()
//const {taskId, isPicture} = storeToRefs(useGlobalStore())
import {taskInfo} from '@/service/Share.ts'
import {ElMessage} from 'element-plus'
//import { useResizeObserver } from '@vueuse/core';


const route = useRoute()

const canvasOneRef = ref(null)
const canvasTwoRef = ref(null)
let ss1 = null
let ss2 = null
const personRef:any = ref(null)
onMounted(() => {
  /*App.initShare({
    domId: 'share-board-container',
  })*/
  // 初始化签名板
  ss1 = new SmoothSignature(canvasOneRef.value,{})
  ss2 = new SmoothSignature(canvasTwoRef.value,{})

  // 窗口大小变化时，重新初始化签名板
  window.onresize = () => {
    // 刷新页面
    location.reload()
  }
})
// 如果有taskId，直接显示图片
/*const review = async () => {
  if (taskId.value) {
    // 根据taskId获取任务，拿到图片信息
    const res = await taskInfo({bianhao: taskId.value})
    if (res.code === 1) {
      const data = res.data[0]
      if (data.imgurl_bg) {
        globalStore.setPictureInfo({
          width: data.img_width,
          height: data.img_length,
          url: BASE_URL + '/' + data.imgurl_bg
        })
        App.shareBoardInstance.initPageEditor()
      } else {
        isPicture.value = false
        ElMessage.info('请上传一张图片')
      }

      // 回显已绘制的要素
      const resLast = await drillInfo({task_data_bianhao: data.task_data_bianhao})
      if (resLast.code === 1) {
        const jsonData = JSON.parse(resLast.data.data)
        if(jsonData) {
          App.shareBoardInstance.reviewElements(jsonData)
        }
      }
    }
  }
}*/
// review()

// 获取当前推演的信息
const taskDetail:any = ref({})
const getTaskInfo = async (bianhao) => {
  const res = await taskInfo({bianhao})
  if (res.code === 1) {
    taskDetail.value = res.data[0]
  } else {
    ElMessage.warning(res.msg)
  }
}
getTaskInfo(route.query.bianhao)

const imageOne = ref('')
const imageTwo = ref('')

const onSubmitPersonOne = () => {
  imageOne.value = ss1.getJPG()
}
const onSubmitPersonTwo = () => {
  imageTwo.value = ss2.getJPG()
}
const onClearOne = () => {
  ss1.clear()
}
const onClearTwo = () => {
  ss2.clear()
}



onUnmounted(() => {
  App.destroy()
})
</script>

<template>
  <div class="my-app">
    <div class="header">
      <div class="back" @click="() => $router.go(-1)">
        <el-button :icon="ArrowLeftBold" circle/>
      </div>
      <span class="task-name">{{taskDetail.name}}</span>
    </div>
<!--    <main class="app-main">
      <div class="share-board-wrapper">
        <div id="share-board-container"></div>
      </div>
    </main>-->
<!--    <div class="record">
      <PageHeader title="作业原则" :back="false"/>
      <div class="content">
        <ul class="list">
          <li class="item">1、指挥信号不明或乱指挥不吊;</li>
          <li class="item">2、超负荷不吊;</li>
          <li class="item">3、工件紧固不牢不吊;</li>
          <li class="item">4、吊物上面有人不吊;</li>
          <li class="item">5、安全装置不灵不吊;</li>
          <li class="item">6、工件埋在地下不吊;</li>
          <li class="item">7、光线隐暗看不清不吊;</li>
          <li class="item">8、斜拉工件不吊;</li>
          <li class="item">9、棱角物件没有措施不吊;</li>
          <li class="item">10、吊物过重不吊</li>
        </ul>
      </div>
      <PageHeader title="注意事项" :back="false"/>
      <div class="content">
        <ul class="list">
          <li class="item">1.对从事指挥和操作的人员进行专人指定。 2.对起重吊具进行安全检查确认，确保处于完好状态(如：吊钩保险扣是否有效、钢丝绳是否有断丝断股现象、U型环是否有滑丝脱扣现象)。 3.对安全措施落实情况及吊装环境进行确认。 4.对吊装区域内的安全状况进行检查(包括吊装区域的划定、标识、障碍、警戒区等)。 5.正确佩戴个人防护用品;预测可能出现的事故，采取有效的预防措施，选择安全逃生通道。</li>
        </ul>
      </div>
      <PageHeader title="应急方案" :back="false"/>
      <div class="content">
        <ul class="list">
          <li class="item">吊装作业应急方案</li>
        </ul>
      </div>
    </div>-->
    <div class="detail">
      <PageHeader title="作业推演信息" :back="false"/>
      <div class="content">
        <el-descriptions
            border
        >
          <el-descriptions-item label="作业名称">{{taskDetail.name}}</el-descriptions-item>
          <el-descriptions-item label="作业类型">{{taskDetail.zuoye_type}}</el-descriptions-item>
          <el-descriptions-item label="作业等级">{{taskDetail.zuoye_level}}</el-descriptions-item>
          <el-descriptions-item label="作业时间">{{taskDetail.zuoye_date}}</el-descriptions-item>
          <el-descriptions-item label="天气">{{taskDetail.weather}}</el-descriptions-item>
          <el-descriptions-item label="推演人">{{taskDetail.username}}</el-descriptions-item>
        </el-descriptions>
      </div>
    </div>
    <div class="signature">
      <PageHeader title="交底签字" :back="false"/>
      <div class="content">
        <div class="person" ref="personRef">
          <div class="subhead">交底人</div>
          <canvas ref="canvasOneRef" class="canvas"></canvas>
          <div class="footer">
            <el-button @click="onClearOne">清空</el-button>
            <el-button type="primary" @click="onSubmitPersonOne">确认</el-button>
          </div>
        </div>
        <div class="person">
          <div class="subhead">被交底人</div>
          <canvas ref="canvasTwoRef" class="canvas"></canvas>
          <div class="footer">
            <el-button @click="onClearTwo">清空</el-button>
            <el-button type="primary" @click="onSubmitPersonTwo">确认</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.my-app {
  width: 100%;
  overflow-x: hidden;

  .header {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
    text-align: center;
    line-height: 60px;
    width: 100%;
    height: 60px;
    background: #409eff;

    .task-name {
      font-size: 24px;
      font-weight: bold;
      color: $white;
    }

    .back {
      position: absolute;
      left: 20px;
      top: 50%;
      transform: translateY(-50%);
    }
  }

  /*.app-main {
    margin-top: 60px;
    margin-bottom: 20px;
    width: 100vw;
    height: 70vh;

    .share-board-wrapper {
      position: relative;
      width: 100%;
      height: 100%;
      background: #f1f2f4;

      #share-board-container {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-grow: 1;
        font-size: 36px;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        pointer-events: auto;
      }
    }
  }*/

  /*.record {
    margin-top: 60px;
    width: 100%;
    background:#fff;

    .content {
      box-sizing: border-box;
      padding: 20px;
      margin-bottom: 20px;
      background: #f7f8f8;

      .list {
        width: 100%;
        .item {
          line-height: 36px;
        }
      }
    }
  }*/

  .detail {
    margin-top: 60px;
    width: 100%;
    background:#fff;

    .content {
      box-sizing: border-box;
      padding: 20px;
      margin-bottom: 20px;
      background: #f7f8f8;

      .list {
        width: 100%;
        .item {
          line-height: 36px;
        }
      }
    }
  }

  .signature {
    width: 100%;
    background: #fff;
    margin-bottom: 20px;

    .content {
      width: 100%;
      display: flex;
      justify-content: space-around;

      .person {
        display: flex;
        flex-direction: column;
        width: 45%;
        height: 500px;
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
          height: calc(100% - 100px);
        }

        .footer {
          height: 60px;
          display: flex;
          justify-content: end;
          margin-top: 20px;
        }
      }
    }
  }
}
</style>