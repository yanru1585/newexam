<template>
  <div>
    <el-drawer
      v-model="drawer"
      title="I am the title"
      size="50%"
      :with-header="false"
      :close-on-click-modal="false"
    >
      <span class="title">试题添加</span>
      <el-form :model="addForm" label-width="120px">
        <el-form-item>
          <el-radio-group v-model="addForm.radio">
            <el-radio label="1">单选题</el-radio>
            <el-radio label="2">多选题</el-radio>
            <el-radio label="3">判断题</el-radio>
            <el-radio label="4">填空题</el-radio>
            <el-radio label="5">问答题</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="题干">
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
              v-model="valueHtml"
              :defaultConfig="editorConfig"
              mode="default"
              @onCreated="handleCreated"
            />
          </div>
        </el-form-item>
        <el-form-item label="选项" v-if="addForm.radio < '3'">
          <div class="option">
            <div class="item" v-for="(item, index) in optionArr" :key="index">
              <span>{{ item }}:</span>
              <el-input v-model="addForm.desc" type="textarea" />
              <el-icon size="26px" @click="dele"><CircleClose /></el-icon>
            </div>
          </div>
          <el-icon class="add" @click="add"><CirclePlus /></el-icon>
        </el-form-item>
        <el-form-item label="正确答案" v-if="addForm.radio < '4'">
          <el-radio-group
            v-model="addForm.trueradio"
            v-if="addForm.radio === '1'"
          >
            <el-radio
              v-for="(item, index) in optionArr"
              :key="index"
              :label="item"
            />
          </el-radio-group>
          <el-checkbox-group
            v-model="addForm.checkList"
            v-if="addForm.radio === '2'"
          >
            <el-checkbox
              v-for="(item, index) in optionArr"
              :key="index"
              :label="item"
            />
          </el-checkbox-group>
          <el-radio-group v-model="addForm.judge" v-if="addForm.radio === '3'">
            <el-radio-button label="正确" />
            <el-radio-button label="错误" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="解析"  v-if="addForm.radio >'3'">
          <el-input type="textarea" style="width: 100%" v-model="addForm.name"  />
        </el-form-item>
        <el-form-item label="分值">
          <el-input style="width: 100px" v-model="addForm.name" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary">保存</el-button>
          <el-button>保存并继续</el-button>
          <el-button>取消</el-button>
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
  defineExpose,
  reactive,
  toRefs,
} from 'vue';
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';

const drawer = ref(true);
defineExpose({
  drawer,
});
interface IaddForm {
  name: String;
  radio: String;
  desc: String;
  trueradio: String;
  checkList: Array<any>;
  judge: String;
}
interface Idata {
  addForm: IaddForm;
  optionArr: Array<any>;
  num: any;
}
const data: Idata = reactive({
  addForm: {
    name: '',
    radio: '1', //题型单选
    desc: '', //
    trueradio: '', //单选框答案
    checkList: [], //复选框答案
    judge: '', //判断
  },
  optionArr: ['A', 'B', 'C', 'D'],
  num: 69,
});
const { addForm, optionArr } = toRefs(data);
// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef();

// 内容 HTML
const valueHtml = ref('<p>hello</p>');

// 模拟 ajax 异步获取内容
onMounted(() => {
  setTimeout(() => {
    valueHtml.value = '<p>模拟 Ajax 异步设置内容</p>';
  }, 1500);
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

// 点击添加选项数据
const add = () => {
  optionArr.value.push(String.fromCharCode(data.num++));
  // console.log(String.fromCharCode(65));
};
// 点击删除选项
const dele = () => {
  optionArr.value.pop();
};
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
