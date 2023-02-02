import service from '@/utils/request';
import { PageType } from './common';

/**
 * 获取重点场所列表
 */
export const getKeySites = (
  params: {
    dept_id?: number;
    scene_name?: string;
    scene_type?: string;
    dispatch_status?: boolean;
  } & PageType
) => {
  return service.post('/keyPlace', params);
};

/**
 * 获取重点场所详情
 */
export const getKeySiteDetail = (params: { id: number }) => {
  return service.post('/keyPlace/details', params);
};

/**
 * 分发重点场所
 */
export const dispatchKeySite = (params: { id: number; dept_id: number }) => {
  return service.post('/keyPlace/dispatch', params);
};
