import service, { download } from '@/utils/request';
import { PageType } from './common';

/**
 * 根据身份证号获取用户信息
 */

export const idCardNucList = (params: {
  certificate_num: string;
  page?: number;
  pageSize?: number;
}) => {
  return service.post('/nucleicAcid/list', params);
};

/**
 * 核验个人核酸信息(导入)
 */

export const checkNuc = (params: FormData) => {
  return service.post('/nucleicAcid/check', params);
  // return download<BlobPart>('/nucleicAcid/check', params, {
  //   responseType: 'blob',
  // });
};

/**
 * 核酸导出
 */
export const exportNuc = (params: { test?: number }) => {
  return download<BlobPart>('/nucleicAcid/export', params, {
    responseType: 'blob',
  });
};
// 核酸导出判断
export const exportNucStatus = () => {
  return service.post('/nucleicAcid/progress');
};
