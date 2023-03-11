<template>
  <div>
    <div class="header">
      <h3>创建试卷</h3>
    </div>
    <el-form :model="addFrom"
    ref="ruleFormRef"
    :rules="rules"
    >
      <el-form-item>
        <div class="stepe">
          <span>1</span>
          <span>基本信息</span>
        </div>
      </el-form-item>
      <el-form-item prop="title" class="inputBox">
        <div class="itemInput">
          <span>考试名称：</span>
          <el-input v-model="addFrom.title" clearable />
        </div>
      </el-form-item>
      <el-form-item>
        <div class="stepe">
          <span>2</span>
          <span>内容设置</span>
        </div>
      </el-form-item>
      <el-form-item >
        <!-- 试卷内容考试列表 -->
        <div class="content">
          <div class="titBox">
            <span style="height: 50px; line-height: 50px;">试卷内容：</span>
            <div class="left_list" v-if="questionsType.length">
              <div  v-for="(item,index) in questionsType" :key="index"  >
                <div class="left_item" v-if="item.const>0">
                <p style="font-size: 13px; color: #848484; margin-bottom: 10px;">{{item.type}}<span>{{item.const}}</span> 道</p>
                <div class="item_detail">
                  <span>每题</span>
                  <el-input v-model="item.score"></el-input>
                  <span>分</span>
                </div>
              </div>
              </div>
            </div>
          </div>

          <div class="list">
            <div class="top">
              <h4>试题列表</h4>
              <div class="right">
                <span style="margin: 0px 20px">总分:{{ scores }}</span>
                <span>已添加{{ addFrom.questions.length }}题</span>
                <el-button @click="empty">清空</el-button>
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
                    <el-icon size="25px" @click="compile(item,index)"><EditPen /></el-icon>
                    <el-icon size="25px" @click="itemDel(index)"><Delete /></el-icon>
                  </div>
                </div>
                <p v-if="item.type==='填空题'" v-html="getReplace(item.title)"   style="margin-left: 20px;line-height: 30px;"></p>
                <p v-else  v-html="item.title" style="margin-left: 20px"></p>
                <el-radio-group v-if="item.type === '单选题'">
                    <el-radio v-for="(itemr, indexr) in item.answers" :key="indexr" :label="itemr.answerno+'：'+itemr.content"  :style="item.answer===itemr.answerno? 'background-color: #eefaf6; width: 100%;':''"
                      ></el-radio
                    >
                    <!-- :label="itemr.answerno+itemr.content"  -->
                </el-radio-group>
                <el-checkbox-group
                  v-if="item.type === '多选题'"
                >
                  <div v-for="(itemr, indexr) in item.answers" :key="indexr">
                    <el-checkbox :label="itemr.answerno" :style="item.answer.includes(itemr.answerno)? 'background-color: #eefaf6; width: 100%; margin:3px 0px':' margin:3px 0px'"
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
                  {{ item.answer}}
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
            <div class="btn">

              <el-button @click="compile(0,-1)">添加题目</el-button>
              <el-button @click="bulkImport">批量导入</el-button>
              <el-button @click="importDatabase">从题库中导入</el-button>
            </div>
          </div>
        </div>
        <!-- 试题存入题库 -->
        <div class="bank">
          <span>试题存入题库 :</span>
          <el-select
            v-model="addFrom.databaseid"
            placeholder="请选择题库"
            class="m-2"
          
          >
            <el-option
              v-for="item in baseList"
              :key="item.id"
              :label="item.title"
              :value="item.id"
            />
          </el-select>
          <el-button @click="establish">+创建试题库</el-button>
        </div>
      </el-form-item>
      <el-form-item >
        <div class="stepe">
          <span>4</span>
          <span>教师范围</span>
        </div>
      </el-form-item>
      <el-form-item >
        <div class="itemInput">
          <span>可见老师：</span>
          <el-badge :value="addFrom.limits.length" class="item" type="primary">
            <el-button @click="teacherDialog">+ 选择</el-button>
          </el-badge>
        </div>
      </el-form-item>
      <el-form-item>
        <div class="footer">
          <el-button type="primary" @click="submitForm(ruleFormRef)">提交</el-button>
          <el-button @click="cancel">取消</el-button>
        </div>
      </el-form-item>
    </el-form>
   
  </div>
   <!-- 添加试题抽屉 -->
   <Drawer
      v-if="drawerShow"
      @drawerEmit="drawerEmit"
      @showEmit="showEmit"
      :compileData="compileData"
    ></Drawer>
    <!-- 可见老师穿梭框 -->
    <Transfer v-if="teacherDialogisShow" @showEmit="showEmit" :title="title" @transferEmit="transferEmit"/> <!-- 可见老师 -->
    <!-- 批量导入 -->
    <Import v-if="inportShow" @showEmit="showEmit" @subjectEmit="subjectEmit"></Import>
    <!-- 创建试题库 -->
    <Database  v-if="databaseShow" @showEmit="showEmit"></Database>
    <!-- 从题库中引入 -->
    <DatabaseTab v-if="databaseTabShow"  @showEmit="showEmit" @questionList="questionList"></DatabaseTab>
    <!-- 题目列表 -->
    <Question v-if="questionShow" :databaseData="databaseData" @questionsEmit="questionsEmit" @qushowEmit="qushowEmit"></Question>
</template>

<script lang="ts" setup>
import Question from '../../../components/subject/QuestionDialog.vue'//题目列表
import DatabaseTab from '../../../components/database/DatabaseTabDialog.vue'//从题库引入
import Database from '../../../components/subject/SubDatabaseDialog.vue'//创建题库
import Import from '../../../components/subject/ImporDialog.vue'//批量导入
import Drawer from '../../../components/subject/SubjectDrawer.vue';//创建试卷
import Transfer from '../../../components/subject/TransferDialog.vue';//可见老师+选择
import { reactive, toRefs, onMounted, computed,watch,toRaw,ref } from 'vue';
import { useRouter,useRoute } from 'vue-router';
import { databaseList,AddSubject,oneSubject } from '../../../api/subjects';
import { ElMessage, ElMessageBox } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus'
const ruleFormRef = ref<FormInstance>()
const route=useRoute()

// console.log('添加试卷接收id',route.query.id);

const title=ref() //弹框的标题
const teacherDialogisShow=ref(false) //是否显示弹框  学生，老师，阅卷老师
const teacherDialog=()=>{//可见老师
  teacherDialogisShow.value=true
  title.value='可见老师'
}

const router=useRouter()
interface Ishow{
  drawerShow:boolean,
  tranferShow:boolean,
  inportShow:boolean,
  databaseShow:boolean,
  databaseTabShow:boolean,
  questionShow:boolean
}
const show:Ishow=reactive({
  drawerShow:false, //控制抽屉显示隐藏
  tranferShow:false,//控制弹框显示隐藏
  inportShow:false,//控制批量导入隐藏
  databaseShow:false,//控制创建试题库显示隐藏
  databaseTabShow:false,//控制题库列表显示隐藏
  questionShow:false,//控制题目列表显示隐藏
})
const {drawerShow,tranferShow,inportShow,databaseShow,databaseTabShow,questionShow}=toRefs(show)

interface Iadd {
  	admin:string;
  answershow:number;
  aorder:number;
  begintime:string;
  databaseid:string;
  endtime:string;
  id:number;
  info:string;
  limits: Array<any>;
  limittime:string;
  markteachers:Array<any>;
  pastscores:number
  qorder:number
  questions: Array<any>;
  scores: number,
  state: null,
  students:  Array<any>
  title: string;  
}
interface Idata {
  oneIndex:number
  addFrom: Iadd;
  baseList: Array<any>;
  selectValue: string;
  scores: number;
  itemType: Array<any>;
  questionsType:Array<any>
  compileData:any
  databaseData:object
}
const data: Idata = reactive({
  // 添加数据
  addFrom: {
    admin:'ldq',
    answershow: 1,
    aorder: 0,
    begintime: "",
    databaseid: '',
    endtime:"",
    id: 0,
    info: "",
    isshow: 1,
    limits: [], //穿梭框数据
    limittime:"",
    markteachers: [],
    pastscores: 60,
    qorder: 0,
    questions: [], //接收题目列表数据
    scores: 100,
    state: null,
    students: [],
    title:'', //考试名称 

    
  },
  selectValue: '', //下拉框
  baseList: [], //题库列表
  compileData:{},//编辑数据详情
  oneIndex:0,//单条编辑下标
  scores: 0, //总分
  itemType:[],//左侧展示题目类型，题量
  questionsType:[{type:'单选题',const:0},{type:'多选题',const:0},{type:'判断题',const:0},{type:'填空题',const:0},{type:'问答题',const:0}],
  databaseData:{},//题库
});
const { addFrom, baseList,itemType,questionsType,selectValue,compileData,databaseData } = toRefs(data);
// 表单验证
const rules = reactive<FormRules>({
  title: [
    { required: true, message: '请输入考试名称', trigger: 'blur' },
  ]
})
//获取题目类型和数量
const getQuseType=()=>{
  questionsType.value.forEach(item=>{
  item.const= addFrom.value.questions.filter(it=>it.type===item.type).length
  })
  // console.log(222,questionsType.value); 
}
// 填空题替换方法
const getReplace=(str:any)=>{
  console.log('填空题括号',str);
  
  return  str.replaceAll('[]','_______,')

}
// 试卷类型事件监听
watch(() =>addFrom.value.questions ,(newVal,oldVal)=>{
  getQuseType()
},{deep:true,immediate:true})
// 获取题库列表
const getDatabaseList = async () => {
  const res: any = await databaseList().catch(() => {});
  // console.log('题库列表', res);
  if (res.errCode !== 10000) {
    return false;
  }
  baseList.value = res.data.list;
};
// 触发自定义事件接收添加题目传值
const drawerEmit = (data: any) => {

  console.log('接收子组件题目传值', data);
  if(data.type==='多选题'){
    data.answer=data.checkList.join('|')
  }
  if(data.type==='填空题'){
    // data.title=data.title.replaceAll('[]','_______,')
    data.answer=data.answer.replaceAll('|',",")
  }
  // console.log(data);
  if(data.oneIndex===-1){
    addFrom.value.questions.push(data);
  }else{
    addFrom.value.questions[data.oneIndex]={...data}
  }
  

  // console.log('接收题目数据', addFrom.value.questions);
};
// 接收子组件数据控制组件显示隐藏
const showEmit = (data: any) => {  
  tranferShow.value = data;
  drawerShow.value = data;
  inportShow.value = data;
  databaseShow.value=data
  databaseTabShow.value=data
  teacherDialogisShow.value=data


};
// 题目组件自定义事件传控制显示隐藏
const qushowEmit=(data: any)=>{
  questionShow.value=data
}
// 点击接收题目组件传值
const questionsEmit=(data: any)=>{
  console.log('接收题库题目传值',data);
  addFrom.value.questions=[...addFrom.value.questions,...JSON.parse(JSON.stringify(data))]

}
// 点击事件单条编辑
const compile=(data:any,index:number)=>{
  // console.log('点击编辑',data,index);
  compileData.value={...data,oneIndex:index}
  // console.log('单条编辑',compileData.value);
  
  drawerShow.value=true
  
// console.log(2222,compileData.value);

}


// 触发自定义事件接收批量导入试卷列表
const subjectEmit=(obj: any)=>{
  addFrom.value.questions=[...addFrom.value.questions,...JSON.parse(JSON.stringify(obj))]
  // console.log('接受批量导入',addFrom.value.questions);
}

// 触发自定义事件接收子组件穿梭框数据
const transferEmit = (val: any) => {
  console.log('接收穿梭框数据', val);
  if(val){
    val.arr.forEach((item: any)=>{ 
      addFrom.value.limits.push({id:item})
    })
  }
};
// 点击取消
const cancel=()=>{
 router.go(-1)
  
};
// 计算总分
const scores = computed(() => {
  return addFrom.value.questions.reduce((pive, next) => {
    return pive + parseInt(next.scores);
  }, 0);
});

// 点击删除
const itemDel=(index: any)=>{
  ElMessageBox.confirm(
    '是否确认删除?',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      addFrom.value.questions.splice(index,1)
      ElMessage({
        type: 'success',
        message: '删除成功',
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消删除',
      })
    })
}

// // 点击提交
// const submit=async ()=>{
//   // console.log('点击提交',addFrom.value);

  
  
// }
// 点击提交
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async(valid, fields) => {
    if (valid) {
      if(addFrom.value.questions.length===0){
        ElMessage.error('请添加题目')
        return false
      }
      if(!addFrom.value.databaseid){
        ElMessage.error('请选择题库')
        return false
      }
      if(addFrom.value.limits.length===0){
        ElMessage.error('请选择可见老师')
        return false
      }
      const res:any=await AddSubject(addFrom.value).catch(()=>{})
  // console.log('提交',res);
  if(res.errCode!==10000){
    ElMessage.error(res.errMsg)
    return false
  }
  ElMessage.success('添加成功')
  router.push('/subjects')
      console.log('submit!')
    } else {
      console.log('error submit!', fields)
    }
  })
}
// 点击批量导入
const bulkImport=()=>{
  inportShow.value=true

}
onMounted(() => {
  getDatabaseList();
  getQuseType()
  getOneData()

});
// 获取单条数据详情
const getOneData=async()=>{
  if(route.query.id){
    console.log(111111111);
    const res:any=await oneSubject({id:route.query.id}).catch(()=>{})
    console.log('单条数据试卷详情',res);
    if(res.errCode!==10000){
      return false
    }
    Object.assign(addFrom.value,res.data)  
  }
}
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
// 点击清空题目列表
const empty=()=>{
  ElMessageBox.confirm(
    '是否确认清空试题列表?',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      addFrom.value.questions=[]
      ElMessage({
        type: 'success',
        message: '已清空数据列表',
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消',
      })
    })
}
// 监听左侧数据变化
watch(()=>questionsType.value,(newVal)=>{

if(newVal){
  let res=newVal.filter(item=>item.score!==null)
  res.forEach(ite=>{
    addFrom.value.questions.forEach(datalist=>{
      if(ite.type===datalist.type){
        datalist.scores=ite.score?ite.score:datalist.scores
      }
    })
}

)}

},{deep:true,immediate:true})
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
  /deep/.el-form-item__content{
    display: flex;
  }
  .itemInput {
    width: 60%;
    margin-left: 10%;
    span:nth-of-type(1) {
      margin: 0px 10px;
    }

   

  }
  .content {
    width: 100%;
    display: flex;
    margin-left: 8%;
    position: relative;
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
    .left_item {
      width: 100%;
      height: 80px;
      padding: 5px;
      border: 1px solid rgb(159, 158, 158);
    }
    span:nth-of-type(1) {
      margin: 0px 10px;
    }
    // background-color: aqua;
    .list {
      width: 70%;
      margin-left: 10px;
      // height: 110px;
      border: 1px solid rgb(159, 158, 158);
      .btn {
        line-height: 56px;
        .el-button:nth-of-type(1) {
          margin-left: 20px;
        }
      }
      .top {
        display: flex;
        justify-content: space-between;
        height: 50px;
        line-height: 50px;
        box-shadow: -1px 1px rgb(198, 197, 197);
        border-bottom: 1px solid rgb(159, 158, 158);
        h4 {
          font-size: 16px;
          font-weight: normal;
          margin-left: 20px;
        }
        .right {
          span {
            color: #90909e;
          }
          .el-button {
            width: 60px;
            margin: 0px 20px;
          }
        }
      }
    }
  }
  .bank {
    width: 100%;
    display: flex;
    margin-left: 8%;
    margin-top: 20px;
    .el-input {
      width: 180px;
      margin: 0px 20px;
    }
  }
  .footer {
    margin-left: 17%;
    margin-top: 30px;
  }
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
.el-checkbox-group {
  margin-left: 20px;
}
.el-radio-group {
  display: block;
  margin-left: 20px;
  span:nth-of-type(1) {
    margin-right: 10px;
  }
}
/deep/.el-form .content span:nth-of-type(1) {
  margin: 0px;
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
// 验证信息提示
/deep/.el-form-item__error{
  margin-left: 20%;
}
.el-radio-group[data-v-b461af89] {
  display: flex;
    flex-direction: column;
    align-items: flex-start;
}
</style>
