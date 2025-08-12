<script setup lang="ts">
import {reactive, watch} from 'vue'

const innerFormData = reactive({
  hw: null,
  zuoye_level: '',
  upgrade: false
})

const emit = defineEmits(['formDataChanged'])

// 监听数据变化并通知父组件
watch(()=> innerFormData, (newVal) => {
  emit('formDataChanged', newVal);
}, { deep: true })

// 根据高度计算作业等级
const calculateZuoyeLevel = () => {
  if (innerFormData.hw >= 2 && innerFormData.hw <= 5) {
    innerFormData.zuoye_level = '一级'
  } else if (innerFormData.hw > 5 && innerFormData.hw <= 15) {
    innerFormData.zuoye_level = '二级'
  } else if(innerFormData.hw > 15 && innerFormData.hw <= 30) {
    innerFormData.zuoye_level = '三级'
  } else if(innerFormData.hw > 30) {
    innerFormData.zuoye_level = '四级'
  } else {
    innerFormData.zuoye_level = ''
  }
}

// 监听质量和长度变化
watch([() => innerFormData.hw], () => {
  innerFormData.upgrade = false
  calculateZuoyeLevel()
})

// 如果升级管理，作业等级zuoye_level+1
watch(() => innerFormData.upgrade, (newVal) => {
  if (newVal) {
    if (innerFormData.zuoye_level === '一级') {
      innerFormData.zuoye_level = '二级'
    } else if (innerFormData.zuoye_level === '二级') {
      innerFormData.zuoye_level = '三级'
    } else if (innerFormData.zuoye_level === '三级') {
      innerFormData.zuoye_level = '四级'
    }
  } else {
    calculateZuoyeLevel()
  }
})

</script>

<template>
  <div class="form-wrapper">
    <el-form-item label="作业高度">
      <el-input v-model="innerFormData.hw" type="number">
        <template #append>m</template>
      </el-input>
    </el-form-item>
    <el-form-item label="作业等级">
      <el-select v-model="innerFormData.zuoye_level" placeholder="请选择作业等级">
        <el-option label="一级" value="一级"/>
        <el-option label="二级" value="二级"/>
        <el-option label="三级" value="三级"/>
        <el-option label="四级" value="四级"/>
      </el-select>
    </el-form-item>
    <el-form-item label="是否升级管理">
      <el-switch v-model="innerFormData.upgrade" active-text="是" inactive-text="否"/>
    </el-form-item>
  </div>
</template>

<style scoped lang="scss">

</style>