<script setup lang="ts">
import {reactive, ref} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
import PageHeader from '@/components/PageHeader.vue'
import NoData from '@/components/NoData.vue'
import {list, libraryInsert, libraryUpdate,
 // libraryDelete
} from '@/service/Library.ts'
//import {Delete, Edit} from '@element-plus/icons-vue'
//import {ElMessage, ElMessageBox} from 'element-plus'

const router = useRouter()
const route = useRoute()

// 面包屑导航
const breadcrumb = `要素库管理,${route.query.type}`

const toLibraryListPage = (library_bianhao, name) => {
  router.push({
    path: '/library-list',
    query: {
      library_bianhao,
      name,
      type: route.query.type,
    }
  })
}

// 获取要素库列表
const resourceList = ref([])
const getList = async () => {
  const res = await list({PageIndex: 1, PageSize: 1000, zuoyetype: route.query.type as string})
  if (res.code === 1) {
    // 删除第一个元素
    //res.data.shift()
    resourceList.value = res.data
  }
}
getList()

const formRef = ref(null)
const form = reactive({
  name: '',
  icon: '',
  zuoyetype: route.query.type as string,
  bianhao: '',
})
const rules = {
  name: [
    {required: true, message: '请输入名称', trigger: 'blur'},
  ],
  icon: [
    {required: true, message: '请选择图标', trigger: 'change'},
  ],
}
const iconList = [
  {id: 1, name: '工器具', icon: 'icon-lib-tool'},
  {id: 2, name: '防护', icon: 'icon-lib-shield'},
  {id: 3, name: '人员', icon: 'icon-lib-person'},
  {id: 4, name: '车辆', icon: 'icon-lib-car'},
  {id: 5, name: '隐患', icon: 'icon-lib-danger'},
]
// 添加要素库
const dialogTypeVisible = ref(false)
/*const handleLibraryTypeAdd = () => {
  form.name = ''
  form.icon = ''
  form.bianhao = ''
  dialogTypeVisible.value = true
  // 重置表单验证
  formRef.value?.clearValidate()
}*/
// 取消添加要素库
const handleAddCancel = () => {
  dialogTypeVisible.value = false
  form.name = ''
  form.icon = ''
}
// 编辑要素库
/*const handleTypeEdit = (item: any) => {
  for (const itemKey in item) {
    form[itemKey] = item[itemKey]
  }
  dialogTypeVisible.value = true
}*/

// 添加或编辑要素库
const handleAddConfirm = async () => {
  // 验证表单
  formRef.value?.validate(async (valid) => {
    if (valid) {
      // 判断是添加还是编辑
      if (form.bianhao) {
        const res = await libraryUpdate({
          ...form
        })
        if (res.code === 1) {
          dialogTypeVisible.value = false
          form.name = form.icon = ''
          // 重新获取要素库列表
          await getList()
        }
      } else {
        const res = await libraryInsert({
          name: form.name,
          icon: form.icon,
          zuoyetype: form.zuoyetype,
        })
        if (res.code === 1) {
          dialogTypeVisible.value = false
          form.name = form.icon = ''
          // 重新获取要素库列表
          await getList()
        }
      }
    } else {
      return false
    }
  })
}
// 删除要素库
/*const handleTypeDelete = async (bianhao) => {
  // 弹出确认框
  ElMessageBox.confirm(
      '确定要删除该要素库吗？',
      'Warning',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
  )
  .then(async () => {
    const res = await libraryDelete({bianhao})
    if (res.code === 1) {
      ElMessage({type: 'success', message: res.msg})
      await getList()
    } else {
      ElMessage({type: 'error', message: res.msg})
    }
  })
  .catch(() => {
    ElMessage({type: 'info', message: '取消删除',})
  })
}*/

</script>

<template>
  <div class="library">
    <AppHeader/>
    <div class="container">
      <PageHeader :title='breadcrumb'>
<!--        <template #operate>
          <el-button type="primary" @click="handleLibraryTypeAdd">添加</el-button>
        </template>-->
      </PageHeader>
      <div class="grid-container" v-if="resourceList.length">
        <div class="grid-item"
             @click="toLibraryListPage(item.bianhao, item.name)"
             v-for="item in resourceList"
             :key="item.id"
        >
<!--          <div class="buttons">
            <el-button type="primary" :icon="Edit" circle @click.stop="handleTypeEdit(item)"/>
            <el-button type="danger" :icon="Delete" circle @click.stop="handleTypeDelete(item.bianhao)"/>
          </div>-->

          <i class="icon" :class="item.icon"></i>
          <span class="text">{{ item.name }}</span>
          <i class="icon-enter"></i>
        </div>
      </div>
      <NoData v-else/>
    </div>

    <el-dialog
        v-model="dialogTypeVisible"
        title="要素类别"
        width="50%"
    >
      <el-form :model="form" label-width="auto" :rules="rules" ref="formRef">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入名称"/>
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <el-select v-model="form.icon" placeholder="请选择图标">
            <el-option
                v-for="item in iconList"
                :key="item.id"
                :label="item.name"
                :value="item.icon"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleAddCancel">取消</el-button>
          <el-button type="primary" @click="handleAddConfirm">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.library {
  width: 100vw;
  height: 100vh;

  .container {
    padding: 20px;
    box-sizing: border-box;
    width: 100%;
    height: calc(100% - 40px);

    .grid-container {
      padding: 20px;
      box-sizing: border-box;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 20px;
      align-content: start;
      overflow: auto;
      height: calc(100% - 60px);

      .grid-item {
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 20px;
        font-size: 30px;
        color: #222;
        aspect-ratio: 1 / 1;
        border-radius: 20px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        border: 8px solid $white;
        user-select: none;
        cursor: pointer;

        .buttons {
          position: absolute;
          top: 10px;
          right: 10px;

        }

        .icon {
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 64px;
          width: 80px;
          height: 80px;
          background: rgba(255, 255, 255, 0.7);
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
          border-radius: 50%;
        }

        &:nth-child(1) {
          color: #0379cc;
        }

        &:nth-child(2) {
          color: #0c9f6a;
        }

        &:nth-child(3) {
          color: #c87a21;
        }

        &:nth-child(4) {
          color: #4c49ce;
        }

        &:nth-child(5) {
          color: #be4c0e;
        }

        .text {
          margin-top: 10px;
          font-weight: bold;
          font-size: 24px;
          color: #FFFFFF;
        }

        &:nth-child(5n+1) {
          background: linear-gradient(0deg, #0077CA 0%, #99D5FF 100%);
        }

        &:nth-child(5n+2) {
          background: linear-gradient(0deg, #099E68 0%, #AAEFBA 100%);
        }

        &:nth-child(5n+3) {
          background: linear-gradient(0deg, #C47016 0%, #FFF1AF 100%);
        }

        &:nth-child(5n+4) {
          background: linear-gradient(0deg, #4B48CE 0%, #AEB9FF 100%);
        }

        &:nth-child(5n+5) {
          background: linear-gradient(0deg, #BD4A0C 0%, #FAB887 100%);
        }

        .icon-enter {
          color: #fff;
          font-size: 30px;
          position: absolute;
          right: 15px;
          bottom: 8px;
        }
      }
    }
  }


}
</style>