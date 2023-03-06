<template>
  <div>
    <el-drawer
      v-model="table"
      title="添加试题"
      direction="rtl"
      size="50%"
      :before-close="handleClose"
    >
      <div style="margin-left: -40px; margin-top: -20px">
        <!-- 类型 -->
        <el-radio-group
          style="margin-bottom: 20px; margin-left: 60px"
          v-model="addData.type"
        >
          <el-radio
            v-for="(item, index) in testType"
            :key="index"
            :label="item.type"
            >{{ item.type }}</el-radio
          >
        </el-radio-group>

        <el-form
          ref="ruleFormRef"
          :model="addData"
          :rules="rules"
          label-width="120px"
          class="demo-ruleForm"
          :size="formSize"
          status-icon
        >
          <el-form-item label="题干" prop="title">
            <div style="border: 1px solid #ccc">
              <Toolbar
                style="border-bottom: 1px solid #ccc"
                :editor="editorRef"
                :defaultConfig="toolbarConfig"
                :mode="mode"
              />
              <Editor
                style="height: 200px; overflow-y: hidden"
                v-model="addData.title"
                :defaultConfig="editorConfig"
                :mode="mode"
                @onCreated="handleCreated"
                @customUpload="onCustomUpload"
                @onBlur="handleBlur"
                ref="wangeditorRef"
              />
            </div>
          </el-form-item>
          <el-form-item
            v-if="addData.type == '单选题' || addData.type == '多选题'"
            label="选项"
            prop="content"
          >
            <div class="tab">
              <div v-for="(item, index) in addData.answers" class="tab_item">
                <span>{{ item.answerno }}:</span>
                <el-input
                  v-model="item.content"
                  :rows="1"
                  :cols="55"
                  type="textarea"
                  style="margin: 10px 10px"
                />
                <el-icon :size="20" style="color: red" @click="delTab"
                  ><CircleClose
                /></el-icon>
              </div>
              <el-icon
                :size="30"
                style="color: #4290f7; margin-left: 30px; margin-top: 5px"
                @click="addTab"
                ><CirclePlus
              /></el-icon>
            </div>
          </el-form-item>
          <el-form-item
            v-if="addData.type == '单选题'"
            label="正确答案"
            prop="content"
          >
            <el-radio-group
              style="margin-bottom: 20px"
              v-model="addData.answer"
            >
              <el-radio
                :label="item.answerno"
                v-for="(item, index) in addData.answers"
                >{{ item.answerno }}</el-radio
              >
            </el-radio-group>
          </el-form-item>
          <el-form-item
            v-if="addData.type == '多选题'"
            label="正确答案"
            prop="content"
          >
            <el-checkbox-group v-model="checkList">
              <el-checkbox
                :label="item.answerno"
                v-for="(item, index) in addData.answers"
              />
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="正确答案" v-if="addData.type == '判断题'">
            <el-radio-group v-model="correct">
              <el-radio-button :label="'正确'" />
              <el-radio-button :label="'错误'" />
            </el-radio-group>
          </el-form-item>
          <el-form-item
            label="解析"
            v-if="addData.type == '填空题' || addData.type == '问答题'"
          >
            <el-input
              v-model="addData.explains"
              :rows="2"
              :cols="30"
              type="textarea"
              style="margin: 10px 10px"
            />
          </el-form-item>
          <el-form-item label="分值" prop="scores">
            <el-input-number
              v-model="addData.scores"
              controls-position="right"
              :min="1"
            />
          </el-form-item>
        </el-form>
      </div>
      <div style="display: flex; justify-content: center">
        <span class="dialog-footer">
          <el-button type="primary" @click="confirm">保存</el-button>
          <el-button @click="cancelAndcontinue">保存并继续</el-button>
          <el-button @click="cancel"> 取消 </el-button>
        </span>
      </div>
    </el-drawer>
  </div>
</template>

<script lang="ts" setup>
import { databasequestionAdd } from '../../api/database';
import { reactive, ref, toRefs } from 'vue';
import { ElDrawer, ElMessageBox } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
import { ElMessage } from 'element-plus';
import { onBeforeUnmount, shallowRef, onMounted, nextTick, watch } from 'vue';
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
import '@wangeditor/editor/dist/css/style.css'; // 引入 css
import { useRoute } from 'vue-router';
const route=useRoute()

const emit = defineEmits(['update:value', 'blur', 'closeDrawer']);

const props = defineProps({
  getList: {
    type: Function,
    required: true,
  },
  questionData:{
    type:Object,
    
  }
});

// 多选 答案
const checkList = ref([]);
// 判断 答案
const correct = ref('');

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef();
// 内容 HTML
const valueHtml = ref('');
console.log(valueHtml.value);

// 配置内容
const mode = ref('simple'); // 'default' 或者 'simple'
const toolbarConfig = {
  excludeKeys: [
    'insertVideo',
    'insertTable',
    'fullScreen',
    'undo',
    'redo',
    'todo',
  ],
};
const editorConfig: any = {
  placeholder: '请输入内容...',
  MENU_CONF: {},
};
editorConfig.MENU_CONF['uploadImage'] = {
  base64LimitSize: 5 * 1024 * 1024,
};

const handleBlur = () => {
  emit('blur');
};

const onCustomUpload = () => {};
const handleCreated = (editor: any) => {
  editorRef.value = editor; // 记录 editor 实例，重要！
};
// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.destroy();
});
watch(valueHtml, (n) => {
  emit('update:value', n);
});

const formSize = ref('default');
const ruleFormRef = ref<FormInstance>();

const rules = reactive<FormRules>({
  title: [
    { required: true, message: '请输入题干', trigger: 'blur' },
    // { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' },
  ],
  content: [
    // { required: true, message: '请输入题干', trigger: 'blur' }
  ],
  scores: [{ required: true, message: '请输入分值', trigger: 'blur' }],
});

interface IaddData {
  id: number,
  databaseid: any;
  title: string;
  type: string;
  answer: string;
  tags: string;
  explains: string;
  scores: number;
  answers: Array<any>;
}
interface Idata {
  testType: Array<any>;
}
const addData: IaddData = reactive({
  id: 0,
  databaseid:route.query.id,
  title: '',
  type: '单选题',
  answer: '',
  tags: '',
  explains: '', //解析
  scores: 1,
  answers: [
    {
      answerno: 'A',
      content: '',
    },
    {
      answerno: 'B',
      content: '',
    },
    {
      answerno: 'C',
      content: '',
    },
    {
      answerno: 'D',
      content: '',
    },
  ],
});
const data: Idata = reactive({
  testType: [
    { type: '单选题', id: 1 },
    { type: '多选题', id: 2 },
    { type: '判断题', id: 3 },
    { type: '填空题', id: 4 },
    { type: '问答题', id: 5 },
  ],
});

const { testType } = toRefs(data);
const { answers } = toRefs(addData);

let timer;
const table = ref(true);
const dialog = ref(false);
const loading = ref(false);

const handleClose = (done: any) => {
  if (loading.value) {
    return;
  }
  ElMessageBox.confirm('你确定要关闭吗?')
    .then(() => {
      loading.value = true;
      timer = setTimeout(() => {
        emit('closeDrawer', false);
        // done();
        // 动画关闭需要一定的时间
        setTimeout(() => {
          loading.value = false;
        }, 400);
      }, 500);
    })
    .catch(() => {
      // catch error
    });
};

// 点击删除一行选项
const delTab = () => {
  console.log(1131);
  addData.answers.pop();
};

// 点击添加一行选项
const addTab = () => {
  let arrNum = 65 + addData.answers.length;
  if (addData.answers.length < 26) {
    let tabData = {
      answerno: String.fromCharCode(arrNum++),
      content: '',
    };
    console.log(tabData);
    addData.answers.push(tabData);
    console.log(addData.answers);
  } else {
    ElMessage('没有更多选项了');
    return false;
  }
};
watch(()=>props.questionData,(newVal,oldVal)=>{
  console.log('编辑新数据',newVal);
  if(newVal){
    Object.assign(addData,newVal)
    if(newVal.answer){
      checkList.value=newVal.answer.split('|')
    }
    console.log(2222,newVal.answer);
    
    // checkList.value=newVal.answer.join('|')
  }
  

},{deep:true,immediate:true})
// 点击保存
const confirm = async () => {
  trueAdd()
  emit('closeDrawer', false);

};
// 点击保存并继续
const cancelAndcontinue = () => {
  trueAdd()
addData.title=''
addData.type='单选题'
addData.explains=''
addData.answers.map((item:any)=>{
  return item.content=''
})
// addData.title=''
};

const trueAdd=async()=>{
  if (addData.type == '多选题') {
    addData.answer = checkList.value.join('|');
  }
  if (addData.type == '判断题') {
    addData.answer = correct.value;
  }
  if (!addData.title) {
    ElMessage('题干必填！');
    return false;
  }
  if (addData.type == '单选题' || addData.type == '多选题') {
    addData.answers.filter((item: any) => {
      if (!item.content) {
        ElMessage('请填写所有选项！');
        return false;
      }
      return false;
    });
  }
  if(addData.type == '单选题' || addData.type == '多选题'||addData.type == '判断题'){
    if (!addData.answer) {
      ElMessage('正确答案必填！');
      return false;
    }
    if (addData.type == '多选题' && addData.answer.length < 3) {
      ElMessage('正确答案至少两项！');
      return false;
    }
  }
  if(addData.id===0){
    let res: any = await databasequestionAdd(addData);
  console.log('添加题库试题', res);
  if (res.errCode !== 10000) {
    ElMessage.error('添加失败！');
    return false;
  }
  ElMessage({
    message: '添加成功！',
    type: 'success',
  });
  }else{
    let res: any = await databasequestionAdd(addData);
  console.log('添加题库试题', res);
  if (res.errCode !== 10000) {
    ElMessage.error('编辑失败！');
    return false;
  }
  ElMessage({
    message: '编辑成功！',
    type: 'success',
  });
  }
 
  console.log(addData);
  props.getList();
}

// 点击取消
const cancel = () => {
  emit('closeDrawer', false);
};
</script>

<style lang="less" scoped>
.tab {
  .tab_item {
    display: flex;
    align-items: center;
  }
}
</style>
