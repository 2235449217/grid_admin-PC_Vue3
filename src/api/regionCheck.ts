import service from '@/utils/request';
import { PageType } from './common';
import { VerificationDetailsType } from './regionCheck/types';
import { download } from '@/utils/request';

/**
 * 获取核查人员列表
 */
export const getVerifications = (
  params: {
    name?: string;
    id_card_num?: string;
    phone?: string;
    risk_level?: string;
    batch_num?: string;
    is_verification?: number;
  } & PageType
) => {
  return service.post('/verification/getVerification', params);
};

/**
 * 获取核查人员详情
 */
export const getVerificationDetails = (params: { id: number }) => {
  return service.post<VerificationDetailsType>(
    '/verification/getVerificationDetails',
    params
  );
};

/**
 * 派发核查人员
 */
export const dispatchVerification = (params: {
  dept_id: number;
  id: number;
  is_control: number;
}) => {
  return service.post('/verification/verificationDispatch', params);
};

/**
 * 导入
 * @param params {
 * }
 */
export const importData = (params: FormData) => {
  return service.post('/verification/import', params);
};

/**
 * 导出
 */
export const exportData = (params: {
  name?: string;
  id_card_num?: string;
  phone?: string;
  risk_level?: string;
  batch_num?: string;
  is_verification?: number;
}) => {
  return download<BlobPart>('/verification/export', params, {
    responseType: 'blob',
  });
};

/**
 * 导出报表
 */
export const exportReport = (
  params: { dept_id: number } = {
    dept_id: 1,
  }
) => {
  return download<BlobPart>('/verification/statisticsExport', params, {
    responseType: 'blob',
  });
};

/**
 * 更新核查信息
 */
export type UpdateVerificationParams = {
  id: number;
  name: string;
  id_card_num: string;
  phone: string;
  is_local: number;
  is_nucleic?: number;
  included_local?: number;
  is_control?: number;
  is_non_local?: number;
  gr_city_address?: string[];
  gr_prov_address?: string[];
  back_reason?: string;
  transfer_reason?: string;
  other_verification_information?: string;
  depart_detail_address?: string;
};
export const updateVerification = (params: UpdateVerificationParams) => {
  return service.post('/verification/updateVerification', params);
};

/**
 * 核查人员市内转派
 */
export const transferCityInner = (params: {
  dept_id: number;
  id: number;
  transfer_reason: string;
}) => {
  return service.post('/verification/innerCityTransfer', params);
};

/**
 * 核查人员市外转派
 */
export const transferCityOutter = (params: { dept_id: number }) => {
  return service.post('/verification/outCityTransfer', params);
};

/**
 * 核查人员省外转派
 */
export const transferProvinceOutter = (params: { dept_id: number }) => {
  return service.post('/verification/outProvinceTransfer', params);
};
