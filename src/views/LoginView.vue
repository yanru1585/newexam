<template>
  <div class="boxlogin">
    <div class="login">
      <div class="img">
        <img src="../assets/images/1.png" alt="" />
      </div>
      <div class="biao" v-if="user">
        <div class="hw">
          <h2>考试系统</h2>
        </div>
        <div @click="user = !user">
          <img src="../assets/images/2.png" alt="" class="images" />
        </div>
      </div>
      <div v-if="user">
        <el-form
          ref="ruleFormRef"
          :model="loginData"
          :rules="rules"
          label-width="120px"
          class="demo-ruleForm"
          status-icon
        >
          <el-form-item prop="username">
            <el-input
              type="text"
              v-model="loginData.username"
              placeholder="用户名"
            />
          </el-form-item>
          <el-form-item prop="pass">
            <el-input
              type="password"
              v-model="loginData.pass"
              placeholder="请输入密码"
              show-password
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              class="Loginbutton"
              @click="submitForm(ruleFormRef)"
              >登录</el-button
            >
          </el-form-item>
          <el-form-item>
            <div class="user">
              <p class="username1">忘记密码</p>
            </div>
          </el-form-item>
        </el-form>
      </div>

      <div>
        <div class="biao" v-if="!user">
          <div class="hw">
            <h2>考试系统</h2>
          </div>
          <div @click="user = !user">
            <img src="../assets/images/3.png" alt="" class="imagess" />
          </div>
        </div>
        <div v-if="!user">
        <img src="../assets/images/4.png" alt="" class="code">
        <div class="wx">
          使用<span>微信</span>扫一扫进行登录
        </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {debounce}  from "../utils/throTtle"
import { reactive, ref, toRefs } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { Loginteach } from '../api/admin';
import { ElMessage } from 'element-plus';
import router from '../router';

const user = ref(true);

const ruleFormRef = ref<FormInstance>();
interface Ilogin {
  username: String;
  pass: String;
}
interface Irule {
  loginData: Ilogin;
}
const ruleForm = reactive({
  loginData: {
    username: 'lisi123',
    pass: 'lisi123',
  },
});
const { loginData } = toRefs(ruleForm);
const rules = reactive<FormRules>({
  username: [
    { required: true, message: '请输入账号', trigger: 'blur' },
    { min: 3, max: 15, message: '账号为3到15个字符', trigger: 'blur' },
  ],

  pass: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 3, max: 15, message: '密码为3到15个字符', trigger: 'blur' },
  ],

  // username: [{ required: true, message: '请输入账号', trigger: 'blur' },{ min: 3, max: 10, message: '账号为3到10个字符', trigger: 'blur' },],

  // pass: [{ required: true, message: '请输入密码', trigger: 'blur' },{ min: 3, max: 10, message: '密码为3到10个字符', trigger: 'blur' },],
});

// 点击登录
const submitForm =debounce ( async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      // console.log('submit!')
      const res = await Loginteach(
        loginData.value.username,
        loginData.value.pass
      );
      console.log('登录', res.data);
      if (res.errCode === 10000) {
        ElMessage({
          message: '登陆成功',
          type: 'success',
        });
        let menuUrl=res.data.menu.filter((item: { id: number; })=>item.id===1)
        console.log(22,menuUrl);
        
        sessionStorage.setItem('token', res.data.token); //存储token
        sessionStorage.setItem('menu', JSON.stringify(res.data.menu)); //存储菜单数据
        sessionStorage.setItem('model', JSON.stringify(res.data.model)); //存储管理员数据
        sessionStorage.setItem('type', res.data.type); //登录类型
        router.push(menuUrl[0].url);
      } else {
        ElMessage.error(res.errMsg);
      }
    } else {
      // console.log('error submit!', fields)
      ElMessage.error('请正确输入账号密码');
    }
  });
},500)
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
.username1 {
  color: cornflowerblue;
}
.img {
  margin-top: 50px;
}
.images {
  width: 60px;
}
.imagess {
  margin-right: 12px;
  width: 48px;
  height: 50px;
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
.code{
  width: 30%;
  height: 30%;
  margin-top: 30px;
}
.wx{
  margin-top: 50px;
}
.wx span{
  color: #0089ff;
}
</style>
