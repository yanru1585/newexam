<template>
  <div>
    <el-container>
        <el-header><h2>阅卷管理</h2></el-header>
        <el-main>
          <div class="cha">
            关键字： <el-input v-model="data.key" placeholder="请输入题库名称" @keyup.enter="reser"/>
            <el-button type="primary" class="elbutton" @click="reser">搜索</el-button>
          </div>
          <div>
            <el-table :data="data.list" border style="width: 100%">
              <el-table-column prop="title" label="考试名称" />
              <el-table-column prop="info" label="考试说明" />
              <el-table-column prop="subjectnum" label="题量" />
              <el-table-column prop="studentcounts" label="考试人数" />
              <el-table-column prop="incomplete" label="未判人数" />
              <el-table-column label="开放时间">
                <template #default="scope">
                  <span>{{
                    scope.row.begintime === ''
                      ? scope.row.begintime至scope.row.endtime
                      : '不限'
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template #default="scope" >
                  <el-button link type="primary" size="small" @click="see(scope.row)">阅卷</el-button>
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
        </el-main>
      </el-container>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { Ilist } from '../../../api/admin';
import router from '../../../router';
const total = ref(0);
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
  list: [],     //
  key:'',        //input 绑定值
});
const getIlist = async () => {
  const res = await Ilist(data.page, data.psize, data.isread,data.key);
  // console.log(res);
  data.list = res.data.list;
  // console.log(data.list);
  total.value = res.data.counts;
};

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
const reser=()=>{
// console.log(input.value);
  getIlist();
}
// 查看
const see=(row:any)=>{
  console.log(row.title);
  router.push({path:"/Examsee",query:{id:row.id,title:row.title}})
}
onMounted(() => {
  getIlist();
});
</script>

<style scoped>
.el-input {
  width: 30%;
  margin-right: 30px;
}
.cha {
  margin-bottom: 30px;
}
</style>
