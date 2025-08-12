<script setup lang="ts">
import {reactive, ref} from 'vue'
import {useRoute} from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
import PageHeader from '@/components/PageHeader.vue'
import {Plus} from '@element-plus/icons-vue'
import {ElMessage} from 'element-plus'
import {materialInsert} from '@/service/Library.ts'
import {$generateUrl} from '@/utils/RegisterGlobalFunctions.ts'

const route = useRoute()
const library_bianhao:string = route.query.library_bianhao as string
// 面包屑导航
const breadcrumb = `要素库管理,${route.query.type},${route.query.name},添加`
// 上传图片地址
const action = BASE_URL+'/api/FileLoad/UploadYSImgFile'
const formRef = ref(null)
// 表单数据
const form = reactive({
  name: '',
  zuoyetype:'',
  length: '',
  width: '',
  height: '',
  zuoyeradius:'',
  describe: '',
  imgurl: ''
})
// 表单验证规则
const rules = {
  name: [
    {required: true, message: '名称必须输入', trigger: 'blur'},
  ],
  length: [
    {required: false, message: '选填', trigger: 'blur'},
  ],
  width: [
    {required: false, message: '选填', trigger: 'blur'},
  ],
  height: [
    {required: false, message: '选填', trigger: 'blur'},
  ],
  zuoyeradius: [
    {required: false, message: '选填', trigger: 'blur'},
  ],
  describe: [
    {required: false, message: '选填', trigger: 'blur'},
  ],
  imgurl: [
    {required: true, message: '图标必须上传', trigger: 'blur'},
  ]
}
// 重置表单数据
const resetForm = () => {
  form.name = ''
  form.length = ''
  form.width = ''
  form.height = ''
  form.zuoyeradius = ''
  form.describe = ''
  form.imgurl = ''
}
// 上传成功回调
const handleMaterialSuccess = (response) => {
  if(response.code === 1) {
    form.imgurl = response.url
  } else {
    ElMessage.error(response.message)
  }
}
// 上传前校验
const beforeMaterialUpload = (rawFile) => {
  if (rawFile.type !== 'image/svg+xml') {
    ElMessage.error('图片必须是SVG类型!')
    return false
  }
  return true
}
// 添加元素请求
const onSubmit = () => {
  formRef.value?.validate(async (valid) => {
    if (valid) {
      const res = await materialInsert({
        ...form,
        library_bianhao
      })
      if(res.code === 1) {
        ElMessage.success(res.msg)
        resetForm()
      } else {
        ElMessage.error(res.msg)
      }
    } else {
      ElMessage.warning('请检查表单填写是否正确')
    }
  })
}
</script>

<template>
  <div class="library-add">
    <AppHeader/>
    <div class="container">
      <PageHeader :title="breadcrumb"></PageHeader>
      <div class="page-content">
        <el-form :model="form" label-width="auto" :rules="rules" ref="formRef">
          <el-form-item label="名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入名称"/>
          </el-form-item>
          <el-form-item label="长度" class="item-group" prop="length">
            <el-input v-model="form.length" placeholder="请输入长度 [选填]">
              <template #append>m</template>
            </el-input>
          </el-form-item>
          <el-form-item label="宽度" class="item-group" prop="width">
            <el-input v-model="form.width" placeholder="请输入宽度 [选填]">
              <template #append>m</template>
            </el-input>
          </el-form-item>
          <el-form-item label="高度" class="item-group" prop="height">
            <el-input v-model="form.height" placeholder="请输入高度 [选填]">
              <template #append>m</template>
            </el-input>
          </el-form-item>
          <el-form-item label="作业半径" class="item-group" prop="zuoyeradius">
            <el-input v-model="form.zuoyeradius" placeholder="请输入作业半径 [选填]">
              <template #append>m</template>
            </el-input>
          </el-form-item>
          <el-form-item label="描述" prop="describe">
            <el-input v-model="form.describe" placeholder="请输入描述 [选填]" type="textarea"/>
          </el-form-item>
          <el-form-item label="图标" prop="imgurl">
            <el-upload
                class="avatar-uploader"
                :action='action'
                :show-file-list="false"
                :on-success="handleMaterialSuccess"
                :before-upload="beforeMaterialUpload"
            >
              <img v-if="form.imgurl" :src="$generateUrl(form.imgurl)" class="avatar" alt=""/>
              <el-icon v-else class="avatar-uploader-icon">
                <Plus/>
              </el-icon>
            </el-upload>
          </el-form-item>
          <el-form-item class="el-form-item-btn">
            <el-button type="primary" @click="onSubmit">确定</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.library-add {
  width: 100vw;
  height: 100vh;

  .container {
    padding: 20px;
    box-sizing: border-box;
    width: 100%;
    height: calc(100% - 40px);

    .page-content {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: calc(100% - 60px);

      .el-form {
        width: 50%;

        .item-group {
          // 排除第一个el-input元素和最后一个el-input元素
          .el-input:not(:first-child):not(:last-child) {
            margin: 10px 0;
          }
        }

        .el-form-item-btn {
          margin-top: 80px;

          :deep(.el-form-item__content) {
            display: flex;
            justify-content: center;
          }
        }

        :deep(.avatar-uploader) {
          .avatar {
            width: 64px;
            height: 64px;
            display: block;
          }

          .el-upload {
            border: 1px dashed #dcdfe6;
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            transition: var(--el-transition-duration-fast);
          }

          .el-upload:hover {
            border-color: var(--el-color-primary);
          }
        }

        .el-icon.avatar-uploader-icon {
          font-size: 28px;
          color: #8c939d;
          width: 64px;
          height: 64px;
          text-align: center;
        }
      }
    }
  }
}
</style>