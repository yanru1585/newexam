// 部门
import { post, get } from './request';
import { AxiosResponse } from 'axios';

// 部门列表
export const departmentList = (): Promise<AxiosResponse<any>> => {
  return get('/department/list');
};

// 添加部门
export const departmentAdd = (params:any): Promise<AxiosResponse<any>> => {
  return post('/department/add',params);
};

// 删除部门
export const departmentDelete = (id:any): Promise<AxiosResponse<any>> => {
  return get('/department/delete',{id});
};