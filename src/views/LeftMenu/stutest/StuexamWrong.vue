<template>
  <div class="box">
      <div class="left">
        <el-page-header @back="goBack">
          <template #content>
            <span class="text-large font-600 mr-3"> {{ testData.title }} </span>
          </template>
        </el-page-header>
        <div
          style="margin-left: 20px; margin-bottom: 50px"
          v-for="(item, index) in testList"
          :key="index"
          class="content"
        >
          <div class="bbb" :id="'test'+index">
            <div style="display: flex; margin-bottom: 15px">
              <div class="tag">
                <p class="tag_left">{{ index + 1 }}</p>
                <p class="tag_right">{{ item.type }}</p>
              </div>
              <p class="scores">分值：{{ item.scores }}</p>

              <div v-if="item.type=='单选题'||item.type=='多选题'||item.type=='判断题'">
                <p v-if="item.studentanswer.includes(item.answer)" style="height: 16px;font-size: 12px;border: #4cc0a4 1px solid;color: #4cc0a4;border-radius: 3px;padding: 0 5px;">得分：{{item.scores}}</p>
                <p v-else style="height: 16px;font-size: 12px;border: #ee0000 solid 1px;border-radius: 3px;color: #e00;padding: 0 5px;">得分：0</p>
              </div>
              <div v-if="item.type=='填空题'||item.type=='问答题'">
                <p style="height: 16px;font-size: 12px;border: #ee0000 solid 1px;border-radius: 3px;color: #e00;padding: 0 5px;">得分：0</p>
              </div>
              
            </div>
            <!-- 选项 -->
            <div>
              <p style="margin: 20px 0;" >
                <p v-if="item.type!=='填空题'">
                  <span v-html="item.title"></span>
                </p>
                <p v-if="item.type=='填空题'">
                  <span v-html="gapFilling"></span>
                </p>
              </p>
              
              <div
                style="display: flex; flex-direction: column"
                v-if="item.type == '单选题'||item.type == '多选题'"
              >
                <div
                  v-for="(it, index1) in item.answers"
                  :key="index1"
                  class="radioItem"
                  :style="item.studentanswer.includes(it.answerno)&&item.answer.includes(it.answerno)? 'border: 1px solid #f0faf6;background-color: #f0faf6;border-radius:3px;':item.studentanswer.indexOf(it.answerno)==-1? '':'background-color: #fcf3f3;border: 1px solid #0089ff;border-radius:3px;'"
                >
                  <div class="radio">
                    <p class="radio_left" :style="item.studentanswer.includes(it.answerno)&&item.answer.includes(it.answerno)?'background-color: #0089ff;color:#fff':item.studentanswer.indexOf(it.answerno)==-1?'':'background-color: #0089ff;color:#fff'">{{ it.answerno }}</p>
                    <span>{{ it.content }}</span>
                  </div>
                </div>
              </div>
              <div v-if="item.type == '判断题'">
                <div class="radio" :style="item.answer.includes(i.judge)&&item.studentanswer.includes(i.judge)?'margin-bottom: 15px;padding:10px;background-color: #f0faf6;':item.studentanswer.indexOf(i.judge)==-1?'padding:10px':'background-color:#fcf3f3;border: 1px solid #0089ff;border-radius:5px;padding:10px'" v-for="(i,index2) in judgeAnswer" :key="index2">
                  <p class="radio_left"></p>
                  <span>{{i.judge}}</span>
                </div>
              </div>
              <div v-if="item.type !== '问答题'">
                <p class="answerItem" :style="item.type=='填空题'?'backgroundColor:red;padding: 10px;':'background-color:#f7fbff;padding: 10px;'">
                  <span :style="item.type=='填空题'?'color:#000':'color:#90adca'">正确答案</span>
                  <span class="answerItem_A" v-if="item.type=='单选题'">{{item.answer}}</span>
                  <span class="answerItem_A" v-if="item.type=='多选题'" v-for="(i,index1) in item.answer">{{i}}</span>
                  <span style="margin-left: 20px;color:rgb(102, 102, 102)" v-if="item.type=='判断题'">{{ item.answer }}</span>
                  <span style="color:#000;margin-left: 10px;margin-top: 2px;" v-if="item.type=='填空题'">{{item.answer}}</span>
                </p>
              </div>
              <div v-if="item.type=='填空题'" style="margin-top: 10px;margin-left: 10px;">
                <span>答案解析</span>
                <span style="margin-left: 10px;">{{ item.explains }}</span>
              </div>

              <div v-if="item.type == '问答题'">
                <p style="background-color: #f5f7fa;padding: 10px 20px;margin-top: 10px;">答:{{ item.studentanswer }}</p>
                <div style="padding: 10px 20px;margin-top: 10px;">{{ item.answer }}</div>
                <div style="padding: 10px 20px;margin-top: 10px;">{{ item.explains }}</div>
              </div>
            </div>
          </div>
          <el-divider />
        </div>
      </div>

      <div class="right">
        <p style="padding: 25px 24px;font-size: 19px;font-weight: 900;">答题卡</p>
        <div style="display: flex;margin-left: 25px;margin-bottom: 30px;">
          <div style="width: 16px;height: 16px;background-color: #f0f8ff;"></div>
          <span style="font-size: 12px;margin: 0 15px 0 5px;">已答</span>
          <div style="width: 15px;height: 15px;border: 1px solid #e9e9e9;"></div>
          <span style="font-size: 12px;margin: 0 15px 0 5px;">未答</span>
        </div>

        <div style="display: flex;flex-wrap: wrap;">
          <div class="tiItem" v-for="(item, index) in testList" :key="index"> 
            <div @click="scrollTo(index)" class="ti" :style="item.studentanswer.includes(item.answer)?'background-color:#f0f8ff;color:#aab4fd;cursor:pointer':'background-color: #fcf2f0;color: #e9747f;cursor:pointer'">{{index+1}}</div>
          </div>
        </div>
      </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, onMounted, toRefs,onBeforeUnmount } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { testGetForResult } from '../../../api/admin';
import { ElMessage } from 'element-plus';

const router = useRouter();
const route = useRoute();
const goBack = () => {
  router.go(-1);
};

interface Idata {
  testData: any;
  testList: Array<any>;
  gapFilling:Array<any>;
  judgeAnswer:Array<any>
}
const data: Idata = reactive({
  testData: {},
  testList: [],
  gapFilling:[],
  judgeAnswer:[
    {judge:'正确'},
    {judge:'错误'}
  ]
});
const { testData, testList,gapFilling,judgeAnswer } = toRefs(data);

onMounted(() => {
  getList();
  // 监听滚动事件
  window.addEventListener('scroll', onScroll, false)
});
onBeforeUnmount(()=>{
  // 必须移除监听器，不然当该vue组件被销毁了，监听器还在就会出错
  window.removeEventListener('scroll', onScroll)
})


const getList = async () => {
  let res: any = await testGetForResult(route.query.id);
  console.log('获取学生考试结果', res);
  if (res.errCode !== 10000) {
    ElMessage.error(res.errMsg);
    return false;
  }
  data.testData = res.data;
  data.testList = res.data.questions;
  console.log(data.testList);
  data.testList.map((item:any)=>{
    if(item.type=="多选题"){
      item.answer=item.answer.split('|')
    }
  })
  data.testList.filter((item:any)=>{
    if(item.type=='填空题'){
      data.gapFilling=item.title.replaceAll('[]','____')
    }
  })
};


// 滚动监听器
const onScroll=()=> {
	// 获取所有锚点元素
	const navContents = document.querySelectorAll(`.content .bbb`)
	// 所有锚点元素的 offsetTop
	const offsetTopArr:any = []
	navContents.forEach((item:any) => {
		offsetTopArr.push(item.offsetTop)
	})
}
// 跳转到指定索引的元素
const scrollTo=(index:any)=> {
	// 获取目标的 offsetTop
	// css选择器是从 1 开始计数，我们是从 0 开始，所以要 +1,   (这个不用加1)
  let top = <HTMLImageElement>document.querySelector(`#test${index}`);
	const targetOffsetTop = top.offsetTop
  
	// 获取当前 offsetTop
  let scrollTop = document.documentElement.scrollTop || document.body.scrollTop
  
	// 定义一次跳 50 个像素，数字越大跳得越快，但是会有掉帧得感觉，步子迈大了会扯到蛋
	const STEP = 100
	// 判断是往下滑还是往上滑
	if (scrollTop > targetOffsetTop) {
		// 往上滑
		smoothUp()
	} else {
		// 往下滑
		smoothDown()
	}
	// 定义往下滑函数
  function smoothDown() {
		// 如果当前 scrollTop 小于 targetOffsetTop 说明视口还没滑到指定位置
		if (scrollTop < targetOffsetTop) {
			// 如果和目标相差距离大于等于 STEP 就跳 STEP
			// 否则直接跳到目标点，目标是为了防止跳过了。
			if (targetOffsetTop - scrollTop >= STEP) {
				scrollTop += STEP
			} else {
				scrollTop = targetOffsetTop
			}
			document.body.scrollTop = scrollTop
			document.documentElement.scrollTop = scrollTop
			// 关于 requestAnimationFrame 可以自己查一下，在这种场景下，相比 setInterval 性价比更高
			requestAnimationFrame(smoothDown)
		}
	}
  // 定义往上滑函数
  function smoothUp() {
		if (scrollTop > targetOffsetTop) {
			if (scrollTop - targetOffsetTop >= STEP) {
				scrollTop -= STEP
			} else {
				scrollTop = targetOffsetTop
			}
			document.body.scrollTop = scrollTop
			document.documentElement.scrollTop = scrollTop
			requestAnimationFrame(smoothUp)
		}              
	}
}
</script>

<style lang="less" scoped>
.box {
  display: flex;
  padding: 0 50px;
  background-color: #fafbfd;
}
.el-page-header {
  padding: 30px 0;
}
.left {
  height: 100vh;
  width: 100%;
  background-color: #fafbfd;
}
.right {
  width: 300px;
  height: 100vh;
  background-color: #fff;
  position: fixed;
  right: 0;
}
.tag {
  border: 1px #3377f9 solid;
  display: flex;
  width: 80px;
  height: 20px;
  font-size: 13px;
  color: #3377f9;
  align-items: center;
  border-radius: 5px;
  .tag_left {
    width: 30%;
    height: 20px;
    line-height: 20px;
    background-color: #3377f9;
    color: #fff;
    text-align: center;
  }
  .tag_right {
    width: 70%;
    text-align: center;
    background-color: #f1f5fb;
  }
}

.scores {
  height: 20px;
  line-height: 20px;
  color: #aca4ab;
  font-size: 12px;
  margin: 0 10px;
}
.radioItem{
  padding:7px 10px;
  margin-bottom:10px
}
.radio {
  display: flex;
  align-items: center;
  .radio_left {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    font-size: 12px;
    border: #d3d4d8 1px solid;
    color: #777f86;
    background-color: #fff;
    margin-right: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
.answerItem {
  display: flex;
  font-size: 15px;
  color: #90adca;
  margin-top: 8px;
  .answerItem_A {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: #4cc0a4;
    font-size: 13px;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 10px;
  }
}
.tiItem{
  width: 16%;
  .ti{
    width: 35px;
    height: 35px;
    border-radius: 3px;
    background-color: #fff;
    border: 1px solid #e3e3e3;
    color: #000;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 6px;
    margin-bottom: 6px;
    font-size: 14px;
  }
}
</style>
