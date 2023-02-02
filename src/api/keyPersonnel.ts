import service from '@/utils/request';
import { PageType } from './common';
/**
 * 通过条件查询重点场所人员管理列表
 * @param data
 * @returns
 */
export const conditionQuery = (
  data: {
    dept_id?: number;
    id_card?: string;
    scene_name?: string;
    time_frame?: [];
  } & PageType
) => {
  return service({
    url: '/keyPlacePerson',
    method: 'post',
    data,
  });
};
/**
 * 通过id查询重点场所人员管理详情
 * @param data
 * @returns
 */
export const idQuery = (data: { id: number }) => {
  return service({
    url: '/keyPlacePerson/details',
    method: 'post',
    data,
  });
};
/**
 * 核酸信息
 * @param data
 * @returns
 */
export const nucleicAcid = (data: {
  section_type: number;
  id: number;
  page: number;
  pageSize: number;
}) => {
  return service({
    url: '/nucleicAcid/info',
    method: 'post',
    data,
  });
};
