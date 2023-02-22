import {post,get} from './request'
import {AxiosResponse} from 'axios'

// 题库列表
export const databaseList=(params:any):Promise<AxiosResponse<any>>=>{
  return get('/database/list',params)
}

// 根据题库id获取试题列表
export const databasequestionList=(params:any):Promise<AxiosResponse<any>>=>{
  return get('/databasequestion/list',params)
}

// 添加题库
export const databaseAdd=(params:any):Promise<AxiosResponse<any>>=>{
  return post('/database/add',params)
}

// 部门列表
export const departmentList=():Promise<AxiosResponse<any>>=>{
  return get('/department/list')
}

// 获取老师信息
export const teacherList=(params:any):Promise<AxiosResponse<any>>=>{
  return get('/teacher/list',params)
}