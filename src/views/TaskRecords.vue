<script setup lang="ts">
import {reactive, ref} from 'vue'
import {storeToRefs} from 'pinia'
import {useUserStore} from '@/store/user.ts'
import {ElMessage, ElMessageBox} from 'element-plus'
import AppHeader from '@/components/AppHeader.vue'
import {
  Delete,
  View,
  Edit,
  Ship,
  Sunny,
  Pouring,
  Drizzling,
  ChatLineSquare,
  PartlyCloudy,
  Sunrise,
} from '@element-plus/icons-vue'
import PageHeader from '@/components/PageHeader.vue'
import PageSubheader from '@/components/PageSubheader.vue'
import NoDataBlock from '@/components/NoData.vue'
import {taskList, deleteTask, updateTask,} from '@/service/Task'
import {useGlobalStore} from '@/store/global.ts'
import {IconFreeze} from '@/components/MyIconLibrary.ts'
import router from '@/router'

const {userInfo} = storeToRefs(useUserStore())
const {setTaskId, setTaskType} = useGlobalStore()

const dialogUpdateVisible = ref(false)
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
  upgrade:false,
  describe: '',
  content: '',
  dangers: '',
  notice: ''
})

const searchValue = ref('')
const filterValue = ref('')
const dateValue = ref([])
const PageIndex = ref(1)
const PageSize = ref(10)
// 获取任务记录数据
const tableData = ref([])
const total = ref(0)
const getTaskList = async () => {
  const res = await taskList({
    PageIndex: PageIndex.value,
    PageSize: PageSize.value,
    name: searchValue.value,
    zuoye_type: filterValue.value,
    starttime: dateValue.value?.[0]||'',
    endtime: dateValue.value?.[1]||'',
  })
  if (res.code === 1) {
    tableData.value = res.data
    total.value = res.count
  } else {
    ElMessage.error(res.msg)
  }
}
getTaskList()

// 交底
const handleShare = (row) => {
  // 如果没有背景图，说明是新建的任务，没有进行推演
  if(!row.imgurl_bg) {
    ElMessage.warning('请先完成推演')
    return
  }
  router.push({name:'share', query:{bianhao:row.bianhao}})
}

// 删除任务
const handleDeleteTask = async (bianhao) => {
  ElMessageBox.confirm(
      '确定要删除该推演记录吗？',
      'Warning',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
  )
  .then(async () => {
    const res = await deleteTask({bianhao})
    if (res.code === 1) {
      ElMessage.success(res.msg)
      getTaskList()
    } else {
      ElMessage.error(res.msg)
    }
  })
  .catch(() => {
  })
}
// 编辑任务
const isEnd = ref(false) // 是否已经交底
const currentBianhao = ref('')
const handleEditTask = (row) => {
  dialogUpdateVisible.value = true
  isEnd.value = !!row.sign_beijiaodi.length
  currentBianhao.value = row.bianhao
  for (const itemKey in form) {
    form[itemKey] = row[itemKey]
  }
  form.weather = row.weather.split(',')
  form.upgrade = row.upgrade === 'true'
}
const handleUpdateCancel = () => {
  dialogUpdateVisible.value = false
}
enum ZuoYeType {
  DiaoZhuang = '吊装作业',
  DongHuo = '动火作业',
  DongTu = '动土作业',
  GaoChu = '高处作业',
  LinDian = '临时用电作业',
  MangBan = '盲板抽堵作业',
  ShouXian = '受限空间作业'
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
    //updateTaskData()
    return
  }

  if (config.condition(form)) {
    const shouldProceed = await showWeatherWarning(config.message)
    shouldProceed && updateTaskData();
  } else {
    updateTaskData()
  }
}

const handleUpdateConfirm = () => {
  formRef.value?.validate(async (valid) => {
    if(!valid) {
      ElMessage.warning('请检查表单填写是否正确')
      return
    }
    validateAndCreateTask(form)
  })
}

const updateTaskData = async () => {
  const res = await updateTask({
    ...form,
    weather: form.weather.join(','), // 天气字段需要转换为字符串
    upgrade: form.upgrade.toString(),
    bianhao: currentBianhao.value
  })
  if (res.code === 1) {
    ElMessage.success(res.msg)
    dialogUpdateVisible.value = false
    await getTaskList()
  } else {
    ElMessage.error(res.msg)
  }
}

// 查看任务
const handleViewTask = (row) => {
  setTaskId(row.bianhao)
  setTaskType(row.zuoye_type)
  router.push({name: 'drawing'})
}
// 分页改变
const handleCurrentChange = (val) => {
  PageIndex.value = val
  getTaskList()
}
// 搜索 - 防抖
let timer = null
const handleSearch = () => {
  clearTimeout(timer)
  timer = setTimeout(() => {
    getTaskList()
  }, 500)
}
// 类型筛选
const handleFilterChange = () => {
  getTaskList()
}
// 日期筛选
const handleDateChange = () => {
  getTaskList()
}
const handleDateClear = () => {
  getTaskList()
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
</script>

<template>
  <div class="task-records">
    <AppHeader/>
    <div class="container">
      <PageHeader title="推演记录">
        <template #center>
          <el-input @input="handleSearch" class="search" placeholder="请输入作业名称" v-model="searchValue" clearable
                    size="large"></el-input>
        </template>
      </PageHeader>
      <PageSubheader class="page-subheader">
        <template #default>
          <div class="filters">
            <div class="title">筛选：</div>
            <el-radio-group v-model="filterValue" @change="handleFilterChange">
              <el-radio-button label="全部" value=""/>
              <el-radio-button label="吊装作业" value="吊装作业"/>
              <el-radio-button label="动火作业" value="动火作业"/>
              <el-radio-button label="动土作业" value="动土作业"/>
              <el-radio-button label="高处作业" value="高处作业"/>
              <el-radio-button label="临时用电作业" value="临时用电作业"/>
              <el-radio-button label="盲板抽堵作业" value="盲板抽堵作业"/>
              <el-radio-button label="受限空间作业" value="受限空间作业"/>
            </el-radio-group>
          </div>
          <div class="search-date">
            <el-date-picker
                v-model="dateValue"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                unlink-panels
                size="large"
                value-format="YYYY-MM-DD"
                clearable
                :editable="false"
                @change="handleDateChange"
                @clear="handleDateClear"
            />
          </div>
        </template>
      </PageSubheader>
      <el-scrollbar>
        <div class="page-content">
          <el-table v-if="total" :data="tableData" stripe style="width: 100%">
            <el-table-column prop="name" label="作业名称" fixed width="150"/>
            <el-table-column prop="zuoye_type" label="作业类型" width="150"/>
            <el-table-column prop="zuoye_level" label="作业等级"/>
            <el-table-column prop="zuoye_date" label="作业时间" width="120"/>
            <el-table-column prop="weather" label="天气">
              <template #default="{row}">
                <!--  row.weather.include(',') 包含逗号说明有多种天气-->
                <span>{{ row.weather }}<span v-if="row.wind_direction">-</span></span>
                <span v-if="row.wind_direction">{{ row.wind_direction }}-</span>
                <span v-if="row.wind_scale">{{ row.wind_scale }}级</span>
              </template>
            </el-table-column>
            <el-table-column prop="username" label="用户名"/>
            <el-table-column label="交底状态">
              <template #default="{row}">
                <el-tag v-if="row.sign_beijiaodi" type="success">已交底</el-tag>
                <el-tag v-else type="danger">未交底</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" fixed="right" min-width="180">
              <template #default="{row}">
                <el-tooltip content="交底" placement="bottom">
                  <el-button type="primary" :icon="ChatLineSquare" circle @click="handleShare(row)"/>
                </el-tooltip>
                <el-tooltip content="编辑" placement="bottom">
                  <el-button type="primary" :icon="Edit" circle @click="handleEditTask(row)"/>
                </el-tooltip>
                <el-tooltip content="查看" placement="bottom">
                  <el-button type="primary" :icon="View" circle @click="handleViewTask(row)"/>
                </el-tooltip>
                <el-tooltip content="删除" placement="bottom">
                  <el-button type="danger" :icon="Delete" circle @click="handleDeleteTask(row.bianhao)"/>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
          <NoDataBlock v-else/>
        </div>
      </el-scrollbar>
      <div class="page-footer">
        <el-pagination
            size="small"
            background
            layout="prev, pager, next"
            :total="total"
            :current-page="PageIndex"
            :page-size="PageSize"
            @current-change="handleCurrentChange"
            class="pagination"
            hide-on-single-page
        />
      </div>
    </div>

    <el-dialog
        v-model="dialogUpdateVisible"
        title="修改推演记录"
        :fullscreen="true"
    >
      <el-form
          :model="form"
          label-width="auto"
          size="large"
          ref="formRef"
          :rules="validateRules"
          :disabled="isEnd"
      >
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
        <el-form-item label="作业类型" prop="zuoye_type">
          <el-select disabled v-model="form.zuoye_type" placeholder="请选择作业类型">
            <el-option label="吊装作业" value="吊装作业"/>
            <el-option label="动火作业" value="动火作业"/>
            <el-option label="动土作业" value="动土作业"/>
            <el-option label="高处作业" value="高处作业"/>
            <el-option label="临时用电作业" value="临时用电作业"/>
            <el-option label="盲板抽堵作业" value="盲板抽堵作业"/>
            <el-option label="受限空间作业" value="受限空间作业"/>
          </el-select>
        </el-form-item>
        <el-form-item label="作业等级">
          <el-select disabled v-model="form.zuoye_level" placeholder="请选择作业等级">
            <el-option label="一级" value="一级"/>
            <el-option label="二级" value="二级"/>
            <el-option label="三级" value="三级"/>
          </el-select>
        </el-form-item>
        <el-form-item label="作业日期">
          <el-date-picker
              v-model="form.zuoye_date"
              type="date"
              placeholder="选择日期"
              value-format="YYYY-MM-DD"
              :editable="false"
          />
        </el-form-item>
        <el-form-item label="天气">
          <el-checkbox-group
              disabled
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
        <el-form-item label="作业描述">
          <el-input :autosize="true" v-model="form.describe" type="textarea" placeholder="请输入作业描述"/>
        </el-form-item>
        <el-form-item label="作业内容">
          <el-input :autosize="true" v-model="form.content" type="textarea" placeholder="请输入作业内容"/>
        </el-form-item>
        <el-form-item label="风险点">
          <el-input :autosize="true" v-model="form.dangers" type="textarea" placeholder="请输入风险点"/>
        </el-form-item>
        <el-form-item label="注意事项">
          <el-input :autosize="true" v-model="form.notice" type="textarea" placeholder="请输入注意事项"/>
        </el-form-item>

      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleUpdateCancel">取消</el-button>
          <el-button type="primary" @click="handleUpdateConfirm">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.task-records {
  width: 100vw;
  height: 100%;

  .container {
    padding: 20px;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    width: 100%;
    height: calc(100% - 40px);

    .filters {
      display: flex;
      align-items: center;

      .title {
        white-space: nowrap;
        margin-right: 10px;
      }

      :deep(.el-radio-group) {
        .el-radio-button {
          margin: 5px 5px 5px 0;

          .el-radio-button__inner {
            box-sizing: content-box;
            border: 1px solid var(--el-border-color);
            border-radius: var(--el-border-radius-base);
          }

          &.is-active {
            .el-radio-button__inner {
              border-color: var(--el-radio-button-checked-border-color);
            }
          }
        }
      }
    }

    .page-subheader {
      display: flex;
      justify-content: space-between;

      .search-date {
        :deep(.el-date-editor .el-range__close-icon--hidden) {
          opacity: 1;
          visibility: visible;
        }
      }
    }

    .page-content {
      padding: 20px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      flex: 1;
      //overflow: auto;
    }

    .page-footer {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 60px;
    }
  }
}
</style>