<template>
  <div>
    <el-card>
      <el-row :gutter="10">
        <el-col :span="4"><div class="grid-content bg-purple" />
          <el-button type="primary" @click="rolesFormVisible = true">添加角色</el-button>
        </el-col>
      </el-row>
      <el-table :data="rolesList" border stripe style="width: 100%">
        <el-table-column type="expand" >
          <template v-slot="scope">
            <pre>
              <el-row :class="['bdbottom',i1 === 0 ? 'bdtop':'','vceter']" v-for="(item1,i1) in scope.row.children" :key="item1.id">
                <el-col :span="5">
                  <div style="white-space: nowrap">
                  <el-tag vceter closable @close="removeRolesById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                  <el-icon><CaretRight /></el-icon>
                  </div>
                </el-col>
                <el-col :span="19">
                  <el-row :class="[i2 === 0 ? '':'bdtop','vceter' ]" v-for="(item2,i2) in item1.children" :key="item2.id">
                    <el-col :span="6" >
                      <div style="white-space: nowrap">
                        <el-tag type="success" vceter closable @close="removeRolesById(scope.row,item2.id)">{{item2.authName}}</el-tag>
                        <el-icon><CaretRight /></el-icon>
                      </div>
                    </el-col>
                    <el-col :span="18" >
                      <el-tag type="warning" v-for="(item3) in item2.children" :key="item3.id" closable @close="removeRolesById(scope.row,item3.id)">{{item3.authName}}</el-tag>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </pre>
          </template>
        </el-table-column>
        <el-table-column type="index" label="序号" />
        <el-table-column prop="roleName" label="角色名称" />
        <el-table-column prop="roleDesc" label="角色描述" />
        <el-table-column fixed="right" label="操作" width="300">
          <template v-slot="scope">
            <!--编辑-->
              <el-button type="primary" size="small" :icon="Edit" @click="editRolesDialog(scope.row.id)">编辑</el-button>
            <!--删除-->
              <el-button type="danger" size="small" :icon="Delete" @click="deleteRoles(scope.row.id)">删除</el-button>
            <!--分配角色-->
              <el-button type="warning" size="small" :icon="Setting" @click="showSetRightDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 新增角色 -->
      <el-dialog v-model="rolesFormVisible" title="新增角色" @close="rolesDialogClosed(rolesFormRef)">
        <el-form
          ref="rolesFormRef"
          :model="rolesForm"
          :rules="rolesFormRules"
          label-width="90px"
        >
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="rolesForm.roleName" />
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="rolesForm.roleDesc" />
          </el-form-item>
          <!--        按钮区域-->
          <el-form-item>
            <el-button type="primary" @click="addRolesForm(rolesFormRef)">提交</el-button>
            <el-button @click="resetForm(rolesFormRef)">重置</el-button>
            <el-button @click="rolesFormVisible = false">关闭</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <!-- 编辑角色 -->
      <el-dialog v-model="editRolesFormVisible" title="新增角色" @close="editRolesDialogClosed(editRolesFormRef)">
        <el-form
          ref="editRolesFormRef"
          :model="editRolesFormData"
          :rules="rolesFormRules"
          label-width="90px"
        >
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="editRolesFormData.roleName" disabled />
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="editRolesFormData.roleDesc" />
          </el-form-item>
          <!--        按钮区域-->
          <el-form-item>
            <el-button type="primary" @click="editRolesForm(editRolesFormRef)">提交</el-button>
            <el-button @click="editRolesFormVisible = false">关闭</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <!--权限分配-->
      <el-dialog
        v-model="setRightDialogVisible"
        title="分配权限"
        width="50%"
        @close="setRightDialogClose"
      >
        <el-tree
          :props="treeProps"
          :data="reghtData"
          show-checkbox
          node-key="id"
          default-expand-all
          :default-checked-keys="deftKey"
          ref="treeRef"
        />
        <template #footer>
      <span class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="ailotRights(treeRef)">确定</el-button>
      </span>
        </template>
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onBeforeMount, reactive } from 'vue'
import api from '@/axios/config'
const { CaretRight, Edit, Delete, Setting } = require('@element-plus/icons')

const { ElMessage, ElMessageBox } = require('element-plus')
const rolesList = ref()
// 新增角色相关参数
const rolesFormVisible = ref(false)
const rolesFormRef = ref()
const rolesForm = reactive({
  roleName: '',
  roleDesc: ''
})
// 编辑角色相关参数
const editRolesFormVisible = ref(false)
const editRolesFormRef = ref()
const editRolesFormData = ref()
const setRightDialogVisible = ref(false)
const reghtData = ref(Object)
const deftKey = reactive([])
const treeRef = ref()
const roleId = ref()

onBeforeMount(() => {
  getRolesList()
})

// 获取角色列表
const getRolesList = async () => {
  const { data: res } = await api.get('/roles')
  if (res.meta.status !== 200) return ElMessage.error(res.meta.msg)
  rolesList.value = res.data
}

const resetForm = (formEl) => {
  formEl.resetFields()
}

const rolesDialogClosed = (formEl) => {
  formEl.resetFields()
}

// 新增角色验证
const rolesFormRules = reactive({
  roleName: [
    { required: true, message: '角色名不能为空', trigger: 'blur' },
    { min: 2, max: 26, message: '角色名长度在 3 到 26个字符', trigger: 'blur' }
  ],
  roleDesc: [
    { required: true, message: '角色描述不能为空', trigger: 'blur' },
    { min: 2, max: 30, message: '角色名长度在 4 到 30个字符', trigger: 'blur' }
  ]
})

// 新增角色
const addRolesForm = (formEl) => {
  formEl.validate(async (valid, fields) => {
    if (!valid) return
    const { data: res } = await api.post('roles', rolesForm)
    if (res.meta.status !== 201) return ElMessage.error(res.meta.msg)
    ElMessage.success(res.meta.msg)
    rolesFormVisible.value = false
    getRolesList()
  })
}

// 编辑角色弹窗
const editRolesDialog = async (id) => {
  const { data: res } = await api.get('roles/' + id)
  if (res.meta.status !== 200) return ElMessage.error(res.meta.msg)
  editRolesFormData.value = res.data
  editRolesFormVisible.value = true
}

// 编辑角色弹窗关闭
const editRolesDialogClosed = (formEl) => {
  formEl.resetFields()
}

// 编辑角色提交
const editRolesForm = (formEl) => {
  formEl.validate(async (valid, fields) => {
    if (!valid) return
    const { data: res } = await api.put('roles/' + editRolesFormData.value.roleId, {
      roleName: editRolesFormData.value.roleName, roleDesc: editRolesFormData.value.roleDesc
    })
    if (res.meta.status !== 200) return ElMessage.error(res.meta.msg)
    ElMessage.success(res.meta.msg)
    editRolesFormVisible.value = false
    getRolesList()
  })
}

// 删除角色
const deleteRoles = (id) => {
  ElMessageBox.confirm(
    '是否删除该角色?',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  )
    .then(async () => {
      const { data: res } = await api.delete('roles/' + id)
      if (res.meta.status !== 200) return ElMessage.error(res.meta.msg)
      ElMessage.success(res.meta.msg)
      getRolesList()
    })
    .catch(() => {
      getRolesList()
      ElMessage.info('未执行删除操作')
    })
}

// 删除权限
const removeRolesById = (role, rightId) => {
  ElMessageBox.confirm(
    '是否删除该权限?',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  )
    .then(async () => {
      const { data: res } = await api.delete(`roles/${role.id}/state/${rightId}`)
      if (res.meta.status !== 200) return ElMessage.error(res.meta.msg)
      ElMessage.success(res.meta.msg)
      role.children = res.data
    })
    .catch(() => {
      ElMessage.info('未执行删除操作')
    })
}
// 分配权限
const treeProps = {
  label: 'authName',
  children: 'children'
}

const showSetRightDialog = async (role) => {
  roleId.value = role.id
  const { data: res } = await api.get('rights/tree')
  if (res.meta.status !== 200) return ElMessage.error(res.meta.msg)
  reghtData.value = res.data
  getLeafKeys(role, deftKey)
  setRightDialogVisible.value = true
}

const getLeafKeys = (node, arr) => {
  if (!node.children) {
    return arr.push(node.id)
  }
  node.children.forEach(item => getLeafKeys(item, arr))
}

const setRightDialogClose = () => {
  deftKey.length = []
}

const ailotRights = async (treeRef) => {
  const keys = [
    ...treeRef.getCheckedKeys(),
    ...treeRef.getHalfCheckedKeys()
  ]
  const idDtr = keys.join(',')
  const { data: res } = await api.post(`roles/${roleId.value}/rights`, { rids: idDtr })
  if (res.meta.status !== 200) return ElMessage.error(res.meta.msg)
  ElMessage.success(res.meta.msg)
  setRightDialogVisible.value = false
  getRolesList()
}
</script>

<style lang="less" scoped>
.el-tag{
  margin: 7px;
}

.bdtop{
  border-top: 1px solid #eeeeee;
}

.bdbottom {
  border-bottom: 1px solid #eeeeee;
}

.vceter{
  display: flex;
  align-items: center;
}
</style>
