<template>
  <div class="box">
    <div
      style="display: flex; justify-content: space-between;"
    >
      <h3>考试管理</h3>
      <el-button type="primary" @click="Addexam">创建考试</el-button>
    </div>
    <el-form
      :inline="true"
      :model="formInline"
      class="demo-form-inline"
      style="display: flex"
    >
      <el-form-item label="关键字">
        <el-input v-model="params.key" placeholder="考试名称" />
      </el-form-item>
      <el-form-item label="创建人">
        <el-input v-model="params.admin" placeholder="创建人" />
        <el-checkbox-group v-model="checkIsmy" @change="checkoutIsmy" style="margin-left: 10px;">
        <el-checkbox label="我创建的 " />
      </el-checkbox-group>
      </el-form-item>
      
      <el-form-item label="开放时间" style="margin-left: 10px;">
        <el-radio-group
        v-model="params.opentime"
        
      >
        <el-radio label="1">永久开放</el-radio>
        <el-radio label="0">部分时段</el-radio>
      </el-radio-group>
      <!-- <div class="block"> -->
        <el-date-picker
            style="width: 360px;margin-left: 15px;"
            v-model="time"
            type="datetimerange"
            :shortcuts="shortcuts"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            @change="datetimerangeChange"
            format="YYYY-MM-DD HH:mm"
            value-format="YYYY-MM-DD HH:mm"
            :disabled="params.opentime==='1'"
          />
      <!-- </div> -->
      </el-form-item>
      
      <el-form-item label="状态" prop="region" style="margin-left: 10px">
        <el-select
          style="width: 100px"
          placeholder="请选择"
          v-model="params.state"
        >
          <el-option
            v-for="item in formInline.personType"
            :key="item.id"
            :label="item.type_name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-button type="primary" @click="onSubmit">查询</el-button>
    </el-form>
    <div style="padding: 10px 0px" v-if="istop">
      <el-button type="danger" @click="deletelist">批量删除</el-button>
      <el-button type="primary" @click="truePublic(1)">发布考试</el-button>
      <el-button type="success" @click="cancelPublic(2)">取消发布</el-button>
    </div>

    <el-table
      :data="data.tableData"
      stripe
      style="width: 100%"
      @selection-change="handleSelectionChange"
      v-loading="loading"
    >
      <el-table-column type="selection" />
      <el-table-column prop="title" label="考试名称" #default="scope">
        <span
          style="color: #409eff; cursor: pointer"
          @click="getTestInfo(scope.row.id)"
          >{{ scope.row.title }}
        </span>
      </el-table-column>
      <el-table-column prop="state" label="状态" #default="scope">
        <span
          @click="editState(scope.row.id, scope.row.state)"
          :style="
            scope.row.state === 1
              ? 'color: #409eff; cursor: pointer'
              : 'color:#f56c6c;cursor: pointer'
          "
          >{{ scope.row.state === 1 ? '已发布' : '未发布' }}</span
        >
      </el-table-column>
      <el-table-column prop="scores" label="总分" />
      <el-table-column prop="pastscores" label="通过分数" />
      <el-table-column prop="studentcounts" label="考试人数" />
      <el-table-column prop="passCounts" label="通过人数" />
      <el-table-column prop="limittime" label="开放时间" #default="scope">
        <span>{{ scope.row.state === 0 ? '1小时' : '不限' }}</span>
      </el-table-column>
      <el-table-column prop="admin" label="创建人" />
      <el-table-column prop="addtime" label="更新时间" width="200" >
        <template #default="scope">
          <span>{{ moment(scope.row.addtime).format('YYYY-MM-DD HH:mm') }}</span>
        </template>
        </el-table-column>

      <!-- moment().format('MMMM Do YYYY, h:mm:ss a') -->
      <el-table-column fixed="right" label="操作" width="200">
        <template #default="scope">
          <p>
            <el-button link type="primary" size="small" @click="studentDialog">学生</el-button>
            <el-button link type="primary" size="small" @click="teacherDialog">可见</el-button>
            <el-button link type="primary" size="small" @click="readTeacherDialog">阅卷老师</el-button>
          </p>
          <p>
            <el-button link type="primary" size="small" @click="getAnalyse(scope.row)">分析</el-button>
            <el-button link type="primary" size="small" @click="getEdit(scope.row.id)">编辑</el-button>
            <el-button link type="danger" size="small" @click="del(scope.row)">删除</el-button>
          </p>
        </template>
      </el-table-column>
    </el-table>
    <div class="pigeBox">
      <el-pagination
        v-model:current-page="params.page"
        v-model:page-size="params.psize"
        :page-sizes="[5, 10, 15, 20]"
       
        layout="total, sizes, prev, pager, next, jumper"
        :total="data.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
  <!-- {{ props.dialogVisible }} -->
  <!-- 单个考试信息弹框 -->
  <TestgetDialog
    style="margin-top: 18px"
    v-if="isShowGet"
    @isshowDialog="isshowDialog"
    :getData="getData"
  />

  <TransferDialog v-if="teacherDialogisShow" @showEmit="showEmit" :title="title"/> <!-- 可见老师 -->
</template>

<script setup lang="ts">
import  moment  from "moment"
import {debounce}  from "../../../utils/throTtle"
import TestgetDialog from '../../../components/test/TestgetDialog.vue';
import TransferDialog from '../../../components/subject/TransferDialog.vue';
import { onMounted, defineProps, toRefs, toRaw ,watchEffect,onActivated} from 'vue';
import { reactive } from 'vue';
import { ref } from 'vue';
import { list, dele, teacherUpdateState,deles } from '../../../api/admin';
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
const time = ref('');
const isShowGet = ref(false);
const loading = ref(true)

const title=ref() //弹框的标题
const teacherDialogisShow=ref(false) //是否显示弹框  学生，老师，阅卷老师

const studentDialog=()=>{//学生
  teacherDialogisShow.value=true
  title.value='学生考试列表'
}

const teacherDialog=()=>{//可见老师
  teacherDialogisShow.value=true
  title.value='可见老师'
}

const readTeacherDialog=()=>{//阅卷老师
  teacherDialogisShow.value=true
  title.value='阅卷老师'
}

// 接收子组件传来的  关闭TransferDialog弹窗
const showEmit=(val:any)=>{
  teacherDialogisShow.value=val
}

// 接收子组件传来的  关闭弹窗
const isshowDialog = (val: any) => {
  isShowGet.value = val;
};

let ids = ref(''); //定义多选
const router = useRouter(); //跳转路由
const formInline: Iform = reactive({
  personType: [
    //访客类型列表
    { id: 0, type_name: '所有' },
    { id: 1, type_name: '已发布' },
    { id: 2, type_name: '未发布' },
  ],
});
const radio = ref(3);
const istop = ref(false);
//列表数据
interface Iparams {
  page: number; //页码 默认是1
  psize: number; //每页显示多少条 默认是2
  key: string; //搜索关键字(名称)
  admin: string; //创建人
  ismy: string; //只看我的 >0
  opentime: string; //opentime>0 开放时间：永久开放
  begindate: string; //开放时间：开始日期
  enddate: string; //开放时间：截止日期
  state: string; //状态 0:所有，1已发布，2未发布
  isread: string; //1考试列表（判卷）
  result: string; //学生考试结果 “已通过”，”未通过”，”待阅卷”，”未考试”
}
interface Igetdata {
  getId: number;
  type: string;
}
//定义表格
interface Istate {
  tableData: Array<any>;
  params: Iparams;
  total: Number;
  // getId: number;
  getData: Igetdata;
  checkIsmy:Array<any>
}
//数据
interface Iform {
  //数据对象接口
  personType: Array<any>;
}
//表格
const data = reactive<Istate>({
  params: {
    page: 1, //页码 默认是1
    psize: 5, //每页显示多少条 默认是2
    key: '', //搜索关键字(名称)
    admin: '', //创建人
    ismy: '', //只看我的 >0
    opentime: '', //opentime>0 开放时间：永久开放
    begindate: '', //开放时间：开始日期
    enddate: '', //开放时间：截止日期
    state: '', //状态 0:所有，1已发布，2未发布
    isread: '', //1考试列表（判卷）
    result: '', //学生考试结果 “已通过”，”未通过”，”待阅卷”，”未考试”
  },
  tableData: [],
  total: 0,
  // getId: 0,
  getData: {
    getId: 0,
    type: '考试',
  },
  checkIsmy:[]
});
// keep_alive组件缓存
onActivated(()=>{
  getlist()
})
const { getData,checkIsmy,params } = toRefs(data);

const getTestInfo = async (val: any) => {
  // console.log('获取单个考试信息的id',val);
  isShowGet.value = true;
  getData.value.getId = val;
};

//列表请求
const getlist = async () => {
  console.log('列表查询',params.value);
  
  let res: any = await list(params.value);
  console.log(res);
  if (res.errCode === 10000) {
    data.tableData = res.data.list;
    data.total = res.data.counts;
    loading.value=false
    // console.log(data.tableData);
    // console.log(res.data.list);
  }
};
onMounted(() => {
  getlist();
});
// 时间选择器点击事件
const datetimerangeChange=(data:any)=>{

  params.value.begindate=data[0]
  params.value.enddate=data[1]
// console.log('时间选择器',addFrom.value.begintime);
// console.log('时间选择器',addFrom.value.endtime);
;
}
//多选数据
const handleSelectionChange = (val: any) => {
  console.log(val);
  if (val.length > 0) {
    istop.value = true;
  } else {
    istop.value = false;
  }
  const arr = val.map((item: { id: any }) => {
    return item.id;
  });
  console.log(arr);
  ids = arr;
  // istop = true
};

const updateData: any = reactive({
  state: 1,
  ids: [],
});

// 修改发布状态
const editState = async (id: any, state: any) => {
  updateData.ids = toRaw([id]);

  if (state == 2) {
    updateData.state = 1;
    Public(updateData);
  } else {
    updateData.state = 2;
    Public(updateData);
  }
};
// 触发只看我创建的
const checkoutIsmy=()=>{
  console.log(checkIsmy.value);
  data.params.admin=''
  // formInline.value.admin=''
  data.params.ismy='1'
  // console.log(formInline.value.admin);
}
// 触发创建人输入框时
watchEffect(()=>{
  if(data.params.admin){
    checkIsmy.value=[]
  }
})
// 批量发布
const truePublic = (state: any) => {
  updateData.state = state;
  updateData.ids = ids;
  Public(updateData);
};

// 批量取消发布
const cancelPublic = (state: any) => {
  updateData.state = state;
  updateData.ids = ids;
  Public(updateData);
};

// 发布
const Public = (val: any) => {
  console.log(val);
  let content = val.state == 1 ? '你确定要发布吗?' : '你确定要取消发布吗?';
  let title = val.state == 1 ? '发布' : '取消发布';

  ElMessageBox.confirm(content, title, {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      let res: any = await teacherUpdateState(val);
      console.log('修改发布状态', res);
      if (val.state == 1) {
        ElMessage({
          type: 'success',
          message: '发布成功！',
        });
      } else {
        ElMessage({
          type: 'success',
          message: '取消发布成功！',
        });
      }
      getlist();
    })
    .catch(() => {
      if (val.state == 1) {
        ElMessage({
          type: 'error',
          message: '发布失败！',
        });
      } else {
        ElMessage({
          type: 'info',
          message: '已取消！',
        });
      }
    });
};

// 删除
const del = async(row:any)=>{
  // console.log(row);
  ElMessageBox.confirm('是否确定删除', '删除', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      const res = await deles(row.id)
      console.log(res);
      ElMessage({
        type: 'success',
        message: '删除成功',
      });
      getlist();
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消删除',
      });
    });
  
}

//批量删除
const deletelist = () => {
  ElMessageBox.confirm('是否确定删除', '删除', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      const res: any = await dele(ids);
      console.log(res);
      ElMessage({
        type: 'success',
        message: '删除成功',
      });
      getlist();
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消删除',
      });
    });
};
//创建考试
const Addexam = () => {
  router.push('/Addtest');
};
//分页

const handleSizeChange = (val: number) => {
  console.log(val);
  data.params.psize = val;
  getlist();
};
const handleCurrentChange = (val: number) => {
  console.log(1111, val);
  data.params.page = val;
  getlist();
};

//查询
const onSubmit =debounce( () => {
  getlist();
},500);
// 点击编辑
const getEdit=(id:any)=>{
  console.log('考试编辑',id);
  router.push({path:'/Addtest',query:{id:id}}) 
}
// 获取详细考试列表


//时间
const value1 = ref('');

const shortcuts = [
{
    text: '最近一周',
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
      return [start, end];
    },
  },
  {
    text: '最近一个月',
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
      return [start, end];
    },
  },
  {
    text: '最近三个月',
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
      return [start, end];
    },
  },
];
// 点击分析
const getAnalyse=(data:any)=>{
  console.log('点击分析数据',data);
  if(data.studentcounts===0){
    ElMessage.error('没有学生考试')
    return false
  }
  if(data.incomplete!==0){
    ElMessage.error('判卷未完成')
    return false
  }
  router.push({path:'/Analyse',query:{id:data.id}})
  

}
</script>

<style lang="less" scoped>
.box h3 {
  font-size: 20px;
    color: rgb(33, 33, 33);
    font-weight: normal;
}
.el-form{
  margin-top: 20px;
}
.el-input {
  width: 100px;
}
.book {
  color: #409eff;
}
.el-table .cell {
  color: #409eff;
}
/deep/.el-pagination{
  justify-content: center;
}
</style>
