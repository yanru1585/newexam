<template>
   <el-drawer
    v-model="table"
    title="考生的试卷"
    direction="rtl"
    size="50%"
    :before-close="handleClose"
  >
  <div class="detail">
    <div class="header">
    <span>得分：{{ testData.studentScores }}</span>
    <span>总分：{{ testData.scores}}</span>
    <span>通过分数：{{ testData.pastscores}}</span>
    <span>考试用时：{{ testData.limittime}}</span>
    <span>交卷时间：{{ testData.studentStartTime }}</span>
    </div>
    <div class="content">
      <div class="item" v-for="(item,index) in questions" :key="index" >
        <div class="item_tit">
          <div class="item_type"> 
          <span class="item_num">{{ index+1 }}</span>
          <span class="item_right">{{item.type}}</span>
          </div>
          <span class="item_scope">分值：{{ item.scores }}</span>
          <span class="item_scopes">得分：{{ item.studentscores }}</span>
        </div>
        <div class="item_cent">
          <span v-html="item.title"></span>
          <div class="item_list" v-if="item.type==='单选题'||item.type==='多选题'">
            <div class="list" v-for="(itemc,indexc) in item.answers" :key="indexc">
              <div class="box  "  :class="item.answer===item.studentanswer&& item.studentanswer===itemc.answerno?'backgr_box':item.answer!==item.studentanswer&&item.studentanswer===itemc.answerno?'backgr_no_box':''" >
              <div style="display: flex;" >
              <div class="radio">
             <span>{{itemc.answerno}}</span>
              </div>
              <span class="radio_cen">{{itemc.content }}</span>
              </div>
              <span  :style="item.answer==item.studentanswer&& item.studentanswer==itemc.answerno?'color: #4cc0a4;':item.answer!==item.studentanswer&&item.studentanswer==itemc.answerno?'color: #e25e61;':''">{{item.answer==item.studentanswer&& item.studentanswer==itemc.answerno?'回答正确':item.answer!==item.studentanswer&&item.studentanswer==itemc.answerno?'回答错误':''}}</span>
            </div>

          </div>
            </div>
            <!-- :class="item.answer===item.studentanswer&& item.studentanswer==='正确'?'backgr_box':item.answer!==item.studentanswer&&item.studentanswer==='正确'?'backgr_no_box':''" -->
          <div class="item_list" v-if="item.type==='判断题'">
            <div class="list " :class="item.answer===item.studentanswer&& item.studentanswer==='正确'?'backgradio_box':item.answer!==item.studentanswer&&item.studentanswer==='正确'?'backgr_no_box':''" >
            <div style="display: flex;" >
              <div class="radio">
             <span></span>
             </div>
             <span class="radio_cen">正确</span>
              </div>
              <span  :style="item.answer===item.studentanswer&& item.studentanswer==='正确'?'color: #4cc0a4;':item.answer!==item.studentanswer&&item.studentanswer==='正确'?'color: #e25e61;':''">{{item.answer===item.studentanswer&& item.studentanswer==='正确'?'回答正确':item.answer!==item.studentanswer&&item.studentanswer==='正确'?'回答错误':''}}</span>
           </div>
           <div class="list " :class="item.answer===item.studentanswer&& item.studentanswer==='错误'?'backgradio_box':item.answer!==item.studentanswer&&item.studentanswer==='错误'?'backgr_no_box':''" >
           <div style="display: flex;">
              <div class="radio">
             <span></span>
              </div>
              <span class="radio_cen">错误</span>
            </div>
            <span  :style="item.answer===item.studentanswer&& item.studentanswer==='错误'?'color: #4cc0a4;':item.answer!==item.studentanswer&&item.studentanswer==='错误'?'color: #e25e61;':''">{{item.answer===item.studentanswer&& item.studentanswer==='错误'?'回答正确':item.answer!==item.studentanswer&&item.studentanswer==='错误'?'回答错误':''}}</span>
            </div>
          </div>
          <div class="item_answer">
            <span>正确答案：</span>
            <div class="radio" style="background-color: #4cc0a4; color: #fff; border: 0px;"  v-if="item.type==='单选题'">
             <span>{{item.answer}}</span>
            </div>
            <div v-else-if="item.type==='多选题'" style="display: flex;">
              <div class="radio" style="background-color: #4cc0a4; color: #fff; border: 0px;"   v-for="(itemr,index) in item.answer" :key="index">
             <span>{{itemr}}</span>
              </div>
            </div>
            <div v-else-if="item.type==='填空题'" style="display: flex;">
              <span v-for="(itemP,index) in item.answer" :key="index" style=" color: #4cc0a4; border: 0px; margin: 0px 5px; padding: 0px 5px;"> {{ itemP }}</span>
            </div>
            <div v-else-if="item.type==='判断题'" style="display: flex;">
              <span  style=" color: #4cc0a4; border: 0px; margin: 0px 5px; padding: 0px 5px;"> {{ item.answer }}</span>
            </div>
           
          </div>
          <div class="item_answer" style="background-color: #fff;" v-if="item.type==='填空题'">
            <span style="color:#90adca;">答案解析：</span>
            <span style="color: #90adca;">{{item.explains}}</span>
          </div>
          

        </div>

      </div>

    </div>

  </div> 

    
  </el-drawer>
</template>

<script setup lang="ts">
import {reqForResult} from '../../api/subjects'
import {ref,defineEmits,defineProps,onMounted,reactive,toRefs,toRaw}from 'vue'
const emit=defineEmits(['showEmit'])
const props=defineProps({
  studentInfo:{
    type:Object,
    required:true
    
  }
})
interface Idata{
  testData:any,
  questions:Array<any>
}
const data:Idata=reactive({
  testData:{
    studentScores:'',
    scores:'',
    pastscores:'',
    studentStartTime:"",
    limittime:'',
  },
  questions:[]

})
const {testData,questions} =toRefs(data)
const obj={...props.studentInfo}
console.log(obj);

const table = ref(true)
// 获取试卷详情
const getTest=async ()=>{
  let data={
    testid:obj.testid,
    studentid:obj.studentid
  }

  
  const res:any=await reqForResult(data).catch(()=>{})
  console.log('试卷详情',res);
  if(res.errCode!==10000){
    return false
  }

  testData.value=toRaw(res.data)
  
  questions.value=[...res.data.questions]

  questions.value.map(item=>{
    if(item.type==='多选题'||item.type==='填空题'){
      item.answer=item.answer.split('|')
      item.studentanswer=item.studentanswer.split('|')
      

    }
    if(item.type==='填空题'){
      item.title=item.title.replaceAll('[]','_____')
    }
    return item
  })
  console.log(questions.value);

  
  

}




const handleClose = () => {
emit('showEmit',false)
}
onMounted(()=>{
  getTest()

})
</script>

<style lang="less" scoped>
.backgradio_box{
  width: 100%;
  display: flex; 
  justify-content: space-between;
  background-color:#f0faf6
}
.backgr_box{
  width: 100%;
  display: flex; 
  justify-content: space-between;
  background-color:#f0faf6
}
.backgr_no_box{
  width: 100%;
  display: flex; 
  justify-content: space-between;
  background-color:#fcf3f3;
  border: 1px solid #0089ff;
}
.box{
  width: 100%;
  height: 100%;
  padding:0px 10px;
  display: flex; 
  justify-content: space-between;
  // background-color: #3377f9;
}
.detail{
  width: 98%;
  height: 40px;
  line-height: 40px;
  margin: 0 auto;
  margin-bottom: 20px;
  
.header{
  height: 40px;
  line-height: 40px;
  border-bottom: 1px solid rgb(159, 158, 158);
  span{
    margin: 0px 10px;
  }
 
}
.item_tit{
  margin-top: 20px;
  display: flex;
  .item_scope{
    font-size: 13px;
    display: inline-block;
    height: 30px;
    line-height: 30px;
    color: #aca4ab;
    margin-left: 10px;
    }
    .item_scopes{
    font-size: 10px;
    display: inline-block;
    border:1px solid  #4cc0a4 ;
    color:  #4cc0a4;
    height: 20px;
    width: 50px;
    line-height: 20px;
    margin-left: 10px;
    border-radius: 3px;
    margin-top: 3px;
    text-align: center;
  }
  } 
 
  .item_cent{
    margin-top: 10px;
    .list{
      margin: 10px 0px;
        display: flex;
        // height: 30px;
        line-height: 30px;
        // margin: 5px 0px;
        .radio_cen{
          font-size: 15px;
        }
      }
    .radio{
      width: 20px;
      height: 20px;
      border-radius: 50%;
      border: 1px solid black;
      font-size: 8px;
      text-align: center;
      line-height: 20px;
      margin-right: 10px;
      margin-top: 5px;
      
    }
  }
  .item_answer{
    width: 100%;
    height: 30px;
    background-color: #f1f5fb;
    font-size: 15px;
    line-height: 30px;
    margin-top: 20px;
    color: #90adca;
    display: flex;
    span::first-letter{
      margin-left: 10px;
    }
  }
}

.item_type{
  width: 90px;
  height: 30px;
  font-size: 13px;
  border: 1px solid #3377f9;
  line-height: 30px;
  border-radius: 3px;

  display: flex;
   .item_num{
    display: inline-block;
    width: 30px;
    color: #fff;
    text-align: center;
    height: 30px;
    // line-height: 30px; 
    border-right:1px solid #3377f9 ;
    border-radius: 3px 0px 0px 3px;
    background-color: #3377f9;
   }
   .item_right{
    width: 60px;
    height: 30px;
    text-align: center;
    display: inline-block;
    background-color: #f1f5fb;
    color: #3377f9;
    border-radius:  0px 3px 3px 0px ;
   }
}
.content{
  padding-bottom: 30px;
}
</style>