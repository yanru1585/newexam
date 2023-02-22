<template>
  <div>
    <div class="header">
      <h3>创建试卷</h3>
    </div>
    <el-form :model="addFrom">
      <el-form-item>
        <div class="stepe">
          <span>1</span>
          <span>基本信息</span>
        </div>
      </el-form-item>
      <el-form-item>
        <div class="itemInput">
          <span>考试名称：</span>
          <el-input v-model="addFrom.name" clearable />
        </div>
      </el-form-item>
      <el-form-item>
        <div class="stepe">
          <span>2</span>
          <span>内容设置</span>
        </div>
      </el-form-item>
      <el-form-item>
        <div class="content">
          <span>试卷内容：</span>
          <div></div>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { reactive, toRefs } from 'vue';

interface Iadd {
  name: String;
}
interface Idata {
  addFrom: Iadd;
}
const data: Idata = reactive({
  addFrom: {
    name: '', //考试名称
  },
});
const { addFrom } = toRefs(data);
</script>

<style lang="less" scoped>
h3 {
  font-size: 20px;
  color: rgb(33, 33, 33);
  font-weight: normal;
}
/deep/.el-step__title {
  color: black;
}
.stepe {
  width: 100%;
  height: 50px;
  background-color: #f9faff;
  display: flex;

  span:nth-of-type(1) {
    font-size: 38px;
    color: rgb(199, 231, 232);
    margin: 0px 20px;
    height: 50px;
    line-height: 50px;
  }
  span:nth-of-type(2) {
    display: block;
    font-size: 16px;
    height: 50px;
    line-height: 50px;
  }
}
/deep/.el-form {
  width: 100%;
  margin-top: 20px;
  .el-input {
    width: 300px;
  }
  .itemInput {
    width: 60%;
    margin-left: 10%;
    span:nth-of-type(1) {
      margin: 0px 10px;
    }
  }
  .content{
    width: 100%;
    height: 500px;
    // background-color: aqua;
  }
}
</style>
