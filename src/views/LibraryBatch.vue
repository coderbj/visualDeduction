<script setup lang="ts">
import {reactive, ref} from 'vue'
import {useRoute} from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
import PageHeader from '@/components/PageHeader.vue'
import {insertResource, IInsertResource} from '@/service/Library.ts'
import {ElMessage} from 'element-plus'
const route = useRoute()

// 面包屑导航
const breadcrumb = `要素库管理,${route.query.type},${route.query.name},批量上传`
// 上传地址
const actionImg = BASE_URL + '/api/FileLoad/UploadImgFile'
const actionExcel = BASE_URL + '/api/FileLoad/UploadExcelFile'

const uploadExcelRef = ref()
const submitUploadExcel = () => {
  uploadExcelRef.value!.submit()
}
// 上传Excel成功回调
const insertData = reactive({
  excelfile: '',
  library_bianhao: route.query.library_bianhao,
})
const handleUploadExcelScucess = async (response) => {
  if (response.code === 1) {
    insertData.excelfile = response.url
    const res = await insertResource({...insertData as IInsertResource})
    if (res.code === 1) {
      ElMessage.success(res.msg)
    } else {
      ElMessage.error(res.msg)
    }
  }
}
// 上传图片成功的回掉
const handleUploadImgScucess = async (response) => {
  // 只提示一次上传成功
  if (response.code === 1) {
    ElMessage.success({
      message: response.message,
      grouping: true,
      type: 'success',
    })
  } else {
    ElMessage.error({
      message: response.message,
      grouping: true,
      type: 'error',
    })
  }
}

const uploadSVGRef = ref()
const submitUploadSVG = () => {
  uploadSVGRef.value!.submit()
}

const downloadExcel = () => {
  window.open(BASE_URL + '/Excel/要素模板.xlsx')
}
</script>

<template>
  <div class="library-batch">
    <AppHeader/>
    <div class="container">
      <PageHeader :title="breadcrumb"></PageHeader>
      <div class="page-content">
        <div class="upload">
          <el-upload
              ref="uploadExcelRef"
              :action="actionExcel"
              :auto-upload="false"
              class="upload-excel"
              :on-success="handleUploadExcelScucess"
          >
            <template #trigger>
              <el-button type="primary">上传Excel</el-button>
            </template>
            <el-button type="success" @click="submitUploadExcel" style="margin-left: 20px;">
              上传到服务器
            </el-button>
            <el-button @click="downloadExcel" style="margin-left: 20px; position: absolute; top: 0; right: 0;">
              模板下载
            </el-button>

            <template #tip>
              <div class="el-upload__tip">仅支持上传xls/xlsx文件</div>
            </template>
          </el-upload>
        </div>
        <div class="upload">
          <el-upload
              ref="uploadSVGRef"
              :action="actionImg"
              :auto-upload="false"
              multiple
              class="upload-svg"
              :on-success="handleUploadImgScucess"
              show-file-list
          >
            <template #trigger>
              <el-button type="primary">上传svg</el-button>
            </template>

            <el-button type="success" @click="submitUploadSVG" style="margin-left: 20px;">
              上传到服务器
            </el-button>
            <template #tip>
              <div class="el-upload__tip">仅支持上传svg文件</div>
            </template>
          </el-upload>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.library-batch {
  width: 100vw;
  height: 100dvh;

  .container {
    padding: 20px;
    box-sizing: border-box;
    width: 100%;
    height: calc(100% - 40px);

    .page-content {
      display: flex;
      justify-content: space-between;
      height: calc(100% - 60px);

      .upload {
        padding: 20px;
        box-sizing: border-box;
        width: 49%;
        height: 100%;
        background: #efefef;
        border-radius: 10px;

        .upload-excel {
          position: relative;
          width: 100%;
          height: 100%;
          background: url("@/assets/images/excel.svg") no-repeat center;
        }

        .upload-svg {
          width: 100%;
          height: 100%;
          background: url("@/assets/images/svg.svg") no-repeat center;
          overflow-y: auto;
        }
      }
    }
  }
}
</style>