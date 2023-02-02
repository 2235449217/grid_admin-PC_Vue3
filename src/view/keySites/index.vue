<template>
  <div>
    <!-- 顶部 -->
    <div class="gva-search-box">
      <!-- 搜索栏 -->
      <el-form :inline="true" :model="searchCriteria">
        <el-form-item label="场所名称">
          <el-input
            v-model="searchCriteria.scene_name"
            placeholder="请输入场所名称" />
        </el-form-item>
        <el-form-item label="场所类型">
          <el-select v-model="searchCriteria.scene_type" placeholder="请选择">
            <el-option
              v-for="(item, index) in sites"
              :key="index"
              :label="item.name"
              :value="item.code" />
          </el-select>
        </el-form-item>
        <el-form-item label="派发状态">
          <el-select
            v-model="searchCriteria.dispatch_status"
            placeholder="请选择">
            <el-option label="未派发" :value="1" />
            <el-option label="已派发" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="search">
            查询
          </el-button>
          <el-button size="small" @click="resetCriteria"> 重置 </el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 内容 -->
    <div class="contariner">
      <!-- 网格树形组件 -->
      <DeptTree ref="deptTreeRef" :on-change="handleDeptChange" />
      <!-- 表格 -->
      <div class="gva-table-box table-box">
        <el-table
          v-loading="isLoading"
          :data="tableData"
          border
          style="width: 100%"
          table-layout="fixed">
          <el-table-column
            show-overflow-tooltip
            align="left"
            label="场所名称"
            prop="scene_name"
            max-width="200" />
          <el-table-column
            show-overflow-tooltip
            align="left"
            label="场所类型"
            prop="scene_type"
            max-width="100">
            <template #default="scope">
              {{ sitesDic[scope.row['scene_type']] || '未知' }}
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            align="left"
            label="场所管理员"
            prop="site_manager"
            max-width="200" />
          <el-table-column
            show-overflow-tooltip
            align="left"
            label="管理员手机号"
            prop="manager_phone"
            max-width="160" />
          <el-table-column
            show-overflow-tooltip
            align="left"
            label="行政区划"
            prop="dept_name"
            max-width="200" />
          <el-table-column
            show-overflow-tooltip
            align="left"
            label="派发状态"
            prop="dispatch_status"
            max-width="160">
            <template #default="scope">
              {{ scope.row['dispatch_status'] === 1 ? '未派发' : '已派发' }}
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            align="left"
            label="派发时间"
            prop="dispatch_time"
            max-width="160">
            <template #default="scope">
              {{ stampFormat(scope.row['dispatch_time']) || '未知' }}
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            align="left"
            fixed="right"
            label="操作">
            <template #default="scope">
              <el-button type="text" @click="handleDispatch(scope.row)">
                派发
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
    <!-- 转派弹窗 -->
    <DecentDialog
      :control-show="false"
      :decent-visible="decentVisible"
      @change-visible="(visible: boolean) => (decentVisible = visible)"
      @submit="decentSubmit" />
  </div>
</template>
<script lang="ts">
export default {
  name: 'KeySites',
};
</script>
<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import DeptTree from '@/components/deptTree/index.vue';
import { TreeType } from '@/components/deptTree/types';
import { getKeySites, dispatchKeySite } from '@/api/keySites';
import DecentDialog from '@/components/decentDialog/index.vue';
import { ElMessage } from 'element-plus';
import { getCode } from '@/api/venueCode';
import { stampFormat } from '@/utils/dateFormat';

const deptTreeRef = ref<InstanceType<typeof DeptTree> | null>(null);

const isLoading = ref<boolean>(false);

onMounted(async () => {
  await initSites();
  await loadData();
});

/************************************************
 * 搜索相关
 ************************************************/

// 搜索条件
type searchCriteriaType = {
  dept_id?: number;
  scene_name?: string;
  scene_type?: string;
  dispatch_status?: number;
};
const searchCriteria = ref<searchCriteriaType>({
  dispatch_status: 1,
});

// 场所
type SiteType = {
  name: string;
  code: number;
};
const sites = ref<SiteType[]>([]);
const sitesDic = ref({});

const initSites = async () => {
  const response = await getCode();
  sites.value = response.data;
  sites.value.map((site: SiteType) => {
    sitesDic[site.code] = site.name;
  });
};

/**
 * 搜索
 */
const search = async () => {
  await loadData();
};

/**
 * 重置搜索条件
 */
const resetCriteria = async () => {
  searchCriteria.value = {};
  deptTreeRef.value && deptTreeRef.value.reset();
  await search();
};

/**
 * 部门树形组件选择回调
 */
const handleDeptChange = async (dept: TreeType) => {
  searchCriteria.value.dept_id = dept.id;
  await search();
};

/************************************************
 * 表格数据相关
 ************************************************/

/**
 * 场所表格数据类型
 */
type TableDataType = {
  id: number;
  dept_id: number;
  dispatch_status: number;
  enabling_status: number;
  manager_phone: string;
  original_dept_id: 0;
  scene_id: string;
  scene_name: string;
  scene_type: number;
  site_manager: string;
};

const tableData = ref<TableDataType[]>([]);

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
    await loadData();
  },
  {
    deep: true,
  }
);

/**
 * 加载数据
 */
const loadData = async () => {
  isLoading.value = true;
  const response = await getKeySites({
    ...searchCriteria.value,
    page: page.value.current,
    pageSize: page.value.size,
  });
  tableData.value = response.data.KeyPlace;
  page.value.total = response.data.count;
  isLoading.value = false;
};

/************************************************
 * 转派
 ************************************************/

// 转派弹窗可视性
const decentVisible = ref(false);
let handlePlaceId = 0;
const handleDispatch = (row: TableDataType) => {
  decentVisible.value = true;
  handlePlaceId = row.id;
};

// 转派弹窗提交回调
const decentSubmit = async (deptId: number) => {
  if (!deptId) return;
  const response = await dispatchKeySite({
    id: handlePlaceId,
    dept_id: deptId,
  });
  if (response.code === 0) {
    ElMessage({
      showClose: true,
      message: '派发成功',
      type: 'success',
    });
    await loadData();
  }
};
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
</style>
