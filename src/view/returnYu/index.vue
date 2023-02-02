<template>
  <div class="page">
    <!-- 头部 -->
    <div class="gva-search-box">
      <el-form :inline="true" :model="searchCriteria">
        <el-form-item label="派发状态">
          <el-select
            v-model="searchCriteria.dispatch_status"
            placeholder="请选择">
            <el-option
              v-for="(item, index) in disPatchStatus"
              :key="index"
              :label="item.name"
              :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否报备">
          <el-select
            v-model="searchCriteria.dispatch_status"
            placeholder="请选择">
            <el-option
              v-for="(item, index) in is_baobei"
              :key="index"
              :label="item.name"
              :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否管控">
          <el-select
            v-model="searchCriteria.dispatch_status"
            placeholder="请选择">
            <el-option
              v-for="(item, index) in is_control"
              :key="index"
              :label="item.name"
              :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否中高风险地区">
          <el-select
            v-model="searchCriteria.dispatch_status"
            placeholder="请选择">
            <el-option
              v-for="(item, index) in is_risk"
              :key="index"
              :label="item.name"
              :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="身份证号码">
          <el-input
            v-model="searchCriteria.identity"
            placeholder="请输入身份证号码" />
        </el-form-item>
        <el-form-item label="日期范围">
          <el-date-picker
            v-model="searchCriteria.date"
            type="daterange"
            range-separator="至"
            start-placeholder="开始"
            end-placeholder="结束"
            :default-time="defaultTime" />
        </el-form-item>
        <el-form-item>
          <el-button
            size="small"
            type="primary"
            icon="search"
            :disabled="disabled"
            @click="selectFunc">
            查询
          </el-button>
          <el-button
            size="small"
            icon="refresh"
            :disabled="disabled"
            @click="resetFunc">
            重置
          </el-button>
        </el-form-item>
      </el-form>
      <el-form> </el-form>
    </div>
    <!-- 弹窗部分 -->
    <addDialog
      v-model:dialogVisible="dialogVisible"
      @on-confirm="onConfirm"></addDialog>
    <!-- 内容部分 -->
    <div class="content">
      <!-- 网格树形组件 -->
      <DeptTree :on-change="handleDeptChange" />
      <div class="gva-table-box table-box">
        <el-button
          size="small"
          type="primary"
          icon="plus"
          @click="dialogVisible = true">
          新增
        </el-button>
        <ReturnTable
          v-loading="loading"
          :table-data="tableData"
          :page-total="pageTotal"
          class="returnTable"
          @editConfirm="editConfirm"></ReturnTable>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
export default {
  name: 'ReturnYu',
};
</script>
<script setup lang="ts">
import { ref, reactive, toRefs, onMounted } from 'vue';
import AddDialog from './addDialog.vue';
import ReturnTable from './returnTable.vue';
import { getBackPerson } from '@/api/backPerson';
import DeptTree from '@/components/deptTree/index.vue';
import { TreeType } from '@/components/deptTree/types';
import { UTCFormat, stampFormat } from '@/utils/dateFormat';
import {
  returnMethod,
  dipatchStatus,
  transferStatus,
} from './components/returnUtils';
import { controlStatus, changeMode } from '@/constant/controlModeList';
const loading = ref(false);
const disabled = ref(false);
// 分页
const pageTotal = ref();
const page_size = ref(10);
const current_page = ref(1);
// 部门树形组件
const deptSelected = ref(0);
// 日期默认值
const defaultTime = ref([
  new Date(2000, 1, 1, 0, 0, 0),
  new Date(2000, 2, 1, 23, 59, 59),
]);
// 搜索条件
type searchCriteriaType = {
  identity?: string;
  date?: [Date, Date];
  dispatch_status?: number;
};
const searchCriteria = ref<searchCriteriaType>({});
//派发状态
const disPatchStatus = ref([
  { name: '未派发', value: 1 },
  { name: '已派发', value: 2 },
]);
//是否报备
const is_baobei = ref([
  { name: '已报备', value: 1 },
  { name: '未报备', value: 2 },
  { name: '自行摸查', value: 3 },
]);
//是否中高风险
const is_risk = ref([
  { name: '高风险', value: 1 },
  { name: '中风险', value: 2 },
  { name: '低风险', value: 3 },
  { name: '无风险', value: 4 },
]);
//是否管控
const is_control = ref([
  { name: '已管控', value: 1 },
  { name: '未管控', value: 2 },
]);
// 定义数据tableDataType数据类型
interface tableDataType {
  depart_detail_address: string;
  dept_id: number;
  dest_detail_address: string;
  dispatch_status: string;
  dispatch_time: string;
  id_card_num: string;
  name: string;
  original_dept_id: number;
  phone: string;
  record_time: string;
  transfer_reason: string;
  transfer_status: string;
  transfer_time: string;
  travel_type: string;
  create_time: string;
  control_mode?: string;
  is_baobei: string;
  is_risk: string;
}
const tableData = ref([] as tableDataType[]);

/*************************
 * 弹窗
 ************************/
interface State {
  dialogVisible: boolean;
}
const state = reactive<State>({
  dialogVisible: false,
});
const { dialogVisible } = toRefs(state);
const onConfirm = (value: string) => {
  console.log('父组件打印:', value);
  state.dialogVisible = false;
  resetFunc();
};

/***********************
 * 加载数据的方法
 ***********************/
// let map: Map<number, string>;

const loadData = async (obj: any) => {
  loading.value = true;
  const res = await getBackPerson(obj);
  if (res.data.BackPersonnel) {
    let i: tableDataType;
    // const map: Map<number, string> = controlStatus();
    for (i of res.data.BackPersonnel) {
      i.record_time = UTCFormat(i.record_time);
      i.travel_type = returnMethod(i.travel_type);
      i.dispatch_status = dipatchStatus(i.dispatch_status);
      i.transfer_status = transferStatus(i.transfer_status);
      i.transfer_time = stampFormat(Number(i.transfer_time));
      i.dispatch_time = stampFormat(Number(i.dispatch_time));
      i.create_time = UTCFormat(i.create_time);
      // i.control_mode = changeMode(map, Number(i.control_mode));
    }
  }
  tableData.value = res.data.BackPersonnel;
  pageTotal.value = res.data.count;
  loading.value = false;
};
/***********************
 * 生命周期调查询所有数据
 ***********************/
onMounted(async () => {
  const obj = {
    dept_id: 0,
    id_card_num: '',
    dispatch_status: '',
    page: 1,
    pageSize: 10,
  };
  await loadData(obj);
});
/***********************
 * 点击查询
 ***********************/
const selectFunc = async () => {
  const obj = {
    dept_id: deptSelected.value,
    id_card_num: JSON.parse(JSON.stringify(searchCriteria.value)).identity,
    dispatch_status: JSON.parse(JSON.stringify(searchCriteria.value))
      .dispatch_status,
    page: 1,
    pageSize: 10,
    time_frame: JSON.parse(JSON.stringify(searchCriteria.value)).date,
  };
  await loadData(obj);
};
/***********************
 * 点击重置
 ***********************/
const resetFunc = async () => {
  const obj = {
    dept_id: 0,
    id_card_num: '',
    page: 1,
    pageSize: page_size.value,
    dispatch_status: '',
  };
  await loadData(obj);
  // 清空输入框和树形
  searchCriteria.value = {};
  deptSelected.value = 0;
};
/*************************
 *点击树形组件重新获取接口
 ************************/
const handleDeptChange = async (dept: TreeType) => {
  deptSelected.value = dept.id;
  const obj = {
    dept_id: deptSelected.value,
    id_card_num: JSON.parse(JSON.stringify(searchCriteria.value)).identity,
    dispatch_status: JSON.parse(JSON.stringify(searchCriteria.value))
      .dispatch_status,
    page: current_page.value,
    pageSize: page_size.value,
  };
  await loadData(obj);
};
/*************************
 点击分页触发的方法（重新调取获取数据的接口）
 ************************/
const editConfirm = async (currentPage: number, pageSize: number) => {
  page_size.value = pageSize;
  current_page.value = currentPage;
  const obj = {
    dept_id: deptSelected.value,
    id_card_num: JSON.parse(JSON.stringify(searchCriteria.value)).identity,
    dispatch_status: JSON.parse(JSON.stringify(searchCriteria.value))
      .dispatch_status,
    page: current_page.value,
    pageSize: page_size.value,
  };
  await loadData(obj);
};
</script>
<style lang="scss" scoped>
.page {
  .content {
    display: flex;
    // grid-template-columns: repeat(2, auto);
    background-color: #fff;
    .table-box {
      .returnTable {
        margin-top: 10px;
      }
    }
  }
}
</style>
