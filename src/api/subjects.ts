import {post,get} from './request'
import {AxiosResponse} from 'axios'

// 试卷列表
export const subjectList=(parms:any):Promise<AxiosResponse<any>>=>{
  return get('/subjects/list',parms)
}