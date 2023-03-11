<template>
  <div class="box">
    <div
      style="display: flex; justify-content: space-between; margin-top: 10px"
    >
      <h3>学员管理</h3>
      <div>
        <el-button @click="batchAdd">批量添加</el-button>
        <el-button type="primary" @click="Addstudent">添加学生</el-button>
      </div>
    </div>
    <el-form
      :inline="true"
      :model="formInline"
      class="demo-form-inline"
      style="display: flex"
    >
      <el-form-item label="关键字">
        <el-input placeholder="请输入关键字" v-model="data.params.key" />
      </el-form-item>
      <el-form-item label="部门">
        <el-cascader
          v-model="params.depid"
          :options="data.list"
          :props="data.props"
          @change="buMenchange"
          :multiple="true"
        />
      </el-form-item>
      <el-form-item label="班级" prop="classid" style="margin-left: 10px">
        <el-select
          v-model="params.classid"
          style="width: 200px"
          placeholder="请选择"
        >
          <el-option
            v-for="item in classList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-button type="primary" @click="onSubmit">查询</el-button>
      <el-button type="danger" style="margin-left: 10px" @click="deletelist"
        >批量删除</el-button
      >
    </el-form>

    <el-table
      :data="data.tableData"
      stripe
      style="width: 100%"
      @selection-change="handleSelectionChange"
      v-loading="loading"
      :header-cell-style="{backgroundColor: 'rgb(250, 250, 250)',padding:'0px'}"
      :header-row-style="{height:'40px'}"
      :row-style="{height:'40px'}"
    >
      <el-table-column type="selection" />
      <el-table-column prop="name" label="姓名"> </el-table-column>
      <el-table-column prop="remarks" label="备注"> </el-table-column>
      <el-table-column prop="depname" label="所属部门"> </el-table-column>
      <el-table-column prop="classname" label="所在班级"> </el-table-column>
      <el-table-column prop="username" label="账号"> </el-table-column>
      <el-table-column prop="addtime" label="添加时间"> 
        <template #default="scope">
          <span>{{ moment(scope.row.addtime).format('YYYY-MM-DD HH:mm') }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="200">
        <template #default="scope">
          <el-button link type="primary" size="small" @click="cpass(scope.row)">重置密码</el-button>
          <el-button link type="primary" size="small" @click="edit(scope.row)">修改</el-button>
          <el-button
            link
            type="primary"
            size="small"
            @click="delId(scope.row.id)"
            >删除</el-button
          >
        </template>
    
      </el-table-column>
    </el-table>
    <div class="pigeBox">
      <el-pagination
        v-model:current-page="currentPage1"
        v-model:page-size="pageSize2"
        :page-sizes="[5, 10, 15, 20]"
        style="margin-top: 10px; float: right"
        layout="total, sizes, prev, pager, next, jumper"
        :total="data.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <div>
      <Addstu ref="studentref" v-if="stuShow" @stuEmit="stuEmit" :getListDialog="getlist" :stuentlist="stuentlist"></Addstu>
    </div>
    <div>
      <Pass ref="passstudenref"  :getListDialog="getlist" :passlistt="passlistt"></Pass>
    </div>
  </div>
  <AlladdQuestion @closeDialog="closeDialog" :addUrl="addStudentUrl" :getList="getlist" v-if="isShowAdd"/> <!-- 批量上传学生 -->
</template>

<script setup lang="ts">
import  moment  from "moment"
import {debounce}  from "../../../utils/throTtle"
import AlladdQuestion from '../../../components/database/AlladdQuestion.vue';
import { onMounted } from 'vue';
import { reactive, toRefs,onActivated } from 'vue';
import { ref } from 'vue';
import Addstu from './Addstuden.vue'
import {
  studentlist,
  studentdele,
  studentall,
  classeslist,
} from '../../../api/admin';
import { departmentList } from '../../../api/department';
import { useRouter } from 'vue-router';
import Pass  from './Passwords.vue'
import { ElMessage, ElMessageBox } from 'element-plus';
const stuShow=ref(false)
const addStudentUrl=ref('http://estate.eshareedu.cn/exam/upload/student.xlsx')
const isShowAdd=ref(false)
const batchAdd=()=>{
  isShowAdd.value=true
}
const loading = ref(true)
// 接受子组件传过来的值  关闭弹窗
const closeDialog=(val:any)=>{
  isShowAdd.value=val
}


const router = useRouter(); //跳转路由
let ids = ref(''); //定义多选删除数据
// let studentref =ref<any>()
const formInline: Iform = reactive({
  personType: [
    //访客类型列表
    // { id: 1, type_name: '无数据' },
  ],
});

//重置密码
let  passstudenref =ref<any>()
const datast =reactive({
  passlistt:{}
})
const {passlistt} =toRefs(datast)
const cpass =(val:any)=>{
  console.log('重置', val);
  datast.passlistt = val;
  passstudenref.value.dialogVisible = true;
// console.log(statst.passlistt);
}
// 接收自定义属性控制显示隐藏
const stuEmit=(data:any)=>{
  stuShow.value=data

}

//列表数据
interface Iparams {
  page: number; //页码 默认是1
  psize: number; //每页显示多少条 默认是2
  key: string; //搜索关键字(名称)
  depid: string; //部门id
  classid: string; //班级id
}
interface IclassData {
  page: number; //页码 默认是1
  psize: number; //每页显示多少条 默认是2
  key: string; //搜索关键字(名称)
  depid: number; //部门id
}
//定义表格
interface Istate {
  tableData: Array<any>;
  list: Array<any>;
  params: Iparams;
  total: Number;
  props: {};
  classData: IclassData;
  classList: Array<any>;
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
    depid: '', //部门id
    classid: '', //班级id
  },
  list: [],
  tableData: [],
  total: 0,
  props: {
    value: 'id',
    label: 'name',
    children: 'children',
    checkStrictly: true, //点击单选框选中改点击整行选中
    emitPath: false, //只获取级联选择器中最后一项
  },
  classData: {
    page: 1,
    psize: 20,
    depid: 0,
    key: '',
  },
  classList: [], //班级select数据
});
const { list, params, classData, classList } = toRefs(data);
//列表请求
const getlist = async () => {
  let res: any = await studentlist(data.params);
  console.log(res);
  if (res.errCode === 10000) {
    data.tableData = res.data.list;
    data.total = res.data.counts;
    loading.value=false
  }

  let result: any = await departmentList();
  console.log('部门列表', result);
  if (result.errCode !== 10000) {
    return false;
  }
  data.list = result.data.list;
};

// 部门发生变化时
const buMenchange = async (val: any) => {
  console.log('部门发生变化', val);
  data.params.depid = val;
  // getList();
  classData.value.depid = val;
  let res: any = await classeslist(data.classData);
  console.log('班级列表', res);
  if (res.errCode !== 10000 || !res.data.list) {
    return false;
  }

  data.classList = res.data.list;
};

onMounted(() => {
  getlist();
});
//多选
//多选数据
const handleSelectionChange = (val: any) => {
  console.log(val);
  const arr = val.map((item: { id: any }) => {
    return item.id;
  });
  console.log(arr);
  ids = arr;
  // istop = true
};
//批量删除
const deletelist = () => {
  ElMessageBox.confirm('是否确定删除', '删除', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      const res: any = await studentall(ids);
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
//删除
const delId = (id: number) => {
  console.log('删除', id);
  ElMessageBox.confirm('是否确认删除？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      const res: any = await studentdele(id).catch(() => {});
      console.log('删除数据', res);
      if (res.errCode != 10000) {
        return false;
      }
      ElMessage({
        type: 'success',
        message: '删除成功',
      });
      getlist();
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '已取消删除！',
      });
    });
};
//添加学生

const Addstudent = () => {
  // studentref.value.title='添加'
  stats.stuentlist={} ;
  stuShow.value=true
  // studentref.value.dialogVisible=true
};
//修改
// const istops =ref<boolean>()
//   const daty =reactive({
//     istops:false
// })
const stats =reactive({
  stuentlist:{}
})

const edit = (val: any) => {
  stuShow.value=true
  
  console.log('编辑', val);
  stats.stuentlist = val;

  // studentref.value.dialogVisible = true;
  console.log(stats.stuentlist );
};
const {  stuentlist } = toRefs(stats);
//分页
const pageSize2 = ref(4);
const currentPage1 = ref(1);
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
onActivated(()=>{
  getlist()
})
</script>

<style lang="less" scoped>
.box h3 {
  padding: 10px;
}
.el-input {
  width: 200px;
}
.book {
  color: #409eff;
}
.el-table .cell {
  color: #409eff;
}
</style>
