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
