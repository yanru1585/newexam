
<template>
  <div class="boxlogin">
    <div class="login">
      <div class="img">
        <img src="../assets/images/1.png" alt="" />
      </div>
      <div class="biao">
        <div class="hw">
          <h2>考试系统</h2>
        </div>
        <div>
          <img src="../assets/images/2.png" alt="" class="images" />
        </div>
      </div>
      <div>
        <el-form
          ref="ruleFormRef"
          :model="ruleForm"
          :rules="rules"
          label-width="120px"
          class="demo-ruleForm"
          status-icon
        >
          <el-form-item prop="username">
            <el-input
              type="text"
              v-model="ruleForm.username"
              placeholder="用户名"
            />
          </el-form-item>
          <el-form-item prop="username">
            <el-input
              type="password"
              v-model="ruleForm.pass"
              placeholder="请输入密码"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="Loginbutton"  @click="Login"
              >登录</el-button
            >
          </el-form-item>
          <el-form-item>
            <div class="user">
              <p class="username">忘记密码</p>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { Loginteach } from '../api/admin';
import { ElMessage } from 'element-plus';
import router from '../router';

const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive({
  username: '',
  pass: '',
});
const rules = reactive<FormRules>({
  username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
});

// 老师登录
const Login = async () => {
  const res = await Loginteach(ruleForm.username, ruleForm.pass);
  console.log(res);
  if (res.errCode === 10000) {
    ElMessage({
      message: '登陆成功',
      type: 'success',
    });
    sessionStorage.setItem('token',res.data)
  } else {
    ElMessage.error(res.errMsg);
  }
};
</script>

<style scoped>
.boxlogin {
  width: 100%;
  height: 93.3vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
.login {
  width: 500px;
  height: 500px;
  text-align: center;
  box-shadow: 0 6px 32px -7px #1d66bd29;
}
.login p {
  margin-bottom: 20px;
}
.el-input {
  width: 65%;
}
.Loginbutton {
  width: 65%;
}
.user {
  width: 100%;
}
.username {
  color: cornflowerblue;
  font-size: 16px;
}
.img {
  margin-top: 50px;
}
.images {
  width: 60px;
}
.biao {
  display: flex;
  align-items: center;
}
.hw {
  margin: auto;
}
.hw h2 {
  margin-left: 60px;
}
</style>

