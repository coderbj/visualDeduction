<script setup lang="ts">
import {reactive, ref} from 'vue'
import {storeToRefs} from 'pinia'
import {Drizzling, PartlyCloudy, Pouring, Ship, Sunny, Sunrise} from '@element-plus/icons-vue'
import {useRouter} from 'vue-router'
import {useUserStore} from '@/store/user'
import {insertTask} from '@/service/Task'
import {ElMessageBox, ElMessage} from 'element-plus'
import {useGlobalStore} from '@/store/global'
import PageHeader from '@/components/PageHeader.vue'
import EnvDiaoZhuang from '@/components/EnvForm/EnvDiaoZhuang.vue'
import EnvDongHuo from '@/components/EnvForm/EnvDongHuo.vue'
import EnvGaoChu from '@/components/EnvForm/EnvGaoChu.vue'
import {getShareInfoList} from '@/service/Share'
import {IconFreeze} from '@/components/MyIconLibrary.ts'


const router = useRouter()
const {setTaskId, setTaskType} = useGlobalStore()
const {userInfo} = storeToRefs(useUserStore())

// 定义一个枚举类型
enum ZuoYeType {
  DiaoZhuang = '吊装作业',
  DongHuo = '动火作业',
  //DongTu = '动土作业',
  GaoChu = '高处作业',
  //LinDian = '临时用电作业',
  //MangBan = '盲板抽堵作业',
  //ShouXian = '受限空间作业'
}

// 验证表单规则
const validateRules = {
  name: [
    {required: true, message: '请输入作业名称', trigger: 'blur'}
  ],
  zuoye_type: [
    {required: true, message: '请选择作业类型', trigger: 'change'}
  ],
  height_img: [
    {required: true, message: '请输入拍摄高度', trigger: 'blur'}
  ],
}
const formRef = ref(null)
const form = reactive({
  name: '',
  username: userInfo.value.username,
  user_bianhao: userInfo.value.BianHao,
  zuoye_type: '',
  zuoye_level: '',
  zuoye_date: '',
  weather: [],
  wind_direction: '',
  wind_scale: '',
  height_img: null,
  around: '',
  envData: {
    zuoye_level: '',
    upgrade: false,
  },
  jiaodi_bianhao: '',
})

// 选中的交底信息
const shareInfo = ref(null)
const shareInfoBianHao = ref('')

const shareInfoList = ref([])
// 获取预设交底信息
const getShareInfoListData = async () => {
  const res = await getShareInfoList({
    PageIndex: 1,
    PageSize: 10000,
    zuoye_type: form.zuoye_type,
    starttime: form.zuoye_date
  })
  if (res.code === 1) {
    shareInfoList.value = res.data
  }
}


// 作业日期变化
const handleDateChange = () => {
  shareInfoBianHao.value = ''
  shareInfoList.value = []
  shareInfo.value = null
  getShareInfoListData()
}
// 作业类型变化
const handleTypeChange = (val) => {
  shareInfoBianHao.value = ''
  shareInfo.value = null
  form.zuoye_type = val
  form.weather = []
  shareInfoList.value = []
  getShareInfoListData()
}
// 交底信息变化
const handleInfoChange = (bianhao) => {
  shareInfo.value = shareInfoList.value.find(item => item.bianhao === bianhao)
  form.jiaodi_bianhao = bianhao
}

// 创建作业推演 form中加入交底信息的jiaodi_bianhao
const createTask = async () => {
  const res = await insertTask({
    ...form,
    weather: form.weather.join(','),
    zuoye_level: form.envData.zuoye_level,
    upgrade: form.envData.upgrade.toString(),
  })
  if (res.code === 1) {
    setTaskId(res.data)
    setTaskType(form.zuoye_type)
    await router.push({path: '/drawing'})
  } else {
    ElMessage.error(res.msg)
  }
}

// 天气配置数据
const weatherOptions = [
  {label: '晴天', value: '晴天', icon: Sunrise},
  {label: '暴雨', value: '暴雨', icon: Drizzling},
  {label: '大雪', value: '大雪', icon: Pouring},
  {label: '大风', value: '大风', icon: Ship},
  {label: '大雾', value: '大雾', icon: PartlyCloudy},
  {label: '高温', value: '高温', icon: Sunny},
  {label: '低温', value: '低温', icon: IconFreeze},
]
// 天气互斥规则（不能共存的组合）
const conflictRules = {
  /* 规则说明：
     1. 晴天不能与任何降水天气（暴雨/大雪）及大雾共存
     2. 不同降水类型互斥（暴雨/大雪）
     3. 大雾不可与晴天或高温共存
     4. 极端温度互斥（高温/低温不能共存）
     5. 高温与降水天气互斥（暴雨/大雪需要较低温度）
     6. 低温可与降水天气共存（如雨夹雪/冻雨）
  */
  '晴天': ['暴雨', '大雪', '大雾'],
  '暴雨': ['晴天', '大雪', '高温'],
  '大雪': ['晴天', '暴雨', '高温'],
  '大雾': ['晴天', '高温'],
  '高温': ['暴雨', '大雪', '大雾', '低温'],
  '低温': ['高温']
}

// 判断当前天气是否可选
const isWeatherDisabled = (currentWeather) => {
  return form.weather.some(selected =>
      conflictRules[selected]?.includes(currentWeather) ||
      conflictRules[currentWeather]?.includes(selected)
  )
}

// 处理选择变化（自动过滤无效组合）
const handleWeatherChange = (newVal) => {
  // 如果不包含大风，清空风向和风级
  if (!newVal.includes('大风')) {
    form.wind_direction = ''
    form.wind_scale = ''
  }
  const validCombination = []
  // 按选择顺序保留有效组合
  newVal.forEach(weather => {
    if (!validCombination.some(w =>
        conflictRules[w]?.includes(weather) ||
        conflictRules[weather]?.includes(w)
    )) {
      validCombination.push(weather)
    }
  })
  form.weather = validCombination
}

// 拆分的作业组件表单数据变化时合并到主表单
const handleInnerFormData = (data) => {
  form.envData = data
}

// 定义作业类型校验配置
const ZUOYE_VALIDATION_CONFIG = {
  [ZuoYeType.DiaoZhuang]: {
    condition: (form) => Number(form.wind_scale) >= 6 || ['大雪', '暴雨', '大雾'].some(w => form.weather.includes(w)),
    message: '吊装作业'
  },
  [ZuoYeType.GaoChu]: {
    condition: (form) => Number(form.wind_scale) >= 5 || ['高温', '低温', '大雪', '暴雨', '大雾'].some(w => form.weather.includes(w)),
    message: '高处作业'
  },
  [ZuoYeType.DongHuo]: {
    condition: (form) => Number(form.wind_scale) >= 5,
    message: '动火作业'
  }
}

// 封装确认弹窗逻辑
async function showWeatherWarning(message: string) {
  try {
    await ElMessageBox.confirm(
        `当前天气不符合${message}规范要求，仍然继续推演吗？`,
        '警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
    )
    return true
  } catch {
    return false
  }
}

// 统一校验逻辑
async function validateAndCreateTask(form) {
  const config = ZUOYE_VALIDATION_CONFIG[form.zuoye_type]
  if (!config) {
    await createTask()
    return
  }

  if (config.condition(form)) {
    const shouldProceed = await showWeatherWarning(config.message)
    shouldProceed && await createTask()
  } else {
    await createTask()
  }
}

const onSubmit = () => {
  formRef.value?.validate(async (valid) => {
    if (!valid) {
      ElMessage.warning('请检查表单填写是否正确')
      return
    }
    // 先清除taskId
    setTaskId('')
    await validateAndCreateTask(form)
  })
}
</script>

<template>
  <div class="env-setup">
    <PageHeader title="作业环境"/>
    <div class="content">
      <div class="title">请设置作业环境</div>
      <el-form :model="form" label-width="auto" size="large" :rules="validateRules" ref="formRef">
        <el-form-item label="作业名称" prop="name">
          <el-input v-model="form.name"/>
        </el-form-item>
        <el-form-item label="拍摄高度" prop="height_img">
          <el-input
              v-model="form.height_img"
              type="number"
              placeholder="请输入拍摄高度"
          >
            <template #suffix>米</template>
          </el-input>
        </el-form-item>
        <el-form-item label="作业日期">
          <el-date-picker
              v-model="form.zuoye_date"
              type="date"
              placeholder="选择日期"
              value-format="YYYY-MM-DD"
              @change="handleDateChange"
              :editable="false"
          />
        </el-form-item>
        <el-form-item label="作业类型" prop="zuoye_type">
          <el-select v-model="form.zuoye_type" placeholder="请选择作业类型" @change="handleTypeChange">
            <el-option label="吊装作业" value="吊装作业"/>
            <el-option label="动火作业" value="动火作业"/>
            <el-option label="动土作业" value="动土作业"/>
            <el-option label="高处作业" value="高处作业"/>
            <el-option label="临时用电作业" value="临时用电作业"/>
            <el-option label="盲板抽堵作业" value="盲板抽堵作业"/>
            <el-option label="受限空间作业" value="受限空间作业"/>
          </el-select>
        </el-form-item>
        <EnvDiaoZhuang v-if="form.zuoye_type === ZuoYeType.DiaoZhuang" @formDataChanged="handleInnerFormData"/>
        <EnvDongHuo v-if="form.zuoye_type === ZuoYeType.DongHuo" @formDataChanged="handleInnerFormData"/>
        <EnvGaoChu v-if="form.zuoye_type === ZuoYeType.GaoChu" @formDataChanged="handleInnerFormData"/>
        <el-form-item label="天气" prop="weather"
                      v-if="form.zuoye_type === ZuoYeType.DiaoZhuang || form.zuoye_type === ZuoYeType.GaoChu || form.zuoye_type === ZuoYeType.DongHuo">
          <el-checkbox-group
              v-model="form.weather"
              size="large"
              :max="2"
              @change="handleWeatherChange"
          >
            <el-checkbox-button
                v-for="item in weatherOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :disabled="isWeatherDisabled(item.value)"
            >
              <template #default>
                <div class="icon">
                  <el-icon>
                    <component :is="item.icon"/>
                  </el-icon>
                  <span class="text">{{ item.label }}</span>
                </div>
              </template>
            </el-checkbox-button>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="风向" v-if="form.weather.includes('大风')">
          <el-select v-model="form.wind_direction" placeholder="请选择风向">
            <el-option label="东风" value="东风"/>
            <el-option label="西风" value="西风"/>
            <el-option label="南风" value="南风"/>
            <el-option label="北风" value="北风"/>
            <el-option label="东北风" value="东北风"/>
            <el-option label="东南风" value="东南风"/>
            <el-option label="西北风" value="西北风"/>
            <el-option label="西南风" value="西南风"/>
          </el-select>
        </el-form-item>
        <el-form-item label="风级" v-if="form.weather.includes('大风')">
          <el-select v-model="form.wind_scale" placeholder="请选择风级">
            <el-option label="0级" value="0"/>
            <el-option label="1级" value="1"/>
            <el-option label="2级" value="2"/>
            <el-option label="3级" value="3"/>
            <el-option label="4级" value="4"/>
            <el-option label="5级" value="5"/>
            <el-option label="6级" value="6"/>
            <el-option label="7级" value="7"/>
          </el-select>
        </el-form-item>
        <el-form-item label="其他周边环境">
          <el-input v-model="form.around" type="textarea" placeholder="如：附近存在高压线"/>
        </el-form-item>
        <el-form-item label="交底信息">
          <el-select placeholder="请选择交底信息" @change="handleInfoChange" v-model="shareInfoBianHao">
            <el-option :label="item.name" :value="item.bianhao" v-for="item in shareInfoList" :key="item.bianhao"/>
          </el-select>
        </el-form-item>
        <el-form-item class="share-info-item" label="交底信息内容" v-if="shareInfo">
          <el-descriptions direction="vertical" :column="1">
            <el-descriptions-item label="作业描述">{{ shareInfo.describe }}</el-descriptions-item>
            <el-descriptions-item label="作业内容">{{ shareInfo.content }}</el-descriptions-item>
            <el-descriptions-item label="风险点">{{ shareInfo.dangers }}</el-descriptions-item>
            <el-descriptions-item label="注意事项">{{ shareInfo.notice }}</el-descriptions-item>
          </el-descriptions>
        </el-form-item>
        <el-form-item class="el-form-item-btn">
          <el-button type="primary" @click="onSubmit">开始推演</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style scoped lang="scss">
.env-setup {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;

  .content {
    display: flex;
    flex-direction: column;
    //justify-content: center;
    align-items: center;
    overflow-y: auto;

    .title {
      font-size: $font-size-xxxl;
      margin-bottom: 60px;
    }

    .el-form {
      width: 60%;

      .el-form-item-btn {
        margin-top: 80px;

        :deep(.el-form-item__content) {
          display: flex;
          justify-content: center;
        }
      }

      .icon {
        display: flex;
        align-items: center;

        .text {
          margin-left: 5px;
        }
      }

      :deep(.share-info-item .el-form-item__content) {
        margin-top: 10px;
      }
    }
  }
}
</style>