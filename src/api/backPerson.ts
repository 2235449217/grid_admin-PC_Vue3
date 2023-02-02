import service from '@/utils/request';
import { PageType } from './common';

/**
 * 获取列表
 */
export const getBackPerson = (
  data: {
    dept_id?: number;
    id_card_num?: string;
    time_frame?: [string];
  } & PageType
) => {
  return service({
    url: '/backPersonnel',
    method: 'post',
    data,
  });
};

/**
 * 查看
 */
export const getBackDetails = (data: { id?: number }) => {
  return service({
    url: '/backPersonnel/getBackDetails',
    method: 'post',
    data,
  });
};

/**
 * 新增
 */
export const addBackPerson = (data: {
  depart_area_code?: string;
  depart_city_code?: string;
  depart_county_code?: string;
  depart_detail_address?: string;
  depart_org_code?: string;
  depart_prov_code?: string;
  dest_area_code?: string;
  dest_county_code?: string;
  dest_detail_address?: string;
  dest_org_code?: string;
  dest_prov_code?: string;
  id_card_num?: string;
  name?: string;
  phone?: string;
  record_time?: number;
  travel_type?: number;
}) => {
  return service({
    url: '/backPersonnel/addBackPersonnel',
    method: 'post',
    data,
  });
};

/**
 * 根据国编获取地点
 */
export const getChannel = (data: { parent_code?: string }) => {
  return service({
    url: '/backPersonnel/channel',
    method: 'post',
    data,
  });
};
/**
 * 删除
 */
export const deletePersonnel = (data: { id?: number }) => {
  return service({
    url: '/backPersonnel/deleteBackPersonnel',
    method: 'delete',
    data,
  });
};

/**
 * 派发
 */
export const backPersonnelDiapatch = (data: {
  control_mode?: number;
  dept_id?: number;
  id?: number;
}) => {
  return service({
    url: '/backPersonnel/backPersonnelDispatch',
    method: 'post',
    data,
  });
};

/**
 * 派发状态
 */
export const backPersonnelStatus = (data: {
  id?: number;
  transfer_reason?: string;
  transfer_status?: number;
}) => {
  return service({
    url: '/backPersonnel/status',
    method: 'post',
    data,
  });
};

/**
 * 转派
 */
export const backPersonnelTransfer = (data: {
  dept_id?: number;
  id?: number;
  original_dept_id?: number;
}) => {
  return service({
    url: '/backPersonnel/transfer',
    method: 'post',
    data,
  });
};
/**
 * 本人入豫记录
 * @param data
 * @returns
 */
export const returnInfo = (
  data: {
    id: number;
    section_type: number;
  } & PageType
) => {
  return service({
    url: '/backPersonnel/returnInfo',
    method: 'post',
    data,
  });
};

/**
 * 管控方式列表
 */
export const controlModeList = (params: { section_type: number }) => {
  return service.post('/healthCode/controlList', params);
};
