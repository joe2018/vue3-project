 <template>
  <div class="login_container">
    <div class="login_box">
<!--      图表区域-->
      <div class="avatar_box">
        <img src="../../assets/logo.png" alt="">
      </div>
      <div class="login_title">供应链电商管理平台</div>
<!--      登入表单区域-->
      <el-form ref="loginFormRef" :model="form" :rules="loginFormRules" class="login_form">
<!--        用户名-->
        <el-form-item prop="username">
          <el-input
            size="large"
            placeholder="请输入用户名"
            :prefix-icon="Avatar"
            v-model="form.username"
          >
          </el-input>
        </el-form-item>
<!--        密码-->
        <el-form-item prop="password">
          <el-input
            size="large"
            placeholder="请输入密码"
            :prefix-icon="Lock"
            v-model="form.password"
            type="password"
          >
          </el-input>
        </el-form-item>
<!--        按钮区域-->
        <el-form-item class="btns">
          <el-button type="primary"  @click=submitForm(loginFormRef)>登入</el-button>
          <el-button @click= resetLoginForm(loginFormRef) >重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import {
  Lock,
  Avatar
} from '@element-plus/icons-vue'
import { reactive, ref } from 'vue'
import api from '@/axios/config'

const { ElMessage } = require('element-plus')

const loginFormRef = ref('')

const form = reactive({
  username: 'admin',
  password: '123456'
})

const loginFormRules = {
  username: [
    { required: true, message: '用户名不可为空', trigger: 'blur' },
    { min: 3, max: 11, message: '用户名长度在3-11位之间', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '密码不可为空', trigger: 'blur' },
    { min: 3, max: 12, message: '密码长度在3-12位之间', trigger: 'blur' }
  ]
}

const submitForm = (formEl) => {
  if (!formEl) return
  formEl.validate(async (valid, fields) => {
    if (valid) {
      const { data: res } = await api.post('login', form)
      if (res.meta.status !== 200) return ElMessage.error(res.meta.msg)
      ElMessage({
        message: res.meta.msg,
        type: 'success'
      })
      window.sessionStorage.setItem('token', res.data.token)
      await window.router.push('/home')
    } else {
      ElMessage.error('提交错误')
    }
  })
}

const resetLoginForm = (formEl) => {
  if (!formEl) return
  formEl.resetFields()
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>

.login_container{
  height: 100%;
  background-image: url("../../assets/bg.57383432.png");
}
.login_box{
  width: 385px;
  height: 385px;
  border-radius: 10px;
  position: absolute;
  left: 80%;
  top: 50%;
  transform: translate(-60%,-50%);
  box-shadow: 0 0 10px #2b4b6b;
  background-color: #ffffff;

  .avatar_box{
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 5px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%,-50%);
    background-color: #ffffff;
    img{
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eeeeee;
    }
  }
}
.login_title{
  text-align: left;
  font-size: 22px;
  margin-bottom: 58px;
  font-weight: 700;
  color: #007fe1;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 30%;
}
.login_form{
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
  top: 45%;
}
.btns{
  display: flex;
  justify-content: flex-end;
  transform: translate(32%);
}

</style>
