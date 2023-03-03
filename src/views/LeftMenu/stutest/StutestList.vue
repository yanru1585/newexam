<template>
  <div>
    <div class="top">
      <p>考试列表</p>
      <div>
        <el-form :inline="true" :model="searchData" class="demo-form-inline">
          <el-form-item label="关键字：">
            <el-input v-model="listParams.key" placeholder="考试名称" />
          </el-form-item>
          <el-form-item label="状态：">
            <el-select
              v-model="listParams.state"
              class="m-2"
              placeholder="Select"
              style="width: 100px"
            >
              <el-option
                v-for="item in selectOption"
                :key="item.id"
                :label="item.result"
                :value="item.result"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <!-- 考试列表 -->
    <el-row :gutter="20">
      <el-col
      v-for="(item,index) in testList" :key="index"
        :span="8"
      >
       <el-card :body-style="{ padding: '10px'}" @click="testGet(item)">
          <div style="display: flex">
            <div class="testImg">
              <img v-if="item.result=='未考试'" src="../../../assets/images/noJoin.jpg" class="image"/>
              <img v-if="item.result=='待阅卷'" src="../../../assets/images/waitExamination.jpg" class="image"/>
              <img v-if="item.result=='已通过'" src="../../../assets/images/alreadyPassed.jpg" class="image"/>
              <img v-if="item.result=='未通过'" src="../../../assets/images/didNotPass.jpg" class="image"/>
            </div>
            <p style="font-size: 14px; margin: 10px">{{ item.title }}</p>
          </div>
          <div style="font-size: 12px; color: #aaabad;display: flex;justify-content:space-between;margin: 10px 0;">
            <p>考试时间: {{item.begintime}}至{{item.endtime}}</p>
            <p>{{item.pastnum}}人通过</p>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>

  <el-pagination
      v-model:current-page="currentPage4"
      v-model:page-size="pageSize4"
      :page-sizes="[12, 24, 24, 48]"
      :small="small"
      :disabled="disabled"
      :background="background"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
</template>

<script lang="ts" setup>
import { reactive, toRefs, onMounted, ref } from 'vue';
import { ElMessage } from 'element-plus'
import { list } from '../../../api/admin';
import { useRouter } from 'vue-router';
const router=useRouter()

const currentPage4 = ref(1)
const pageSize4 = ref(12)
const small = ref(false)
const background = ref(false)
const disabled = ref(false)

const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`)
  data.listParams.psize=val
  getList()
}
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`)
  data.listParams.page=val
  getList()
}

interface IsearchData {
  key: string;
  state: string;
}
const searchData: IsearchData = reactive({
  key: '',
  state: '所有',
});

interface Idata {
  selectOption: Array<any>;
  listParams: {
    page: number;
    psize: number; //每页显示多少条
    key: string; //搜索关键字(名称)
    admin: string; //创建人
    ismy: number; //	只看我的 >0
    opentime: number; // 开放时间：永久开放
    begindate: string; //开放时间：开始日期
    enddate: string; //	开放时间：截止日期
    state: number; // 0:所有，1已发布，2未发布
    isread: number; //	1考试列表（判卷）
    result: string; //学生考试结果 “已通过”，”未通过”，”待阅卷”，”未考试”
  };
  testList:Array<any>,
  total:number
}
const data: Idata = reactive({
  selectOption: [
    { id: 1, result: '所有' },
    { id: 2, result: '未考试' },
    { id: 3, result: '待阅卷' },
    { id: 4, result: '已通过' },
    { id: 5, result: '未通过' },
  ],
  listParams: {
    page: 1,
    psize: 12, //每页显示多少条
    key: '', //搜索关键字(名称)
    admin: '', //创建人
    ismy: 0, //	只看我的 >0
    opentime: 0, // 开放时间：永久开放
    begindate: '', //开放时间：开始日期
    enddate: '', //	开放时间：截止日期
    state: 0, // 0:所有，1已发布，2未发布
    isread: 1, //	1考试列表（判卷）
    result: '', //学生考试结果 “已通过”，”未通过”，”待阅卷”，”未考试”
  },
  testList:[],
  statusImg:'',
  total:0
});
const { selectOption, listParams,testList,total } = toRefs(data);

// 点击查询
const search=()=>{
  getList();
}

onMounted(() => {
  getList();
});

const getList = async () => {
  let res: any = await list(listParams.value);
  console.log('考试列表', res);
  if(res.errCode!==10000){
    ElMessage.error(res.errMsg)
    return false
  }
  data.testList=res.data.list
  data.total=res.data.counts
};

const testGet=(item:any)=>{
  console.log(item);
  if(item.result=='未考试'){
    router.push({path:"/examprepare",query:{id:item.id}});
  }
  if(item.result!=='未考试'){
    router.push({path:"/examresults",query:{id:item.id}});
  }
  
  console.log('aaaaaa');
  
}
</script>

<style lang="less" scoped>
.top {
  display: flex;
  justify-content: space-between;
}
.testImg {
  width: 130px;
  height: 74px;
  img {
    width: 130px;
    height: 74px;
    border-radius: 10px;
  }
}
.el-card{
  margin-bottom: 20px;
}
.el-pagination{
  display: flex;
  justify-content: center;
}
</style>
