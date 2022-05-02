<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/' }">二级</el-breadcrumb-item>
      <el-breadcrumb-item>三级</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row :gutter="10">
        <el-col :span="6"><div class="grid-content bg-purple" />
          <el-input
            v-model="queryInfo.query"
            placeholder="Please input"
            class="input-with-select"
            @change="searchChange()"
            :clearable="true"
          >
            <template #prepend>
              <el-button :icon="Search" @click="getUserList"/>
            </template>
          </el-input>
        </el-col>
        <el-col :span="4"><div class="grid-content bg-purple" />
          <el-button type="primary" @click="dialogFormVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <el-table :data="usersList" border stripe style="width: 100%">
        <el-table-column fixed="" type="index" label="序号" />
        <el-table-column prop="username" label="姓名" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="mobile" label="电话" />
        <el-table-column prop="role_name" label="角色" />
        <el-table-column label="状态" >
          <template v-slot="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)"/>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="180">
          <template v-slot="scope">
<!--            编辑-->
            <el-tooltip
              effect="dark"
              content="编辑"
              placement="top"
              :enterable="false"
            >
            <el-button type="primary" size="small" :icon="Edit" @click="showEditDialog(scope.row.id)"/>
            </el-tooltip>
<!--            删除-->
            <el-tooltip
              effect="dark"
              content="删除用户"
              placement="top"
              :enterable="false"
            >
            <el-button type="danger" size="small" :icon="Delete" @click="deleteOpen(scope.row.id)"></el-button>
            </el-tooltip>
<!--            分配角色-->
            <el-tooltip
              effect="dark"
              content="权限分配"
              placement="top"
              :enterable="false"
            >
            <el-button type="warning" size="small" :icon="Setting"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-model:currentPage="queryInfo.pagenum"
        v-model:page-size="queryInfo.pagesize"
        :page-sizes="[1, 3, 5, 10]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-card>
    <!-- 新增用户 -->
    <el-dialog v-model="dialogFormVisible" title="新增用户" @close="addDialogClosed(ruleFormRef)">
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="ruleFormRules"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="ruleForm.username" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="ruleForm.password" />
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="ruleForm.mobile" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="ruleForm.email" />
        </el-form-item>
        <!--        按钮区域-->
        <el-form-item>
          <el-button type="primary" @click="addUsertForm(ruleFormRef)">提交</el-button>
          <el-button @click="resetForm(ruleFormRef)">重置</el-button>
          <el-button @click="dialogFormVisible = false">关闭</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 编辑用户信息 -->
    <el-dialog v-model="editDialogVisible" title="编辑用户" @close="editDialogClosed(editFormRef)">
      <el-form
        ref="editFormRef"
        :model="editForm"
        :rules="editFormRules"
        label-width="70px"
      >
        <el-form-item label="用户名" >
          <el-input v-model="editForm.username" disabled />
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email" />
        </el-form-item>
        <!--        按钮区域-->
        <el-form-item>
          <el-button type="primary" @click="editUsertForm(editFormRef)">提交</el-button>
          <el-button @click="editDialogVisible = false">关闭</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup>
import { Search, Edit, Delete, Setting } from '@element-plus/icons'
import { ref, reactive } from 'vue'
import api from '@/axios/config'
const { ElMessage, ElMessageBox } = require('element-plus')

const ruleFormRef = ref('')

const ruleForm = reactive({
  username: '',
  password: '',
  email: '',
  mobile: ''
})

const {
  onBeforeMount
} = require('vue')

const usersList = ref([])

const total = ref(0)

const dialogFormVisible = ref(false)

const queryInfo = reactive({
  query: '',
  pagenum: 1,
  pagesize: 5
})
onBeforeMount(() => {
  getUserList()
})

const userStateChanged = async (userinfo) => {
  const { data: res } = await api.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
  if (res.meta.status !== 200) {
    userinfo.mg_state = !userinfo.mg_state
    return ElMessage.error(res.meta.msg)
  }
  ElMessage.success(res.meta.msg)
}

const getUserList = async () => {
  const { data: res } = await api.get('users', { params: queryInfo })
  if (res.meta.status !== 200) return ElMessage.error(res.meta.msg)
  usersList.value = res.data.users
  total.value = res.data.total
}

const handleCurrentChange = (newPage) => {
  queryInfo.pagenum = newPage
  getUserList()
}

const handleSizeChange = (newSize) => {
  queryInfo.pagesize = newSize
  getUserList()
}

const searchChange = () => {
  getUserList()
}

const checkUsername = (rule, value, callback) => {
  const reg = /^[_a-zA-Z0-9]+$/
  if (value === '' || value === undefined || value === null) {
    callback()
  } else {
    callback()
    if (!reg.test(value)) {
      callback(new Error('仅由英文字母，数字以及下划线组成'))
    } else {
      callback()
    }
  }
}

const ruleFormRules = reactive({
  username: [
    { required: true, message: '用户名不能为空', trigger: 'blur' },
    { min: 3, max: 11, message: '用户名长度在 3 到 11个字符', trigger: 'blur' },
    { validator: checkUsername, trigger: 'blur' }
  ],
  password: [
    { required: true, message: '密码不能为空', trigger: 'blur' },
    { min: 3, max: 12, message: '密码长度在 3 到 12个字符', trigger: 'blur' }
  ],
  email: [
    { required: false },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  mobile: [
    { required: false },
    { pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ]
})

const addUsertForm = (formEl) => {
  formEl.validate(async (valid, fields) => {
    if (!valid) return
    const { data: res } = await api.post('users', ruleForm)
    if (res.meta.status !== 201) return ElMessage.error(res.meta.msg)
    ElMessage({
      message: res.meta.msg,
      type: 'success'
    })
    dialogFormVisible.value = false
    getUserList()
  })
}

const resetForm = (formEl) => {
  formEl.resetFields()
}

const addDialogClosed = (formEl) => {
  formEl.resetFields()
}

// 以下为用户信息编辑

const editFormRef = ref('')

const editForm = ref({})

const editDialogVisible = ref(false)

const showEditDialog = async (id) => {
  const { data: res } = await api.get('users/' + id)
  if (res.meta.status !== 200) return ElMessage.error(res.meta.msg)
  editForm.value = res.data
  editDialogVisible.value = true
}

const editUsertForm = (formEl) => {
  formEl.validate(async (valid, fields) => {
    if (!valid) return
    const { data: res } = await api.put('users/' + editForm.value.id, {
      email: editForm.value.email, mobile: editForm.value.mobile
    })
    if (res.meta.status !== 200) return ElMessage.error(res.meta.msg)
    ElMessage({
      message: res.meta.msg,
      type: 'success'
    })
    editDialogVisible.value = false
    getUserList()
  })
}

const editFormRules = reactive({
  email: [
    { required: false },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  mobile: [
    { required: false },
    { pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ]
})

const editDialogClosed = (editFormRef) => {
  editFormRef.resetFields()
}

// 删除用户
const deleteOpen = (id) => {
  ElMessageBox.confirm(
    '是否删除该用户?',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  )
    .then(async () => {
      const { data: res } = await api.delete('users/' + id)
      if (res.meta.status !== 200) return ElMessage.error(res.meta.msg)
      ElMessage({
        message: res.meta.msg,
        type: 'success'
      })
      getUserList()
    })
    .catch(() => {
      getUserList()
      ElMessage({
        type: 'info',
        message: '未执行删除操作'
      })
    })
}

</script>

<style lang="less" scoped>

</style>
