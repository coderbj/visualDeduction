<script setup lang="ts">
import {reactive, ref} from 'vue'
import {storeToRefs} from 'pinia'
import {useUserStore} from '@/store/user.ts'
import {ElMessage, ElMessageBox} from 'element-plus'
import AppHeader from '@/components/AppHeader.vue'
import {
  Delete,
  Edit,
  Ship,
  Sunny,
  Pouring,
  Drizzling,
  PartlyCloudy
} from '@element-plus/icons-vue'
import PageHeader from '@/components/PageHeader.vue'
import PageSubheader from '@/components/PageSubheader.vue'
import NoDataBlock from '@/components/NoData.vue'
//import {useGlobalStore} from '@/store/global.ts'
import router from '@/router'
import {getShareInfoList, deleteShareInfo} from '@/service/Share.ts'
import {updateTask} from '@/service/Task.ts'

const {userInfo} = storeToRefs(useUserStore())
//const {setTaskId} = useGlobalStore()

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
  height_img: 0,
  other_env: '',
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
const parentBorder = ref(false)
const tableData = ref([])
const total = ref(0)
const getShareInfoListData = async () => {
  const res = await getShareInfoList({
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
getShareInfoListData()

// 作业信息添加
const toShareInfoPage = (row) => {
  if(row.bianhao) {
    router.push({
      name: 'share-info',
      query: {
        bianhao: row.bianhao
      }
    })
  } else {
    router.push({name: 'share-info'})
  }
}

// 作业信息删除
const handleDeleteTask = async (bianhao) => {
  ElMessageBox.confirm(
      '确定要删除该作业信息吗？',
      'Warning',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
  )
  .then(async () => {
    const res = await deleteShareInfo({bianhao})
    if (res.code === 1) {
      ElMessage.success(res.msg)
      getShareInfoListData()
    } else {
      ElMessage.error(res.msg)
    }
  })
  .catch(() => {})
}
// 编辑任务
const currentBianhao = ref('')
const handleUpdateCancel = () => {
  dialogUpdateVisible.value = false
}
const handleUpdateConfirm = () => {
  formRef.value?.validate(async (valid) => {
    if (valid) {
      const res = await updateTask({
        ...form,
        weather: form.weather.join(','), // 天气字段需要转换为字符串
        bianhao: currentBianhao.value
      })
      if (res.code === 1) {
        ElMessage.success(res.msg)
        dialogUpdateVisible.value = false
        getShareInfoListData()
      } else {
        ElMessage.error(res.msg)
      }
    } else {
      ElMessage.warning('请检查表单填写是否正确')
    }
  })
}
// 分页改变
const handleCurrentChange = (val) => {
  PageIndex.value = val
  getShareInfoListData()
}
// 搜索 - 防抖
let timer = null
const handleSearch = () => {
  clearTimeout(timer)
  timer = setTimeout(() => {
    getShareInfoListData()
  }, 500)
}
// 类型筛选
const handleFilterChange = () => {
  getShareInfoListData()
}
// 日期筛选
const handleDateChange = () => {
  getShareInfoListData()
}
const handleDateClear = () => {
  getShareInfoListData()
}

const weatherOptions = [
  {label: '晴天', value: '晴天', icon: Sunny},
  {label: '大雨', value: '大雨', icon: Drizzling},
  {label: '大雪', value: '大雪', icon: Pouring},
  {label: '大风', value: '大风', icon: Ship},
  {label: '大雾', value: '大雾', icon: PartlyCloudy}
]
// 天气互斥规则（不能共存的组合）
const conflictRules = {
  /* 规则说明：
     1. 晴天不能与任何降水天气共存
     2. 不同降水类型互斥（雨/雪）
     3. 大雾可与大风共存，但不可与晴天共存
  */
  '晴天': ['大雨', '大雪', '大雾'],
  '大雨': ['晴天', '大雪'],
  '大雪': ['晴天', '大雨'],
  '大雾': ['晴天']
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
      <PageHeader title="作业信息列表">
        <template #center>
          <el-input @input="handleSearch" class="search" placeholder="请输入作业名称" v-model="searchValue" clearable
                    size="large"></el-input>
        </template>
        <template #operate>
          <el-button type="primary" @click="toShareInfoPage">添加</el-button>
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
          <el-table v-if="total" :data="tableData" :border="parentBorder" stripe style="width: 100%">
            <el-table-column type="expand">
              <template #default="props">
                <div class="infos">
                  <p class="item">作业描述: {{ props.row.describe }}</p>
                  <p class="item">作业内容: {{ props.row.content }}</p>
                  <p class="item">风险点: {{ props.row.dangers }}</p>
                  <p class="item">注意事项: {{ props.row.notice }}</p>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="名称"/>
            <el-table-column prop="zuoye_type" label="作业类型"/>
            <el-table-column prop="zuoye_date" label="作业时间"/>
            <el-table-column label="操作" fixed="right">
              <template #default="{row}">
                <el-tooltip content="编辑" placement="bottom">
                  <el-button type="primary" :icon="Edit" circle @click="toShareInfoPage(row)"/>
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
        width="50%"
    >
      <el-form :model="form" label-width="auto" size="large" ref="formRef">
        <el-form-item label="作业名称">
          <el-input v-model="form.name"/>
        </el-form-item>
        <el-form-item label="作业类型">
          <el-select v-model="form.zuoye_type" placeholder="请选择作业类型">
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
          <el-select v-model="form.zuoye_level" placeholder="请选择作业等级">
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
          />
        </el-form-item>
        <el-form-item label="天气">
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
            <el-option label="0级" value="0级"/>
            <el-option label="1级" value="1级"/>
            <el-option label="2级" value="2级"/>
            <el-option label="3级" value="3级"/>
            <el-option label="4级" value="4级"/>
            <el-option label="5级" value="5级"/>
            <el-option label="6级" value="6级"/>
            <el-option label="7级" value="7级"/>
          </el-select>
        </el-form-item>
        <el-form-item label="作业描述">
          <el-input v-model="form.describe" type="textarea" placeholder="请输入作业描述"/>
        </el-form-item>
        <el-form-item label="作业内容">
          <el-input v-model="form.content" type="textarea" placeholder="请输入作业内容"/>
        </el-form-item>
        <el-form-item label="风险点">
          <el-input v-model="form.dangers" type="textarea" placeholder="请输入风险点"/>
        </el-form-item>
        <el-form-item label="注意事项">
          <el-input v-model="form.notice" type="textarea" placeholder="请输入注意事项"/>
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

      .infos {
        .item {
          margin-bottom: 10px;
          line-height: 2;
        }
      }
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