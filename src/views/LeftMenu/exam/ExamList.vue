<template>
  <div>
      <h3 class="h3">阅卷管理</h3>
      <el-form :inline="true" :model="data" class="demo-form-inline">
      <el-form-item label="关键字">
        <el-input v-model="data.key" placeholder="请输入题库名称" @keyup.enter="reser"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="elbutton" @click="reser">查询</el-button>
      </el-form-item>
      </el-form>
          <div>
            <el-table :data="data.list"   
            style="width: 100%" 
            v-loading="loading"
            :header-cell-style="{backgroundColor: 'rgb(250, 250, 250)',padding:'0px'}"
            :header-row-style="{height:'40px'}"
            :row-style="{height:'40px'}">
              <el-table-column prop="title" label="考试名称" />
              <el-table-column prop="info" label="考试说明" />
              <el-table-column prop="subjectnum" label="题量"/>
              <el-table-column prop="studentcounts" label="考试人数"/>
              <el-table-column  label="未判人数" >
                <template #default="scope">
                  <span class="incomplete">{{scope.row.incomplete}}</span>
                </template >
              </el-table-column>
              <el-table-column label="开放时间" >
                <template #default="scope">
                  <span>{{scope.row.begintime===null ? '不限':moment(scope.row.begintime).format('YYYY-MM-DD HH:mm')}}</span>
                </template >
              </el-table-column>
              <el-table-column label="操作" >
                <template #default="scope" >
                  <el-button link type="primary" size="small" @click="see(scope.row)">
                  <span>{{scope.row.incomplete === 0 ? '查看':'阅卷'}}</span>
                  </el-button>
                </template>
              </el-table-column>
            </el-table>

            <el-pagination
              v-model:current-page="data.page"
              v-model:page-size="data.psize"
              :page-sizes="[5, 10, 15, 20]"
              :small="small"
              :disabled="disabled"
              :background="background"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>

  </div>
</template>

<script setup lang="ts">
import  moment  from "moment"
import {debounce}  from "../../../utils/throTtle"
import { onMounted, reactive, ref,onActivated } from 'vue';
import { Ilist } from '../../../api/admin';
import router from '../../../router';
const total = ref(0);
const loading = ref(true)
// 阅卷列表
interface marking {
  page: number;
  psize: number;
  isread: number;
  list: Array<any>;
  key:string,
}
const data: marking = reactive({
  page: 1,      //页数
  psize: 10,    //条数
  isread: 1,    //
  list: [],     //7
  key:'',        //input 绑定值
});
const getIlist =async () => {
  const res = await Ilist(data.page, data.psize, data.isread,data.key);
  // console.log(res);
  data.list = res.data.list;
  // console.log(data.list);
  total.value = res.data.counts;
  loading.value=false
} ;

// 分页
const small = ref(false);
const background = ref(false);
const disabled = ref(false);
const handleSizeChange = (val: number) => {
  // console.log(`${val} items per page`);
  data.psize = val;
  getIlist();
};
const handleCurrentChange = (val: number) => {
  // console.log(`current page: ${val}`);
  data.page = val;
  getIlist();
};

// 搜索
const reser=debounce(()=>{
// console.log(input.value);
  getIlist();
},500)
// 查看
const see=(row:any)=>{
  console.log(row);
  router.push({path:"/Examsee",query:{id:row.id,title:row.title}})
}
onMounted(() => {
  getIlist();
});
onActivated(()=>{
  getIlist()
})


</script>

<style lang="less" scoped>
.h3 {
  font-size: 20px;
    color: rgb(33, 33, 33);
    font-weight: normal;
}
.el-form{
  margin-top: 20px;
}
.el-input {
  width: 200px;
  margin-right: 30px;
}
.cha {
  margin-top: 20px;
  margin-bottom: 20px;
}
.incomplete{
  color: red;
}
/deep/.el-pagination{
  justify-content: center;
}
</style>
