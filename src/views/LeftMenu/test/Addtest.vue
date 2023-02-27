<template>
  <div class="bot">
    <h3>创建考试</h3>
    <!-- 基本信息 -->
    <div class="box">
      <p class="first">1</p>
      <p class="information">基本信息</p>
    </div>
    <el-form :model="addFrom" label-width="120px">
      <el-form-item
        label="考试名称:"
        style="margin-left: 60px; padding: 10px 0px"
      >
        <el-input v-model="addFrom.title" />
      </el-form-item>
      <el-form-item label="考试说明:" style="margin-left: 60px">
        <el-input v-model="addFrom.info" type="textarea" style="width: 300px" />
      </el-form-item>
      <!-- </el-form> -->
      <!-- 内容设置 -->
      <div class="box">
        <p class="first">2</p>
        <p class="information">内容设置</p>
      </div>
      <!-- 内容布局 -->
      <div class="content">
        <div class="left" style="margin-top: 10px;">
          <span>考试内容:</span>
          <div class="titBox" style="margin-top: 10px;">
          <div class="left_list" v-if="questionsType.length">
              <div  v-for="(item,index) in questionsType" :key="index"  >
                <div class="lefts_item" v-if="item.const>0">
                <p style="font-size: 13px; color: #848484; margin-bottom: 10px;">{{item.type}}<span>{{item.const}}</span> 道</p>
                <div class="item_detail">
                  <span>每题</span>
                  <el-input></el-input>
                  <span>分</span>
                </div>
              </div>
              </div>
            </div>
            </div>
        </div>
        <div class="right">
            <div class="godTop">
              <h3 class="lefts">试题列表</h3>
              <div class="god">
                <span>总分：0</span>
                <span>已添加：0题</span>
                <button type="button"><span>清空</span></button>
              </div>
            </div>
          <!-- 添加题目展示 -->
          <div class="sublist" v-if="addFrom.questions.length">
            <div
              class="list_item"
              v-for="(item, index) in addFrom.questions"
              :key="index"
            >
              <div class="item_tit">
                <div class="tit_left">
                  <span>{{ index + 1 }}.</span>
                  <span>{{ item.type }}</span>
                  <span>分值</span>
                  <el-input v-model="item.scores"></el-input>
                </div>
                <div class="tit_right">
                  <el-icon size="25px" @click="compile(item, index)"
                    ><EditPen
                  /></el-icon>
                  <el-icon size="25px" @click="itemDel(index)"
                    ><Delete
                  /></el-icon>
                </div>
              </div>
              <p v-html="item.title" style="margin-left: 20px"></p>
              <el-radio-group
                v-model="item.answer"
                v-if="item.type === '单选题'"
              >
                <div v-for="(itemr, indexr) in item.answers" :key="indexr">
                  <el-radio :label="itemr.answerno"
                    :style="item.answer.includes(itemr.answerno)? 'background-color: #eefaf6; width: 100%;': ''"><span>{{ itemr.answerno }}:</span
                    >{{ itemr.content }}</el-radio
                  >
                </div>
              </el-radio-group>
              <el-checkbox-group
                v-model="item.checkList"
                v-if="item.type === '多选题'"
              >
                <div v-for="(itemr, indexr) in item.answers" :key="indexr">
                  <el-checkbox
                    :label="itemr.answerno"
                    :style="item.answer.includes(itemr.answerno)? 'background-color: #eefaf6; width: 100%; margin:3px 0px': ' margin:3px 0px' "
                    ><span>{{ itemr.answerno }}:</span
                    >{{ itemr.content }}</el-checkbox
                  >
                </div>
              </el-checkbox-group>
              <div
                class="judgeBox"
                v-if="item.type === '判断题' || item.type === '填空题'"
              >
                <span>正确答案</span>
                {{ item.judge }}
              </div>
              <div
                class="analyBox"
                v-if="item.type === '填空题' || item.type === '问答题'"
              >
                <span>答案解析:</span>
                {{ item.analysis }}
              </div>
            </div>
          </div>
          <div class="buttons">
            <el-button @click="addSubject" style="margin: 10px">添加题目</el-button >
            <el-button  style="margin: 10px" @click="bulkImport">批量导入</el-button>
            <el-button  style="margin: 10px" @click="importDatabase">从题库导入</el-button>
            <el-button  style="margin: 10px">选择已有试卷</el-button>
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
            <el-option v-for="item in baseList"
              :key="item.id"
              :label="item.title"
              :value="item.id" />
          </el-select>
        </el-form-item>
        <div>
          <el-button @click="establish" style="margin-left: 10px;">+创建试题库</el-button>
        </div>
      </div>
      <!-- 考试设置 -->
      <div class="box">
        <p class="first">3</p>
        <p class="information">考试设置</p>
      </div>
      <div class="lable">
        <div class="lefts">通过分数:</div>
        <div class="fen">
          <input type="number" v-model="addFrom.pastscores" placeholder="60" />
        </div>
      </div>
      <div class="examss">
        <div class="hour">考试时长:</div>
        <el-radio-group
          v-model="addFrom.isshow"
          style="margin-top: 5px; margin-left: 10px"
        >
          <el-radio label="0">不限时长</el-radio>
          <el-radio label="1">限时时长</el-radio>
        </el-radio-group>
        <div class="">
          <input type="number" v-model="addFrom.pastscores" placeholder="60" />
          <span>分钟</span>
        </div>
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
          v-model="addFrom.answershow"
          style="margin-top: 5px; margin-left: 10px"
        >
          <el-radio label="1">交卷后显示</el-radio>
          <el-radio label="2">不允许查看</el-radio>
          <el-radio label="3">仅可查看对错</el-radio>
          <el-radio label="4">仅查看对错</el-radio>
          <el-radio label="5">考试结束后查看</el-radio>
        </el-radio-group>
      </div>
      <div class="examss">
        <div class="hour">防作弊:</div>
        <el-checkbox-group
          v-model="checkList"
          style="margin-top: 10px; margin-left: 10px"
        >
          <el-checkbox label="0" >试题顺序打乱</el-checkbox>
          <el-checkbox label="1" >选项顺序打乱(单选题,多选题,判断题)</el-checkbox>
        </el-checkbox-group>
      </div>
      <div class="box">
        <p class="first">4</p>
        <p class="information">教师范围</p>
      </div>
      <div class="examss">
        <div class="hour">可见老师:</div>

        <el-badge :value="0" class="item" type="primary">
          <el-button style="margin-left: 10px; margin-top: 10px"
            >+选择</el-button
          >
        </el-badge>
      </div>
      <div class="box">
        <p class="first">5</p>
        <p class="information">考试学生</p>
      </div>
      <div class="examss">
        <div class="hour">考试范围:</div>

        <el-badge :value="0" class="item" type="primary">
          <el-button style="margin-left: 10px; margin-top: 10px"
            >+选择</el-button
          >
        </el-badge>
      </div>
      <div class="box">
        <p class="first">6</p>
        <p class="information">协同设置</p>
      </div>
      <div class="examss">
        <div class="hour">阅卷老师:</div>

        <el-badge :value="0" class="item" type="primary">
          <el-button style="margin-left: 10px; margin-top: 10px"
            >+选择</el-button
          >
        </el-badge>
      </div>
      <div class="buoot">
        <el-button>发布</el-button>
        <el-button type="primary">保存(不发布)</el-button>
        <el-button>取消</el-button>
      </div>
    </el-form>
  </div>
  <!-- 添加题目 -->
  <Drawer
    v-if="drawerShow"
    @showEmit="showEmit"
    @drawerEmit="drawerEmit"
    :compileData="compileData"
  ></Drawer>
  <!-- 批量导入 -->
  <Import v-if="inportShow" @showEmit="showEmit" @subjectEmit="subjectEmit"></Import>
    <!-- 创建试题库 -->
    <Database  v-if="databaseShow" @showEmit="showEmit"></Database>
    <!-- 从题库中引入 -->
    <DatabaseTab v-if="databaseTabShow"  @showEmit="showEmit" @questionList="questionList"></DatabaseTab>
     <!-- 题目列表 -->
     <Question v-if="questionShow" :databaseData="databaseData" @questionsEmit="questionsEmit" @qushowEmit="qushowEmit"></Question>
</template>

<script setup lang="ts">
import Question from '../../../components/subject/QuestionDialog.vue'//题目列表
import DatabaseTab from '../../../components/database/DatabaseTabDialog.vue'//从题库引入
import Database from '../../../components/subject/SubDatabaseDialog.vue'//创建题库
import Import from '../../../components/subject/ImporDialog.vue'//批量导入
import Drawer from '../../../components/subject/SubjectDrawer.vue';
import { ref, toRefs, reactive,watch,onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { databaseList,AddSubject,oneSubject } from '../../../api/subjects';
interface Ishow {
  drawerShow: boolean;
  tranferShow: boolean;
  inportShow: boolean;
  databaseShow: boolean;
  databaseTabShow:boolean,
  questionShow:boolean
}
interface Iadd {
  admin: string;
  answershow: number;
  aorder: number;
  begintime: string;
  databaseid: number;
  endtime: string;
  id: number;
  info: string;
  limits: Array<any>;
  limittime: string;
  markteachers: Array<any>;
  pastscores: number;
  qorder: number;
  questions: Array<any>;
  scores: number;
  state: null;
  students: Array<any>;
  title: string;
  isshow:number
}
interface ItestData {
  addFrom: Iadd;
  questionsType:Array<any>
  compileData:any
  baseList: Array<any>;
  databaseData:object
}
const testData: ItestData = reactive({
  // 添加数据
  addFrom: {
    admin: 'ldq',
    answershow: 0,//答案可见
    aorder: 0,//防作弊
    begintime: '',//开始时间
    databaseid: 20,//题库id
    endtime: '',//结束时间
    id: 0,
    info: '',//考试介绍
    isshow: 1,//限制时长
    limits: [], //可见老师
    limittime: '',//考试时长
    markteachers: [],//阅卷老师
    pastscores: 60,//通过分数
    qorder: 0,
    questions: [], //接收题目列表数据
    scores: 100,
    state: null,
    students: [],//学生可见
    title: '', //考试名称
  },
  questionsType:[{type:'单选题',const:0},{type:'多选题',const:0},{type:'判断题',const:0},{type:'填空题',const:0},{type:'问答题',const:0}],
  compileData:{},//编辑数据详情
  baseList: [], //题库列表
  databaseData:{},//题库
});
const { addFrom,questionsType,compileData,baseList ,databaseData} = toRefs(testData);
const show: Ishow = reactive({
  drawerShow: false, //控制抽屉显示隐藏
  tranferShow: false, //控制弹框显示隐藏
  inportShow: false, //控制批量导入隐藏
  databaseShow: false, //控制创建试题库显示隐藏
  databaseTabShow:false,//控制题库列表显示隐藏
  questionShow:false,//控制题目列表显示隐藏
});
const { drawerShow, tranferShow, inportShow, databaseShow,databaseTabShow,questionShow } = toRefs(show);
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
//获取题目类型和数量
const getQuseType=()=>{
  questionsType.value.forEach(item=>{
  item.const= addFrom.value.questions.filter(it=>it.type===item.type).length
  })
  console.log(222,questionsType.value); 
}
watch(() =>addFrom.value.questions ,(newVal,oldVal)=>{
  getQuseType()
},{deep:true,immediate:true})
// 接收子组件数据控制组件显示隐藏
const showEmit = (data: any) => {
  tranferShow.value = data;
  drawerShow.value = data;
  inportShow.value = data;
  databaseShow.value = data;
  databaseTabShow.value=data
};
// 题目组件自定义事件传控制显示隐藏
const qushowEmit=(data: any)=>{
  questionShow.value=data
}
// 点击添加题目
const addSubject = () => {
  console.log(2222);
  drawerShow.value = true;
};
// 点击事件单条编辑
const compile = (data: any, index: number) => {
    // console.log('点击编辑',data,index);
    compileData.value={...data,oneIndex:index}
    // console.log('单条编辑',compileData.value);
    drawerShow.value=true
  // console.log(2222,compileData.value);
};
// 点击删除
const itemDel = (index: any) => {
  ElMessageBox.confirm('是否确认删除?', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      addFrom.value.questions.splice(index, 1);
      ElMessage({
        type: 'success',
        message: '删除成功',
      });
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消删除',
      });
    });
};
// 触发自定义事件接收添加题目传值
const drawerEmit = (data: any) => {
  console.log('接收子组件题目传值', data);
  if (data.type === '多选题') {
    data.answer = data.checkList.join('|');
  }
  console.log(data);
  if (data.oneIndex === -1) {
    addFrom.value.questions.push(data);
  } else {
    addFrom.value.questions[data.oneIndex]=data
  }

  // console.log('接收题目数据', addFrom.value.questions);
};
// 点击批量导入
const bulkImport=()=>{
  inportShow.value=true
}
// 触发自定义事件接收批量导入试卷列表
const subjectEmit=(obj: any)=>{
  addFrom.value.questions=[...addFrom.value.questions,...JSON.parse(JSON.stringify(obj))]
  console.log('接受批量导入',addFrom.value.questions);
}
// 获取题库列表
const getDatabaseList = async () => {
  const res: any = await databaseList().catch(() => {});
  // console.log('题库列表', res);
  if (res.errCode !== 10000) {
    return false;
  }
  baseList.value = res.data.list;
};
// 点击创建试题库
const establish=()=>{
  console.log(111);
  
  databaseShow.value=true

}
// 点击从题库中引入
const importDatabase=()=>{
  databaseTabShow.value=true 
}
//触发自定义事件接收题库中数据传值
const questionList=(data: any)=>{
  console.log('接收题库传值',data);
  questionShow.value=true
  databaseData.value=data
}
// 点击接收题目组件传值
const questionsEmit=(data: any)=>{
  console.log('接收题库题目传值',data);
  addFrom.value.questions=[...addFrom.value.questions,...JSON.parse(JSON.stringify(data))]

}
onMounted(()=>{
  getDatabaseList()
})
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
  margin-left: 80px;
  display: flex;
}
.left {
  font-size: 15px;
  color: var(--el-text-color-regular);
  margin-right: 10px;
}
.lefts {
  margin-top: 10px;
  font-size: 15px;
  color: var(--el-text-color-regular);
}


.right {
  width: 80%;
  // margin-left: 20px;
  margin-top: 10px;
  border: 1px solid #dcdfe6;
  .godTop {
  width: 100%;
  border: 1px solid #dcdfe6;
  // display: flex;
  display: flex;
  justify-content: space-between;
  // border-bottom: 4px solid #dcdfe6;
}
  .buttons {
  width: 100%;
  border: 1px solid #dcdfe6;
  // padding: 10px;
}
.el-radio-group {
  display: block;
  margin-left: 20px;
  span:nth-of-type(1) {
    margin-right: 10px;
  }
}
.el-checkbox-group {
  margin-left: 20px;
}
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
.sublist {
  max-height: 500px;
  padding: 0px 10px;
  border-bottom: 1px solid rgb(159, 158, 158);
  display: block;
  overflow-y: scroll;

  .list_item {
    //每一项题目
    margin: 20px 0px;
  }
  .item_tit {
    display: flex;
    justify-content: space-between;

    .tit_left {
      margin-top: 10px;
      span:nth-of-type(3) {
        margin: 0px 10px;
      }
      .el-input {
        width: 60px;
      }
    }
    .tit_right {
      margin-top: 10px;
      .el-icon {
        color: #4290f7;
        margin: 0px 10px;
      }
    }
  }
}
.judgeBox {
  font-size: 15px;
  height: 50px;
  line-height: 50px;
  color: #5acda6;
  background-color: #eefaf6;
  margin: 10px;
  padding-left: 10px;
}
.analyBox {
  font-size: 15px;
  height: 50px;
  line-height: 50px;
  color: #9dadbc;
  background-color: #f5faff;
  margin: 10px;
  padding-left: 10px;
}
.titBox {
      width: 100px;
      margin-right: 10px;
      // padding: 10px;
      .item_detail{
        display: inline;
        font-size: 13px;
        color: #848484;
        .el-input{
          width: 50px;
          margin: 0px 5px;
        }
      }
    }
.lefts_item{
  width: 100%;
  height: 80px;
  padding: 5px;
  border: 1px solid rgb(159, 158, 158);
}
</style>
