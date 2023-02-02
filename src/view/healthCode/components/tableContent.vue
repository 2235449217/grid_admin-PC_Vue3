<template>
  <div class="page">
    <div class="buttonGroup">
      <el-button icon="plus" type="primary" size="small" @click="addDialog"
        >新增</el-button
      >
      <el-button
        icon="upload"
        type="primary"
        plain
        size="small"
        @click="importFunc"
        >导入</el-button
      >
      <el-button icon="download" size="small" @click="exportFunc"
        >导出</el-button
      >
    </div>
    <div>
      <el-table
        ref="updataList"
        border
        :data="tableData"
        style="width: 100%"
        table-layout="fixed">
        <el-table-column prop="sort" label="序号" width="80" type="index" />
        <el-table-column prop="name" label="姓名" min-width="120" sortable />
        <el-table-column
          prop="certificate_num"
          label="身份证号"
          min-width="150" />
        <el-table-column
          prop="phone"
          label="手机号码"
          min-width="120"
          sortable />
        <el-table-column prop="code_color" label="健康码状态" min-width="120">
          <template #default="scope">
            <HealthCodeColor
              :color-data="scope.row.code_color"></HealthCodeColor>
          </template>
        </el-table-column>
        <el-table-column
          prop="give_code_time"
          label="赋码时间"
          min-width="180" />
        <el-table-column
          prop="give_code_reason"
          label="赋码原因"
          min-width="120"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="control_mode" label="管控方式" min-width="120" />
        <el-table-column
          prop="dept_name"
          label="行政区划"
          min-width="120"
          show-overflow-tooltip />
        <el-table-column
          prop="dispatch_status"
          label="派发状态"
          min-width="120">
        </el-table-column>
        <el-table-column
          prop="dispatch_time"
          label="派发时间"
          min-width="180" />
        <el-table-column
          prop="transfer_status"
          label="转派状态"
          min-width="120" />
        <el-table-column
          prop="transfer_time"
          label="转派时间"
          min-width="180" />
        <el-table-column
          prop="transfer_reason"
          label="转派拒绝原因"
          min-width="120"
          show-overflow-tooltip>
          <template #default="scope">
            {{ scope.row['transfer_reason'] || DEFAULT_VALUE }}
          </template>
        </el-table-column>
        <el-table-column
          prop="remark"
          label="备注"
          min-width="120"
          show-overflow-tooltip>
          <template #default="scope">
            {{ scope.row['remark'] || DEFAULT_VALUE }}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="320px">
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
              icon="help"
              size="small"
              plain
              @click="controlFunc(scope.row)"
              >管控方式</el-button
            >
            <el-button
              type="text"
              :icon="Position"
              size="small"
              color=""
              plain
              @click="sendFunc(scope.row)"
              >派发</el-button
            >
            <el-button
              type="text"
              :icon="BottomRight"
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
                  <el-dropdown-item @click="returnYu(scope.row)"
                    >入新人员</el-dropdown-item
                  >
                  <el-dropdown-item @click="scanCode(scope.row)"
                    >扫码记录</el-dropdown-item
                  >
                  <el-dropdown-item @click="deleteHealth(scope.row)"
                    >删除</el-dropdown-item
                  >
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </div>
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
    <!-- 核酸记录表 -->
    <DialogTable
      :total="total"
      :toptitle="innerTitle"
      :loading="littleloading"
      :visible="innerVisible"
      :information-data="informationData"
      :headercolumn="headercolumn"
      @changeshow="changeshow"
      @paging-query="pagingQuery"></DialogTable>
    <!-- 新增健康码信息 -->
    <el-dialog v-model="dialogFormVisible" title="新增" draggable>
      <el-form
        ref="healthCodeForm"
        :model="form"
        label-width="100px"
        label-position="right"
        :rules="rules"
        style="justity-content: space-around">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label=" 姓  名 " prop="name">
              <el-input
                v-model="form.name"
                autocomplete="off"
                placeholder="请输入姓名"
                maxlength="10"
                show-word-limit />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label=" 身份证号码" prop="certificate_num">
              <el-input
                v-model="form.certificate_num"
                autocomplete="off"
                placeholder="请输入身份证号码"
                maxlength="18"
                show-word-limit />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号码" prop="phone">
              <el-input
                v-model="form.phone"
                autocomplete="off"
                placeholder="请输手机号码"
                maxlength="11"
                show-word-limit />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="健康码状态" prop="code_color">
              <el-select
                v-model="form.code_color"
                style="width: 100%"
                placeholder="请选择健康码状态">
                <el-option label="绿码" value="1" />
                <el-option label="黄码" value="2" />
                <el-option label="红码" value="3" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="赋码原因" prop="give_code_reason">
              <el-input
                v-model="form.give_code_reason"
                type="textarea"
                placeholder="请输入内容"
                maxlength="200"
                show-word-limit
                rows="2"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="管控方式" prop="control_mode">
              <el-select
                v-model="form.control_mode"
                style="width: 100%"
                placeholder="请选择管控方式">
                <el-option
                  v-for="(item, index) in control_list"
                  :key="index"
                  :label="item.label"
                  :value="item.value" />
                <!-- <el-option label="无" value="无" /> -->
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备注" prop="remark">
              <el-input
                v-model="form.remark"
                type="textarea"
                placeholder="请输入内容"
                maxlength="200"
                show-word-limit
                rows="2"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeDialog"> 取 消 </el-button>
          <el-button type="primary" @click="enterForm">确定</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 查看弹窗 -->
    <el-dialog v-model="viewVisible" title="健康码详情" dragger width="70%">
      <el-descriptions :column="3" border>
        <el-descriptions-item
          label="姓名"
          label-align="left"
          align="center"
          label-class-name="my-label"
          class-name="my-content"
          width="120px"
          >{{ viewData.name }}</el-descriptions-item
        >
        <el-descriptions-item
          label="身份证号"
          label-align="left"
          width="120px"
          align="center"
          >{{ viewData.certificate_num }}</el-descriptions-item
        >
        <el-descriptions-item
          label="手机号"
          label-align="left"
          width="200px"
          align="center"
          >{{ viewData.phone }}</el-descriptions-item
        >
        <el-descriptions-item
          label="健康码状态"
          label-align="left"
          align="center">
          <HealthCodeColor :color-data="viewData.code_color"></HealthCodeColor>
        </el-descriptions-item>
        <el-descriptions-item
          label="管控方式"
          label-align="left"
          align="center"
          >{{ viewData.control_mode }}</el-descriptions-item
        >
        <el-descriptions-item
          label="赋码时间"
          label-align="left"
          align="center"
          >{{ viewData.give_code_time }}</el-descriptions-item
        >
        <el-descriptions-item
          label="行政区划"
          label-align="left"
          align="center"
          >{{ viewData.dept_name }}</el-descriptions-item
        >
        <el-descriptions-item
          label="派发状态"
          label-align="left"
          align="center"
          >{{ viewData.dispatch_status }}</el-descriptions-item
        >
        <el-descriptions-item
          label="派发时间"
          label-align="left"
          align="center"
          >{{ viewData.dispatch_time }}</el-descriptions-item
        >
        <el-descriptions-item label="备注" label-align="left" align="center">{{
          viewData.remark || DEFAULT_VALUE
        }}</el-descriptions-item>
        <el-descriptions-item
          label="转派状态"
          label-align="left"
          align="center"
          >{{ viewData.transfer_status }}</el-descriptions-item
        >
        <el-descriptions-item
          label="转派时间"
          label-align="left"
          align="center"
          >{{ viewData.transfer_time }}</el-descriptions-item
        >
        <el-descriptions-item
          label="赋码原因"
          label-align="left"
          align="center"
          >{{ viewData.give_code_reason }}</el-descriptions-item
        >
      </el-descriptions>
    </el-dialog>
    <!-- 管控方式 -->
    <ControlWayDialog
      :current_id="currentId"
      :section_type="sectionType"
      :control-visible="controlVisible"
      @change-control="changeControl"></ControlWayDialog>
    <!-- 导入派发弹窗 -->
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
              v-model="transferForm.transfer_reason"
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
    <!-- 导入文件 -->
    <ImportExcel ref="dialogRef"></ImportExcel>
  </div>
</template>
<script lang="ts">
export default { name: 'TableContent' };
</script>
<script setup lang="ts">
import { inject, onMounted, ref, toRefs } from 'vue';
import {
  addHealthCode,
  dispatch,
  getDepartment,
  getHealthCodeDetails,
  healthCodeTransfer,
  healthCodeTransferstatus,
  delCode,
  importExcel,
  exportExcel,
  importTemplate,
  controlModeList,
} from '@/api/healthCode';
import ImportExcel from './importExcel.vue';
import {
  BottomRight,
  View,
  Position,
  MoreFilled,
} from '@element-plus/icons-vue';
import DialogTable from '@/components/dialogTable/index.vue';
import DecentDialog from '@/components/decentDialog/index.vue';
import { ElMessage } from 'element-plus';
import { nucleicAcid } from '@/api/keyPersonnel';
import { returnInfo } from '@/api/backPerson';
import { sceneCode } from '@/api/venueCode';
import { UTCFormat } from '@/utils/dateFormat';
import HealthCodeColor from '@/components/healthCodeColor/index.vue';
import { DEFAULT_VALUE } from '@/constant/tableCodeMap';
import ControlWayDialog from '@/components/controlWayDialog/index.vue';

// 子组件接收父组件传来的方法
const emit = defineEmits(['loadData']);

const props = defineProps<{
  ddptid: number;
  tableData: HealthCodeForm[];
  searchForm: searchType;
}>();

const { searchForm, tableData } = toRefs(props);

type searchType = {
  id_card?: string;
  dept_id?: number;
  code_color?: number;
  control_mode?: number;
  dispatch_status?: number;
  time_frame?: string[];
};

//上传
interface DialogExpose {
  acceptParams: (params: any) => void;
}
const dialogRef = ref<DialogExpose>();
const importFunc = () => {
  let params = {
    title: '添加',
    importUrl: importExcel,
    tempUrl: importTemplate,
    section_type: 1,
    // getTableList: getTableList, //操作成功之后刷新数据
  };
  console.log(dialogRef);
  dialogRef.value?.acceptParams(params);
  console.log('上传页面弹出成功');
};
// 导出
const exportFunc = async () => {
  console.log(searchForm.value);
  const response = await exportExcel({
    ...searchForm.value,
  });
  const blob = new Blob([response.data], {
    type: response.headers['content-type'],
  });
  console.log('99999', blob);
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

// 新增表单
type HealthCodeForm = {
  id: number;
  name: string; //姓名
  code_color: number; //健康码状态
  control_mode: string; //管控方式
  phone: string; //手机号
  certificate_num: string; //身份证号
  give_code_reason: string; //赋码原因
  dispatch_status: string; //派发状态
  transfer_status: string; //转派状态
  give_code_time: string; //赋码时间
  remark: string;
  dispatch_address: string;
  dept_name: string;
  transfer_reason: string;
};
const dialogFormVisible = ref(false);

// 添加字段时的校验规则
const rules = ref({
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  certificate_num: [
    { required: true, message: '请输入身份证号', trigger: 'blur' },
    {
      pattern:
        /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
      message: '请输入正确的身份证号码',
      trigger: 'blur',
    },
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    {
      pattern:
        /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,
      message: '请输入正确的手机号',
      trigger: 'blur',
    },
  ],
  code_color: [
    { required: true, message: '请选择健康码状态', trigger: 'blur' },
  ],
  control_mode: [
    { required: true, message: '请选择管控方式', trigger: 'blur' },
  ],
  transfer_reason: [
    { required: true, message: '请选择管控方式', tigger: 'blur' },
  ],
  give_code_reason: [
    { required: true, message: '请填写赋码原因', tigger: 'blur' },
  ],
});

const form = ref({
  name: '',
  code_color: '',
  control_mode: '',
  dispatch_status: '',
  dispatch_time: '',
  phone: '',
  certificate_num: '',
  give_code_time: '',
  give_code_reason: '',
  dept_name: '',
  transfer_status: '',
  transfer_reason: '',
  remark: '',
});

// 初始化表单
const healthCodeForm = ref();
const initForm = () => {
  if (healthCodeForm.value) {
    healthCodeForm.value.resetFields();
  }
  form.value = {
    name: '',
    phone: '',
    certificate_num: '',
    code_color: '',
    control_mode: '',
    dispatch_status: '',
    dispatch_time: '',
    give_code_reason: '',
    give_code_time: '',
    transfer_status: '',
    dept_name: '',
    transfer_reason: '',
    remark: '',
  };
};

/**
 * 新增相关
 */

// 打开新增弹窗
const openDialog = () => {
  initForm();
  dialogFormVisible.value = true;
};

//关闭新增弹窗
const closeDialog = () => {
  initForm();
  dialogFormVisible.value = false;
};
interface HealthCode {
  id: number;
  name: string; //姓名
  code_color: number; //健康码状态
  control_mode: string; //管控方式
  phone: string; //手机号
  certificate_num: string; //身份证号
  dept_name: string; //派发至
  dispatch_status: string; //派发状态
  dispatch_time: string; //派发时间
  transfer_status: string; //转派状态
  transfer_time: string; //转派时间
  transfer_reason: string;
  give_code_time: string; //赋码时间
  give_code_reason: string; //赋码原因
  dept_id?: number;
  remark: string;
}
// let healthCode = ref<HealthCode[]>([]);

// 确定弹窗
const enterForm = () => {
  healthCodeForm.value.validate(async (valid: HealthCode) => {
    if (valid) {
      await addHealthCode({
        certificate_num: form.value.certificate_num,
        code_color: parseInt(form.value.code_color),
        control_mode: parseInt(form.value.control_mode),
        give_code_reason: form.value.give_code_reason,
        name: form.value.name,
        phone: form.value.phone,
        remark: form.value.remark,
      }).then(res => {
        if (res.code === 0) {
          ElMessage({
            type: 'success',
            message: '新增成功！',
          });
          emit('loadData');
        }
      });
    }
    closeDialog();
  });
};
const addDialog = () => {
  openDialog();
};
/**
 * 查看相关
 */

const viewVisible = ref(false);
const viewData = ref({
  name: '', //姓名
  code_color: 0, //健康码状态
  control_mode: '', //管控方式
  phone: '', //手机号
  certificate_num: '', //身份证号
  give_code_reason: '', //赋码原因
  dept_name: '', //派发至
  dispatch_status: '', //派发状态
  dispatch_time: '',
  transfer_status: '', //转派状态
  transfer_time: '', //转派状态
  give_code_time: '', //赋码时间
  transfer_reason: '',
  remark: '',
});
const seeInfoFunc = async (row: HealthCode) => {
  viewVisible.value = true;
  const res = await getHealthCodeDetails({ id: row.id });
  viewData.value = row;
};

/**
 * 三个内部弹窗
 */
const innerVisible = ref(false);
// 引入更多中代码记录部分
const innerTitle = ref('核酸记录');
const headercolumn = ref<any[]>([]);
const rnaHeadcolumn = [
  { label: '姓名', prop: 'patient_name', width: '100px' },
  { label: '身份证号码', prop: 'certificate_num', width: '120px' },
  { label: '核酸检测结果', prop: 'state', width: '100px' },
  { label: '核酸报告时间', prop: 'upload_time', width: '120px' },
  { label: '核酸检测机构', prop: 'census_Address', width: '150px' },
];
const yuHeadcolumn = [
  { label: '姓名', prop: 'name', width: '100px' },
  { label: '身份证号码', prop: 'id_card_num', width: '120px' },
  { label: '出发地', prop: 'depart_detail_address', width: '150px' },
  { label: '目的地', prop: 'dest_detail_address', width: '150px' },
  { label: '返乡时间', prop: 'record_time', width: '120px' },
  { label: '返乡方式', prop: 'travel_type', width: '100px' },
  { label: '派发至', prop: 'address', width: '120px' },
];
const scanCodeHeadcolumn = [
  { label: '单位名称', prop: 'scene_name' },
  { label: '场所代码', prop: 'scene_code' },
  { label: '证件号码', prop: 'id_card' },
  { label: '联系方式', prop: 'phone' },
  { label: '扫码时间', prop: 'scan_time' },
  { label: '亮码', prop: 'code_color' },
];

type nucType = {
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
type scanType = {
  scene_name: string;
  scene_code: string;
  id_card: string;
  phone: string;
  scan_time: string;
  code_color: number;
};
type ruyuType = {
  name: string;
  id_card_num: string;
  record_time: string;
  depart_detail_address: string;
  dest_detail_address: string;
  travel_type: number;
  address: string;
};
interface prop {
  nuc?: nucType;
  scan?: scanType;
  ruyu?: ruyuType;
}
let informationData = ref<prop[]>([]);
const total = ref(0); //小表格数据总量
const loading = ref(true);

const changeshow = (booblean: boolean) => {
  innerVisible.value = booblean;
};
const id = ref(0);
//修改小表格中的 pageSize 所有的小表格 pagesize 都需要改变
const littlepageSize = ref(10);
const littleloading = ref(true);
const pagingQuery = async (page: number, pageSize: number) => {
  littlepageSize.value = pageSize;
  littleloading.value = true;
  if (innerTitle.value === '核酸记录') {
    nucleicAcid({
      id: id.value,
      section_type: 1,
      page: page,
      pageSize: pageSize,
    }).then(res => {
      informationData.value = res.data.AcidRecordInfo;
      littleloading.value = false;
    });
  } else if (innerTitle.value === '入新记录') {
    returnInfo({
      id: id.value,
      section_type: 1,
      page: page,
      pageSize: pageSize,
    }).then(res => {
      informationData.value = res.data.ReturnInfo;
      littleloading.value = false;
    });
  } else if (innerTitle.value === '扫码记录') {
    const res = await sceneCode({
      id: id.value,
      section_type: 1,
      page: page,
      pageSize: pageSize,
    });
    for (const i of res.data.ScanRecord) {
      i.scan_time = UTCFormat(i.scan_time);
    }
    informationData.value = res.data.ScanRecord;
    littleloading.value = false;
  }
};

/**
 * 核酸记录
 * @param row
 */
const rnaRecord = async (row: HealthCode) => {
  littleloading.value = true;
  informationData.value = [];
  innerTitle.value = '核酸记录';
  headercolumn.value = rnaHeadcolumn;
  id.value = row.id;
  innerVisible.value = true;
  const res = await nucleicAcid({
    id: row.id,
    section_type: 1,
    page: 1,
    pageSize: littlepageSize.value,
  });
  informationData.value = res.data.AcidRecordInfo;
  total.value = res.data.Count;
  littleloading.value = false;
};
/**
 * 入新记录
 */
const returnYu = async (row: HealthCode) => {
  littleloading.value = true;
  informationData.value = [];
  innerVisible.value = true;
  headercolumn.value = yuHeadcolumn;
  id.value = row.id;
  innerTitle.value = '入新记录';
  const res = await returnInfo({
    id: row.id,
    section_type: 1,
    page: 1,
    pageSize: littlepageSize.value,
  });
  informationData.value = res.data.ReturnInfo;
  total.value = res.data.count;
  littleloading.value = false;
};

/**
 * 获取场所记录表
 */
const scanCode = async (row: HealthCode) => {
  littleloading.value = true;
  informationData.value = [];
  innerVisible.value = true;
  id.value = row.id;
  innerTitle.value = '扫码记录';
  headercolumn.value = scanCodeHeadcolumn;
  // const promise = () => {
  //   return new Promise(resolve => {
  //     setTimeout(() => {
  //       resolve(true);
  //     }, 5000);
  //   });
  // };
  // await promise();
  const res = await sceneCode({
    id: row.id,
    section_type: 1,
    page: 1,
    pageSize: littlepageSize.value,
  });
  console.log(res, 1111111111111);
  informationData.value = res.data.ScanRecord;
  total.value = res.data.count;
  littleloading.value = false;
};

/**
 * 删除相关
 * @param row
 */
const delDialogVisible = ref(false);
const delRowData = ref();
const deleteHealth = (row: HealthCode) => {
  delDialogVisible.value = true;
  delRowData.value = row;
};
const delConsoleFunc = () => {
  delDialogVisible.value = false;
};
const delConfirmFunc = async () => {
  delDialogVisible.value = false;
  const response = await delCode({
    id: delRowData.value.id,
  });
  if (response.code === 0) {
    ElMessage({
      type: 'success',
      message: '删除成功！',
    });
    emit('loadData');
  }
};

/**
 * 派发相关操作
 */
const decentVisible = ref(false);
const changeVisible = (boolean: boolean) => {
  // console.log('时间调用');
  decentVisible.value = boolean;
  // console.log(decentVisible.value, 1111111);
};
const submit = (deptId: number, controlMode: number) => {
  dispatch({
    dept_id: deptId,
    id: currentId.value,
    control_mode: controlMode,
  }).then(res => {
    if (res.code === 0) {
      ElMessage({
        type: 'success',
        message: '派发成功！',
      });
      emit('loadData');
    }
    // console.log(res, 11111);
  });
};

const currentId = ref();
const alias = inject('reload');
// 派发
const sendFunc = (row: HealthCode) => {
  decentVisible.value = true;
  currentId.value = row.id;
};

// 管控方式
const controlVisible = ref(false);
const sectionType = 1;
const controlFunc = (row: HealthCode) => {
  controlVisible.value = true;
  currentId.value = row.id;
};
const changeControl = (boolean: boolean) => {
  controlVisible.value = boolean;
};

/**
 * 转派接口数据
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
      // console.log(res.data);
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
  transfer_reason: '',
});
type TransferForm = {
  transferPlace: number;
  transfer_reason: string;
};
const initTransferForm = () => {
  transferForm.value = {
    transferPlace: '',
    transfer_reason: '',
  };
};
const rowData = ref();
const isTransfer = ref(false);
// 转派判断
const transferFunc = (row: HealthCode) => {
  initTransferForm();
  transferVisible.value = true;
  rowData.value = row;
  // console.log(111111111, rowData.value);
  transferId.value = row.transfer_status;
  // console.log(8888888888888, row.transfer_status, transferId.value);
  if (transferId.value !== '转派中') {
    isTransfer.value = true;
  }
};
// 转派接受
const acceptTransfer = () => {
  transferVisible.value = false;
  refuseTransferInput.value = false;
  healthCodeTransferstatus({
    id: rowData.value.id,
    transfer_status: 3,
    transfer_reason: transferForm.value.transfer_reason,
  }).then(res => {
    if (res.code === 0) {
      ElMessage({
        type: 'success',
        message: '转派接收！',
      });
      alias();
    }
  });
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
// 点击确定
const enterEditBtn = () => {
  transferVisible.value = false;
  if (transferForm.value.transferPlace || transferForm.value.transfer_reason) {
    if (refuseTransferInput.value) {
      healthCodeTransferstatus({
        id: rowData.value.id,
        transfer_status: 4,
        transfer_reason: transferForm.value.transfer_reason,
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
      healthCodeTransfer({
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

const control_list = ref([
  {
    lable: '',
    value: '',
  },
]);
// 页面初始化
onMounted(async () => {
  const res = await controlModeList({ section_type: 1 });
  // console.log(res.data);
  control_list.value = res.data;
});
</script>
<style lang="scss" scoped>
.page {
  background-color: #fff;
  .buttonGroup {
    margin-bottom: 15px;
  }
  .refuseReason {
    margin: 15px 0 0 70px;
    width: 70%;
    text-align: center;
  }
  .more {
    margin-left: 15px;
    margin-top: 5px;
  }
}
</style>
