<!-- 健康码管理 -->
<template>
  <div class="healthCode">
    <div class="header">
      <!-- 搜索区域 -->
      <div class="searchContent">
        <el-form :inline="true" :model="searchForm" class="demo-form-inline">
          <el-form-item label="身份证号码">
            <el-input
              v-model="searchForm.id_card"
              placeholder="请输入身份证号码"
              class="input" />
          </el-form-item>
          <el-form-item label="健康码状态" class="healthState">
            <el-select v-model="searchForm.code_color" placeholder="请选择">
              <el-option
                v-for="(item, index) in codeColors"
                :key="index"
                :label="item.name"
                :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="派发状态">
            <el-select
              v-model="searchForm.dispatch_status"
              placeholder="请选择">
              <el-option
                v-for="(item, index) in disPatchStatus"
                :key="index"
                :label="item.name"
                :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="日期范围">
            <el-date-picker
              v-model="searchForm.time_frame"
              type="daterange"
              start-placeholder="开始"
              end-placeholder="结束"
              range-separator="至"
              :default-time="defaultTime"
          /></el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              size="small"
              icon="search"
              :disabled="disabled"
              @click="onSubmit"
              >查询</el-button
            >
            <el-button
              icon="refresh"
              size="small"
              :disabled="disabled"
              @click="resetSearchForm"
              >重置</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="content">
      <div class="leftContent">
        <div class="treeContent">
          <!-- 树形组件 -->
          <DeptTree ref="deptTreeRef" :on-change="handleDeptChange" />
        </div>
      </div>
      <div class="rightContent">
        <div class="mainContent">
          <table-content
            v-loading="loading"
            :search-form="searchForm"
            :ddptid="deptSelected"
            :table-data="tableData"
            @load-data="loadData"></table-content>
        </div>
        <!-- 分页功能 -->
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
</template>
<script lang="ts">
export default { name: 'Test' };
</script>
<script setup lang="ts">
import TableContent from './components/tableContent.vue';
import DeptTree from '@/components/deptTree/index.vue';
import { TreeType } from '@/components/deptTree/types';
import { ref, onMounted, watch } from 'vue';
import { getHealthCode } from '@/api/healthCode';
import { dipatchStatus, transferStatus } from './handelValues';
import { stampFormat, UTCFormat } from '@/utils/dateFormat';
import { controlStatus, changeMode } from '@/constant/controlModeList';

const deptTreeRef = ref<InstanceType<typeof DeptTree> | null>(null);
const codeColors = ref([
  { name: '绿码', value: 1 },
  { name: '黄码', value: 2 },
  { name: '红码', value: 3 },
]);
const disPatchStatus = ref([
  { name: '未派发', value: 1 },
  { name: '已派发', value: 2 },
]);
/**
 * 搜索条件
 */
type SearchFormType = {
  id_card?: string;
  dept_id?: number;
  code_color?: number;
  control_mode?: number;
  dispatch_status?: number;
  time_frame?: string[];
};
const searchForm = ref<SearchFormType>({});
/**
 * 重置搜索条件
 */
const resetSearchForm = async () => {
  searchForm.value = {};
  deptTreeRef.value && deptTreeRef.value.reset();
  await onSubmit();
};
const defaultTime = ref([
  new Date(2000, 1, 1, 0, 0, 0),
  new Date(2000, 2, 1, 23, 59, 59),
]);

// 分页数据
const page = ref({
  current: 1,
  size: 10,
  total: 0,
});
/**
 * 健康码表格类型
 */
type HealthCode = {
  id: number;
  name: string; //姓名
  code_color: number; //健康码状态
  control_mode?: string; //管控方式
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
  dispatch_time: string;
  transfer_time: string;
};
const tableData = ref<HealthCode[]>([]);
// 初始化时加载数据
onMounted(async () => {
  await loadData();
});
/**
 * 部门树形组件
 */
const deptSelected = ref(0);
const handleDeptChange = async (dept: TreeType) => {
  // console.log(dept);
  searchForm.value.dept_id = dept.id;
  await onSubmit();
};

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
const loading = ref(true);
const disabled = ref(false);
// 加载数据
const loadData = async () => {
  loading.value = true;
  disabled.value = true;
  const response = await getHealthCode({
    ...searchForm.value,
    page: page.value.current,
    pageSize: page.value.size,
  });
  if (response.data.HealthCode) {
    // HandleArrays(response.data.HealthCode, handValues);
    let i: HealthCode;
    const map: Map<number, string> = controlStatus();
    for (i of response.data.HealthCode) {
      i.dispatch_status = dipatchStatus(i.dispatch_status);
      i.control_mode = changeMode(map, Number(i.control_mode));
      i.transfer_status = transferStatus(i.transfer_status);
      i.give_code_time = UTCFormat(i.give_code_time);
      i.dispatch_time = stampFormat(Number(i.dispatch_time));
      i.transfer_time = stampFormat(Number(i.transfer_time));
    }
  }
  tableData.value = response.data.HealthCode;
  page.value.total = response.data.count;
  loading.value = false;
  disabled.value = false;
};
/**
 * 查询
 */
const onSubmit = async () => {
  // const response = await getHealthCode({
  //   ...searchForm.value,
  //   page: page.value.current,
  //   pageSize: page.value.size,
  // });
  // tableData.value = response.data.HealthCode;
  // page.value.total = response.data.count;
  await loadData();
};
</script>
<style lang="scss" scoped>
.healthCode {
  background: rgba(240, 242, 245, 1);
  padding: 20px;
  width: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  .header {
    // height: 108px;
    padding: 15px 15px 0 15px;
    margin-bottom: 15px;
    background: rgba(255, 255, 255, 1);
    border-radius: 2px;
  }
  .content {
    display: grid;
    grid-template-columns: repeat(2, auto);
    background: rgba(255, 255, 255, 1);
    border-radius: 2px;

    .rightContent {
      overflow: hidden;
      padding: 15px;
      .pagination {
        display: flex;
        justify-content: flex-end;
      }
    }
  }
}
</style>
