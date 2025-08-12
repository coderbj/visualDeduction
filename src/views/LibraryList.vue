<script setup lang="ts">
import {computed, ref, reactive} from 'vue'
import {useRouter, useRoute} from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
import PageHeader from '@/components/PageHeader.vue'
import {Delete, Edit, Plus,} from '@element-plus/icons-vue'
import {materialDelete, materialList, materialUpdate} from '@/service/Library.ts'
import NoDataBlock from '@/components/NoData.vue'
import {ElMessage, ElMessageBox} from 'element-plus'
import {$generateUrl} from '@/utils/RegisterGlobalFunctions.ts'

const router = useRouter()
const route = useRoute()

// 面包屑导航
const breadcrumb = `要素库管理,${route.query.type},${route.query.name}`
const searchValue = ref('')
// 上传图片地址
const action = BASE_URL + '/api/FileLoad/UploadImgFile'
// 表单ref
const formRef = ref(null)
// 表单数据
const form = reactive({
  name: '',
  zuoyetype: '',
  length: '',
  width: '',
  height: '',
  zuoyeradius: '',
  describe: '',
  imgurl: '',
})
// 表单验证规则
const rules = {
  name: [
    {required: true, message: '名称必须输入', trigger: 'blur'},
  ],
  imgurl: [
    {required: true, message: '图标必须上传', trigger: 'blur'},
  ]
}
// 当前选中的工器具index
const activeIndex = ref(-1)
const handleSelected = (index) => {
  activeIndex.value = index
}
// 获取当前选中的元素信息
const getActiveItem = computed(() => {
  return materialsList.value[activeIndex.value]
})

// 获取要素列表
const total= ref(0)
const PageIndex = ref(1)
const PageSize = ref(30)
const materialsList = ref([])
const getMaterialsList = async () => {
  const res = await materialList({
    PageIndex: PageIndex.value,
    PageSize: PageSize.value,
    name: searchValue.value,
    library_bianhao: route.query.library_bianhao as string,
  })
  if (res.code === 1) {
    materialsList.value = res.data
    total.value = res.count
  } else {
    materialsList.value = []
  }
}
getMaterialsList()
// 搜索 - 防抖
let timer = null
const handleSearch = () => {
  clearTimeout(timer)
  timer = setTimeout(() => {
    getMaterialsList()
  }, 500)
}
// 分页改变
const handleCurrentChange = (val)=> {
  PageIndex.value = val
  getMaterialsList()
}
// 修改要素
const dialogUpdateVisible = ref(false)
const handleUpdateMaterial = (item) => {
  dialogUpdateVisible.value = true
  for (const itemKey in form) {
    form[itemKey] = item[itemKey]
  }
}
const handleUpdateCancel = () => {
  dialogUpdateVisible.value = false
}
// 上传成功回调
const handleMaterialSuccess = (response) => {
  if (response.code === 1) {
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
// 网络请求-更新要素
const handleUpdateConfirm = () => {
  formRef.value?.validate(async (valid) => {
    if (valid) {
      const bianhao = getActiveItem.value.bianhao as string
      const library_bianhao = route.query.library_bianhao as string
      const res = await materialUpdate({
        ...form,
        bianhao,
        library_bianhao,
      })
      if (res.code === 1) {
        ElMessage.success(res.msg)
        dialogUpdateVisible.value = false
        getMaterialsList()
      } else {
        ElMessage.error(res.msg)
      }
    } else {
      ElMessage.warning('请检查表单填写是否正确')
    }
  })
}
// 网络请求-删除要素
const handleDeleteMaterial = (bianhao) => {
  ElMessageBox.confirm('此操作将删除该要素, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    const res = await materialDelete({bianhao})
    if (res.code === 1) {
      ElMessage.success(res.msg)
      await getMaterialsList()
      handleHideMask()
    } else {
      ElMessage.error(res.msg)
    }
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}

// 隐藏Mask
const handleHideMask = () => {
  activeIndex.value = -1
}
// 跳转到添加页面
const toLibraryAddPage = () => {
  router.push({
    path: '/library-add',
    query: {
      library_bianhao: route.query.library_bianhao,
      name: route.query.name,
      type: route.query.type,
    }
  })
}
// 跳转到批量上传页面
const toLibraryBatchPage = () => {
  router.push({
    path: '/library-batch',
    query: {
      library_bianhao: route.query.library_bianhao,
      name: route.query.name,
      type: route.query.type,
    }
  })
}
</script>

<template>
  <div class="library-list">
    <AppHeader/>
    <div class="container">
      <PageHeader :title='breadcrumb'>
        <template #center>
          <el-input @input="handleSearch" class="search" placeholder="请输入搜索内容" v-model="searchValue" clearable size="large"></el-input>
        </template>
        <template #operate>
          <el-button type="primary" @click="toLibraryAddPage">添加</el-button>
          <el-button type="primary" @click="toLibraryBatchPage">批量上传</el-button>
        </template>
      </PageHeader>
      <div class="page-content">
        <div class="grid-container" @click="handleHideMask">
          <div class="grid-content" v-if="total">
            <div class="grid-item"
                 v-for="(item, index) in materialsList"
                 :key="item.bianhao"
                 @click.stop="handleSelected(index)"
                 :class="{'grid-item-active': activeIndex === index}"
            >
              <div class="icon">
                <img :src="$generateUrl(item.imgurl)" alt="item.name">
              </div>
              <div class="text">{{ item.name }}</div>
              <div class="mask" v-if="activeIndex === index">
                <el-button type="primary" :icon="Edit" circle @click="handleUpdateMaterial(item)"/>
                <el-button type="danger" :icon="Delete" @click="handleDeleteMaterial(item.bianhao)" circle/>
              </div>
            </div>
          </div>
          <NoDataBlock v-else/>
          <div class="grid-footer">
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
        <div class="information">
          <el-descriptions
              :title='route.query.name+"描述"'
              direction="vertical"
              :column="1"
              border
              v-if="activeIndex >=0"
          >
            <el-descriptions-item label="名称">{{ getActiveItem.name }}</el-descriptions-item>
            <el-descriptions-item label="描述">{{ getActiveItem.describe? getActiveItem.describe:'暂无描述' }}</el-descriptions-item>
            <template v-if="route.query.name === '车辆'">
              <el-descriptions-item label="车长">{{ getActiveItem.length? getActiveItem.length+'米':'暂无数据' }}</el-descriptions-item>
              <el-descriptions-item label="车宽">{{ getActiveItem.width? getActiveItem.width+'米':'暂无数据' }}</el-descriptions-item>
              <el-descriptions-item label="作业半径">{{ getActiveItem.zuoyeradius? getActiveItem.zuoyeradius+'米':'暂无数据' }}</el-descriptions-item>
            </template>

          </el-descriptions>
          <p v-else class="normal">选择要素，查看信息</p>
        </div>
      </div>
    </div>
    <el-dialog
        v-model="dialogUpdateVisible"
        title="修改要素"
        width="50%"
    >
      <el-form :model="form" label-width="auto" :rules="rules" ref="formRef">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入名称"/>
        </el-form-item>
        <el-form-item label="长度" class="item-group">
          <el-input v-model="form.length" placeholder="请输入长度" type="number">
            <template #append>m</template>
          </el-input>
        </el-form-item>
        <el-form-item label="宽度" class="item-group">
          <el-input v-model="form.width" placeholder="请输入宽度" type="number">
            <template #append>m</template>
          </el-input>
        </el-form-item>
        <el-form-item label="高度" class="item-group">
          <el-input v-model="form.height" placeholder="请输入高度" type="number">
            <template #append>m</template>
          </el-input>
        </el-form-item>
        <el-form-item label="作业半径" class="item-group">
          <el-input v-model="form.zuoyeradius" placeholder="请输入作业半径 [选填]" type="number">
            <template #append>m</template>
          </el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.describe" placeholder="请输入描述" type="textarea"/>
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
.library-list {
  width: 100vw;
  height: 100dvh;

  .container {
    padding: 20px;
    box-sizing: border-box;
    width: 100%;
    height: calc(100% - 40px);

    .page-content {
      position: relative;
      display: flex;
      height: calc(100% - 60px);

      .grid-container {
        flex: 1;
        padding: 20px;
        box-sizing: border-box;

        .grid-content {
          padding-top: 1px;
          padding-left: 1px;
          display: grid;
          justify-content: center;
          align-content: start;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 0;
          overflow: auto;
          width: 100%;
          height: calc(100% - 60px);
          .grid-item {
            margin-top: -1px;
            margin-left: -1px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 20px;
            background-color: #fff;
            aspect-ratio: 2 / 1;
            border: 1px solid #ccc;
            user-select: none;
            cursor: pointer;

            .text {
              font-size: 14px;
              width: 100%;
              text-align: center;
              text-overflow: ellipsis;
              overflow: hidden;
              white-space: nowrap;
            }

            .icon {
              width: 64px;
              height: 64px;

              img {
                width: 100%;
                height: 100%;
              }
            }
          }
          .grid-item-active {
            position: relative;

            .mask {
              display: flex;
              justify-content: space-evenly;
              align-items: center;
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              background-color: rgba(0, 0, 0, .5);
              backdrop-filter: blur(3px);
              color: #fff;
            }
          }
        }

        .grid-footer {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 60px;
        }
      }

      .information {
        padding: 20px 10px;
        box-sizing: border-box;
        width: 300px;
        height: 100%;
        border: 1px solid #eee;

        .normal {
          font-size: 14px;
          color: #999;
          text-align: center;
          margin-top: 20px;
        }
      }
    }
  }

  .el-form {
    width: 100%;

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
</style>