<template>
  <el-dialog
    v-model="dialogVisible"
    title="Tips"
    width="40%"
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
      <el-input v-model="AddForm.photo" />
    </el-form-item>
    
    <el-form-item label="部门" prop="department">
      <el-cascader v-model="AddForm.department" :options="DepartmentList" :props="props" clearable placeholder="请选择部门" 
     @change="handleChange" />
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
    </el-form-item>
    <el-form-item label="账号" prop="username">
      <el-input v-model="AddForm.username" />
    </el-form-item>
    <el-form-item label="密码" prop="pass">
      <el-input v-model="AddForm.pass" />
    </el-form-item>
  </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="Cancel">取消</el-button>
        <el-button type="primary" @click="confirm(ruleFormRef)">
         添加
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref,onMounted,toRefs,watch } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus'
import { reactive } from 'vue'
import { departmentList } from '../../../api/department';
import {classeslist,classesad}from '../../../api/admin'
import { indexOf } from 'lodash';
const dialogVisible = ref(false)

defineExpose({
  dialogVisible
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
  depid:string,
  department:string
}
interface Idatss{
  AddForm:Iadd
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
  depid:'',
  department:''
  }
})
const {AddForm} =toRefs(datss)
//部门数据
interface Idata{//部门列表接口
  DepartmentList:Array<any>//部门列表
}
const Data:Idata=reactive({//部门列表数组
  DepartmentList:[]
})

interface Iprop{// 级联选择器属性接口
  value:string,
  label:string,
  children:string
}
const props:Iprop=reactive({// 级联选择器属性
  value:'name',
  label:'name',
  children:'son'
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
//定义表格
interface Istate {
  classList: Array<any>;
  params: Iparams;

}
const datat = reactive<Istate>({
  params: {
    page: 1, //页码 默认是1
    psize: 5, //每页显示多少条 默认是2
 
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

  
  // console.log(DepartmentList.value); 
}
// 级别选择器点击事件
const handleChange = (value:any) => {
  console.log('级联选择器',value)
  value===null?AddForm.value.department='' :AddForm.value.department=value[value.length-1]
  console.log('所在部门',AddForm.value.department);
    let res:any = classeslist(datat.params)
    console.log('班级',res);
    
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
  },
  { immediate: true, deep: true }
);
//校验
const rules = reactive<FormRules>({
  name: [
    { required: true, message: '请输入名字', trigger: 'blur' },
    { min: 3, max: 5, message: 'Length should be 4 to 8', trigger: 'blur' },
  ],
  // username:[
  //   { required: true, message: '请输入账号', trigger:'blur' },
  //   { min: 3, max: 5, message: 'Length should be 14 to 20', trigger: 'blur' },
  // ],
  pass:[
  { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 3, max: 5, message: 'Length should be 6 to 12', trigger: 'blur' },
  ]
})
//添加
// 确定
const confirm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {

      let res: any = await classesad(AddForm.value);
      console.log('添加学生', res);
      if (res.errCode !== 10000) {
        ElMessage({
          message: '失败咯！',
          type: 'error',
        });
        return false;
      }
      if (AddForm.value.id == 0) {
        ElMessage({
          message: '添加成功！',
          type: 'success',
        });
      } else {
        ElMessage({
          message: '修改成功！',
          type: 'success',
        });
      }
      dialogVisible.value = false;
    } else {
      console.log('error submit!', fields);
      ElMessage('请输入学生数据！');
    }
    propss.getListDialog(); //调用父级的列表  刷新
    formEl.resetFields(); //重置表单
  });
};
//取消
const Cancel = () => {
  dialogVisible.value = false;

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