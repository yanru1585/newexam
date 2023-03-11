<template>
  <el-drawer :title="data.name" size="50%">
    <el-form
      ref="ruleFormRef"
      :model="data"
      label-width="70px"
      class="demo-ruleForm"
      :size="formSize"
      status-icon
    >
      <div class="box" v-for="(item, index) in data.list" :key="index">
        <div v-if="item.type === '问答题'">
          <div class="top">
            <span>{{ index + 1 }}.{{ item.type }}</span>
            <span>分值：{{ item.scores }}</span>
          </div>
          <div class="issue">
            <span v-html="item.title"></span>
          </div>
          <div class="answer">
            <span>回答：</span>
          </div>
          <div class="answerr">
            <span>{{ item.studentanswer }}</span>
          </div>
          <div class="isNum">
            <el-form-item
              :rules="studentscores(item.scores)"
              label="打分"
              :prop="'list.' + index + '.studentscores'"
            >
              <el-input class="elinput" v-model="item.studentscores" />
            </el-form-item>
            <el-form-item label="批注">
              <el-input v-model="item.comments" type="textarea" />
            </el-form-item>
          </div>
        </div>
        <div v-if="item.type === '填空题'">
          <div class="top">
            <span>{{ index + 1 }}.{{ item.type }}</span>
            <span>分值：{{ item.scores }}</span>
          </div>
          <div class="issue">
            <span v-html="getReplace(item.title)"></span>
          </div>
          <div class="isNum">
            <el-form-item
              :rules="studentscores(item.scores)"
              label="打分"
              :prop="'list.' + index + '.studentscores'"
            >
              <el-input class="elinput" v-model="item.studentscores" />
            </el-form-item>
            <el-form-item label="批注">
              <el-input v-model="item.comments" type="textarea" />
            </el-form-item>
          </div>
        </div>
      </div>
      <div class="elbutton">
        <el-button type="primary" @click="submitForm(ruleFormRef)"
          >阅卷完毕</el-button
        >
        <el-button @click="cancel">取消</el-button>
      </div>
    </el-form>
  </el-drawer>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, defineProps } from 'vue';
import { IQuestion, IButton } from '../../../api/admin';

import type { FormInstance } from 'element-plus';
import { ElMessage } from 'element-plus';

const formSize = ref('default');
const ruleFormRef = ref<FormInstance>();
// 动态校验

const scopevalidator = (val: number, rule: any, value: any, callback: any) => {
  // console.log('value',value);
  if (isNaN(value)) {
    callback(new Error('请输入数字'));
  } else if (value === null || value === '') {
    callback(new Error('请输入分数'));
  } else if (value < 0 || value > val) {
    callback(new Error(`分数大于0小于${val}`));
  } else {
    callback();
  }
};
// const rules = reactive({
//   studentscores: [{ validator: scopevalidator.bind(this,), trigger: 'blur' },],
// });

const studentscores = (scope: number) => {
  return [{ validator: scopevalidator.bind(this, scope), trigger: 'blur' }];
};

// 抽屉

const a = defineProps({
  dda: {
    type: Object,
    required: true,
  },
  carr: {
    type: Function,
    required: true,
  },
});
// console.log(a.dda);

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
  let arr = data.list
  arr.map((item)=>{
    if(item.type==='填空题'){
      let arr1 = item.studentanswer.split('|')
      console.log(arr1);
      arr1.forEach((data:string)=>{
        // console.log(data);      
        item.title=item.title.replace(
          /\[\]/,
          `<input type="text" value="${data}" disabled style="width:90px;border:none;border-bottom:1px solid #b9b8b8;margin-left:10px"/>`
        )
      })
    } 
    return item   
  })
};


onMounted(() => {
  getIQuestion();
});
// 点击阅卷完毕
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(async (valid) => {
    if (valid) {
      let dat = data.list.map((item: any) => {
        return {
          answerid: item.answerid,
          scores: item.studentscores,
          comments: item.comments,
        };
      });
      let res: any = await IButton(dat);
      // console.log(res);
      if (res.errCode === 10000) {
        ElMessage({
          message: '阅卷完毕',
          type: 'success',
        });

        a.carr();
      }
    } else {
      ElMessage.error('有错误');
    }
  });
};
// 点击取消
const cancel = () => {
  ElMessage.error('取消阅卷了');
  a.carr();
};
// 填空题替换方法
const getReplace=(str:any)=>{
//   console.log('填空题括号',str);
  
  return  str.replaceAll('[]','_______,')

}
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
.elinput {
  width: 30%;
}
.elbutton {
  margin-top: 20px;
}
</style>
