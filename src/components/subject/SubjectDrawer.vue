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
        <el-form-item label="题干" prop="title">
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
              <el-input  v-model="item.content" type="textarea"  size="small" class="put" />
              <el-icon size="20px" @click="dele"><CircleClose /></el-icon>
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
          <el-radio-group v-model="addForm.answer" v-if="addForm.type === '判断题'">
            <el-radio-button label="正确" />
            <el-radio-button label="错误" />
          </el-radio-group>
        </el-form-item> 
        <el-form-item label="正确答案"   v-if="addForm.type ==='填空题'&&filling.length>0">
          <el-input v-for="item in filling" v-model="item.cont" style="margin: 5px 0px;"  type="textarea"  size="small" class="put" />
        </el-form-item>
        <el-form-item label="解析"  v-if="addForm.type ==='填空题' || addForm.type ==='问答题'">
          <el-input type="textarea" style="width: 100%" v-model="addForm.analysis"  />
        </el-form-item>

        <el-form-item label="分值" prop="scores">
          <el-input style="width: 100px" v-model="addForm.scores" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm(ruleFormRef)">保存</el-button>
          <el-button @click="submitGo(ruleFormRef)">保存并继续</el-button>
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
  defineEmits,
  defineProps,
  watch
} from 'vue';
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
import { ElMessage, FormInstance, FormRules } from 'element-plus';

const ruleFormRef = ref<FormInstance>()
const props=defineProps({
  compileData:{
    type:Object,
  }
})
// const drawer = ref(true);
const emit=defineEmits(['drawerEmit','showEmit'])
interface IaddForm {
  oneIndex:number;
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
  filling:Array<any>
  addForm: IaddForm;
  newAddForm: IaddForm;

  drawer:string
}
const data: Idata = reactive({
  filling:[],
  drawer:'',
  addForm: {
    oneIndex:-1,
    type:'单选题',//题型
    scores: '',//分值
    radio: '1', //题型单选
    answer: '', //正确答案
    checkList: [], //复选框答案
    judge: '', //
    title:'<p></p>',//富文本数据，题干
    answers: [//选项数组数据数组
    {answerno:'A',content:''},
    {answerno:'B',content:''},
    {answerno:'C',content:''},
    {answerno:'D',content:''},
  ],
  analysis:'',//解析
  },
  newAddForm: {
    oneIndex:-1,
    type:'单选题',//题型
    scores: '',//分值
    radio: '1', //题型单选
    answer: '', //单选框答案
    checkList: [], //复选框答案
    judge: '', //判断
    title:'<p></p>',//富文本数据，题干
    answers: [//选项数组数据数组
    {answerno:'A',content:''},
    {answerno:'B',content:''},
    {answerno:'C',content:''},
    {answerno:'D',content:''},
  ],
  analysis:'',//解析
  },
});
const { addForm ,drawer,newAddForm,filling} = toRefs(data);
// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef();

// 模拟 ajax 异步获取内容
onMounted(() => {
  // setTimeout(() => {
  //   addForm.value.title = '<p></p>';
  // }, 500);
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
  { required: true, message: "分值为数字", trigger: "blur" },
 { pattern: /^[0-9]*.?[0-9]{1,2}?$/ , message: '分值为数字', trigger: "blur"}
  ],

})
// console.log(777,props.compileData);

// 点击添加选项数据
const add = () => {
  let num=65+addForm.value.answers.length
  // console.log(555,num);
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
console.log(addForm.value);

  if (!formEl) return
  await formEl.validate((valid, fields) => {
    // console.log(addForm.value.title ); 
    if (valid) {
      if(addForm.value.title === '<p><br></p>' || addForm.value.title .includes(' &nbsp;') || addForm.value.title === '<p></p>'){
        return ElMessage.error('请输入题目内容')
      }
      // console.log('submit!')
      if(addForm.value.type==='单选题'||addForm.value.type==='多选题'){
       let arr= addForm.value.answers.filter(item=>{
        if(!item.content){
          return item
        }
       })
       if(arr.length!==0){
        ElMessage.error('请输入选项内容')
        return false
       }
        // console.log(444,arr)
      }
      // console.log(2222);
      
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
      if(addForm.value.type==='填空题'){
        addForm.value.answer=filling.value.map(item=>item.cont).join('|')
      }
      console.log(222222222,addForm.value.answer);
      
      // emit('drawerEmit',{...addForm.value})
      emit('drawerEmit',JSON.stringify(addForm.value))
      emit('showEmit',false)
      // drawer.value=false
    } else {
      // console.log('error submit!', fields)
    }
  })
}
// 点击保存并继续
const submitGo=async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    console.log(addForm.value.title );
    
    if (valid) {
      if(addForm.value.title === '<p><br></p>' || addForm.value.title .includes(' &nbsp;') || addForm.value.title === '<p></p>'){
        return ElMessage.error('请输入题目内容')
      }
      // console.log('submit!')
      if(addForm.value.type==='单选题'||addForm.value.type==='多选题'){
       let arr= addForm.value.answers.filter(item=>{
        if(!item.content){
          return item
        }
       })
       if(arr.length!==0){
        ElMessage.error('请输入选项内容')
        return false
       }
        // console.log(444,arr)
      }
      console.log(2222);
      
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
      console.log(222222222);
      
      emit('drawerEmit',{...addForm.value})
      Object.assign(addForm.value,newAddForm.value)
      // resetFields()
    } else {
      // console.log('error submit!', fields)
    }
  })
}
watch(
  [ () => props.compileData],
  (newValue, oldValue) => {
    // console.log('变化了', newValue);
    Object.assign(addForm.value,newValue[0])
    // console.log('变化了', addForm.value);
 
  },
  { immediate: true, deep: true }
);
watch(()=>addForm.value.title,(newVal,oldVal)=>{
  // console.log(newVal);
  filling.value=[]
 if(newVal){
  let num= newVal.match(/\[\]/g)
  if(num){
    // console.log(num.length);
    for (var i =0;i<num.length;i++){
      filling.value.push({cont:''})
    }
  }
 }


})
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
    // font-size: 20px;
    display: block;
    width: 20px;
    line-height:32px;
    text-align: center;
    margin: 0px 5px;
    font-size: var(--font-size);
  }
  .el-icon {
    margin-top: 10px;
    color: rgb(249, 115, 115);
    margin-left: 10px;
  }
}
.add {
  font-size: 30px;
  color: #48a2ff;
  margin: 20px 0px 0px 30px;
}
/deep/.el-textarea__inner{
  // width: 400px;
  // height: 34px;
  padding: 0px 0px;
}
.el-form-item{
  font-size: 14px;
}
</style>
