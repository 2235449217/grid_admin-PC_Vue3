import service from '@/utils/request';
/**
 *获取地图数据
 * @returns
 */
export const getMapdata = async () => {
  return await service.post('/homePage/mapData');
};
/**
 * 获取具体点的统计h信息
 * @param data
 * @returns
 */
export const getMaker = async (data: {
  dept_id: number;
  data_type: string;
}) => {
  return await service.post('/homePage/dataCount', data);
};
