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
          <el-badge :value="0" class="item" type="primary">
          <el-button>+ 选择</el-button>
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
    <Drawer ref="drawerRef"></Drawer>
  </div>
</template>

<script  lang="ts" setup >
import  Drawer from '../../../components/SubjectDrawer.vue'
import { reactive, toRefs,onMounted,ref } from 'vue';
import{databaseList} from "../../../api/subjects"
import { fa } from 'element-plus/es/locale';
const drawerRef=ref<any>() 
interface Iadd {
  name: String;
  selectValue:String
}
interface Idata {
  addFrom: Iadd;
  baseList:Array<any>
}
const data: Idata = reactive({
  addFrom: {
    name: '', //考试名称
    selectValue:'',//下拉框
  },
  baseList:[],//题库列表
});
const { addFrom,baseList } = toRefs(data);
// 点击添加题目
const addSubject=()=>{
  drawerRef.value.drawer=true

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

</style>
