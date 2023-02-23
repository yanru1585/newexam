<template>
  <el-drawer v-model="drawer" :title="data.name" size="50%">
    <div class="box" v-for="(item,index) in data.list" :key="index">
      <div class="top">
        <span>1.{{ item.type }}</span>
        <span>分值：{{ item.scores }}</span>
      </div>
      <div class="issue">
        <span>{{ item.title }}</span>
      </div>
      <div class="answer">
        <span>回答：</span>
      </div>
      <div class="answerr">
        <span>{{ item.studentanswer }}</span>
      </div>
      <div class="isNum">
        <el-form
          ref="ruleFormRef"
          :model="data"
          :rules="rules"
          label-width="70px"
          class="demo-ruleForm"
          :size="formSize"
          status-icon
        >
          <el-form-item :rules="rules.name"  label="打分" :prop="'data.list'+index+'studentscores'">
            <el-input class="elinput" v-model="item.studentscores" />
          </el-form-item>
          <el-form-item label="批注">
            <el-input v-model="item.comments" type="textarea" />
          </el-form-item>
        </el-form>
      </div>

    </div>
    <div class="elbutton">
        <el-button type="primary" @click="submitForm(ruleFormRef)">阅卷完毕</el-button>
        <el-button>取消</el-button>
      </div>
  </el-drawer>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, defineProps } from 'vue';
import { IQuestion } from '../../../api/admin';

import type { FormInstance, FormRules } from 'element-plus';

const formSize = ref('default');
const ruleFormRef = ref<FormInstance>();
// 动态校验
// const scopeValidator = (rule: any, value: any, callback: any) => {

//   let max = 9
//   //  console.log('value',value);
//   //  if(!value){
//   //    callback(new Error('请输入分数'))
//   //  }else if(value<0 || value>max){
//   callback(new Error(`分数大于0小于${max}`))
//   //  }else{
//   //    callback()
//   //  }
// }
const scopeValidator = (rule: any, value: any, callback: any) => {
  let max = 9
  callback(new Error(`分数必须大于0小于${max}`))
}
const rules = reactive({
  name: [
    { validator:scopeValidator, trigger: 'blur' },
  ],
});
// 点击阅卷完毕
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      console.log('submit!')
    } else {
      console.log('error submit!')
      return false
    }
  })
}
// 抽屉
const a = defineProps({
  dda: {
    type: Object,
    required: true,
  },
});
const drawer = ref(true);

// 渲染数据
interface Iquestion {
  testid: any;
  studentid: any;
  list: Array<any>;
  name: any;
}
const data: Iquestion = reactive({
  testid: a.dda.ids, //第二个页面传过来的id
  studentid: a.dda.id, //第一个页面传的id
  list: [], //声明的数组用来渲染
  name: a.dda.name, //第二个页面传的名称
});
// 获取列表
const getIQuestion = async () => {
  const res = await IQuestion(data.studentid, data.testid);
  console.log(res);
  data.list = res.data.list;
};
onMounted(() => {
  getIQuestion();
});

</script>

<style scoped>
.box {
  width: 100%;
  margin-top: 20px;
}
.top {
  height: 50px;
  line-height: 50px;
}
.top span:nth-child(2) {
  margin-left: 20px;
  color: #c7c2b1;
  font-size: 14px;
}
/* 问题 */
.issue {
  height: 50px;
  line-height: 50px;
}
/* 回答 */
.answer {
  height: 50px;
  line-height: 50px;
}
/* 答案 */
.answerr {
  height: 100px;
}
.isNum {
  width: 100%;
  padding: 15 0;
  background-color: #fafafa;
  border-bottom: #c7c2b1 1px solid;
}
/* 打分的输入框 */
.elinput{
  width: 30%;
}
.elbutton{
  margin-top: 20px;
}
</style>
