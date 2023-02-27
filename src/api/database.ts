import { post, get } from './request';
import { AxiosResponse } from 'axios';

// 题库列表
export const databaseList = (params: any): Promise<AxiosResponse<any>> => {
  return get('/database/list', params);
};

// 根据题库id获取试题列表
export const databasequestionList = (
  params: any
): Promise<AxiosResponse<any>> => {
  return get('/databasequestion/list', params);
};

// 添加题库
export const databaseAdd = (params: any): Promise<AxiosResponse<any>> => {
  return post('/database/add', params);
};



// 获取老师信息
export const teacherList = (params: any): Promise<AxiosResponse<any>> => {
  return get('/teacher/list', params);
};

// 删除题库
export const databaseDelete = (id: any): Promise<AxiosResponse<any>> => {
  return get('/database/delete', { id });
};

// 批量删除题库
export const databaseDeleteall = (ids: any): Promise<AxiosResponse<any>> => {
  return post('/database/deleteall', { ids });
};

// 题库试题删除
export const databasequestionDelete = (id: any): Promise<AxiosResponse<any>> => {
  return get('/databasequestion/delete', { id });
};


// 题库试题批量删除
export const databasequestionDeleteall = (ids: any): Promise<AxiosResponse<any>> => {
  return post('/databasequestion/deleteall', { ids });
};

// 题库试题添加
export const databasequestionAdd = (params: any): Promise<AxiosResponse<any>> => {
  return post('/databasequestion/add', params);
};

// 题库试题批量添加
export const databasequestionAddlist = (params: any): Promise<AxiosResponse<any>> => {
  return post('/databasequestion/addlist', params);
};
