<script setup lang="ts">
import {reactive} from 'vue'
import {useRoute} from 'vue-router'
import PageHeader from '@/components/PageHeader.vue'
import {setShareInfo, updateShareInfo} from '@/service/Share.ts'
import {ElMessage} from 'element-plus'
import {getShareInfo} from '@/service/Share.ts'

const route = useRoute()

const form = reactive({
  name: '',
  zuoye_type: '',
  zuoye_date: '',
  describe: '',
  content: '',
  dangers: '',
  notice: ''
})

// 获取交底信息
const getShareInfoData = async () => {
  const res = await getShareInfo(route.query.bianhao as string)
  if (res.code === 1) {
    const data = res.data[0]
    for (const formKey in form) {
      form[formKey] = data[formKey]
    }
  }
}
// 编辑时获取交底信息
route.query.bianhao && getShareInfoData()

const onSubmit = async () => {
  // 判断当前是新增还是编辑
  if (route.query.bianhao) {
    form['bianhao'] = route.query.bianhao as string
    // 编辑
    const res = await updateShareInfo(form)
    if (res.code === 1) {
      ElMessage.success(res.msg)
    } else {
      ElMessage.error(res.msg)
    }
  } else {
    const res = await setShareInfo(form)
    if (res.code === 1) {
      ElMessage.success(res.msg)
      // 清空表单
      for (const formKey in form) {
        form[formKey] = ''
      }
    } else {
      ElMessage.error(res.msg)
    }
  }
}
</script>

<template>
  <div class="env-setup">
    <PageHeader title="交底信息"/>
    <div class="content">
      <div class="title">请设置交底信息</div>
      <el-form :model="form" label-width="auto" size="large">
        <el-form-item label="交底信息名称">
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
        <el-form-item label="作业日期">
          <el-date-picker
              v-model="form.zuoye_date"
              type="date"
              placeholder="选择日期"
              value-format="YYYY-MM-DD"
              :editable="false"
          />
        </el-form-item>
        <el-form-item label="作业描述">
          <el-input v-model="form.describe" type="textarea" :autosize="true" placeholder="请输入作业描述"/>
        </el-form-item>
        <el-form-item label="作业内容">
          <el-input v-model="form.content" type="textarea" :autosize="true"  placeholder="请输入作业内容"/>
        </el-form-item>
        <el-form-item label="风险点">
          <el-input v-model="form.dangers" type="textarea" :autosize="true" placeholder="请输入风险点"/>
        </el-form-item>
        <el-form-item label="注意事项">
          <el-input v-model="form.notice" type="textarea" :autosize="true" placeholder="请输入注意事项"/>
        </el-form-item>
        <el-form-item class="el-form-item-btn">
          <el-button type="primary" @click="onSubmit">提交</el-button>
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
  height: 100dvh;

  .content {
    overflow-y: auto;
    box-sizing: border-box;
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;

    .title {
      font-size: $font-size-xxxl;
      margin-bottom: 60px;
    }

    .el-form {
      width: 50%;

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
    }
  }
}
</style>