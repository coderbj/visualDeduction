<script setup lang="ts">
import {reactive, watch} from 'vue'

const emit = defineEmits(['formDataChanged'])
let innerFormData = reactive({
  quality: 0,
  length: 0,
  zuoye_level: '',
  upgrade: false
})

// 监听数据变化并通知父组件
watch(()=> innerFormData, (newVal) => {
  emit('formDataChanged', newVal);
}, { deep: true })

// 根据质量和长度计算作业等级
const calculateZuoyeLevel = () => {
  if (innerFormData.quality > 100 || innerFormData.length > 60) {
    innerFormData.zuoye_level = '一级'
  } else if (innerFormData.quality >= 40 && innerFormData.quality <= 100) {
    innerFormData.zuoye_level = '二级'
  } else {
    innerFormData.zuoye_level = '三级'
  }
}

// 监听质量和长度变化
watch([() => innerFormData.quality, () => innerFormData.length], () => {
  innerFormData.upgrade = false
  calculateZuoyeLevel()
})
// 如果升级管理，作业等级zuoye_level+1
watch(() => innerFormData.upgrade, (newVal) => {
  if (newVal) {
    if (innerFormData.zuoye_level === '三级') {
      innerFormData.zuoye_level = '二级'
    } else if (innerFormData.zuoye_level === '二级') {
      innerFormData.zuoye_level = '一级'
    }
  } else {
    calculateZuoyeLevel()
  }
})

</script>

<template>
  <div class="form-wrapper">
    <el-form-item label="质量">
      <el-input v-model="innerFormData.quality" type="number">
        <template #append>吨</template>
      </el-input>
    </el-form-item>
    <el-form-item label="长度">
      <el-input v-model="innerFormData.length" type="number">
        <template #append>m</template>
      </el-input>
    </el-form-item>
    <el-form-item label="作业等级">
      <el-select v-model="innerFormData.zuoye_level" placeholder="请选择作业等级">
        <el-option label="一级" value="一级"/>
        <el-option label="二级" value="二级"/>
        <el-option label="三级" value="三级"/>
      </el-select>
    </el-form-item>
    <el-form-item label="是否升级管理">
      <el-switch v-model="innerFormData.upgrade" active-text="是" inactive-text="否"/>
    </el-form-item>
  </div>
</template>

<style scoped lang="scss">

</style>