<template>
  <el-dialog
    v-model="dialogVisible"
    :title="AddForm.id===0?'添加':'修改' "
    width="40%"
    :before-close="handleClose"
  >
  <el-form
    ref="ruleFormRef"
    :model="AddForm"
    :rules="rules"
    label-width="120px"
    class="demo-ruleForm"
    :size="formSize"
    status-icon
  >
    <el-form-item label="姓名" prop="name">
      <el-input v-model="AddForm.name" />
    </el-form-item>
    <el-form-item label="电话" prop="photo">
      <el-input v-model="AddForm.photo" maxlength="11"/>
    </el-form-item>
    
    <el-form-item label="部门" prop="department">
     <el-select v-model="AddForm.depname" clearable placeholder="请选择" @change="selectChange">
        <el-option
          v-for="item in DepartmentList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="班级" prop="classid" >
      <el-select
        v-model="AddForm.classid"
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
    <el-form-item label="备注" prop="remarks" style="border-bottom: solid 1px #eee;padding: 10px 0px;">
      <el-input v-model="AddForm.remarks" type="textarea" style="width: 300px;"/>
    </el-form-item >
    <el-form-item label="账号" prop="username" v-if="AddForm.id===0">
      <el-input v-model="AddForm.username" />
    </el-form-item >
    <el-form-item label="密码" prop="pass" v-if="AddForm.id===0">
      <el-input v-model="AddForm.pass" />
    </el-form-item>
  </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="Cancel">取消</el-button>
        <!-- AddForm.id===0?'添加':'修改' -->
        <el-button type="primary" @click="confirm(ruleFormRef)">
         {{AddForm.id===0?'添加':'修改' }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref,onMounted,toRefs,watch,defineExpose,defineEmits } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus'
import { reactive } from 'vue'
import { departmentList } from '../../../api/department';
import {classeslist,classesad}from '../../../api/admin'
const emit=defineEmits(['stuEmit'])
const dialogVisible = ref(true)
const title =ref()
defineExpose({
  dialogVisible,
  title
})
//接收数据
const propss = defineProps({
  getListDialog: {
    type: Function,
    required: true,
  },
  stuentlist: {
    type: Object,
    required: true,
  },
});

const formSize = ref('default')
const ruleFormRef = ref<FormInstance>()

interface Iadd{//添加数据接口
  id: number,
  name: string,
  classid: string,
  remarks:string,
  username:string,
  photo:string,
  pass:string,
  depname:string,
}
interface Idatss{
  AddForm:Iadd,
  newAddForm:Iadd
}
const datss:Idatss = reactive({//添加数据
  AddForm:{
    id: 0,
    name: '',
    remarks:"",
    classid: '',
    photo:'',
    username:"",
    pass:'',
    depname:'',
    },
    newAddForm:{
    id: 0,
    name: '',
    remarks:"",
    classid: '',
    photo:'',
    username:"",
    pass:'',
    depname:'',
    }
})
const {AddForm,newAddForm} =toRefs(datss)
//部门数据
interface Idata{//部门列表接口
  DepartmentList:Array<any>//部门列表
}
const Data:Idata=reactive({//部门列表数组
  DepartmentList:[]
})

//列表数据
interface Iparams {
  page: number; //页码 默认是1
  psize: number; //每页显示多少条 默认是2
}
interface IclassData {
  page: number; //页码 默认是1
  psize: number; //每页显示多少条 默认是2
}
interface IclassParams{
  page: number, //页码 默认是1
    psize: number, //每页显示多少条 默认是2
    depid:number,
    key:string
}
//定义表格
interface Istate {
  classList: Array<any>;
  params: Iparams;
  classParams:IclassParams
}
const datat = reactive<Istate>({
  params: {
    page: 1, //页码 默认是1
    psize: 5, //每页显示多少条 默认是2
  },
  classParams:{
    page: 1, //页码 默认是1
    psize: 5, //每页显示多少条 默认是2
    depid:0,
    key:''
  },
  classList: [], //班级select数据
});
const {DepartmentList}=toRefs(Data)//部门
const {classList}=toRefs(datat)//班级
// 获取部门列表
const getDepartmentList=async ()=>{
  const res:any=await departmentList().catch(()=>{})
  console.log('部门列表',res);
  if(res.errCode===10000){
    DepartmentList.value=res.data.list
  }
}
// 部门select  change事件
const selectChange=async(val:any)=>{
  console.log('部门id',val);
  datat.classParams.depid=val
  let res:any = await classeslist(datat.classParams)
  console.log('班级列表',res);
  if(res.errCode!==10000){
    return false
  }
  datat.classList=res.data.list
}
const handleClose = (done: () => void) => {
  Object.assign(AddForm.value,newAddForm.value)
      // dialogVisible.value = false;
      emit('stuEmit',false)
}
onMounted(()=>{
  getDepartmentList()//部门
  // Object.assign(propss.editList, AddForm);
})
// 编辑回显
watch(
  [ () => propss.stuentlist],
  (newValue, oldValue) => {
    console.log('person的job变化了', newValue, oldValue);
    Object.assign(AddForm.value, newValue[0])
    // AddForm=newValue[0] 
    console.log(9999,AddForm.value);
  },

  { immediate: true, deep: true }
 
  
);
//校验
const rules = reactive<FormRules>({
  name: [
    { required: true, message: '请输入名字', trigger: 'blur' },
    { min: 2, max: 8, message: '长度在2-8个字符之间', trigger: 'blur' },
  ],
  photo:[
  { required: true, message: '请输入手机号', trigger: 'change' },
  { pattern: /^1[3|5|7|8|9]\d{9}$/, message: '请输入正确的号码格式', trigger: 'blur' }
  ],
  // username:[
  //   { required: true, message: '请输入账号', trigger:'blur' },
  //   { min: 3, max: 5, message: 'Length should be 14 to 20', trigger: 'blur' },
  // ],
  pass:[
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 12, message: '长度在6-12个字符之间', trigger: 'blur' },
  ]
})
//添加
const confirm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      let res: any = await classesad(AddForm.value);
      console.log('添加学生', res);
      if (res.errCode !== 10000) {
        ElMessage({
          message:res.errMsg,
          type: 'error',
        });
        return false;
      }
      if (AddForm.value.id === 0) {

        Object.assign(AddForm.value,newAddForm.value)
        ElMessage({
          message: '添加成功！',
          type: 'success',
        });
      } else {

        Object.assign(AddForm.value,newAddForm.value)
        ElMessage({
          message: '修改成功！',
          type: 'success',
        });
      }
      emit('stuEmit',false)
      // dialogVisible.value = false;
     
    } else {
      console.log('error submit!', fields);
      ElMessage('请输入学生数据！');
      // Object.assign(AddForm.value,newAddForm.value)
    }
    propss.getListDialog(); //调用父级的列表  刷新
    formEl.resetFields(); //重置表单
  });
};
//取消
const Cancel = () => {
  emit('stuEmit',false)
  // dialogVisible.value = false;
  Object.assign(AddForm.value,newAddForm.value)

};

</script>
<style scoped>
.dialog-footer button:first-child {
  margin-right: 10px;
}
.el-input{
  width: 300px;
}
</style>