import service from '@/utils/request';
import { PageType } from './common';

export const getDataStaticstics = (data: {
  dept_id?: number;
  time_frame?: [string];
}) => {
  return service({
    url: '/dataStatistics',
    method: 'post',
    data,
  });
};

export const getSceneCode = (
  data: {
    dept_id?: number;
    scene_name?: string;
  } & PageType
) => {
  return service({
    url: '/dataStatistics/sceneCode',
    method: 'post',
    data,
  });
};

export const getCode = () => {
  return service({
    url: '/sceneCode/getCode',
    method: 'post',
  });
};

export const exportExcel = () => {
  return service({
    url: '/sceneCode/getCode',
    method: 'post',
  });
};

export const claimRate = () => {
  return service({
    url: '/dataStatistics/claimRate',
    method: 'post',
  });
};
