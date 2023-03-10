import {post,get} from './request'
import {AxiosResponse} from 'axios'

// 老师登录
interface Iadmin{
  (username:string,pass:string):any
}
export const Loginteach:Iadmin=(username:string,pass:string):Promise<AxiosResponse<any>>=>{
  return post('/teacher/checklogin',{username,pass})
}
export const list=(params:any):Promise<AxiosResponse<any>>=>{
  return get('/test/list',params)
}//考试列表

export const dele=(ids:any):Promise<AxiosResponse<any>>=>{
  return post('/test/deleteall',{ids})
}//考试批量删除
export const deles=(id:any):Promise<AxiosResponse<any>>=>{

  return get('/test/delete',{id})
}//考试删除


export const AddText=(params:any):Promise<AxiosResponse<any>>=>{
  return post('/test/add',params)
}//考试添加
export const TextAnalyse=(testid:any):Promise<AxiosResponse<any>>=>{
  return get('/test/analyse',testid)
}//考试分析统计

// 阅卷管理列表
interface Iist{
  (page:number,psize:number,isread:number,key:string):Promise<AxiosResponse<any>>
}
export const Ilist:Iist=(page:number,psize:number,isread:number,key:string):Promise<AxiosResponse<any>>=>{
  return get('/test/list',{page,psize,isread,key})
}
// 阅卷查看
interface Isee{
  (page:number,psize:number,testid:number,state:string,key:string):Promise<AxiosResponse<any>>
}
export const ISee:Isee=(page:number,psize:number,testid:number,state:string,key:string):Promise<AxiosResponse<any>>=>{
  return get('/student/test',{page,psize,testid,key,state})
}
//部门数据
export const IClasses=(params:any):Promise<AxiosResponse<any>>=>{
  return get('/department/list',params)
}
// 阅卷抽屉
interface Iquestion{
  (testid:number,studentid:number):Promise<AxiosResponse<any>>
}
export const IQuestion:Iquestion=(testid:number,studentid:number):Promise<AxiosResponse<any>>=>{
  return get('/question/listforstu',{testid,studentid})
}

// 阅卷完毕按钮
export const IButton=(params:any):Promise<AxiosResponse<any>>=>{
  return post('/studentanswer/update',params)
}


export const teacherlsit=(params:any):Promise<AxiosResponse<any>>=>{
  return get('/teacher/list',params)
}//师资列表

export const teacherdele=(id:any):Promise<AxiosResponse<any>>=>{
  return get('/teacher/delete',{id})
}//师资删除

export const classeslist=(params?:any):Promise<AxiosResponse<any>>=>{
  return get('/classes/list',params)
}//班级列表

interface Iclassesadd{
  (name:string,depid:number,id:number):Promise<AxiosResponse<any>>
}
export const classesadd:Iclassesadd=(name:string,depid:number,id:number):Promise<AxiosResponse<any>>=>{
  return post('/classes/add',{name,depid,id})
}//班级添加

export const classesdele=(id:any):Promise<AxiosResponse<any>>=>{
  return get('/classes/delete',{id})
}//班级删除

export const classesdeles=(ids:any):Promise<AxiosResponse<any>>=>{
  return post('/classes/deleteall',{ids})
}//班级批量删除

export const classesad=(params:any):Promise<AxiosResponse<any>>=>{
 return post('/student/add',params)
}//添加学生
export const studentlist=(params:any):Promise<AxiosResponse<any>>=>{
  return get('/student/list',params)
}//学员列表

export const studentdele=(id:any):Promise<AxiosResponse<any>>=>{
  return get('/student/delete',{id})
}//学员删除
export const studentall=(ids:any):Promise<AxiosResponse<any>>=>{
  return post('/student/deleteall',{ids})
}//学员批量删除

export const studentcs=(ids:any):Promise<AxiosResponse<any>>=>{
  return post('/student/changepass',{ids})
}//学员重置密码
export const rolelist=(params:any):Promise<AxiosResponse<any>>=>{
  return get('/role/list',params)
}//角色列表
interface Irolelistt{
  (page:number,psize:number):Promise<AxiosResponse<any>>
}
export const rolelistt:Irolelistt=(page:number,psize:number):Promise<AxiosResponse<any>>=>{
  return get('/role/list',{page,psize})
}//角色列表

export const roledel=(id:any):Promise<AxiosResponse<any>>=>{
  return get('/role/delete',{id})

}

// 根据id获取单个考试信息
export const testGet=(id:any):Promise<AxiosResponse<any>>=>{
   return get('/test/get',{id})
  }
//角色删除

export const menulsit=(roleid:any):Promise<AxiosResponse<any>>=>{
  return get('/menu/list',{roleid})
}//角色权限列表


export const roleadd=(params:any):Promise<AxiosResponse<any>>=>{

  return post('/role/add',params)
}//角色添加

// 老师修改密码
export const teacherChangePass=(oldpass:string,pass:string):Promise<AxiosResponse<any>>=>{
  return post('/teacher/changePass',{oldpass,pass})
}

// 修改发布状态
export const teacherUpdateState=(params:any):Promise<AxiosResponse<any>>=>{
  return post('/test/updateState',params)
}

// 获取考试阅卷老师

export const testGetmarkteachers=(params:any):Promise<AxiosResponse<any>>=>{
  return get('/test/getmarkteachers',params)
}


// 获取学生考试结果
export const testGetForResult=(testid:any):Promise<AxiosResponse<any>>=>{
  return get('/test/getForResult',{testid})
}

// 获取考试题目（开始考试）
export const testStart=(testid:any):Promise<AxiosResponse<any>>=>{
  return get('/test/start',{testid})
}

// 学生答题
export const studentanswerAdd=(params:any):Promise<AxiosResponse<any>>=>{
  return post('/studentanswer/add',params)
}

// 师资重置密码
export const teacher=(params:any):Promise<AxiosResponse<any>>=>{
  return post('/teacher/add',params) 
}

// 获取考试学生列表
export const testStudent=(params:any):Promise<AxiosResponse<any>>=>{
  return get('/student/test',params)
}

// 学生修改密码
export const studentTest=(oldpass:string,pass:string):Promise<AxiosResponse<any>>=>{
  return post('/student/test',{oldpass,pass})
}