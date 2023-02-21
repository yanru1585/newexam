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