<template>
  <div class="myTable">
    <el-table
      ref="tableRef"
      border
      :data="tableData"
      size="small"
      :row-style="{ height: '44px' }"
      :cell-style="{ padding: 0 }"
      :header-cell-style="{ height: '50px', lineHeight: '50px' }"
      style="width: 100%">
      <!-- 序号列 -->
      <el-table-column prop="sort" label="序号" type="index" width="80" />
      <!-- 文本 -->
      <template v-for="(item, key) in tableTitleData" :key="key">
        <el-table-column
          :prop="item.prop"
          :label="item.label"
          :min-width="item.width"
          :sortable="item.sortable"
          :align="item.align || 'left'"
          show-overflow-tooltip>
          <template #default="scope">
            <template v-if="item.prop === 'code_color'">
              <HealthCodeColor
                :color-data="scope.row['code_color']"></HealthCodeColor
            ></template>
            <template v-else>
              {{ conditionRender(item.prop, scope.row[item.prop]) }}
            </template>
          </template>
        </el-table-column>
      </template>
      <!-- 操作 -->
      <el-table-column fixed="right" label="操作" width="240px">
        <template #default="scope">
          <el-button
            type="text"
            :icon="View"
            size="small"
            plain
            @click="seeInfoFunc(scope.row)"
            >查看</el-button
          >
          <el-button
            type="text"
            :icon="Position"
            size="small"
            color=""
            plain
            @click="decentFunc(scope.row)"
            >派发</el-button
          >
          <el-button
            type="text"
            icon="bottomRight"
            size="small"
            color=""
            plain
            @click="transferFunc(scope.row)"
            >转派</el-button
          >
          <el-dropdown>
            <el-button
              type="text"
              :icon="MoreFilled"
              size="small"
              plain
              class="more"
              >更多</el-button
            >
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="rnaRecord(scope.row)"
                  >核酸记录</el-dropdown-item
                >
                <el-dropdown-item @click="delFunc(scope.row)"
                  >删除</el-dropdown-item
                >
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <!-- 删除弹窗 -->
    <el-dialog v-model="delDialogVisible" title="删除" width="30%" draggable>
      <span>确定删除吗?</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="delConsoleFunc">取消</el-button>
          <el-button type="primary" @click="delConfirmFunc()">确定</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 派发弹窗 -->
    <DecentDialog
      :decent-visible="decentVisible"
      @submit="submit"
      @change-visible="changeVisible"></DecentDialog>
    <!-- 转派弹窗 -->
    <el-dialog v-model="transferVisible" title="转派">
      <!-- 转派的操作部分 -->
      <div>
        <!-- 未转派或者转派已接收或者转派被拒绝 -->
        <div v-if="transferId !== 2">
          <span>转派至：</span>
          <el-cascader
            v-model="transferForm.transferPlace"
            :props="decentProps" />
        </div>
        <!-- 转派中 -->
        <div v-else-if="transferId === 2">
          <el-button type="primary" @click="acceptTransfer">接受</el-button>
          <el-button @click="refuseTransfer">拒绝</el-button>
          <!-- 拒绝原因填写 -->
          <div v-if="refuseTransferInput" class="refuseReason">
            <el-input
              v-model="transferForm.transferRefuseReason"
              type="textarea"
              placeholder="请填写拒绝原因"
              maxlength="100"
              row:2></el-input>
          </div>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="consoleBtn()">取消</el-button>
          <el-button type="primary" @click="enterEditBtn()">确定</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 核酸记录表 -->
    <DialogTable
      :total="total"
      :toptitle="toptitle"
      :visible="visible"
      :information-data="informationData"
      :headercolumn="headercolumn"
      :loading="littleloading"
      @changeshow="changeshow"
      @paging-query="pagingQuery"></DialogTable>
    <!-- 查看的弹窗 -->
    <el-dialog v-model="detailVisible" title="风险人员详情">
      <el-descriptions :column="2" border>
        <el-descriptions-item
          label="姓名"
          label-align="left"
          align="center"
          label-class-name="my-label"
          class-name="my-content"
          width="150px"
          >{{ riskListDetail.name }}</el-descriptions-item
        >
        <el-descriptions-item
          label="身份证号"
          label-align="left"
          align="center"
          >{{ riskListDetail?.id_card_num }}</el-descriptions-item
        >
        <el-descriptions-item
          label="手机号码"
          label-align="left"
          align="center"
          >{{ riskListDetail.phone }}</el-descriptions-item
        >
        <el-descriptions-item
          label="健康码状态"
          label-align="left"
          align="center">
          <HealthCodeColor
            :color-data="riskListDetail.code_color"></HealthCodeColor>
        </el-descriptions-item>
        <el-descriptions-item
          label="出发地"
          label-align="left"
          align="center"
          >{{ riskListDetail.origin_place }}</el-descriptions-item
        >
        <el-descriptions-item
          label="目的地"
          label-align="left"
          align="center"
          >{{ riskListDetail.destination_place }}</el-descriptions-item
        >
        <el-descriptions-item
          label="返乡时间"
          label-align="left"
          align="center"
          >{{ UTCFormat(riskListDetail.departure_time) }}</el-descriptions-item
        >
      </el-descriptions>
    </el-dialog>
  </div>
</template>
<script lang="ts">
export default { name: 'RiskTable' };
</script>
<script setup lang="ts">
import { getDepartment } from '@/api/healthCode';
import { ref, reactive, onMounted, inject } from 'vue';
import { View, Position, MoreFilled } from '@element-plus/icons-vue';
import DialogTable from '../../../components/dialogTable/index.vue';
import { ElMessage } from 'element-plus';
import DecentDialog from '@/components/decentDialog/index.vue';
import { nucleicAcid } from '@/api/keyPersonnel';
import {
  delriskPersonnel,
  getRiskPersonnelDetails,
  getRiskPersonnelStatus,
  getRiskPersonnelTransfer,
  riskPersonnelDispatch,
} from '@/api/riskPersonnel';
import { stampFormat, UTCFormat } from '@/utils/dateFormat';
import HealthCodeColor from '@/components/healthCodeColor/index.vue';
import TABLE_CODE_MAP, { DEFAULT_VALUE } from '@/constant/tableCodeMap';

const visible = ref(false);
const decentVisible = ref(false);

const emit = defineEmits(['on-updata', 'updateTableList']);

// 条件渲染
const conditionRender = (prop: string, value: string | number) => {
  let res: string | number = '';
  switch (prop) {
    case 'transfer_status':
    case 'dispatch_status':
    case 'is_risk_area':
      res = TABLE_CODE_MAP[prop][value] || DEFAULT_VALUE;
      break;
    case 'dispatch_time':
    case 'transfer_time':
      res = stampFormat(value as number) || DEFAULT_VALUE;
      break;
    case 'departure_time':
      res = UTCFormat(value as string) || DEFAULT_VALUE;
      break;
    default:
      res = value || DEFAULT_VALUE;
      break;
  }
  return res;
};
/**
 * 引入更多选项中悬浮显示的小表格
 */
const toptitle = ref('核酸记录');
const headercolumn = reactive([
  { label: '姓名', prop: 'patient_name' },
  { label: '身份证号码', prop: 'certificate_num' },
  { label: '核酸报告时间', prop: 'upload_time' },
  { label: '核酸检测机构', prop: 'census_Address' },
  { label: '核酸检测结果', prop: 'state' },
]);
const changeshow = (booblean: boolean) => {
  visible.value = booblean;
  console.log(visible.value);
};
const changeVisible = (boolean: boolean) => {
  decentVisible.value = boolean;
};

// table元素
const tableRef = ref();
const tableHeight = ref(750); //表格高度

onMounted(() => {
  // 设置表格初始高度为innerHeight-offsetTop-表格底部与浏览器底部距离85
  tableHeight.value = window.innerHeight - tableRef.value.$el.offsetTop - 85;
  // 监听浏览器高度变化
  window.onresize = () => {
    tableHeight.value = window.innerHeight - tableRef.value.$el.offsetTop - 85;
  };
});
const props = defineProps({
  tableTitleData: {
    type: Object,
    default: () => {
      return [{}];
    },
  },
  tableData: {
    type: Array,
    default: () => {
      return [{}];
    },
  },
  isEdit: {
    type: Boolean,
    default: false,
  },
  isBtn: {
    type: Boolean,
    default: false,
  },
  isTransfer: {
    type: Boolean,
    default: false,
  },
});

type RiskPersonnel = {
  id: number;
  name: string;
  id_card_num: string;
  phone: string;
  origin_place: string; //出发地
  destination_place: string; //目的地
  departure_time: number | string;
  transferRefuseReason: string;
  transfer: string; //转派至
  dept_id?: number;
  is_risk_area: number | string;
  transfer_status: number; //转派状态
};
interface prop {
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
}
const informationData = ref<prop[]>([]);
const id = ref(0);
const total = ref(0);
// 核酸记录
//修改小表格中的 pageSize 所有的小表格 pagesize 都需要改变
const littlepageSize = ref(10);
const littleloading = ref(true);
const rnaRecord = (row: RiskPersonnel) => {
  littleloading.value = true;
  visible.value = true;
  id.value = row.id;
  nucleicAcid({
    id: row.id,
    section_type: 5,
    page: 1,
    pageSize: littlepageSize.value,
  }).then(res => {
    console.log(res);
    informationData.value = res.data.AcidRecordInfo;
    total.value = res.data.Count;
    littleloading.value = false;
  });
  // console.log(row);
};
const pagingQuery = (page: number, pageSize: number) => {
  littlepageSize.value = pageSize;
  const littleloading = ref(true);
  nucleicAcid({
    id: id.value,
    section_type: 5,
    page: page,
    pageSize: pageSize,
  }).then(res => {
    console.log(res);
    informationData.value = res.data.AcidRecordInfo;
    littleloading.value = false;
  });
};

/**
 * 派发操作
 */
const currentId = ref();
const decentFunc = (row: RiskPersonnel) => {
  decentVisible.value = true;
  console.log(555555555555, row);
  currentId.value = row.id;
};

const submit = (deptId: number, controlMode: number) => {
  console.log('hfsjfhdj', deptId);
  riskPersonnelDispatch({
    dept_id: deptId,
    id: currentId.value,
    control_mode: controlMode,
  }).then(res => {
    if (res.code === 0) {
      ElMessage({
        type: 'success',
        message: '派发成功',
      });
      alias();
    }
  });
};

/**
 * 转派的相关操作
 */
const decentProps = {
  checkStrictly: true,
  lazy: true,
  lazyLoad(node: any, resolve: any) {
    console.log(node);
    // userInfo.dept
    getDepartment({ id: node.data.id || 1 }).then(res => {
      const list = res.data.list.map((v: { ID: number; deptName: string }) => {
        return {
          label: v.deptName,
          id: v.ID,
          value: v.ID,
        };
      });
      resolve(list);
    });
  },
};
const alias = inject('reload');
const transferId = ref();
const transferVisible = ref(false);
const refuseTransferInput = ref(false);
const transferForm = ref({
  transferPlace: '',
  transferRefuseReason: '',
});
type TransferForm = {
  transferPlace: number;
  transferRefuseReason: string;
};

/**
 * 初始化转派的弹窗
 */
const initTransferForm = () => {
  transferForm.value = {
    transferPlace: '',
    transferRefuseReason: '',
  };
};
const rowData = ref();
const isTransfer = ref(false);
const transferFunc = (row: RiskPersonnel) => {
  initTransferForm();
  transferVisible.value = true;
  rowData.value = row;
  // console.log(111111111, rowData.value);
  transferId.value = row.transfer_status;
  if (transferId.value !== 2) {
    isTransfer.value = true;
  }
};
// 转派接受
const acceptTransfer = () => {
  transferVisible.value = false;
  refuseTransferInput.value = false;
  getRiskPersonnelStatus({
    id: rowData.value.id,
    transfer_status: 3,
    transfer_reason: transferForm.value.transferRefuseReason,
  }).then(res => {
    if (res.code === 0) {
      ElMessage({
        type: 'success',
        message: '转派已接收',
      });
      alias();
    }
  });

  emit('on-updata');
};
// 转派拒绝
const refuseTransfer = () => {
  refuseTransferInput.value = true;
};
const consoleBtn = () => {
  transferVisible.value = false;
  initTransferForm();
  console.log('取消了');
};
const enterEditBtn = () => {
  transferVisible.value = false;
  if (
    transferForm.value.transferPlace ||
    transferForm.value.transferRefuseReason
  ) {
    if (refuseTransferInput.value) {
      getRiskPersonnelStatus({
        id: rowData.value.id,
        transfer_status: 4,
        transfer_reason: transferForm.value.transferRefuseReason,
      }).then(res => {
        if (res.code === 0) {
          ElMessage({
            type: 'success',
            message: '转派已拒绝',
          });
          alias();
        }
      });
    }
    if (isTransfer.value) {
      getRiskPersonnelTransfer({
        dept_id: parseInt(transferForm.value.transferPlace.slice(-1)),
        id: rowData.value.id,
        original_dept_id: rowData.value.dept_id,
      }).then(res => {
        if (res.code === 0) {
          ElMessage({
            type: 'success',
            message: '转派处理中',
          });
          alias();
        }
      });
    }
  } else {
    ElMessage({
      type: 'error',
      message: '请选择或填写有效信息！',
    });
  }
  initTransferForm();
};

/**
 * 删除
 */
const delDialogVisible = ref(false);
const delRowData = ref();
const delFunc = async (row: RiskPersonnel) => {
  delDialogVisible.value = true;
  delRowData.value = row;
};
const delConsoleFunc = () => {
  delDialogVisible.value = false;
};
const delConfirmFunc = async () => {
  delDialogVisible.value = false;
  const response = await delriskPersonnel({
    id: delRowData.value.id,
  });
  if (response.code === 0) {
    ElMessage({
      type: 'success',
      message: '删除成功！',
    });
    alias();
  }
};
/**
 * 查看相关
 */
const detailVisible = ref(false); //控制查看弹窗的显示
// 查看表单类型
type RiskListDetailType = {
  name: string;
  id_card_num: string;
  phone: string;
  origin_place: string;
  destination_place: string;
  departure_time: string;
  dept_id?: number;
  code_color: number;
};
const riskListDetail = ref<RiskListDetailType>({
  name: '',
  id_card_num: '',
  phone: '',
  origin_place: '',
  destination_place: '',
  departure_time: '',
  dept_id: 0,
  code_color: 0,
});
const seeInfoFunc = async (row: RiskPersonnel) => {
  detailVisible.value = true;
  const list = await getRiskPersonnelDetails({ id: row.id });
  console.log(list.data);
  riskListDetail.value = list.data;
  console.log(riskListDetail.value);
};
</script>
<style lang="scss" scoped>
.myTable {
  background-color: #fff;
  font-size: 14px;
  .more {
    margin-left: 15px;
    margin-top: 5px;
  }
  .refuseReason {
    margin: 15px 0 0 70px;
    width: 70%;
    text-align: center;
  }
}
</style>
