<template>
  <div>
    <el-drawer
      v-model="drawer"
      size="50%"
      :with-header="false"
      :close-on-click-modal="false"
    >
      <span class="title">试题添加</span>
      <el-form :model="addForm" label-width="120px" ref="ruleFormRef" :rules="rules">
        <el-form-item>
          <el-radio-group v-model="addForm.type">
            <el-radio label="单选题">单选题</el-radio>
            <el-radio label="多选题">多选题</el-radio>
            <el-radio label="判断题">判断题</el-radio>
            <el-radio label="填空题">填空题</el-radio>
            <el-radio label="问答题">问答题</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="题干" >
          <!-- 富文本编辑器 -->
          <div style="border: 1px solid #ccc">
            <Toolbar
              style="border-bottom: 1px solid #ccc"
              :editor="editorRef"
              :defaultConfig="toolbarConfig"
              mode="default"
            />
            <Editor
              style="height: 300px; overflow-y: hidden"
              v-model="addForm.title"
              :defaultConfig="editorConfig"
              mode="default"
              @onCreated="handleCreated"
            />
          </div>
        </el-form-item>
        <el-form-item label="选项" v-if="addForm.type === '单选题'||addForm.type === '多选题'" >
          <div class="option">
            <div class="item" v-for="(item, index) in addForm.answers" :key="index">
              <span>{{ item.answerno }}:</span>
              <el-input  v-model="item.content" type="textarea" />
              <el-icon size="26px" @click="dele"><CircleClose /></el-icon>
            </div>
          </div>
          <el-icon class="add" @click="add"><CirclePlus /></el-icon>
        </el-form-item>
        <el-form-item label="正确答案" v-if="addForm.type !== '填空题'&&addForm.type !== '问答题'">
          <el-radio-group
            v-model="addForm.answer"
            v-if="addForm.type === '单选题'"
          >
            <el-radio
              v-for="(item, index) in addForm.answers"
              :key="index"
              :label="item.answerno"
            />
          </el-radio-group>
          <el-checkbox-group
            v-model="addForm.checkList"
            v-if="addForm.type === '多选题'"
          >
            <el-checkbox
              v-for="(item, index) in addForm.answers"
              :key="index"
              :label="item.answerno"
            />
          </el-checkbox-group>
          <el-radio-group v-model="addForm.judge" v-if="addForm.type === '判断题'">
            <el-radio-button label="正确" />
            <el-radio-button label="错误" />
          </el-radio-group>
        </el-form-item> 
        <el-form-item label="解析"  v-if="addForm.type ==='填空题' || addForm.type ==='问答题'">
          <el-input type="textarea" style="width: 100%" v-model="addForm.analysis"  />
        </el-form-item>
        <el-form-item label="分值" prop="scores">
          <el-input style="width: 100px" v-model="addForm.scores" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm(ruleFormRef)">保存</el-button>
          <el-button>保存并继续</el-button>
          <el-button  @click="cancelForm">取消</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import '@wangeditor/editor/dist/css/style.css'; // 引入 css
import {
  onBeforeUnmount,
  ref,
  shallowRef,
  onMounted,
  reactive,
  toRefs,
  defineEmits
} from 'vue';
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
import { ElMessage, FormInstance, FormRules } from 'element-plus'
const ruleFormRef = ref<FormInstance>()
// const drawer = ref(true);
const emit=defineEmits(['drawerEmit','showEmit'])
interface IaddForm {
  scores: string;
  radio: string;
  answer: string;
  checkList: Array<any>;
  judge: string;
  title:string;
  answers:Array<any>
  type:string;
  analysis:string

}
interface Idata {
  addForm: IaddForm;

  drawer:string
}
const data: Idata = reactive({
  drawer:'',
  addForm: {
    type:'单选题',//题型
    scores: '',//分值
    radio: '1', //题型单选
    answer: '', //单选框答案
    checkList: [], //复选框答案
    judge: '', //判断
    title:'<p>hello</p>',//富文本数据，题干
    answers: [//选项数组数据数组
    {answerno:'A',content:''},
    {answerno:'B',content:''},
    {answerno:'C',content:''},
    {answerno:'D',content:''},
  ],
  analysis:'',//解析
  },
});
const { addForm ,drawer} = toRefs(data);
// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef();

// 模拟 ajax 异步获取内容
onMounted(() => {
  setTimeout(() => {
    addForm.value.title = '<p></p>';
  }, 500);
});

const toolbarConfig = {};
const editorConfig = { placeholder: '请输入内容...' };

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.destroy();
});

const handleCreated = (editor: any) => {
  editorRef.value = editor; // 记录 editor 实例，重要！
};
//验证
const rules = reactive<FormRules>({
  scores: [
  {
      required: true,
      message: '请输入分值',
      trigger: 'blur',
    },
  ],

})
// 点击添加选项数据
const add = () => {
  let num=65+addForm.value.answers.length
  console.log(555,num);
  let optionData={
    
    answerno:String.fromCharCode(num++),
    content:''
  }
  addForm.value.answers.push(optionData);
};
// 点击删除选项
const dele = () => {
  addForm.value.answers.pop();
};
// 点击取消
const cancelForm=()=>{
  emit('showEmit',false)
}
// 点击保存
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log('submit!')
      if(addForm.value.type==='单选题'||addForm.value.type==='多选题'){
        addForm.value.answers.forEach(item=>{
          if(!item.content){
            ElMessage.error('选项内容必填')
            return false
          }
        })
        
      }
       if(addForm.value.type==='单选题'){
        if(!addForm.value.answer){
            ElMessage.error('正确答案必填')
            return false
          }
      }
       if(addForm.value.type==='多选题'){
        if(addForm.value.checkList.length===0){
            ElMessage.error('正确答案必填')
            return false
          }
      }
      if(addForm.value.type==='判断题'){
        if(!addForm.value.judge){
            ElMessage.error('正确答案必填')
            return false
          }
      }
      emit('drawerEmit',{...addForm.value})
      emit('showEmit',false)
      // drawer.value=false
    } else {
      console.log('error submit!', fields)
    }
  })
}
</script>

<style lang="less" scoped>
.title {
  font-size: 18px;
}
.el-textarea {
  width: 60%;
}
.option {
  width: 100%;
}
.item {
  display: flex;
  line-height: 50px;
  margin-top: 10px;
  span {
    color: rgb(97, 97, 97);
    font-size: 20px;
    display: block;
    width: 20px;
    text-align: center;
    margin: 0px 10px;
  }
  .el-icon {
    margin-top: 15px;
    color: rgb(249, 115, 115);
    margin-left: 10px;
  }
}
.add {
  font-size: 30px;
  color: #48a2ff;
  margin: 20px 0px 0px 30px;
}
</style>
