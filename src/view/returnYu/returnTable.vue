<template>
  <div class="returnTable">
    <el-table :data="tableData" class="tableData">
      <el-table-column
        prop="name"
        label="姓名"
        width="120"
        show-overflow-tooltip />
      <el-table-column
        prop="id_card_num"
        label="身份证号码"
        width="150"
        show-overflow-tooltip />
      <el-table-column
        prop="phone"
        label="手机号码"
        width="150"
        show-overflow-tooltip />
      <el-table-column
        prop="depart_detail_address"
        label="出发地"
        width="200"
        show-overflow-tooltip />
      <el-table-column
        prop="dest_detail_address"
        label="目的地"
        width="200"
        show-overflow-tooltip />
      <el-table-column
        prop="travel_type"
        label="返乡方式"
        width="120"
        show-overflow-tooltip />
      <el-table-column
        prop="control_mode"
        label="管控方式"
        width="120"
        show-overflow-tooltip>
        <template #default="scope">
          {{ changeMode(map, Number(scope.row.control_mode)) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="record_time"
        label="返乡时间"
        width="160"
        show-overflow-tooltip />
      <el-table-column
        prop="address"
        label="行政区划"
        width="120"
        show-overflow-tooltip />
      <el-table-column
        prop="dispatch_status"
        label="派发状态"
        width="120"
        show-overflow-tooltip />
      <el-table-column
        prop="dispatch_time"
        label="派发时间"
        width="120"
        show-overflow-tooltip />
      <el-table-column
        prop="transfer_status"
        label="转派状态"
        width="120"
        show-overflow-tooltip />
      <el-table-column
        prop="transfer_time"
        label="转派时间"
        width="120"
        show-overflow-tooltip />
      <el-table-column prop="transfer_reason" label="转派拒绝原因" width="180">
        <template #default="scope">
          {{ scope.row['transfer_reason'] || DEFAULT_VALUE }}
        </template>
      </el-table-column>
      <el-table-column prop="create_time" label="数据创建时间" width="180" />
      <el-table-column prop="is_baobei" label="是否报备" width="180" />
      <el-table-column prop="is_risk" label="是否为中高风险地区" width="180" />
      <el-table-column fixed="right" label="操作" width="310px">
        <template #default="scope">
          <el-button
            type="text"
            size="small"
            :icon="Tickets"
            plain
            @click="lookClick(scope.row)"
            >编辑</el-button
          >
          <el-button
            type="text"
            icon="help"
            size="small"
            plain
            @click="controlFunc(scope.row)"
            >管控方式</el-button
          >
          <el-button
            type="text"
            size="small"
            :icon="Position"
            color=""
            plain
            @click="sendFunc(scope.row)"
            >派发</el-button
          >
          <el-button
            type="text"
            size="small"
            icon="bottomRight"
            color=""
            plain
            @click="transferFunc(scope.row)"
            >转派</el-button
          >
          <el-dropdown>
            <el-button
              type="text"
              size="small"
              :icon="MoreFilled"
              plain
              class="moreButton">
              更多
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="recordFunc(scope.$index, scope.row)"
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
    <el-dialog v-model="delVisibel" title="删除" width="30%"
      >确定删除吗？
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="delVisibel = false">取消</el-button>
          <el-button type="primary" @click="deletePerson()">确定</el-button>
        </span>
      </template></el-dialog
    >
    <!-- 核酸记录弹窗 -->
    <DialogTable
      v-loading="loading"
      :total="total"
      :toptitle="toptitle"
      :visible="recordVisible"
      :headercolumn="headercolumn"
      :information-data="informationData"
      :loading="littleloading"
      @paging-query="pagingQuery"
      @changeshow="changeshow"></DialogTable>

    <!-- 分页 -->
    <div class="pagination">
      <el-pagination
        background
        :current-page="currentPage"
        :page-size="pageSize"
        :page-sizes="[10, 30, 50, 100]"
        :total="pageTotal"
        layout="total, sizes, prev, pager, next, jumper"
        @current-change="currentChange"
        @size-change="sizeChange" />
    </div>
    <!-- 查看弹窗 -->
    <addDialog
      v-model:dialogVisible="dialogVisible"
      @on-confirm="onConfirm"></addDialog>
    <!-- <el-dialog v-model="isVisibel" title="入新人员详情">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="姓名" label-align="left" width="140px">{{
          form.name
        }}</el-descriptions-item>
        <el-descriptions-item
          label="身份证号"
          label-align="left"
          width="140px"
          >{{ form.id_card_num }}</el-descriptions-item
        >
        <el-descriptions-item label="手机号码" label-align="left">{{
          form.phone
        }}</el-descriptions-item>
        <el-descriptions-item label="派发状态" label-align="left">{{
          form.dispatch_status
        }}</el-descriptions-item>
        <el-descriptions-item label="返乡时间" label-align="left">{{
          form.record_time
        }}</el-descriptions-item>
        <el-descriptions-item label="返回方式" label-align="left">{{
          form.travel_type
        }}</el-descriptions-item>
        <el-descriptions-item label="出发地" label-align="left">{{
          form.depart_detail_address
        }}</el-descriptions-item>
        <el-descriptions-item label="目的地" label-align="left">{{
          form.dest_detail_address
        }}</el-descriptions-item>
        <el-descriptions-item label="行政区划" label-align="left">{{
          form.address
        }}</el-descriptions-item>
        <el-descriptions-item label="派发时间" label-align="left">{{
          form.dispatch_time
        }}</el-descriptions-item>
        <el-descriptions-item label="转派状态" label-align="left">{{
          form.transfer_status
        }}</el-descriptions-item>
        <el-descriptions-item label="转派时间" label-align="left">{{
          form.transfer_time
        }}</el-descriptions-item>
        <el-descriptions-item label="数据创建时间" label-align="left">{{
          form.created_at
        }}</el-descriptions-item>
        <el-descriptions-item label="管控方式" label-align="left"
          ><template #default>
            {{ changeMode(map, Number(form.control_mode)) }}
          </template></el-descriptions-item
        >
        <el-descriptions-item label="转派拒绝原因" label-align="left">{{
          form.transfer_reason
        }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog> -->
    <!-- 管控方式 -->
    <ControlWayDialog
      :current_id="currentId"
      :section_type="sectionType"
      :control-visible="controlVisible"
      @change-control="changeControl"></ControlWayDialog>
    <!-- 转派弹窗 -->
    <DecentDialog
      :decent-visible="decentVisible"
      @submit="submit"
      @change-visible="changeVisible"></DecentDialog>

    <!--转派弹窗 -->
    <el-dialog v-model="transferVisible" title="转派">
      <!-- 转派的操作部分 -->
      <div>
        <!-- 未转派或者转派已接收或者转派被拒绝 -->
        <div v-if="transferId !== '转派中'">
          <span>转派至：</span>
          <el-cascader
            v-model="transferForm.transferPlace"
            :props="decentProps" />
        </div>
        <!-- 转派中 -->
        <div v-else-if="transferId === '转派中'">
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
  </div>
</template>
<script lang="ts">
export default {
  name: 'ReturnTable',
};
</script>
<script setup lang="ts">
import { ref, reactive, inject, onMounted } from 'vue';
import DialogTable from '@/components/dialogTable/index.vue';
import addDialog from './addDialog.vue';
import { ElMessage } from 'element-plus';
import DecentDialog from '@/components/decentDialog/index.vue';
import { useUserStore } from '@/pinia/modules/user';
import { Position, MoreFilled, Tickets } from '@element-plus/icons-vue';
import {
  getBackDetails,
  deletePersonnel,
  backPersonnelDiapatch,
  backPersonnelStatus,
  backPersonnelTransfer,
} from '@/api/backPerson';
import { nucleicAcid } from '@/api/keyPersonnel';
import { getDepartment } from '@/api/healthCode';
import { UTCFormat, stampFormat } from '@/utils/dateFormat';
import {
  returnMethod,
  dipatchStatus,
  transferStatus,
} from './components/returnUtils';
import { DEFAULT_VALUE } from '@/constant/tableCodeMap';
import ControlWayDialog from '@/components/controlWayDialog/index.vue';
import { controlStatus, changeMode } from '@/constant/controlModeList';
defineProps({
  tableData: {
    type: Object,
    require: true,
    default: function () {
      return [{}];
    },
  },
  form: {
    type: Object,
    require: true,
    default: function () {
      return [{}];
    },
  },
  pageTotal: {
    type: Number,
    require: true,
    default: function () {
      return [{}];
    },
  },
});
const alias = inject('reload');

//查看可视化
const dialogVisible = ref(false);

//暴露出去的分页数据
const currentPage = ref(1);
const pageSize = ref(10);

const emit = defineEmits(['editConfirm']);
const isVisibel = ref(false);
const form = ref({});
const map = ref<Map<number, string>>([]);
onMounted(() => {
  map.value = controlStatus();
  // map1.value = map;
});
// let map: Map<number, string> = controlStatus();
//点击查看
function lookClick(row: any) {
  dialogVisible.value = true;
  getBackDetails({ id: row.id }).then(res => {
    res.data.record_time = UTCFormat(res.data.record_time);
    res.data.travel_type = returnMethod(res.data.travel_type);
    res.data.dispatch_status = dipatchStatus(res.data.dispatch_status);
    res.data.transfer_status = transferStatus(res.data.transfer_status);
    res.data.transfer_time = stampFormat(Number(res.data.transfer_time));
    res.data.dispatch_time = stampFormat(Number(res.data.dispatch_time));
    res.data.created_at = UTCFormat(res.data.created_at);
    // res.data.control_mode = changeMode(map, Number(res.data.control_mode));
    form.value = res.data;
  });
}
//点击删除
const delVisibel = ref(false);
const curId = ref(0);
function delFunc(row: any) {
  delVisibel.value = true;
  curId.value = row.id;
}
function deletePerson() {
  delVisibel.value = false;
  deletePersonnel({ id: curId.value }).then(res => {
    if (res.code === 0) {
      emit('editConfirm', currentPage.value, pageSize.value);
      ElMessage({
        type: 'success',
        message: '删除人员信息成功',
        showClose: true,
      });
    }
  });
}

// 更多核酸记录组件
interface props {
  abnormal_cause: string;
  code_color: number;
  id: number;
  id_card_num: string;
  phone: string;
  scan_person: string;
  scan_time: string;
  scene_id: string;
  scene_name: string;
  sign_city: string;
  sign_time: string;
}
let informationData = ref<props[]>([]);
//子组件修改
const total = ref(0); //小表格数据总量
const loading = ref(true);
const id = ref(0);
//修改小表格中的 pageSize 所有的小表格 pagesize 都需要改变
const littlepageSize = ref(10);
const littleloading = ref(true);
const pagingQuery = (page: number, pageSize: number) => {
  //记录页码
  littlepageSize.value = pageSize;
  littleloading.value = true;
  nucleicAcid({
    id: id.value,
    section_type: 3,
    page: page,
    pageSize: pageSize,
  }).then(res => {
    informationData.value = res.data.AcidRecordInfo;
    littleloading.value = false;
  });
};
const recordVisible = ref(false);
const toptitle = ref('核酸记录');
const headercolumn = reactive([
  { label: '姓名', prop: 'patient_name' },
  { label: '身份证号码', prop: 'certificate_num' },
  { label: '手机号码', prop: 'mobile' },
  { label: '核算报告时间', prop: 'upload_time' },
  { label: '核算检测地点', prop: 'census_Address' },
  { label: '核算检测结果', prop: 'state' },
]);
const changeshow = (booblean: boolean) => {
  recordVisible.value = booblean;
  console.log(recordVisible.value);
};

interface tableDataType {
  id: number;
  depart_detail_address: string;
  dept_id: number;
  dest_detail_address: string;
  dispatch_status: string;
  dispatch_time: number;
  id_card_num: string;
  name: string;
  original_dept_id: number;
  phone: string;
  record_time: string;
  transfer_reason: string;
  transfer_status: string;
  transfer_time: string;
  travel_type: string;
}
function recordFunc(index: number, row: tableDataType) {
  littleloading.value = true;
  id.value = row.id;
  recordVisible.value = true;
  nucleicAcid({
    id: row.id,
    section_type: 3,
    page: 1,
    pageSize: littlepageSize.value,
  }).then(res => {
    informationData.value = res.data.AcidRecordInfo;
    total.value = res.data.Count;
    littleloading.value = false;
  });
}

// ???
const { userInfo } = useUserStore();
/**
 * 派发相关操作
 */
const decentVisible = ref(false);
const changeVisible = (boolean: boolean) => {
  console.log('时间调用');

  decentVisible.value = boolean;
  // console.log(decentVisible.value, 1111111);
};
const submit = (deptId: number, controlMode: number) => {
  backPersonnelDiapatch({
    dept_id: deptId,
    id: currentId.value,
    control_mode: controlMode,
  }).then(res => {
    if (res.code === 0) {
      ElMessage({
        showClose: true,
        message: '派发成功',
        type: 'success',
      });
    }
    emit('editConfirm', currentPage.value, pageSize.value);
  });
};

const currentId = ref();

const sendFunc = (row: HealthCode) => {
  decentVisible.value = true;
  currentId.value = row.id;
};
interface HealthCode {
  id: number;
  name: string; //姓名
  code_color: string; //健康码状态
  control_mode: string; //管控方式
  phone: string; //手机号
  certificate_num: string; //身份证号
  desc: string; //备注
  give_code_reason: string; //赋码原因
  distributePlace: number; //派发至
  dispatch_status: number; //派发状态
  transfer_status: number; //转派状态
  give_code_time: string; //赋码时间
  transferRefuseReason: string;
  dept_id: number;
  remark: string;
  is_baobei: number; //是否报备
  is_risk: number; //是否中高风险地区
}

// 管控方式
const controlVisible = ref(false);
const sectionType = 3;
const controlFunc = (row: HealthCode) => {
  controlVisible.value = true;
  currentId.value = row.id;
};
const changeControl = (boolean: boolean) => {
  controlVisible.value = boolean;
};

/**
 * 新增中派发接口数据
 * */
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
/**
 * 转派的相关操作
 */
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
const initTransferForm = () => {
  transferForm.value = {
    transferPlace: '',
    transferRefuseReason: '',
  };
};
const rowData = ref();
const isTransfer = ref(false);
const transferFunc = (row: HealthCode) => {
  initTransferForm();
  transferVisible.value = true;
  rowData.value = row;
  console.log(111111111, rowData.value);
  transferId.value = row.transfer_status;
  if (
    transferId.value === '未转派' ||
    transferId.value === '转派成功' ||
    transferId.value === '转派拒绝'
  ) {
    isTransfer.value = true;
  }
};
// 转派接受

const acceptTransfer = () => {
  backPersonnelStatus({
    id: rowData.value.id,
    transfer_status: 3,
    transfer_reason: transferForm.value.transferRefuseReason,
  }).then(res => {
    if (res.code === 0) {
      ElMessage({
        type: 'success',
        message: '转派接收！',
      });
      alias();
    }
  });
  transferVisible.value = false;
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

//分页数据

const enterEditBtn = () => {
  transferVisible.value = false;
  if (
    transferForm.value.transferPlace ||
    transferForm.value.transferRefuseReason
  ) {
    if (refuseTransferInput.value) {
      backPersonnelStatus({
        id: rowData.value.id,
        transfer_status: 4,
        transfer_reason: transferForm.value.transferRefuseReason,
      }).then(res => {
        if (res.code === 0) {
          ElMessage({
            type: 'success',
            message: '转派拒绝！',
          });
          alias();
        }
      });
    }
    if (isTransfer.value) {
      backPersonnelTransfer({
        dept_id: parseInt(transferForm.value.transferPlace.slice(-1)),
        id: rowData.value.id,
        original_dept_id: rowData.value.dept_id,
      }).then(res => {
        if (res.code === 0) {
          ElMessage({
            type: 'success',
            message: '转派成功！',
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

const currentChange = (val: number) => {
  currentPage.value = val;
  emit('editConfirm', currentPage.value, pageSize.value);
};
const sizeChange = (val: number) => {
  pageSize.value = val;
  emit('editConfirm', currentPage.value, pageSize.value);
};
</script>
<style lang="scss" scoped>
.returnTable {
  background-color: #fff;
  .tableData {
    border: 0.5px solid rgba(230, 230, 230, 1);
    border-bottom: none;
  }
  .moreButton {
    margin-left: 10px;
    margin-top: 4px;
  }
  .dialog {
    margin: 0 50px;
  }
  .refuseReason {
    margin: 15px 0 0 0px;
    width: 70%;
    text-align: center;
  }
  .pagination {
    display: flex;
    justify-content: flex-end;
    margin-right: 50px;
  }
}
</style>
