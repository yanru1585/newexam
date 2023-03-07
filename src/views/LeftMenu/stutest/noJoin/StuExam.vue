<template>
  <div style="display: flex;">
    <div class="left">
      <div style="font-size: 20px">{{ testData.title }}</div>
      <div class="content" style="margin-left: 20px;margin-bottom: 50px;" v-for="(item, index) in questionsList" :key="index">
        <el-divider />
        <div class="bbb" :id="'test'+index">
          <div style="display: flex">
            <div class="tag">
              <p class="tag_left">{{index+1}}</p>
              <p class="tag_right">{{item.type}}</p>
            </div>
            <p class="scores">分值：{{item.scores}}</p>
          </div>
          <!-- 选项 -->
          <div >
            <p style="margin: 20px 0;" >
              <p v-if="item.type!=='填空题'">
                <span v-html="item.title"></span>
              </p>
              <p v-if="item.type=='填空题'">
                <span @input="gapFillingFn($event,index)" v-html="gapFilling"></span>
              </p>
            </p>
            <div style="display: flex; flex-direction: column;margin-left: 15px;" v-if="item.type=='单选题'">
              <el-radio
                v-model="item.studentanswer"
                v-for="(it, index1) in item.answers"
                :key="index1"
                :label="it.answerno"
                size="large"
                :style="item.studentanswer==it.answerno?'border: 1px solid #0089ff;background-color: #f1f5fb;border-radius:3px;padding:5px 10px;':'padding:5px 10px;'"
                >{{ it.content }}</el-radio>
            </div>
            <div style="display: flex; flex-direction: column;margin-left: 30px;" v-if="item.type=='多选题'">
              <el-checkbox-group style="display: flex; flex-direction: column;" v-for="(it, index1) in item.answers" :key="index1" @change="handleCheckAllChange(index)" v-model="item.checkedCities">
                <el-checkbox 
                :label="it.answerno" size="large">{{ it.content }}</el-checkbox>
              </el-checkbox-group>
            </div>

            <div v-if="item.type=='判断题'">
              <div style="display: flex;flex-direction: column;">
                <div :class="item.studentanswer==i.answer?'panduanItemSel panduanItem':'panduanItem'" @click="judgeRight(i.answer,index)" v-for="(i,index2) in judge" :key="index2">
                  <p :class="item.studentanswer==i.answer?'panduanItem_left_sel':'panduanItem_left'"><span v-if="item.studentanswer==i.answer">√</span></p>
                  <span>{{i.answer}}</span>
                </div>
              </div>
            </div>

            <div v-if="item.type=='问答题'">
              <el-input v-model="item.studentanswer" type="textarea" placeholder="请输入问答"/>
            </div>
          </div>
        </div>
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
        <div  class="tiItem" v-for="(item, index) in questionsList" :key="index"> 
          <div @click="scrollTo(index)" class="ti" :style="item.studentanswer?'background-color:#f0f8ff;color:#aab4fd':''">{{index+1}}</div>
        </div>
      </div>
      <div class="bottom_div">
        <p>共<span>{{questionsList.length}}</span>道，剩余<span>{{residue}}</span>道未完成</p>
        
        <el-popconfirm @confirm="confirmAdd" :title="residue==0?'答题时间未结束，确定要提交吗？':'你还有'+residue+'题未答，确定要提交吗?'">
          <template #reference>
            <el-button type="primary" @click="trueFn">交卷</el-button>
          </template>
        </el-popconfirm>
      </div>
    </div>

    <!-- 倒计时 -->
    <div class="ding" v-if="testData.limittime">
        <svg style="height: 1.7em;width:1.7em;margin-top: 15px;" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-237f5b4c=""><path fill="currentColor" d="M512 832a320 320 0 1 0 0-640 320 320 0 0 0 0 640zm0 64a384 384 0 1 1 0-768 384 384 0 0 1 0 768z"></path><path fill="currentColor" d="m292.288 824.576 55.424 32-48 83.136a32 32 0 1 1-55.424-32l48-83.136zm439.424 0-55.424 32 48 83.136a32 32 0 1 0 55.424-32l-48-83.136zM512 512h160a32 32 0 1 1 0 64H480a32 32 0 0 1-32-32V320a32 32 0 0 1 64 0v192zM90.496 312.256A160 160 0 0 1 312.32 90.496l-46.848 46.848a96 96 0 0 0-128 128L90.56 312.256zm835.264 0A160 160 0 0 0 704 90.496l46.848 46.848a96 96 0 0 1 128 128l46.912 46.912z"></path></svg>
        <span>倒计时</span>
        <el-countdown  format="HH:mm:ss" value-style="color:#fff;font-size:13px" :value="value" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, toRefs,ref,watch,onBeforeUnmount,toRaw } from 'vue';
import { testStart,studentanswerAdd } from '../../../../api/admin';
import { ElMessage } from 'element-plus';
import { useRouter, useRoute } from 'vue-router';
const router = useRouter();
const route = useRoute();

const judgeRight=(val:any,index:any)=>{
  data.questionsList[index].studentanswer=val // 判断答案
}
const gapFillingFn=(e:any,index:any)=>{
data.questionsList[index].studentanswer=e.data
}

interface Idata {
  testData: any;
  questionsList: Array<any>;
  checkList: Array<any>;
  gapFilling:Array<any>
  judge: Array<any>;
  residue:number
  addList: Array<any>;
  studentid:number
}
const data: Idata = reactive({
  testData: {},
  questionsList: [],
  checkList:[],
  gapFilling:[],
  judge:[
    {answer:'正确'},
    {answer:'错误'}
  ],
  residue:0, //剩余数量
  addList:[], //学生要提交的题
  studentid:0
});
const { testData, questionsList,checkList,gapFilling,judge,residue,addList } = toRefs(data);

onMounted(() => {
  const model:any = sessionStorage.getItem('model')
  data.studentid=JSON.parse(model).id
  // console.log(data.studentid);
  
  getList();
  // 监听滚动事件
    window.addEventListener('scroll', onScroll, false)
});

onBeforeUnmount(()=>{
  // 必须移除监听器，不然当该vue组件被销毁了，监听器还在就会出错
  window.removeEventListener('scroll', onScroll)
})

// 点多选框触发
const handleCheckAllChange=(index:any)=>{
  data.questionsList[index].studentanswer=data.questionsList[index].checkedCities.join('|')  //多选
}

// 点击交卷
const trueFn=()=>{
  data.addList=data.questionsList.map((i:any)=>{ //要添加的数据
    if(!i.studentanswer){
      i.studentanswer=''
    }
    return {answer:i.studentanswer,questionid:i.id,scores:i.scores,studentid:data.studentid,testid:i.testid}
  })
  console.log(data.addList);
}

// 没答的题数量
const testnum=()=>{
  data.residue=data.questionsList.filter((item:any)=>{
    if(!item.studentanswer){
      return item
    }
  }).length
}
console.log(124);
console.log(123);


// 监听  剩余数量
watch(()=>data.questionsList,(newVal)=>{
  if(newVal.length>0){
    getTest() //存题
  }
  testnum() //剩余题目数量
},{deep:true,immediate:true})
const getTest=()=>{ //把题存缓存里
  localStorage.setItem(`examTest${route.query.id}`,JSON.stringify(data.questionsList))
}

const value=ref(Date.now() + 1000*60 * 60 * 7)

const getList = async () => {
  let res: any = await testStart(route.query.id);
  console.log('获取考试题目（开始考试）', res);
  if (res.errCode !== 10000) {
    ElMessage.error(res.errMsg);
    return false;
  }
  data.testData = res.data;

  // 倒计时
    value.value=(Date.now()+new Date(res.data.studentStartTime).getTime())-Date.now()+res.data.limittime*1000 * 60
    console.log('倒计时',Date.now()+res.data.limittime*1000 * 60);
    
  if(localStorage.getItem(`examTest${route.query.id}`)){//如果缓存里有值，从缓存里读取题,退出再进来可以接着做
    let a:any =localStorage.getItem(`examTest${route.query.id}`)
    data.questionsList=JSON.parse(a)
  }else{
    data.questionsList = res.data.questions; //题
  }
  data.residue=res.data.questions.length
  data.questionsList.filter((item:any)=>{
    if(item.type=='填空题'){
      data.gapFilling=item.title.replaceAll('[]','<input/>')
    }
  })

const shuffle = (arr:any) => { //防作弊 打乱题目
  for (let i = 0; i < arr.length; i++) {
    const randomIndex = Math.round(Math.random() * (arr.length - 1 - i)) + i;
    [arr[i], arr[randomIndex]] = [arr[randomIndex], arr[i]]
  }
  return arr
};
shuffle(data.questionsList)
};

const confirmAdd=async()=>{ //交卷
  let res:any = await studentanswerAdd(data.addList)
  console.log('提交的数据',res);
  if(res.errCode!==10000){
    ElMessage.error(res.errMsg)
    return false
  }
  ElMessage({
    message: '交卷成功！',
    type: 'success',
  })
  router.push({path:"/examresults",query:{id:route.query.id}});
}

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
.left{
  height: 100vh;
  width: 100%;
  background-color: #fafbfd;
  padding-top: 20px;
  padding-left: 35px;
}
.right{
  width: 300px;
  height: 100vh;
  background-color: #fff;
  position: fixed;
  right: 0;
}
.ding{
  width: 85px;
  height: 100px;
  border-radius: 5px;
  background-color: #e98478;
  position: fixed;
  top: 20px;
  right: 320px;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #fff;
  span{
    font-size: 12px;
    margin-top: 5px;
  }
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
// 判断
.panduanItemSel{
  background-color: #f1f5fb;
  border: 1px solid #0089ff;
  padding: 10px;
  border-radius: 3px;
}
.panduanItem{
  display: flex;
  margin-bottom: 10px;
  padding: 8px;
  .panduanItem_left{
    width: 20px;
    height: 20px;
    border: 1px solid #d3d4d8;
    border-radius: 50%;
    margin-right: 10px;
  }
  .panduanItem_left_sel{
    width: 20px;
    height: 20px;
    line-height: 20px;
    border: #0089ff 1px solid;
    border-radius: 50%;
    margin-right: 10px;
    background-color: #0089ff;
    text-align: center;
    color: #fff;
    font-size: 10px;
  }
}

// 单选
.radioItemSel{
  background-color: #f1f5fb;
  border: 1px solid #0089ff;
  padding: 10px;
  border-radius: 3px;
}
.radioItem{
  display: flex;
  margin-bottom: 10px;
  padding: 8px;
  .radioItem_left{
    width: 20px;
    height: 20px;
    border: 1px solid #d3d4d8;
    border-radius: 50%;
    margin-right: 10px;
  }
  .radioItem_left_sel{
    width: 20px;
    height: 20px;
    line-height: 20px;
    border: #0089ff 1px solid;
    border-radius: 50%;
    margin-right: 10px;
    background-color: #0089ff;
    text-align: center;
    color: #fff;
    font-size: 10px;
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

.bottom_div{
  position: absolute;
  bottom: 30px;
  font-size: 12px;
  p{
    color: #989a99;
  }
  span{
    color: #000;
  }
  .el-button{
    width: 260px;
    font-size: 12px;
    margin-top: 10px;
  }
}
</style>
