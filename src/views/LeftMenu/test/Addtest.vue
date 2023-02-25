<template>
  <div class="bot">
    <h3>创建考试</h3>
    <!-- 基本信息 -->
    <div class="box">
      <p class="first">1</p>
      <p class="information">基本信息</p>
    </div>
    <el-form :model="form" label-width="120px">
      <el-form-item
        label="考试名称:"
        style="margin-left: 60px; padding: 10px 0px"
      >
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="考试说明:" style="margin-left: 60px">
        <el-input v-model="form.desc" type="textarea" style="width: 300px" />
      </el-form-item>
    </el-form>
    <!-- </el-form> -->

    <!-- 内容设置 -->
    <div class="box">
      <p class="first">2</p>
      <p class="information">内容设置</p>
    </div>
    <!-- 内容布局 -->
    <div class="content">
      <div class="left">考试内容:</div>
      <div class="right">
        <div class="godrol">
          <div class="godTop">
            <h3 class="lefts">试题列表</h3>
            <div class="god">
              <span>总分：0</span>
              <span>已添加：0题</span>
              <button type="button"><span>清空</span></button>
            </div>
          </div>
        </div>
        <div class="buttons">
          <button class="butm" @click="isShowDrawer=true"><span class="buto">添加题目</span></button>
          <button class="butm"><span class="buto">批量导入</span></button>
          <button class="butm"><span class="buto">从题库导入</span></button>
          <button class="butm"><span class="buto">选择已有试卷</span></button>
        </div>
      </div>
    </div>
    <!-- 题库 -->
    <div class="subict">
      <el-form-item label="试题存入题库:">
        <el-select
          v-model="form.region"
          placeholder="请选择题库"
          style="margin-left: 10px"
        >
          <el-option label="Zone one" value="shanghai" />
          <el-option label="Zone two" value="beijing" />
        </el-select>
      </el-form-item>
      <div>
        <button class="butm"><span class="buto">+创建试题库</span></button>
      </div>
    </div>
    <!-- 考试设置 -->
    <div class="box">
      <p class="first">3</p>
      <p class="information">考试设置</p>
    </div>
    <div class="lable">
      <div class="lefts">通过人数:</div>
      <div class="fen">
        <input type="number" placeholder="60" />
      </div>
    </div>
    <div class="examss">
      <div class="hour">考试时长:</div>
      <el-radio-group
        v-model="radio"
        style="margin-top: 5px; margin-left: 10px"
      >
        <el-radio :label="3">不限时长</el-radio>
        <el-radio :label="6">限时时长</el-radio>
      </el-radio-group>
    </div>

    <div class="examss">
      <div class="hour">开放时间:</div>
      <div class="block">
        <el-date-picker
          v-model="value2"
          type="datetimerange"
          :shortcuts="shortcuts"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
        />
      </div>
      <span class="bu">不填表示永久</span>
    </div>
    <div class="examss">
      <div class="hour">答案解析:</div>
      <el-radio-group
        v-model="radio"
        style="margin-top: 5px; margin-left: 10px"
      >
        <el-radio :label="3">交卷后显示</el-radio>
        <el-radio :label="6">不允许查看</el-radio>
        <el-radio :label="9">仅可查看对错</el-radio>
        <el-radio :label="12">仅查看对错</el-radio>
        <el-radio :label="15">考试结束后查看</el-radio>
      </el-radio-group>
    </div>
    <div class="examss">
      <div class="hour">防作弊:</div>
      <el-checkbox-group
        v-model="checkList"
        style="margin-top: 10px; margin-left: 10px"
      >
        <el-checkbox label="试题顺序打乱" />
        <el-checkbox label="选项顺序打乱(单选题,多选题,判断题)" />
      </el-checkbox-group>
    </div>
    <div class="box">
      <p class="first">4</p>
      <p class="information">教师范围</p>
    </div>
    <div class="examss">
      <div class="hour">可见老师:</div>

      <el-badge :value="0" class="item" type="primary">
        <el-button style="margin-left: 10px; margin-top: 10px" @click="teacherDialog">+选择</el-button>
      </el-badge>
    </div>
    <div class="box">
      <p class="first">5</p>
      <p class="information">考试学生</p>
    </div>
    <div class="examss">
      <div class="hour">考试范围:</div>

      <el-badge :value="0" class="item" type="primary">
        <el-button style="margin-left: 10px; margin-top: 10px" @click="studentDialog">+选择</el-button>
      </el-badge>
    </div>
    <div class="box">
      <p class="first">6</p>
      <p class="information">协同设置</p>
    </div>
    <div class="examss">

      <div class="hour">阅卷老师:</div>

      <el-badge :value="0" class="item" type="primary">
        <el-button style="margin-left: 10px; margin-top: 10px" @click="readTeacherDialog">+选择</el-button>
      </el-badge>
    </div>
    <div class="buoot">
      <el-button>发布</el-button>
      <el-button type="primary">保存(不发布)</el-button>
      <el-button>取消</el-button>
    </div>
  </div>

  <SubjectDrawer v-if="isShowDrawer"/>
  <TransferDialog v-if="teacherDialogisShow" @showEmit="showEmit" :title="title"/> <!-- 可见老师 -->
</template>

<script setup lang="ts">
import TransferDialog from '../../../components/subject/TransferDialog.vue';
import SubjectDrawer from '../../../components/SubjectDrawer.vue';
import { reactive } from 'vue';
import { ref } from 'vue';
const form = reactive({
  name: '',
  region: '',
  date1: '',
  date2: '',
  delivery: false,
  type: [],
  resource: '',
  desc: '',
});

const isShowDrawer=ref(false)

const title=ref() //弹框的标题
const teacherDialogisShow=ref(false) //是否显示弹框  学生，老师，阅卷老师

const studentDialog=()=>{//学生
  teacherDialogisShow.value=true
  title.value='学生考试列表'
}

const teacherDialog=()=>{//可见老师
  teacherDialogisShow.value=true
  title.value='可见老师'
}

const readTeacherDialog=()=>{//阅卷老师
  teacherDialogisShow.value=true
  title.value='阅卷老师'
}

// 接收子组件传来的  关闭TransferDialog弹窗
const showEmit=(val:any)=>{
  teacherDialogisShow.value=val
}

//单选框
const radio = ref(3);
//多选框
const checkList = ref(['selected and disabled']);
//时间
const value1 = ref<[Date, Date]>([
  new Date(2000, 10, 10, 10, 10),
  new Date(2000, 10, 11, 10, 10),
]);
const value2 = ref('');

const shortcuts = [
  {
    text: '最近一周',
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
      return [start, end];
    },
  },
  {
    text: '最近一个月',
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
      return [start, end];
    },
  },
  {
    text: '最近三个月',
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
      return [start, end];
    },
  },

];


// 点击天机题目
const addSubject=()=>{
  
}
</script>

<style lang="less" scoped>
.box {
  display: flex;
  align-items: center;
  margin-top: 10px;
  background-color: #f9faff;
  padding: 5px 30px;
}
.first {
  font-size: 35px;
  color: #c7e5ff;
}
.information {
  font-size: 15px;
  padding: 10px;
}
.el-input {
  width: 300px;
}
.content {
  margin-top: 10px;
  margin-left: 100px;
  display: flex;
}
.left {
  font-size: 15px;
  color: var(--el-text-color-regular);
}
.lefts {
  margin-top: 10px;
  font-size: 15px;
  color: var(--el-text-color-regular);
}
.right {
  margin-left: 20px;
  margin-top: 10px;
}
.godTop {
  width: 1025px;
  border: 1px solid #dcdfe6;
  // display: flex;
  display: flex;
  justify-content: space-between;
  border-bottom: 4px solid #dcdfe6;
}
.buttons {
  width: 1025px;
  border: 1px solid #dcdfe6;
  padding: 10px;
}

.lefts {
  padding: 15px 15px;
}
.god {
  padding: 15px 15px;
}
.god span {
  color: var(--el-text-color-regular);
  padding: 0px 10px;
}
.subict {
  margin-top: 10px;
  margin-left: 60px;
  display: flex;
}
.lable {
  display: flex;
  margin-left: 80px;
  margin-top: 10px;
}
.fen {
  margin-top: 20px;
  width: 70px;
  color: #606266;
  height: 30px;
  background-color: #fff;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}
.fen input {
  padding: 0px 10px;
  text-align: center;
  margin-top: 6px;
  border: none;
  width: 40px;
}
.examss {
  display: flex;
  margin-left: 90px;
  margin-top: 10px;
  padding: 10px 0px;
}
.hour {
  margin-top: 10px;
  font-size: 15px;
  color: var(--el-text-color-regular);
}
.block {
  margin-left: 10px;
  margin-top: 7px;
}
.bu {
  font-size: 14px;
  line-height: 30px;
  color: #c3c3c3;
  margin-top: 7px;
  margin-left: 10px;
}
.buoot {
  margin: 20px;
  margin-left: 200px;
}
.butm {
  width: 100px;
  color: #606266;
  margin: 0px 10px;
  background-color: #fff;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  line-height: 30px;
}
.buto {
  font-size: 13px;
}
</style>
