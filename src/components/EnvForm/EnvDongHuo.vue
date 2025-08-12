<script setup lang="ts">
import {reactive, watch} from 'vue'

const radioOptions = [
  // 特级
  {
    label: '运行状态下的石油天然气生产处理装置或系统的设备、管道、容器（不含带有可燃介质的储罐）等本体及其附件上进行的动火作业',
    value: '特级1'
  },
  {
    label: '无法进行清洗、置换的石油天然气生产处理装置或系统带压不置换动火作业',
    value: '特级2'
  },
  {label: '输油（气）干线不置换动火作业', value: '特级3'},
  {label: '运行中的重大危险源罐区防火堤内进行的动火作业', value: '特级4'},
  {label: '其他特殊危险场所、特殊容器进行的动火作业', value: '特级5'},

  // 一级
  {label: '在易燃易爆场所进行的除特级动火作业以外的动火作业', value: '一级1'},
  {label: '厂区管廊上的动火作业按一级动火作', value: '一级2'},
  {label: '未构成重大危险源的原油库、联合站、天然气处理站等各类集输场站的防爆区域内，贮存、输送非油气易燃易爆介质的管线本体、非压力容器本体上的动火作业', value: '一级3'},
  // 二级
  {label: '除特级动火、一级动火作业外，在防爆油气区外的油气生产区域内的各类动火作业', value: '二级1'},
  {label: '凡生产装置或系统全部停运，装置经清洗、置换、分析合格并采取安全隔离措施后，可根据其火灾、爆炸危险性大小，经二级单位生产部门和安全监管部门同意的动火作业', value: '二级2'},
  {label: '遇节假日、夜间（当日20时至次日6时）或其他特殊情况', value: '升级'},
]
const emit = defineEmits(['formDataChanged'])
const innerFormData = reactive({
  content: '',
  zuoye_level: '',
  upgrade: false
})

// 根据content计算zuoye_level
const calculateZuoyeLevel = () => {
  if(innerFormData.content.includes('特级')) {
    innerFormData.zuoye_level = '特级'
  } else if(innerFormData.content.includes('一级')) {
    innerFormData.zuoye_level = '一级'
  } else if(innerFormData.content.includes('二级')) {
    innerFormData.zuoye_level = '二级'
  }
  // 如果是升级，作业等级+1
  if(innerFormData.upgrade) {
    if(innerFormData.zuoye_level === '二级') {
      innerFormData.zuoye_level = '一级'
    } else if(innerFormData.zuoye_level === '一级') {
      innerFormData.zuoye_level = '特级'
    }
  }
}

// 监听数据变化并通知父组件
watch(()=> innerFormData, (newVal) => {
  emit('formDataChanged', newVal)
}, { deep: true })

// 监听数据变化
watch([() => innerFormData.content], () => {
  calculateZuoyeLevel()
})
// 如果升级管理，作业等级zuoye_level+1
watch(() => innerFormData.upgrade, (newVal) => {
  if (newVal) {
    if (innerFormData.zuoye_level === '二级') {
      innerFormData.zuoye_level = '一级'
    } else if (innerFormData.zuoye_level === '一级') {
      innerFormData.zuoye_level = '特级'
    }
  } else {
    calculateZuoyeLevel()
  }
})

</script>

<template>
  <div class="form-wrapper">
    <el-form-item label="作业内容">
      <el-radio-group v-model="innerFormData.content">
        <div v-for="item in radioOptions" style="width: 100%">
          <el-radio :label="item.label" :value="item.value">{{item.label}}</el-radio>
        </div>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="作业等级">
      <el-select v-model="innerFormData.zuoye_level" placeholder="请选择作业等级">
        <el-option label="特级" value="特级"/>
        <el-option label="一级" value="一级"/>
        <el-option label="二级" value="二级"/>
      </el-select>
    </el-form-item>
    <el-form-item label="是否升级管理">
      <el-switch v-model="innerFormData.upgrade" active-text="是" inactive-text="否"/>
    </el-form-item>
  </div>
</template>

<style scoped lang="scss">
.form-wrapper {
  .el-radio-group {
    :deep(.el-radio__label) {
      line-height: 20px;
      white-space: wrap;
    }
  }
}
</style>