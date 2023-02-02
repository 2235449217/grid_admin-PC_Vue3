<template>
  <div>
    <!-- 顶部 -->
    <div class="gva-search-box">
      <!-- 搜索栏 -->
      <el-form :inline="true" :model="searchCriteria">
        <el-form-item label="姓名">
          <el-input v-model="searchCriteria.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="证件号码">
          <el-input
            v-model="searchCriteria.id_card_num"
            placeholder="请输入证件号码" />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="searchCriteria.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="风险等级">
          <el-select
            v-model="searchCriteria.risk_level"
            placeholder="请选择风险等级">
            <el-option
              v-for="(item, index) in Object.keys(TABLE_CODE_MAP.risk_level)"
              :key="index"
              :label="item"
              :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="批次号">
          <el-input
            v-model="searchCriteria.batch_num"
            placeholder="请输入批次号" />
        </el-form-item>
        <el-form-item label="派发状态">
          <el-select
            v-model="searchCriteria.dispatch_status"
            placeholder="请选择">
            <el-option label="未派发" :value="1" />
            <el-option label="已派发" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否核查">
          <el-radio-group
            v-model="searchCriteria.is_verification"
            class="ml-4"
            @change="search">
            <el-radio
              v-for="item in [
                TABLE_CODE_MAP.is_verification['未核查'],
                TABLE_CODE_MAP.is_verification['已核查'],
              ]"
              :key="item"
              :label="item"
              >{{ TABLE_CODE_MAP.is_verification[item] }}</el-radio
            >
          </el-radio-group></el-form-item
        >
        <el-form-item>
          <el-button size="small" type="primary" icon="search" @click="search">
            查询
          </el-button>
          <el-button size="small" icon="refresh" @click="resetCriteria">
            重置
          </el-button>
          <el-button
            v-if="hasAuth(3)"
            size="small"
            icon="upload"
            @click="handleImportData">
            导入
          </el-button>
          <el-button
            v-if="hasAuth(3)"
            size="small"
            icon="download"
            @click="handleExportData">
            导出
          </el-button>
          <el-button
            v-if="hasAuth(2)"
            size="small"
            icon="download"
            @click="handleExportReport">
            导出统计报表
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 内容 -->
    <div class="contariner">
      <DeptTree ref="deptTreeRef" :on-change="handleDeptChange" />
      <div class="gva-table-box table-box">
        <el-table
          v-loading="isLoading"
          :data="tableData"
          border
          style="width: 100%"
          table-layout="fixed">
          <template
            v-for="(column, index) in tableColumns.filter(item => {
              return !item.isChecked || item.isChecked === isChecked;
            })"
            :key="index"
            ><el-table-column
              align="left"
              show-overflow-tooltip
              :label="column.label"
              :prop="column.prop"
              :min-width="column.width"
              :max-width="column.width">
              <template #default="scope">
                <template v-if="column.prop === 'risk_level'">
                  <div class="risk-level-column">
                    <div
                      :class="['risk-point', riskPointCalc(scope.row)[0]]"
                      :title="riskPointCalc(scope.row)[1]"></div>
                    <span
                      class="risk-text"
                      :title="riskPointCalc(scope.row)[2]"
                      >{{ scope.row[column.prop] }}</span
                    >
                  </div>
                </template>
                <template v-else>
                  {{ conditionRender(column.prop, scope.row[column.prop]) }}
                </template>
              </template>
            </el-table-column>
          </template>
          <el-table-column align="left" label="操作" fixed="right" width="260">
            <template #default="scope">
              <el-button
                type="text"
                size="small"
                :icon="Position"
                @click="handleDispatch(scope.row)">
                派发
              </el-button>
              <el-button
                v-if="hasAuth(3)"
                type="text"
                size="small"
                :icon="DocumentChecked"
                @click="handelCheckPopupOpen(scope.row.id)">
                核查
              </el-button>
              <el-button
                type="text"
                size="small"
                :icon="BottomRight"
                :disabled="checkTtransferred(scope.row.transfer_time)"
                :title="
                  checkTtransferred(scope.row.transfer_time)
                    ? '转派后24h内无法转派'
                    : ''
                "
                @click="handleReassignment(scope.row.id)">
                转派
              </el-button>
              <el-button
                link
                type="primary"
                size="small"
                icon="Document"
                @click="showNucleicRecord(scope.$index, scope.row.id)">
                核酸记录
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div class="pagination">
          <el-pagination
            :current-page="page.current"
            :page-size="page.size"
            :page-sizes="[10, 20]"
            :total="page.total"
            background
            layout="total, sizes, prev, pager, next, jumper"
            @current-change="currentChange"
            @size-change="sizeChange" />
        </div>
      </div>
    </div>
    <!-- 派发弹窗 -->
    <DecentDialog
      :decent-visible="decentVisible"
      @change-visible="(visible: boolean) => (decentVisible = visible)"
      @submit="decentSubmit" />
    <!-- 核查弹窗 -->
    <CheckPopup
      :visible="checkPopupVisible"
      :handle-close="handelCheckPopupClose"
      @close="handelCheckPopupClose"
      @submit="handleCheck" />
    <!-- 转派弹窗 -->
    <ReassignmentPopup
      v-model:visible="reassignmentVisible"
      @submit="reassignmentSubmit" />
    <!-- 核酸记录弹窗 -->
    <DialogTable
      toptitle="核酸记录"
      :visible="nucleicVisible"
      :headercolumn="headercolumn"
      :information-data="nucleicData"
      :total="nucleicTotal"
      :loading="nucleicLoading"
      @changeshow="changeNucleicShow"
      @paging-query="pagingNucleicQuery"></DialogTable>
  </div>
</template>
<script lang="ts">
export default {
  name: 'RegionCheck',
};
</script>
<script setup lang="ts">
import { inject, onMounted, ref, watch, provide } from 'vue';
import {
  getVerifications,
  dispatchVerification,
  updateVerification,
  importData,
  exportData,
  UpdateVerificationParams,
  transferCityInner,
  exportReport,
} from '@/api/regionCheck';

import DeptTree from '@/components/deptTree/index.vue';
import { TreeType } from '@/components/deptTree/types';
import CheckPopup from './components/checkPopup/index.vue';
import DecentDialog from '@/components/decentDialog/index.vue';
import { ElMessage } from 'element-plus';
import ReassignmentPopup from './components/reassignmentPopup.vue';
import { stampFormat } from '@/utils/dateFormat';
import TABLE_CODE_MAP, {
  DEFAULT_VALUE,
  CLOSE_TIME_SLOT,
} from '@/constant/tableCodeMap';
import { useUserStore } from '@/pinia/modules/user';
import {
  BottomRight,
  Position,
  DocumentChecked,
} from '@element-plus/icons-vue';
import DialogTable from '@/components/dialogTable/index.vue';
import { nucleicAcid } from '@/api/keyPersonnel';
import { emitter } from '@/utils/bus';
import { controlModeList } from '@/api/healthCode';
import { type } from 'os';
const deptTreeRef = ref<InstanceType<typeof DeptTree> | null>(null);
const reload = inject<() => void>('reload');

/************************************************
 * 导入导出
 ************************************************/

// 导入
const handleImportData = () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept =
    'application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  input.style.display = 'none';
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  input.addEventListener('change', async ({ target: { files } }) => {
    const file = files[0];
    const formdata = new FormData();
    formdata.append('file', file, file.name);
    const response = await importData(formdata);
    if (response.code === 0) {
      ElMessage({
        showClose: true,
        message: '导入成功',
        type: 'success',
      });
      reload && reload();
    }
  });
  document.querySelector('body')?.appendChild(input);
  input.click();
};

// 导出
const handleExportData = async () => {
  const response = await exportData({
    ...searchCriteria.value,
  });
  const blob = new Blob([response.data], {
    type: response.headers['content-type'],
  });
  console.log(blob);
  const downloadElement = document.createElement('a');
  const hrefBlob = window.URL.createObjectURL(blob);
  downloadElement.href = hrefBlob;
  const fileName = decodeURI(
    response.headers['content-disposition']?.split('filename=')[1]
  ).slice(1, -1);
  console.log(fileName);
  downloadElement.download = fileName || '导出表格';
  document.body.appendChild(downloadElement);
  downloadElement.click();
  document.body.removeChild(downloadElement);
  window.URL.revokeObjectURL(hrefBlob);
};

// 判断当前用户是否有权限导出统计报表
const { userInfo } = useUserStore();
console.log(userInfo);

const hasAuth = (requireLv: number) => {
  return (
    userInfo.authorities.length > 0 &&
    userInfo.authorities[0].level &&
    userInfo.authorities[0].level <= requireLv
  );
};

// 导出统计报表
const handleExportReport = async () => {
  const response = await exportReport();
  const blob = new Blob([response.data], {
    type: response.headers['content-type'],
  });
  console.log(blob);
  const downloadElement = document.createElement('a');
  const hrefBlob = window.URL.createObjectURL(blob);
  downloadElement.href = hrefBlob;
  const fileName = decodeURI(
    response.headers['content-disposition']?.split('filename=')[1]
  ).slice(1, -1);
  console.log(fileName);
  downloadElement.download = fileName || '导出统计报表';
  document.body.appendChild(downloadElement);
  downloadElement.click();
  document.body.removeChild(downloadElement);
  window.URL.revokeObjectURL(hrefBlob);
};

/************************************************
 * 搜索条件
 ************************************************/

type searchCriteriaType = {
  name?: string;
  id_card_num?: string;
  phone?: string;
  risk_level?: string;
  batch_num?: string;
  is_verification?: number;
  dept_id?: number;
  dispatch_status?: number;
};
const searchCriteria = ref<searchCriteriaType>({
  is_verification: TABLE_CODE_MAP.is_verification['未核查'],
  dispatch_status: 1,
});

/**
 * 搜索
 */
const search = async () => {
  await loadData();
  isChecked.value =
    searchCriteria.value.is_verification ===
      TABLE_CODE_MAP.is_verification['已核查'] || false;
};

/**
 * 重置搜索条件
 */
const resetCriteria = async () => {
  searchCriteria.value = {
    is_verification: TABLE_CODE_MAP.is_verification['未核查'],
  };
  deptTreeRef.value && deptTreeRef.value.reset();
  isChecked.value = false;
  await search();
};

/**
 * 部门查询条件
 */
const handleDeptChange = async (dept: TreeType) => {
  searchCriteria.value.dept_id = dept.id;
  loadData();
};
/**
 * 是否核查
 */
const isChecked = ref<boolean>(false);

/************************************************
 * 表格数据
 ************************************************/

// 表头数据类型
type tableColumnType = {
  label: string;
  prop: string;
  width: number;
  isChecked?: boolean;
};

// 表头数据
const tableColumns: tableColumnType[] = [
  {
    label: '姓名',
    prop: 'name',
    width: 100,
  },
  {
    label: '批次',
    prop: 'batch_num',
    width: 200,
  },
  {
    label: '手机号码',
    prop: 'phone',
    width: 160,
  },
  {
    label: '身份证号',
    prop: 'id_card_num',
    width: 200,
  },
  {
    label: '核查状态',
    prop: 'is_verification',
    width: 120,
  },
  {
    label: '行政区划',
    prop: 'dept_name',
    width: 180,
  },
  {
    label: '事件名称',
    prop: 'event_name',
    width: 180,
    isChecked: false,
  },
  {
    label: '风险等级',
    prop: 'risk_level',
    width: 120,
    isChecked: false,
  },
  {
    label: '来源类型',
    prop: 'source_type',
    width: 200,
    isChecked: false,
  },
  {
    label: '核查日期',
    prop: 'verification_time',
    width: 180,
    isChecked: true,
  },
  {
    label: '原始区划',
    prop: 'verification_area',
    width: 120,
    isChecked: true,
  },
  {
    label: '核查区划',
    prop: 'dispatch_address',
    width: 120,
    isChecked: true,
  },
  {
    label: '是否属实本地',
    prop: 'is_local',
    width: 120,
    isChecked: true,
  },
  {
    label: '本地管控方式',
    prop: 'is_control',
    width: 120,
    isChecked: true,
  },
  {
    label: '派发状态',
    prop: 'dispatch_status',
    width: 120,
  },
  {
    label: '派发时间',
    prop: 'dispatch_time',
    width: 180,
  },
  {
    label: '转派状态',
    prop: 'transfer_status',
    width: 120,
  },
  {
    label: '转派时间',
    prop: 'transfer_time',
    width: 180,
  },
];

// 表格数据类型
type TableDataType = {
  id: number;
  name: string;
  batch_num: string;
  phone: string;
  id_card_num: string;
  dispatch_time?: string;
  event_name?: number;
  risk_level?: number;
  source_type?: string;
  verification_time?: string;
  verification_area?: string;
  dispatch_address?: string;
  is_local?: boolean;
  is_control?: number;
};

// 表格数据
const tableData = ref<TableDataType[]>([]);

// 条件渲染
const conditionRender = (prop: string, value: string | number) => {
  let res: string | number = '';
  switch (prop) {
    case 'is_verification':
    case 'dispatch_status':
    case 'transfer_status':
    case 'is_local':
    case 'is_control':
      res = TABLE_CODE_MAP[prop][value] || DEFAULT_VALUE;
      break;
    case 'dispatch_time':
    case 'transfer_time':
      res = stampFormat(value as number) || DEFAULT_VALUE;
      break;
    default:
      res = value || DEFAULT_VALUE;
      break;
  }
  return res;
};

// 风险点
const riskPointCalc = (row: Record<string, string | number | undefined>) => {
  const value = row['risk_level'];
  if (!value) return DEFAULT_VALUE;
  const curTime = Date.now() / 1000;
  const recTime = row['source_date'] as number;
  const riskLevel = TABLE_CODE_MAP.risk_level[value];
  let res = ['', '', ''];
  const deltaTime = recTime + riskLevel.timeliness - curTime;
  if (deltaTime < 0) {
    res = ['expired', '逾期'];
  } else {
    if (deltaTime < CLOSE_TIME_SLOT) {
      res = ['closed', '临期'];
    } else {
      res = ['unexpired', '时间充裕'];
    }
  }
  res[2] = riskLevel.title;
  return res;
};

// 分页数据
const page = ref({
  current: 1,
  size: 10,
  total: 0,
});

onMounted(async () => {
  await loadData();
});

/**
 * 页码变化
 */
const currentChange = (current: number) => {
  page.value.current = current;
};

/**
 * 每页数据量变化
 */
const sizeChange = (size: number) => {
  page.value.size = size;
};

watch(
  page,
  async () => {
    await loadData();
  },
  {
    deep: true,
  }
);

/**
 * 请求数据
 */
const isLoading = ref(false);
const loadData = async () => {
  if (isLoading.value) return;
  isLoading.value = true;
  const response = await getVerifications({
    ...searchCriteria.value,
    page: page.value.current,
    pageSize: page.value.size,
  });
  tableData.value = response.data.GrAreaVerificationList;
  page.value.total = response.data.count;
  isLoading.value = false;
};

/************************************************
 * 核查弹窗相关
 ************************************************/

const checkPopupVisible = ref(0);

// 核查弹窗打开
const handelCheckPopupOpen = (id: number) => {
  checkPopupVisible.value = id;
};

// 核查弹窗关闭回调
const handelCheckPopupClose = () => {
  checkPopupVisible.value = 0;
};

// 核查弹窗提交回调
const handleCheck = async (
  res: Record<
    string,
    | string[]
    | string
    | number[]
    | number
    | boolean
    | Date[]
    | Date
    | [Date | null, Date | null]
    | undefined
  >
) => {
  console.log('check', res);
  const response = await updateVerification(res as UpdateVerificationParams);
  if (response.code === 0) {
    ElMessage({
      showClose: true,
      message: '核查成功',
      type: 'success',
    });
    reload && reload();
  }
  checkPopupVisible.value = 0;
};

/************************************************
 * 派发弹窗
 ************************************************/

// 派发弹窗可视性
const decentVisible = ref(false);
// 处理数据id
let handleId = 0;

// 处理派发按钮
const handleDispatch = (row: TableDataType) => {
  decentVisible.value = true;
  handleId = row.id;
};

// 派发弹窗提交回调
const decentSubmit = async (
  deptId: number,
  controlMode: number,
  reason: string
) => {
  // if (!deptId || !controlMode) return;
  console.log(deptId, controlMode);
  let response;
  response = await dispatchVerification({
    id: handleId,
    dept_id: deptId,
    is_control: controlMode,
  });
  if (response.code === 0) {
    ElMessage({
      showClose: true,
      message: '派发成功',
      type: 'success',
    });
    reload && reload();
  }
};

/************************************************
 * 转派弹窗相关
 ************************************************/

// 转派处理id
const reassignmentVisible = ref(0);

// 处理转派按钮
const handleReassignment = (id: number) => {
  reassignmentVisible.value = id;
};

// 转派弹窗提交回调
const reassignmentSubmit = async ({
  id,
  dept_id,
}: {
  id: number;
  dept_id: number;
}) => {
  const response = await transferCityInner({
    id: id,
    dept_id,
    transfer_reason: '',
  });
  if (response.code === 0) {
    ElMessage({
      showClose: true,
      type: 'success',
      message: '转派成功',
    });
    reload && reload();
    reassignmentVisible.value = 0;
  }
  setTimeout(() => {
    emitter.emit('reload');
  }, 500);
};

/**
 * 判断是否可以转派
 */
const checkTtransferred = (transferTime: number) => {
  return Date.now() / 1000 - transferTime < 24 * 60 * 60;
};

/************************************************
 * ✨核酸记录
 ************************************************/

const nucleicLoading = ref(false);

// 核酸记录弹窗表头
const headercolumn = [
  { label: '姓名', prop: 'patient_name' },
  { label: '身份证号', prop: 'certificate_num' },
  { label: '核酸检测结果', prop: 'state' },
  { label: '核酸报告时间', prop: 'upload_time' },
  { label: '核酸检测机构', prop: 'census_Address' },
];

// 核酸记录数据
type NucleicRecordType = {
  abnormal_cause: string;
  code_color: number;
  id: number;
  id_card: string;
  phone: string;
  scan_person: string;
  scan_time: string;
  scene_id: string;
  scene_name: string;
  sign_city: string;
  sign_time: string;
};
const nucleicData = ref<NucleicRecordType[]>([]);
const nucleicTotal = ref(0);

// 核酸弹窗可视性
const nucleicVisible = ref(false);

const changeNucleicShow = (booblean: boolean) => {
  nucleicVisible.value = booblean;
};

// 当前显示核酸记录id
const nucleicShowId = ref(0);

// 核酸记录每页数量
let nucleicRecordPageSize = 10;

// 展示核酸记录
const showNucleicRecord = (index: number, id: number) => {
  nucleicLoading.value = false;
  nucleicShowId.value = id;
  nucleicVisible.value = true;
  nucleicAcid({
    id: id,
    section_type: 7,
    page: 1,
    pageSize: nucleicRecordPageSize,
  }).then(res => {
    nucleicData.value = res.data.AcidRecordInfo;
    nucleicTotal.value = res.data.Count;
    nucleicLoading.value = false;
  });
};

// 核酸记录换页
const pagingNucleicQuery = (page: number, pageSize: number) => {
  nucleicLoading.value = true;
  nucleicRecordPageSize = pageSize;
  nucleicAcid({
    id: nucleicShowId.value,
    section_type: 7,
    page: page,
    pageSize: pageSize,
  }).then(res => {
    nucleicData.value = res.data.AcidRecordInfo;
    nucleicLoading.value = false;
  });
};
//异步获取 管控列表
//管控方式列表
type control = {
  value: number;
  label: string;
}[];
const controldata = ref<control[]>([]);
controlModeList({ section_type: 7 }).then(res => {
  controldata.value = res.data;
});
const getdata = () => {
  return controldata.value;
};
provide('getdata', getdata);
</script>
<style scoped lang="scss">
.contariner {
  display: grid;
  grid-template-columns: repeat(2, auto);
  background-color: #fff;
  .pagination {
    display: flex;
    justify-content: flex-end;
  }
}

.risk-level-column {
  position: relative;
  .risk-point {
    z-index: 1;
    position: absolute;
    width: 12px;
    height: 12px;
    margin-right: 5px;
    top: 50%;
    transform: translateY(-50%);
    border-radius: 100%;
    &.expired {
      background-color: #ff0000;
    }
    &.closed {
      background-color: #f3ed28;
    }
    &.unexpired {
      background-color: #61e95f;
    }
  }
  .risk-text {
    margin-left: 21px;
  }
}
</style>
