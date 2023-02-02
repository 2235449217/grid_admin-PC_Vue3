<!-- 风险人员管理 -->
<template>
  <div class="riskPersonnel gva-search-box">
    <div class="header">
      <div class="searchContent">
        <el-form :inline="true" :model="searchRisk" class="demo-form-inline">
          <el-form-item label="身份证号码">
            <el-input
              v-model="searchRisk.id_card"
              placeholder="请输入身份证号码"
              class="input" />
          </el-form-item>
          <el-form-item label="健康码状态" class="healthState">
            <el-select v-model="searchRisk.code_color" placeholder="请选择">
              <el-option label="绿码" value="1" />
              <el-option label="黄码" value="2" />
              <el-option label="红码" value="3" />
            </el-select>
          </el-form-item>
          <el-form-item label="派发状态">
            <el-select
              v-model="searchRisk.dispatch_status"
              placeholder="请选择">
              <el-option label="未派发" value="1" />
              <el-option label="已派发" value="2" />
            </el-select>
          </el-form-item>
          <el-form-item label="日期范围">
            <el-date-picker
              v-model="searchRisk.time_frame"
              type="daterange"
              start-placeholder="开始"
              end-placeholder="结束"
              range-separator="至"
              :default-time="defaultTime"
          /></el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              :disabled="disabled"
              size="small"
              icon="search"
              @click="search"
              >查询</el-button
            >
            <el-button
              size="small"
              icon="refresh"
              :disabled="disabled"
              @click="resetBtn"
              >重置</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="contariner">
      <div class="treeContent">
        <!-- 网格树形组件 -->
        <DeptTree :on-change="handleDeptChange" />
      </div>
      <div class="rightContent">
        <div class="mainContent">
          <el-button
            icon="plus"
            type="primary"
            size="small"
            class="addBtn"
            @click="addRiskFunc()"
            >新增</el-button
          >
          <Table
            v-loading="loading"
            :table-data="tableData"
            :table-title-data="tableTitleData"
            :is-edit="isEdit"
            @on-updata="search"
            @updata-table-list="updateTableList">
          </Table>
          <!-- 分页 -->
          <div class="pagination">
            <el-pagination
              :current-page="page.current"
              :page-size="page.size"
              :page-sizes="[10, 20]"
              :total="page.total"
              :disabled="disabled"
              background
              layout="total, sizes, prev, pager, next, jumper"
              @current-change="currentChange"
              @size-change="sizeChange" />
          </div>
        </div>
      </div>
    </div>
    <!-- 新增弹窗 -->
    <AddRiskDialog
      :add-risk-visible="addRiskVisible"
      @change-visible="changeVisible"></AddRiskDialog>
  </div>
</template>
<script lang="ts">
export default { name: 'RiskPersonnel' };
</script>
<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue';
import Table from './components/table.vue';
import DeptTree from '@/components/deptTree/index.vue';
import { TreeType } from '@/components/deptTree/types';
import { getRiskPersonnel } from '@/api/riskPersonnel';
import AddRiskDialog from './components/addRiskDialog.vue';

const deptTreeRef = ref<InstanceType<typeof DeptTree> | null>(null);

// 默认时间
const defaultTime = ref([
  new Date(2000, 1, 1, 0, 0, 0),
  new Date(2000, 2, 1, 23, 59, 59),
]);
/*
 * 部门树形组件
 */
const handleDeptChange = (dept: TreeType) => {
  searchRisk.value.dept_id = dept.id;
  search();
};
const isEdit = true;
const tableTitleData = reactive([
  {
    prop: 'name',
    label: '姓名',
    width: '80px',
    align: '',
  },
  {
    prop: 'id_card_num',
    label: '身份证号',
    width: '120px',
    align: '',
  },
  {
    prop: 'phone',
    label: '手机号码',
    width: '120px',
    align: '',
  },
  {
    prop: 'origin_place',
    label: '出发地',
    width: '130px',
    align: '',
  },
  {
    prop: 'destination_place',
    label: '目的地',
    width: '130px',
    align: '',
  },
  {
    prop: 'departure_time',
    label: '返乡时间',
    width: '110px',
    align: '',
  },
  {
    prop: 'is_risk_area',
    label: '是否风险人员',
    width: '120px',
    align: '',
  },
  {
    prop: 'code_color',
    label: '健康码状态',
    width: '100px',
    align: '',
  },
  {
    prop: 'dept_name',
    label: '行政区划',
    width: '120px',
    align: '',
  },
  {
    prop: 'dispatch_status',
    label: '派发状态',
    width: '100px',
    align: '',
  },
  {
    prop: 'dispatch_time',
    label: '派发时间',
    width: '150px',
  },
  {
    prop: 'transfer_status',
    label: '转派状态',
    width: '100px',
    align: '',
  },
  {
    prop: 'transfer_time',
    label: '转派时间',
    width: '150px',
  },
  {
    prop: 'transfer_reason',
    label: '转派拒绝原因',
    width: '150px',
  },
]);

type searchRiskType = {
  code_color?: number;
  dept_id?: number;
  id_card?: string;
  dispatch_status?: number;
  time_frame?: string[];
};
const searchRisk = ref<searchRiskType>({});
/**
 * 搜索条件
 */
const search = async () => {
  await updateTableList();
};
/**
 * 重置搜索条件
 */
const resetBtn = async () => {
  searchRisk.value = {};
  deptTreeRef.value && deptTreeRef.value.reset();
  await search();
};
const tableData = ref();
onMounted(async () => {
  await updateTableList();
});
// 分页数据
const page = ref({
  current: 1,
  size: 10,
  total: 0,
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
    await updateTableList();
  },
  {
    deep: true,
  }
);
/**
 * 更新风险人员
 */
const loading = ref(true);
const disabled = ref(false);
const updateTableList = async () => {
  loading.value = true;
  disabled.value = true;
  const response = await getRiskPersonnel({
    code_color: Number(searchRisk.value.code_color),
    dept_id: searchRisk.value.dept_id,
    id_card: searchRisk.value.id_card,
    time_frame: searchRisk.value.time_frame,
    dispatch_status: Number(searchRisk.value.dispatch_status),
    page: page.value.current,
    pageSize: page.value.size,
  });
  console.log(response.data.RiskList, 1111111111111111);

  tableData.value = response.data.RiskList;
  page.value.total = response.data.count;
  loading.value = false;
  disabled.value = false;
};

/**
 * 新增
 */
const addRiskVisible = ref(false);
const addRiskFunc = async () => {
  addRiskVisible.value = true;
};

// 子组件修改父组件的条件
const changeVisible = (boolean: boolean) => {
  addRiskVisible.value = boolean;
};
</script>
<style lang="scss" scoped>
.riskPersonnel {
  background: rgba(240, 242, 245, 1);
  padding: 20px;
  width: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  .header {
    padding: 25px 0 0 15px;
    margin-bottom: 15px;
    background: rgba(255, 255, 255, 1);
    border-radius: 2px;
  }
  .contariner {
    display: grid;
    grid-template-columns: repeat(2, auto);
    background: rgba(255, 255, 255, 1);
    border-radius: 2px;

    .rightContent {
      padding: 15px;
      overflow: hidden;
      .addBtn {
        margin-bottom: 15px;
      }
    }
    .pagination {
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>
