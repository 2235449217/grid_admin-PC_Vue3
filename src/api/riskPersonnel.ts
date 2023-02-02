import service from '@/utils/request';
import { PageType } from './common';

/**
 * 获取风险人员列表
 */
export const getRiskPersonnel = (
  data: {
    code_color?: number;
    dispatch_status?: number;
    dept_id?: number;
    id_card?: string;
    time_frame?: Array<string>;
  } & PageType
) => {
  return service({
    url: '/riskPersonnel',
    method: 'post',
    data,
  });
};

/**
 * 获取风险人员详细信息列表
 */
export const getRiskPersonnelDetails = (data: { id: number }) => {
  return service({
    url: '/riskPersonnel/details',
    method: 'post',
    data,
  });
};

/**
 * 风险人员派发
 */
export const riskPersonnelDispatch = (data: {
  id: number;
  control_mode: number;
  dept_id: number;
}) => {
  return service({
    url: '/riskPersonnel/dispatch',
    method: 'post',
    data,
  });
};

/**
 * 风险人员转派状态
 */
export const getRiskPersonnelStatus = (data: {
  id: number;
  transfer_reason?: string;
  transfer_status: number;
}) => {
  return service({
    url: '/riskPersonnel/status',
    method: 'post',
    data,
  });
};
/**
 * 风险人员转派管理
 * @param data
 * @returns
 */
export const getRiskPersonnelTransfer = (data: {
  id: number;
  dept_id?: number;
  original_dept_id: number;
}) => {
  return service({
    url: '/riskPersonnel/transfer',
    method: 'post',
    data,
  });
};

/**
 * 风险人员删除
 */
export const delriskPersonnel = (data: { id: number }) => {
  return service({
    url: '/riskPersonnel/del',
    method: 'delete',
    data,
  });
};

/**
 * 风险人员增加
 */
export const addriskPersonnel = (data: {
  code_color: number;
  depart_prov_code: string;
  depart_city_code: string;
  depart_area_code: string;
  depart_county_code: string;
  depart_org_code: string;
  depart_detail_address: string;
  departure_time: number;
  dept_id?: number;
  dest_city_code: string;
  dest_area_code: string;
  dest_county_code: string;
  dest_org_code: string;
  dest_detail_address: string;
  id_card_num: string;
  name: string;
  phone: string;
}) => {
  return service({
    url: '/riskPersonnel/add',
    method: 'post',
    data,
  });
};
