import {post,get} from './request'
import {AxiosResponse} from 'axios'

// 试卷列表
export const subjectList=(parms:any):Promise<AxiosResponse<any>>=>{
  return get('/subjects/list',parms)
}
// 获取题库列表
export const databaseList=(parms?:any):Promise<AxiosResponse<any>>=>{
  return get('/database/list',parms)
}
// 添加试卷
export const AddSubject=(parms?:any):Promise<AxiosResponse<any>>=>{
  return post('/subjects/add',parms)
}
// 删除试卷
export const DelSubject=(id:any):Promise<AxiosResponse<any>>=>{
  return get('/subjects/delete',id)
}
// 单条试卷详情
export const oneSubject=(id:any):Promise<AxiosResponse<any>>=>{
  return get('/subjects/get',id)
}
// 获取学生考试结果
export const reqForResult=(parms:any):Promise<AxiosResponse<any>>=>{
  return get('/test/getForResult',parms)
}