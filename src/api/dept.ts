import service from '@/utils/request';
import { PageType } from './common';
// @Router /authority/getAuthorityList [post]
export const getDeptList = (data: PageType) => {
  return service({
    url: '/department/lists',
    method: 'post',
    data,
  });
};

export const deleteDepartment = (data: {
  children: [string];
  createBy: number;
  createdAt: string;
  deptName: string;
  deptSort: number;
  id: number;
  parentID: number;
  updateBy: number;
  updatedAt: string;
}) => {
  return service({
    url: '/department/deleteDept',
    method: 'post',
    data,
  });
};

// @Summary 创建部门
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body api.CreateAuthorityPatams true "创建部门"
// @Success 200 {string} json "{"success":true,"data":{},"msg":"获取成功"}"
// @Router /authority/createAuthority [post]
export const createDept = (data: {
  children: [string];
  createBy: number;
  createdAt: string;
  deptName: string;
  deptSort: number;
  id: number;
  parentID: number;
  updateBy: number;
  updatedAt: string;
}) => {
  return service({
    url: 'department/addDept',
    method: 'post',
    data,
  });
};

// @Summary 修改部门
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body model.SysAuthority true "修改部门"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"设置成功"}"
// @Router /authority/setDataAuthority [post]
export const updateDept = (data: {
  children: [string];
  createBy: number;
  createdAt: string;
  deptName: string;
  deptSort: number;
  id: number;
  parentID: number;
  updateBy: number;
  updatedAt: string;
}) => {
  return service({
    url: '/department/updateDept',
    method: 'post',
    data,
  });
};

/**
 * 根据id获取部门列表
 * @param {*} data
 * @returns
 */
export const getDeptById = (data: { id: number }) => {
  return service({
    url: '/department/id',
    method: 'post',
    data,
  });
};

/**
 * 查询部门下用户
 * @param {*} data
 * @returns
 */
export const getDeptByUsers = (data: {
  children: [string];
  createBy: number;
  createdAt: string;
  deptName: string;
  deptSort: number;
  id: number;
  parentID: number;
  updateBy: number;
  updatedAt: string;
}) => {
  return service({
    url: '/department/users',
    method: 'post',
    data,
  });
};
