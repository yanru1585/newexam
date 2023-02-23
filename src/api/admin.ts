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
interface Iclasses{
  (page:number,psize:number,):Promise<AxiosResponse<any>>
}
export const IClasses:Iclasses=(page:number,psize:number,):Promise<AxiosResponse<any>>=>{
  return get('/classes/list',{page,psize})
}
// 阅卷抽屉
interface Iquestion{
  (testid:number,studentid:number):Promise<AxiosResponse<any>>
}
export const IQuestion:Iquestion=(testid:number,studentid:number):Promise<AxiosResponse<any>>=>{
  return get('/question/listforstu',{testid,studentid})
}
export const teacherlsit=(params:any):Promise<AxiosResponse<any>>=>{
  return get('/teacher/list',params)
}//师资列表

export const teacherdele=(id:any):Promise<AxiosResponse<any>>=>{
  return get('/teacher/delete',{id})
}//师资删除

export const classeslist=(params:any):Promise<AxiosResponse<any>>=>{
  return get('/classes/list',params)
}//班级列表

export const classesdele=(id:any):Promise<AxiosResponse<any>>=>{
  return get('/classes/delete',{id})
}//班级删除

export const classesdeles=(ids:any):Promise<AxiosResponse<any>>=>{
  return post('/classes/deleteall',{ids})
}//班级批量删除

export const studentlist=(params:any):Promise<AxiosResponse<any>>=>{
  return get('/student/list',params)
}//学员列表

export const studentdele=(id:any):Promise<AxiosResponse<any>>=>{
  return get('/student/delete',{id})
}//学员删除
export const studentall=(ids:any):Promise<AxiosResponse<any>>=>{
  return post('/student/deleteall',{ids})
}//学员批量删除

export const rolelist=(params:any):Promise<AxiosResponse<any>>=>{
  return get('/role/list',params)
}//角色列表

export const roledel=(id:any):Promise<AxiosResponse<any>>=>{
  return get('/role/delete',{id})

}


//角色删除

export const menulsit=(params:any):Promise<AxiosResponse<any>>=>{
  return get('/menu/list',params)
}//角色权限列表


export const roleadd=(params:any):Promise<AxiosResponse<any>>=>{

  return post('/role/add',params)
}//角色添加

