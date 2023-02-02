import service from '@/utils/request';
import { PageType } from './common';
/**
 * 通过条件查询风险预警详情
 * @param data
 * @returns
 */
export const riskWarning = (
  data: {
    dept_id?: number;
    time_frame?: [];
    id_card?: string;
    phone?: string;
  } & PageType
) => {
  return service({
    url: '/riskWarning',
    method: 'post',
    data,
  });
};
/**
 * 通过id查询风险预警详情
 * @param data
 * @returns
 */
export const WarningDetails = (data: { id: number }) => {
  return service({
    url: '/riskWarning/details',
    method: 'post',
    data,
  });
};
/**
 * 查询获取预警信息
 * @param data
 * @returns
 */
export const warningSources = (data: { code_color: number }) => {
  return service({
    url: '/warningSources',
    method: 'post',
    data,
  });
};
/**
 * 查询获取预警信息
 * @param data
 * @returns
 */
export const record = (data: {
  id: number;
  page: number;
  pageSize: number;
  section_type: number;
}) => {
  return service({
    url: '/sceneCode/record',
    method: 'post',
    data,
  });
};
