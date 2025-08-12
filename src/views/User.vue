<script setup lang="ts">
import {reactive, ref} from 'vue'
import PageHeader from '@/components/PageHeader.vue'
import AppHeader from '@/components/AppHeader.vue'
import {Delete, Edit, Hide, View} from '@element-plus/icons-vue'
import NoData from '@/components/NoData.vue'
import {insert, list, deleteuser, update} from '@/service/Login.ts'
import {ElMessage, ElMessageBox} from 'element-plus'

const PageIndex = ref(1)
const PageSize = ref(1000)
const tableData = ref([])
const isView = ref(false) // 是否是查看
const currentRow = ref('') // 当前行BianHao
const isUpdate = ref(false) // 是否是修改
const dialogVisible = ref(false)
//const dialogTipsVisible = ref(false)

const form = reactive({
  name: '',
  username: '',
  password: '',
})
const formRef = ref(null)

// 请求-获取用户列表
const getUserList = async () => {
  const res = await list({PageIndex: PageIndex.value, PageSize: PageSize.value})
  if (res.code === 1) {
    tableData.value = res.data
  } else {
    ElMessage.error(res.msg)
  }
}
getUserList()

const onChangeView = (BianHao) => {
  isView.value = !isView.value
  currentRow.value = BianHao
}

// 弹窗
const onClose = () => {
  dialogVisible.value = false
}
const onCancel = () => {
  dialogVisible.value = false
}
// 添加用户
const handleAddUser = () => {
  resetForm()
  isUpdate.value = false
  dialogVisible.value = true
}

// 修改用户
const handleUpdateUser = async (item) => {
  isUpdate.value = true
  dialogVisible.value = true
  form.name = item.name
  form.username = item.username
  form.password = item.password
  form['BianHao'] = item.BianHao
}

const onConfirm = async () => {
  formRef.value?.validate(async v => {
    if (v) {
      // 判断是添加还是修改
      if (isUpdate.value) {
        const res = await update({
          BianHao: form['BianHao'],
          name: form.name,
          username: form.username,
          password: form.password
        })
        if (res.code === 1) {
          ElMessage.success(res.msg)
          getUserList() // 重新获取用户列表
        } else {
          ElMessage.error(res.msg)
        }
        dialogVisible.value = false
        // 重置表单
        resetForm()
      } else {
        const res = await insert(form)
        if (res.code === 1) {
          ElMessage.success(res.msg)
          dialogVisible.value = false
          getUserList() // 重新获取用户列表
        } else {
          ElMessage.error(res.msg)
        }
        resetForm()
      }
    } else {
      ElMessage.error('请检查输入内容')
    }
  })
}
// 重置表单
const resetForm = () => {
  dialogVisible.value = false
  formRef.value?.clearValidate()
  for (const key in form) {
    form[key] = ''
  }
  delete form['BianHao']
}

// 删除用户
const handleDeleteUser = (id) => {
  ElMessageBox.confirm('确定要删除该用户吗？', '提示', {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning',})
  .then(async () => {
    const res = await deleteuser({BianHao: id})
    if (res.code === 1) {
      ElMessage.success(res.msg)
      getUserList() // 重新获取用户列表
    } else {
      ElMessage.error(res.msg)
    }
  }).catch(() => {
  })
}
</script>

<template>
  <div class="user">
    <AppHeader/>
    <div class="container">
      <PageHeader title="用户管理">
        <template #operate>
          <el-button type="primary" @click="handleAddUser">添加</el-button>
        </template>
      </PageHeader>
      <div class="page-content" ref="PageContentRef">
        <el-scrollbar v-if="tableData.length">
          <el-table
              :data="tableData"
              header-row-class-name="table-header"
          >
            <el-table-column type="index" label="序号" width="80"/>
            <el-table-column property="name" label="姓名"/>
            <el-table-column property="username" label="用户名"/>
            <el-table-column property="password" label="密码">
              <template #default="scope">
              <span
                  style="width: 100px; cursor: pointer; position: relative"
                  @click="onChangeView(scope.row.BianHao)"
              >{{ isView && currentRow === scope.row.BianHao ? scope.row.password : '***' }}
                <span class="icon-view">
                  <Component :is="isView && currentRow === scope.row.BianHao? Hide : View"/>
                </span>
              </span>

              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template #default="scope">
                <el-button
                    size="small"
                    plain
                    type="primary"
                    title="修改"
                    @click.stop="handleUpdateUser(scope.row)">
                  <el-icon>
                    <Edit/>
                  </el-icon>
                </el-button>
                <el-button
                    size="small" plain type="danger"
                    title="删除"
                    @click.stop="handleDeleteUser(scope.row.BianHao)">
                  <el-icon>
                    <Delete/>
                  </el-icon>
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-scrollbar>
        <NoData v-else/>
      </div>
    </div>
    <el-dialog
        v-model="dialogVisible"
        title="用户信息"
        width="50%"
        :before-close="onClose"
    >
      <el-form :model="form" ref="formRef">
        <el-form-item label="姓&emsp;&emsp;名" prop="name"
                      :rules="[{ required: true, message: '姓名必须填写', trigger:'blur'}]">
          <el-input v-model="form.name"/>
        </el-form-item>
        <el-form-item label="用&ensp;户&ensp;名" prop="username" :rules="[
            { required: true, message: '用户名必须填写', trigger:'blur'}]">
          <el-input v-model="form.username"/>
        </el-form-item>
        <el-form-item label="密&emsp;&emsp;码" prop="password" :rules="[
            { required: true, message: '密码必须填写', trigger:'blur'},
            { pattern: /[0-9A-Za-z]{6,20}$/, message: '密码格式不正确', trigger:'blur'}]"
        >
          <el-input v-model="form.password"/>
        </el-form-item>
      </el-form>
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="onCancel">取消</el-button>
        <el-button type="primary" @click="onConfirm">确定</el-button>
      </span>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.user {
  width: 100vw;
  height: 100dvh;

  .container {
    padding: 20px;
    box-sizing: border-box;
    width: 100%;
    height: calc(100% - 40px);

    .page-content {
      box-sizing: border-box;
      width: 100%;
      height: calc(100% - 60px);

      .icon-view {
        position: absolute;
        display: inline-block;
        padding-left: 12px;
        width: 16px;
        height: 16px;
      }
    }
  }
}
</style>