<template>
  <div>
    <el-dialog
      v-model="dialogVisible"
      :title="title"
      width="50%"
      :before-close="handleClose"
    >
      <div class="seleBox">
        <div>
          <span>部门</span>
          <el-select
            v-model="seleValue"
            class="m-2"
            placeholder="请选择"
            @change="selectChang"  
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.name"
              :value="item.id" 
            />
            <!--  -->
          </el-select>
        </div>
        <div v-if="title == '学生考试列表'" style="margin-left: 50px;">
          <span>班级</span>
          <el-select
            v-model="classid"
            style="width: 200px"
            placeholder="请选择"
            @change="selectClassChang" 
            :disabled="classList.length===0"
          >
            <el-option
              v-for="item in classList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </div>
      </div>
      <el-transfer
        v-model="value"
        :data="data"
        :titles="['未选', '全选']"
        :props="props"
        @left-check-change="leftOptionsChange"
        @right-check-change="rightOptionsChange"
      />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancelForm">取消</el-button>
          <el-button type="primary" @click="confirm"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { teacherlsit, classeslist, testGetmarkteachers,studentlist } from '../../api/admin';
import { departmentList } from '../../api/department';
import { ref, onMounted, reactive, toRefs, defineEmits,watch } from 'vue';

const emit = defineEmits(['transferEmit', 'showEmit']);

const propsd = defineProps({
  title: {
    type: String,
    required: true,
  },
  transData:{
    type:Array
  }
});

console.log(2222,propsd.transData);

const title = ref();
title.value = propsd.title;
// console.log(propsd.title);

interface Idata {
  options: Array<any>;
  seleValue: string;
  props: Iprop;
  classid: string;
  classList: Array<any>;
  classData: IclassData;
}
interface IclassData {
  page: number; //页码 默认是1
  psize: number; //每页显示多少条 默认是2
  key: string; //搜索关键字(名称)
  depid: number; //部门id
}
interface Iprop {
  key: string;
  label: string;
}
const dialogData: Idata = reactive({
  seleValue: '',
  options: [],
  props: {
    key: 'id',
    label: 'name',
  },
  classid: '',
  classData: {
    page: 1,
    psize: 20,
    depid: 0,
    key: '',
  },
  classList: [],
});
// 穿梭框数据
const data:any = ref();
const value :any= ref([]);
const { options, seleValue, props, classid, classData, classList } =
  toRefs(dialogData);

const dialogVisible = ref(true);

const handleClose = (done: () => void) => {
  emit('showEmit', false);
};
watch(()=>propsd.transData,(newVal,oldVal)=>{
  if(newVal&&newVal.length!==0){
    console.log('穿梭框监听',newVal);
    // value.value=[]
    value.value=newVal
    console.log(3333,value.value);
    
  }

},{deep:true,immediate:true})
// 获取部门列表
const getList = async () => {
  const res: any = await departmentList().catch(() => {});
  // console.log('部门列表', res);
  if (res.errCode !== 10000) {
    return false;
  }
  options.value = res.data.list;
  // console.log(options.value);
};
const debaId =ref(0)
const selectChang = async (val: any) => {
  debaId.value=val
  console.log(val);
  if (title.value == '可见老师') {
    const res: any = await teacherlsit({ depid: val }).catch(() => {});
    console.log('可见老师', res);
    if (res.errCode !== 10000) {
      return false;
    }
    data.value = res.data.list;
  }
  // 班级
  if (title.value == '学生考试列表') {
    dialogData.classData.depid = val;
    let result: any = await classeslist(dialogData.classData);
    console.log('班级列表', result);
    if (result.errCode !== 10000 || !result.data.list) {
      return false;
    }
    dialogData.classList = result.data.list;
    // data.value = result.data.list;
  }

  if (title.value == '阅卷老师') {
    dialogData.classData.depid = val;
    let result: any = await testGetmarkteachers(dialogData.classData);
    console.log('班级列表', result);
    if (result.errCode !== 10000 || !result.data.list) {
      return false;
    }
    dialogData.classList = result.data.list;
    // data.value = result.data.list;
  }
};
// 点击班级列表下拉框触发事件
const selectClassChang=async (val:any)=>{
  console.log('班级下拉框',val);
  let res:any=await studentlist({depid:debaId.value,classid:val})
  console.log('请求学生列表',res);
  if(res.errCode !== 10000){
    return false
  }
  data.value = res.data.list;
  
  

}
// 点击左侧穿梭框
const leftOptionsChange=(key: any)=>{
  // console.log('左侧穿梭框',key);
  // console.log('左侧数据11',data.value);
  key.forEach((item:any)=>{
    if(value.value.indexOf(item)===-1){
      value.value.push(item)
    }
  }) 
}
//点击右侧穿梭框

const rightOptionsChange=(key: any)=>{
  // console.log('右侧穿梭框',key);
  // console.log('左侧数据22',data.value);
  key.forEach((it:any)=>{
    value.value=value.value.filter((item: any)=>{
   if(item!==it) {
    return item
   }      
  }) 
  })
}
onMounted(() => {
  getList();
});
// 点击确定
const confirm = () => {
  let data={
    tit:title.value,
    arr:value.value
  }
  console.log('确定', value.value);
  emit('transferEmit', data);
  emit('showEmit', false);
};
// 点击取消
const cancelForm = () => {
  emit('showEmit', false);
};
</script>

<style lang="less" scoped>
.seleBox {
  display: flex;
  // justify-content: space-between;
  margin-bottom: 30px;
  span {
    margin-right: 10px;
  }
}
.dialog-footer button:first-child {
  margin-right: 10px;
}
/deep/.el-transfer__buttons{
  display: none;
}
/deep/.el-transfer-panel{
  width: 260px;
  height: 500px;
  margin: 10px 20px;

  .el-transfer-panel__body{
    height: 90%;
  }
}
.el-transfer {
  // margin-left: 30px;
  width:100% ;
  height: 500px;
}
</style>
