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
         <!-- 试卷内容考试列表 -->
        <div class="content">
          <span>试卷内容：</span>
          <div class="list">
            <div class="top">
              <h4>考试列表</h4>
              <div class="right">
                <span>总分:0</span>
                <span>已添加0题</span>
                <el-button>清空</el-button>
              </div>
            </div>
            <!-- 添加题目展示 -->
            <div class="subjectlist" v-if="subjectList.length">
              <div class="list_item" v-for="(item,index) in subjectList" :key="index">
                <div class="item_tit">
                  <div class="tit_left">
                    <span>{{index+1}}.</span>
                    <span >{{item.type}}</span>
                    <span>分值</span>
                    <el-input v-model="item.scores"></el-input>
                  </div>
                  <div class="tit_right">
                    <el-icon size="25px"><EditPen /></el-icon>
                    <el-icon size="25px"><Delete /></el-icon>
                  </div>
                </div>
                  <p v-html="item.valueHtml" style="margin-left: 20px;"></p>
                  <el-radio-group v-model="item.trueradio" v-if="item.type==='单选题'">
                    <div v-for="(itemr,indexr) in item.optionArr" :key="indexr"><el-radio :label="itemr.tit"><span>{{ itemr.tit }}:</span>{{ itemr.center }}</el-radio>
                    </div>
                  </el-radio-group>
                  <el-checkbox-group v-model="item.checkList"  v-if="item.type==='多选题'">
                    <div v-for="(itemr,indexr) in item.optionArr" :key="indexr">
                      <el-checkbox :label="itemr.tit" ><span>{{ itemr.tit }}:</span>{{ itemr.center }}</el-checkbox>
                    </div>
                  </el-checkbox-group>
                  <div class="judgeBox" v-if="item.type==='判断题'|| item.type==='填空题'">
                    <span>正确答案</span>
                    {{ item.judge }}
                  </div>
                  <div class="analyBox" v-if="item.type==='填空题'||item.type==='问答题' ">
                    <span>答案解析:</span>
                    {{ item.analysis }}
                  </div>
              </div>
            </div>
            <div class="btn">
            <el-button @click="addSubject">添加题目</el-button>
            <el-button>批量导入</el-button>
            <el-button>从题库中导入</el-button>
            </div>
          </div>
        </div>
        <!-- 试题存入题库 -->
        <div class="bank">
          <span>试题存入题库 :</span>
          <el-select v-model="addFrom.selectValue" class="m-2" placeholder="请选择题库">
          <el-option
            v-for="item in baseList"
            :key="item.id"
            :label="item.title"
            :value="item.id"
          />
          </el-select>
          <el-button>+创建试题库</el-button>
        </div>
      </el-form-item>
      <el-form-item>
        <div class="stepe">
          <span>4</span>
          <span>教师范围</span>
        </div>
      </el-form-item>
      <el-form-item>
        <div class="itemInput">
          <span>可见老师：</span>
          <el-badge :value="transferArr.length" class="item" type="primary">
          <el-button @click="getSeleter">+ 选择</el-button>
        </el-badge>
        </div>
      </el-form-item>
      <el-form-item>
        <div class="footer">
          <el-button type="primary" >提交</el-button>
          <el-button >取消</el-button>
        </div>
    </el-form-item>
    </el-form>
    <!-- 添加试题抽屉 -->
    <Drawer ref="drawerRef" v-if="drawerShow" @drawerEmit="drawerEmit" @showEmit="showEmit"></Drawer>
    <!-- 可见老师穿梭框 -->
    <Transfer ref="transferRef" v-if="tranferShow" @transferEmit="transferEmit" @showEmit="showEmit"></Transfer>
  </div>
</template>

<script  lang="ts" setup >
import  Drawer from '../../../components/SubjectDrawer.vue'
import Transfer from '../../../components/TransferDialog.vue'
import { reactive, toRefs,onMounted,ref } from 'vue';
import{databaseList} from "../../../api/subjects"
<<<<<<< HEAD
import { fa } from 'element-plus/es/locale';
const drawerRef=ref<any>() 
=======

const drawerShow=ref<any>(false) //控制抽屉显示隐藏
const tranferShow=ref<any>(false) //控制弹框显示隐藏
// const drawerRef=ref<any>() 
const transferRef=ref()
>>>>>>> 48551c6ec7eecaa5a8425779574c5e191d1534b0
interface Iadd {
  name: string;
  selectValue:string
}
interface Idata {
  addFrom: Iadd;
  baseList:Array<any>;
  subjectList:Array<any>;
  transferArr:Array<any>;
}
const data: Idata = reactive({
  addFrom: {
    name: '', //考试名称
    selectValue:'',//下拉框
  },
  baseList:[],//题库列表
  subjectList:[],//接收题目列表数据
  transferArr:[],//穿梭框数据
});
const { addFrom,baseList,subjectList,transferArr } = toRefs(data);
// 点击添加题目
const addSubject=()=>{
  drawerShow.value=true
  // drawerRef.value.drawer=true
}


// 获取题库列表
const getDatabaseList= async()=>{
  const res:any=await databaseList().catch(()=>{})
  console.log('题库列表',res);
  if(res.errCode!==10000){
    return false
  }
  baseList.value=res.data.list
}
// 触发自定义事件接收添加题目传值
const drawerEmit=(data: any)=>{
  console.log('接收子组件题目传值',data);
  subjectList.value.push(data)
  console.log('接收题目数据',subjectList.value); 
}
// 接收子组件数据控制销毁
const showEmit=(data: any)=>{
  drawerShow.value=data
  tranferShow.value=data
  console.log('55555',data);
}
// 点击选择显示老师可见弹框
const getSeleter=()=>{
  tranferShow.value=true
}
// 触发自定义事件接收子组件穿梭框数据
const transferEmit=(val: any)=>{
  console.log('接收穿梭框数据',val);
  transferArr.value=[...val]
  console.log(transferArr.value.length);
  

}
onMounted(()=>{
  getDatabaseList()
})
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
    display: flex;
    margin-left: 10%;
    span:nth-of-type(1) {
      margin: 0px 10px;
    }
    // background-color: aqua;
    .list{
      width: 70%;
      // height: 110px;
      border: 1px solid rgb(159, 158, 158);
      .btn{
        line-height: 56px;
        .el-button:nth-of-type(1){
          margin-left: 20px;
        }
      }
      .top{
        display: flex;
        justify-content: space-between;
        height: 50px;
        line-height: 50px;
        box-shadow: -1px 1px rgb(198, 197, 197);
        border-bottom: 1px solid rgb(159, 158, 158);
        h4{
          font-size: 16px;
          font-weight: normal;
          margin-left: 20px;
        }
        .right{
          span{
            color: #90909e;
          }
          .el-button{
            width: 60px;
            margin: 0px 20px;
          }
        }
      }

    }
  }
  .bank{
    width: 100%;
    display: flex;
    margin-left: 7%;
    margin-top: 20px;
   .el-input {
      width: 180px;
      margin:0px  20px;
    }
    span{
      // margin: 0px 10px;
    }
  }
  .footer{
    margin-left: 17%;
    margin-top: 30px;
  }
}
.subjectlist{
  // height: 600px;
  padding: 0px 10px;
  border-bottom: 1px solid rgb(159, 158, 158);
  display: block;
  overflow-y: scroll;
  
  
  .list_item{//每一项题目
    margin: 20px 0px;
  }
  .item_tit{
    display: flex;
    justify-content: space-between;

    .tit_left{
      margin-top: 10px;
      span:nth-of-type(3){
        margin: 0px 10px;
      }
      .el-input{
        width: 60px;
      }
    }
    .tit_right{
      margin-top: 10px;
      .el-icon{
        color:#4290f7;
        margin: 0px 10px;
      }
    }
  }
}
.el-checkbox-group{
  margin-left: 20px;
}
.el-radio-group{
  display: block;
  margin-left: 20px;
  span:nth-of-type(1){
    margin-right: 10px;
  }
 

}
/deep/.el-form .content span:nth-of-type(1){
    margin: 0px ;
  }
  .judgeBox{
    font-size: 15px;
    height: 50px;
    line-height:50px;
    color: #5acda6;
    background-color: #eefaf6;
    margin: 10px;
    padding-left: 10px;
  }
  .analyBox{
    font-size: 15px;
    height: 50px;
    line-height:50px;
    color:  #9dadbc;
    background-color: #f5faff;
    margin: 10px;
    padding-left: 10px;
  }
  // /deep/.is-checked:first-child{
  //   width: 100%;

  //   background-color: #5acda6;
  // }
</style>
