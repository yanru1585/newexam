<!-- 学生考试结果 -->
<template>
  <div class="box">
    <div class="contentBox">
      <div class="top">
        <el-page-header @back="goBack">
          <template #content>
            <span class="text-large font-600 mr-3">{{ testData.title }}</span>
          </template>
        </el-page-header>
        <div class="topContent">
          <span>用时：{{time}}分钟</span>
          <el-divider direction="vertical" />
          <span>交卷时间：{{testData.stuEndTime}}</span>
          <el-divider direction="vertical" />
          <span>试卷总分：{{ testData.scores }}分</span>
          <el-divider direction="vertical" />
          <span>通过分数：{{ testData.pastscores }}分</span>
        </div>
        <p class="line"></p>
        <div :class="testData.result=='未通过'?'topRight':testData.result=='已通过'?'passTopRight':''">
          <div :class="testData.result=='未通过'?'topRight1':testData.result=='已通过'?'passTopRight1':''">
            <span v-if="testData.result=='未通过'||testData.result=='已通过'">{{ testData.result }}</span>
          </div>
        </div>
      </div>
      
      <div v-if="testData.result=='未通过'||testData.result=='已通过'">
        <div :class="testData.studentScores<testData.pastscores?'scores':'passScores'">{{ testData.studentScores }}</div>
        <div class="desc"><span v-if="testData.result=='未通过'">很可惜，未通过</span><span v-if="testData.result=='已通过'">恭喜，通过考试</span></div>
      </div>
      <div v-if="testData.result=='待阅卷'">
        <span style="display: flex;justify-content: center;font-size: 70px;font-weight: 700;color: #f39134;margin-top: 20px;margin-bottom: 30px;">{{ testData.result }}</span>
      </div>

        <el-table border style="margin-top: 50px" :show-header="false" :data="transData">
        <el-table-column
        v-for="(item, index) in testTitle"
          :label="item"
          :key="index"
          align="center"
        >
          <template #default="scope">
            {{ scope.row[index] }}
          </template>
        </el-table-column>
      </el-table>

      <div class="btn" v-if="testData.result!=='待阅卷'">
        <el-button @click="lookTest">查看答卷</el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, toRefs, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { testGetForResult } from '../../../../api/admin';
import { ElMessage } from 'element-plus';
const router = useRouter();
const route = useRoute();

// 返回
const goBack = () => {
  router.push('stutest');
};
interface Idata {
  testData: any;
  testTable: Array<any>;
  testTitle: Array<any>;
  transData: Array<any>;
  time:number
}
const data: Idata = reactive({
  testData: {},
  testTable: [
    { type: '单选题', correct: 0, mistak: 0 },
    { type: '多选题', correct: 0, mistak: 0 },
    { type: '判断题', correct: 0, mistak: 0 },
    { type: '填空题', correct: 0, mistak: 0 },
    { type: '问答题', correct: 0, mistak: 0 },
  ],
  testTitle: ["", "正确数", "错误数","","",""],
  transData:[],
  time:0
});
const { testData,testTable,testTitle,transData,time } = toRefs(data);

onMounted(() => {
  getList();
});

const getList = async () => {
  let res: any = await testGetForResult(route.query.id);
  console.log('获取学生考试结果', res);
  if (res.errCode !== 10000) {
    ElMessage.error(res.errMsg);
    return false;
  }
  data.testData = res.data;

  let d1:any = new Date(res.data.studentStartTime);
  let d2:any = new Date(res.data.stuEndTime);
  data.time=(d2 - d1)/ 1000 / 60 //两个时间相差的分钟数


  let arr = res.data.questions;
  console.log(arr);

  if(testData.value.result=='未通过'||testData.value.result=='已通过'){
    data.testTable.forEach((item: any,index:any) => {
      let typeData=arr.filter((i: any) => item.type == i.type)
      
      if(item.type=='单选题'||item.type=='多选题'||item.type=='判断题'){
        item.correct = typeData.filter((it: any) => {
        if(it.studentanswer.includes(it.answer)){
          return it
        }
      }).length+'题'; //正确数
        item.mistak=typeData.filter((it:any)=>{
          if(it.studentanswer.indexOf(it.answer)==-1){
            return it
          }
        }).length+'题'
      }

      if(item.type=='问答题'||item.type=='填空题'){
        item.correct = typeData.filter((it:any)=>{
          if(it.studentanswer){
            return it
          }
        }).length+'题'
        item.mistak=typeData.filter((it:any)=>{
          if(!it.studentanswer){
            // console.log(it);
            return it
          }
        }).length+'题'
      }
      if(item.correct=='0题'){
        item.correct='--'
      }
      if(item.mistak=='0题'){
        item.mistak='--'
      }
      
      if(typeData.length>0){
        item.type=item.type+'('+typeData.length+')'
      }else{
        item.type
      }  //单选题(10)
    });
  }
  if(testData.value.result=='待阅卷'){
    data.testTable.forEach((item: any,index:any) => {
      let typeData=arr.filter((i: any) => item.type == i.type)
      if(item.type=='单选题'||item.type=='多选题'||item.type=='判断题'){
        item.correct = typeData.filter((it: any) => {
          if(!it.answer.includes(it.studentanswer)){
            return it
          }
        }).length+'题'; //正确数
        console.log(item.correct);
        if(item.correct=='0题'){
          item.correct='--'
        }
        // item.mistak = typeData.length - item.correct;
        item.mistak = typeData.filter((it: any) => {
          if(it.answer.includes(it.studentanswer)){
              return it
            }
        }).length+'题' //错误数
        console.log( item.mistak);
        
        if(item.mistak=='0题'){
          item.mistak='--'
        }
        if(typeData.length>0){
          item.type=item.type+'('+typeData.length+')'
        }else{
          item.type
        }
      }
      if(item.type=='填空题'||item.type=='问答题'){
        return item.mistak='等待阅卷',item.correct='等待阅卷'
      }
    });
  }
console.log(data.testTable);
const matrixData = data.testTable.map((item:any)=>{
  // console.log(item);
  let arr:any=[]
  for(let key in item){
    arr.push(item[key])
  }
  return arr
})
console.log(matrixData);

// 加入标题拼接最终的数据
  data.transData = matrixData[0].map((item:any,index:any)=>{
    return [data.testTitle[index],...matrixData.map((i:any,in1:any)=>{
      return i[index]
    })]
  })
};

// 查看答卷
const lookTest=()=>{
  router.push({path:"/stuexamwrong",query:{id:route.query.id}});
}
</script>

<style lang="less" scoped>
.box {
  height: 100vh;
  background: url('../../../../assets/images/testGetbjt.jpg') no-repeat;
  background-size: cover;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.contentBox {
  width: 650px;
  // height: 320px;
  padding: 50px 60px;
  background-color: #fff;
  position: relative;
  .line {
    margin-top: 25px;
    border-bottom: 1px solid #e7e4e4;
  }
}

.topContent {
  font-size: 12px;
  color: #a0a5ab;
  margin-top: 10px;
  margin-left: 10px;
}
// 未通过
.topRight {
  width: 94px;
  height: 94px;
  border: 2px solid red;
  border-radius: 50%;
  transform: rotate(-18deg);
  position: absolute;
  right: 70px;
  top: 60px;
  .topRight1 {
    width: 85px;
    height: 85px;
    line-height: 85px;
    border-radius: 50%;
    border: 4px solid rgba(255, 0, 0, 0.197);
    text-align: center;
  }
 
  span {
    color: red;
  }
}
// 已通过
.passTopRight{
  width: 94px;
  height: 94px;
  border: 2px solid #14bd83;
  border-radius: 50%;
  transform: rotate(-18deg);
  position: absolute;
  right: 70px;
  top: 60px;
  .passTopRight1 {
    width: 85px;
    height: 85px;
    line-height: 85px;
    border-radius: 50%;
    border: #14bd8229 solid 4px;
    text-align: center;
  }
 
  span {
    color: #14bd83;
  }
}
.scores {
  font-size: 70px;
  color: red;
  display: flex;
  justify-content: space-around;
  margin-top: 13px;
}
.passScores{
  font-size: 70px;
  color: #14bd83;
  display: flex;
  justify-content: space-around;
  margin-top: 13px;
}
.desc {
  font-size: 23px;
  display: flex;
  justify-content: space-around;
}
.btn {
  display: flex;
  margin-top: 20px;

  justify-content: center;
  .el-button {
    width: 240px;
    color: #fff;
    background-color: red;
    height: 45px;
  }
}
</style>
