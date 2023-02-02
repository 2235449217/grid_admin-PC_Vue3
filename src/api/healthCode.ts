import service from '@/utils/request';
import { PageType } from './common';
import { download } from '@/utils/request';

/**
 * 获取健康码管理列表
 * */
export const getHealthCode = (
  data: {
    dept_id?: number;
    code_color?: number;
    control_mode?: number;
    dispatch_status?: number;
    id_card?: string;
    time_frame?: string[];
  } & PageType
) => {
  return service({
    url: '/healthCode',
    method: 'post',
    data,
  });
};

/**
 * 获取健康码管理详情
 */
export const getHealthCodeDetails = (data: { id: number }) => {
  return service({
    url: '/healthCode/details',
    method: 'post',
    data,
  });
};

/**
 * 获取转派加载的地点
 */
export const getDepartment = (data: { id: number }) => {
  return service({
    url: '/department/id',
    method: 'post',
    data,
  });
};

/**
 * 健康码派发
 */
export const dispatch = (data: {
  control_mode: number;
  dept_id: number;
  id: number;
}) => {
  return service({
    url: 'healthCode/dispatch',
    method: 'post',
    data,
  });
};

/**
 * 健康码转派状态
 * 点击拒绝/接受时调用这个接口
 */
export const healthCodeTransferstatus = (data: {
  id: number;
  transfer_reason?: string;
  transfer_status: number;
}) => {
  return service({
    url: '/healthCode/status',
    method: 'post',
    data,
  });
};
/**
 * 健康码转派管理
 */
export const healthCodeTransfer = (data: {
  id: number;
  dept_id?: number;
  original_dept_id: number;
}) => {
  return service({
    url: '/healthCode/transfer',
    method: 'post',
    data,
  });
};
/**
 * 新增
 */
export const addHealthCode = (data: {
  certificate_num: string;
  code_color: number;
  control_mode: number;
  give_code_reason: string;
  name: string;
  phone: string;
  remark?: string;
}) => {
  return service({
    url: '/healthCode/add',
    method: 'post',
    data,
  });
};

/**
 * 删除
 */
export const delCode = (data: { id: number }) => {
  return service({
    url: '/healthCode/del',
    method: 'delete',
    data,
  });
};

/**
 * 获取核酸记录
 */
export const nucleicAcidInfo = (data: { id: number } & PageType) => {
  return service({
    url: '/nucleicAcid/info',
    method: 'post',
    data,
  });
};

/**
 * 健康码导入
 */
export const importExcel = (params: FormData) => {
  return service.post('/healthCode/import', params);
};
/**
 * 健康码导出
 */
export const exportExcel = (params: {
  certificate_num?: string;
  code_color?: number;
  dept_id?: number;
  dispatch_status?: number;
  time_frame?: string[];
}) => {
  return download<BlobPart>('/healthCode/export', params, {
    responseType: 'blob',
  });
};

/**
 * 模板下载
 */
export const importTemplate = (params: { section_type: number }) => {
  return download<BlobPart>('/healthCode/template', params, {
    responseType: 'blob',
  });
};
/**
 * 管控方式列表
 */
export const controlModeList = (params: { section_type: number }) => {
  return service.post('/healthCode/controlList', params);
};
/**
 * 管控方式修改
 */
export const controlModeChange = (params: {
  section_type: number;
  id: number;
  code: number;
}) => {
  return service.post('/healthCode/controlMode', params);
};
