import service from '@/utils/request';
import { PageType } from './common';

/**
 * 获取场所码信息
 */
export const getVenueCode = (
  data: {
    dispatch_status?: number;
    dept_id?: number;
    scene_type?: number;
    scene_name?: string;
    time_frame?: Array<string>;
  } & PageType
) => {
  return service({
    url: '/sceneCode/getSceneList',
    method: 'post',
    data,
  });
};

/**
 * 获取场所码查看详情
 */
export const getVenueCodeDetails = (data: { id: number }) => {
  return service({
    url: '/sceneCode/getSceneListDetails',
    method: 'post',
    data,
  });
};
/**
 *场所码派发
 */
export const getCode = () => {
  return service({
    url: '/sceneCode/getCode',
    method: 'post',
  });
};
/**
 * 扫码记录
 * @param data
 * @returns
 */
export const getScanCodeList = (
  data: {
    scene_name: string;
  } & PageType
) => {
  return service({
    url: '/sceneCode/getScanCodeList',
    method: 'post',
    data,
  });
};
/**
 * 场所码派发
 */
export const dispatchSceneCode = (data: { dept_id: number; id: number }) => {
  return service({
    url: '/sceneCode/dispatchSceneCode',
    method: 'post',
    data,
  });
};
/**
 * 个人扫码记录
 * @param data
 * @returns
 */
export const sceneCode = (
  data: {
    id: number;
    section_type: number;
  } & PageType
) => {
  return service({
    url: '/sceneCode/record',
    method: 'post',
    data,
  });
};

/**
 *场所码状态
 */
export const updateSceneStatus = (data: {
  enabling_status: number;
  id: number;
}) => service.post('/sceneCode/updateSceneStatus', data);
