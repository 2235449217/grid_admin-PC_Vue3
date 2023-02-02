// 核查状态
enum is_verification {
  '未核查' = 1,
  '已核查',
}

// 派发状态
enum dispatch_status {
  '未派发' = 1,
  '已派发',
}

// 转派状态
enum transfer_status {
  '未转派' = 1,
  '转派中',
  '转派成功',
  '转派拒绝',
}

// 是否属于本地
enum is_local {
  '否' = 1,
  '是',
}

// 管控方式
// enum is_control {
//   '集中隔离' = 1,
//   '居家隔离',
//   '居家健康检测',
//   '过期人员无需监控',
//   '低风险地区无需管控',
// }
enum is_control {
  '集中隔离' = 1,
  '居家隔离',
  '居家健康检测',
  '低风险区管控',
  '常态化管控',
  '无需管控',
}

// 是否当地核算检测
enum is_nucleic {
  '是（阴性）' = 1,
  '是（确诊）',
  '是（无症状感染）',
  '否',
}

// 是否核酸
enum is_nucleic_acid {
  '是' = 1,
  '否',
}

// 健康码色
enum code_color {
  '绿码' = 1,
  '黄码',
  '红码',
  '灰码',
}

// 是否为返新人员
enum is_back_personnel {
  '绿码' = 1,
  '黄码',
  '红码',
  '灰码',
}

// 是否为中高风险
enum is_risk_area {
  '是' = 1,
  '否',
}

// 返乡方式
enum returnMethod {
  '驾车' = 1,
  '火车',
  '飞机',
  '其他',
}

// 退回原因
enum back_reason {
  '经核查此人不在本省内' = 1,
  '经核查此人并未来河南',
  '拒接电话，拒绝配合疫情核查工作',
  '联系不上，多次拨打无人接听',
  '联系不上，电话处于停机、关机、空号状态',
  '其他原因',
}

// 风险等级
const risk_level = {
  一般: {
    timeliness: 48 * 60 * 60,
    title: '48小时完成业务反馈',
  },
  急: {
    timeliness: 24 * 60 * 60,
    title: '24小时完成业务反馈',
  },
  紧急: {
    timeliness: 24 * 60 * 60,
    title: '24小时完成业务反馈',
  },
  特急: {
    timeliness: 12 * 60 * 60,
    title: '2小时完成电话反馈，12小时完成业务反馈',
  },
};

// 是否纳入本地管控
enum included_local {
  '是' = 1,
  '否',
}

// 管控方式 wxr
enum control_mode {
  '集中隔离' = 1,
  '居家隔离',
  '居家健康检测',
  '失控状态',
  '解除管控',
}

// 非本地操作
enum is_non_local {
  '新乡市内转派' = 1,
  '非新乡市',
}

// 返乡方式
enum travel_type {
  '驾车' = 1,
  '火车',
  '飞机',
  '其他',
}

const TABLE_CODE_MAP = {
  is_verification,
  dispatch_status,
  transfer_status,
  is_local,
  is_control,
  is_nucleic_acid,
  is_nucleic,
  code_color,
  is_back_personnel,
  is_risk_area,
  returnMethod,
  back_reason,
  risk_level,
  included_local,
  control_mode,
  is_non_local,
  travel_type,
};

export default TABLE_CODE_MAP;

// 空表单项默认值
export const DEFAULT_VALUE = '-';

// 风险预警时间临近差值
export const CLOSE_TIME_SLOT = 3 * 60 * 60;
