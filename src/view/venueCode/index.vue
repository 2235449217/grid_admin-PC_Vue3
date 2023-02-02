<!-- 场所码页面 -->
<template>
  <div class="venueCode">
    <el-dialog v-model="dialogFormVisible" title="场所码详情">
      <el-descriptions :column="2" border>
        <el-descriptions-item
          label="场所代码"
          label-align="left"
          align="center"
          label-class-name="my-label"
          class-name="my-content"
          width="120px"
          >{{ form.scene_code }}</el-descriptions-item
        >
        <el-descriptions-item
          label="单位名称"
          label-align="left"
          width="120px"
          align="center"
          >{{ form.scene_name }}</el-descriptions-item
        >
        <el-descriptions-item
          label="联系人"
          label-align="left"
          width="120px"
          align="center"
          >{{ form.site_manager }}</el-descriptions-item
        >
        <el-descriptions-item label="场所状态" label-align="left" align="center"
          >{{ form.enabling_status === 1 ? '启用' : '未启用' }}
        </el-descriptions-item>
        <el-descriptions-item
          label="场所类型"
          label-align="left"
          align="center"
          >{{ form.scene_code_name }}</el-descriptions-item
        >
        <el-descriptions-item
          label="行政区划"
          label-align="left"
          align="center"
          >{{ form.dept_name }}</el-descriptions-item
        >
        <el-descriptions-item
          label="派发状态"
          label-align="left"
          align="center"
          >{{ form.dispatch_status }}</el-descriptions-item
        >
        <el-descriptions-item
          label="派发时间"
          label-align="left"
          align="center"
          >{{ UTCFormat(form.dispatch_time) }}</el-descriptions-item
        >
      </el-descriptions>
    </el-dialog>
    <DialogTable
      :visible="visible"
      :total="total"
      :toptitle="toptitle"
      :headercolumn="headercolumn"
      :information-data="informationData"
      :loading="littleloading"
      @changeshow="changeshow"
      @paging-query="pagingQuery"></DialogTable>
    <div class="header">
      <el-form :inline="true" :model="searchCriteria">
        <el-form-item label="场所类型">
          <el-select v-model="searchCriteria.scene_type" placeholder="请选择">
            <el-option
              v-for="(item, index) in site"
              :key="index"
              :label="item.name"
              :value="item.code" />
          </el-select>
        </el-form-item>
        <el-form-item label="派发状态">
          <el-select
            v-model="searchCriteria.dispatch_status"
            placeholder="请选择">
            <el-option label="已派发" :value="dispatch_status[1]" />
            <el-option label="未派发" :value="dispatch_status[0]" />
          </el-select>
        </el-form-item>
        <el-form-item label="场所名称">
          <el-input
            v-model="searchCriteria.scene_name"
            placeholder="请填写"></el-input>
        </el-form-item>
        <el-form-item label="日期范围">
          <el-date-picker
            v-model="searchCriteria.time_frame"
            type="daterange"
            range-separator="至"
            start-placeholder="开始"
            end-placeholder="结束" />
        </el-form-item>
        <el-form-item>
          <el-button
            size="small"
            type="primary"
            icon="search"
            :disabled="disabled"
            @click="search">
            查询
          </el-button>
          <el-button
            size="small"
            icon="refresh"
            :disabled="disabled"
            @click="resetCriteria">
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="contariner">
      <DeptTree ref="deptTreeRef" :on-change="handleDeptChange" />
      <div class="gva-table-box table-box">
        <el-table
          v-loading="loading"
          :data="tableData"
          border
          style="width: 100%">
          <el-table-column
            align="left"
            label="场所代码"
            prop="scene_code"
            min-width="140px"
            show-overflow-tooltip />
          <el-table-column
            align="left"
            label="单位名称"
            min-width="150px"
            prop="scene_name"
            show-overflow-tooltip />
          <el-table-column
            label="联系人"
            prop="site_manager"
            min-width="120px"
            show-overflow-tooltip />
          <el-table-column
            align="left"
            label="联系人号码"
            prop="manager_phone"
            min-width="120px"
            show-overflow-tooltip />
          <el-table-column label="场所状态" show-overflow-tooltip>
            <template #default="scope">
              <el-switch
                v-model="scope.row.enabling_status"
                :inactive-value="2"
                :active-value="1"
                @change="() => switchChange(scope.row)" />
            </template>
          </el-table-column>
          <el-table-column
            label="场所类型"
            prop="scene_code_name"
            min-width="140px"
            show-overflow-tooltip />
          <el-table-column
            label="行政区划"
            prop="dept_name"
            min-width="120px"
            show-overflow-tooltip />
          <el-table-column
            label="派发状态"
            prop="dispatch_status"
            min-width="120px"
            show-overflow-tooltip />
          <el-table-column
            label="派发时间"
            prop="dispatchTime"
            min-width="120px"
            show-overflow-tooltip />
          <el-table-column label="操作" width="220" fixed="right">
            <template #default="scope">
              <el-button
                icon="view"
                type="text"
                size="small"
                @click="examine(scope.row)"
                >查看</el-button
              >
              <el-button
                type="text"
                size="small"
                icon="position"
                @click="handleDispatch(scope.row)"
                >派发</el-button
              >
              <el-button
                type="text"
                size="small"
                icon="document"
                @click="showMessage(scope.$index, scope.row)"
                >扫码记录</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div class="pagination">
          <el-pagination
            background
            :current-page="page.current"
            :page-size="page.size"
            :page-sizes="[10, 20]"
            :total="page.total"
            :disabled="disabled"
            layout="total, sizes, prev, pager, next, jumper"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange" />
        </div>
        <!-- 派发弹窗 -->
        <DecentDialog
          :decent-visible="decentVisible"
          @submit="submit"
          @change-visible="changeVisible"></DecentDialog>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
export default { name: 'VenueCode' };
</script>
<script setup lang="ts">
import { ref, reactive, onMounted, watch, inject } from 'vue';
import DialogTable from '@/components/dialogTable/index.vue';
import DeptTree from '@/components/deptTree/index.vue';
import { TreeType } from '@/components/deptTree/types';
import { ElMessage } from 'element-plus';
import {
  getVenueCode,
  getCode,
  getScanCodeList,
  dispatchSceneCode,
  updateSceneStatus,
  getVenueCodeDetails,
} from '@/api/venueCode';
import DecentDialog from '../../components/decentDialog/index.vue';
import { codeStatus } from '../riskPersonnel/handleValues';
import { UTCFormat } from '@/utils/dateFormat';

const deptTreeRef = ref<InstanceType<typeof DeptTree> | null>(null);
const dispatch_status = [1, 2];
const changeVisible = (boolean: boolean) => {
  decentVisible.value = boolean;
};
/**
 * 派发操作
 */
const decentVisible = ref(false);
let handlePlaceId = 0;
const handleDispatch = (row: List) => {
  console.log(decentVisible.value);
  decentVisible.value = true;
  handlePlaceId = row.id;
};
const submit = (deptId: number) => {
  console.log('hfsjfhdj', deptId);
  dispatchSceneCode({
    dept_id: deptId,
    id: handlePlaceId,
  }).then(res => {
    if (res.code === 0) {
      ElMessage({
        showClose: true,
        message: '派发成功',
        type: 'success',
      });
      loadData();
    }
  });
};

//场所
type Site = {
  name: string;
  code: number;
};
const site = ref<Site[]>([]);
//搜索条件 {场所类型，派发状态，日期范围}
type List = {
  dept_id?: number;
  id: number;
  dispatch_status?: string | number;
  enabling_status?: number | string;
  is_nucleic_acid?: string | number;
  manager_phone?: string;
  scene_code?: string;
  scene_name: string;
  scene_type: number;
  site_manager?: string;
  scene_code_name: string;
  dispatch_time: string;
  dispatchTime: string;
  dept_name: string;
};

/*** 子组件信息  {记录组件} ***/
const toptitle = ref('扫码记录');
const visible = ref(false);
// 子组件事件
const changeshow = (booblean: boolean) => {
  visible.value = booblean;
};
/*** 子组件信息  {信息组件} ***/
const headercolumn = reactive([
  { label: '姓名', prop: 'scan_person', width: '120px' },
  { label: '身份证号', prop: 'id_card', width: '120px' },
  { label: '联系方式', prop: 'phone', width: '120px' },
  { label: '场所名称', prop: 'scene_name', width: '120px' },
  { label: '扫码时间', prop: 'scan_time', width: '120px' },
  { label: '健康码色', prop: 'code_color', width: '120px' },
  { label: '异常原因', prop: 'abnormal_cause', width: '120px' },
  // { label: '赋码时间', prop: 'scan_time', width: '120px' },
  { label: '赋码地市', prop: 'sign_city', width: '120px' },
]);
const form = ref<List>({
  scene_code: '',
  scene_name: '',
  site_manager: '',
  manager_phone: '',
  enabling_status: '',
  scene_type: 0,
  dispatch_status: '',
  id: 0,
  scene_code_name: '',
  dispatch_time: '',
  dispatchTime: '',
  dept_name: '',
});

/*** 主页Table ***/
const tableData = ref<List[]>([]);
const loading = ref(true);
type props = {
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
  enabling_status: string;
};
//Page
const page = reactive({
  current: 1,
  size: 10,
  total: 0,
});
//搜索条件 {场所类型，派发状态，日期范围}
type searchCriteriaType = {
  dept_id?: number;
  scene_type?: number;
  dispatch_status?: number;
  time_frame?: Array<string>;
  scene_name?: string;
};
const searchCriteria = ref<searchCriteriaType>({});

/**
 * 查看
 * @param index
 * @param row
 */
const dialogFormVisible = ref(false);
const viewData = ref();
const examine = async (row: List) => {
  dialogFormVisible.value = true;
  const res = await getVenueCodeDetails({ id: row.id });
  // viewData.value = res.data;
  form.value = row;
};
/**
 * 展示当前信息
 * @param index
 * @param row
 */
let informationData = ref<props[]>([]);
//动态传入字段
const scene_name = ref('');
const total = ref(0);
//修改小表格中的 pageSize 所有的小表格 pagesize 都需要改变
const littlepageSize = ref(10);
const littleloading = ref(true);
const showMessage = async (index: number, row: List) => {
  littleloading.value = true;
  visible.value = true;
  scene_name.value = row.scene_name;
  await getScanCodeList({
    scene_name: row.scene_name,
    page: 1,
    pageSize: littlepageSize.value,
  }).then(res => {
    informationData.value = res.data.ScanCode;
    total.value = res.data.count;
    littleloading.value = false;
  });
};
//子组件修改
const pagingQuery = (page: number, pageSize: number) => {
  //记录页码
  littleloading.value = true;
  littlepageSize.value = pageSize;
  getScanCodeList({
    page: page,
    pageSize: pageSize,
    scene_name: scene_name.value,
  }).then(res => {
    informationData.value = res.data.ScanCode;
    littleloading.value = false;
  });
};
const alias = inject('reload');
//搜索
const search = async () => {
  await loadData();
};
//重置搜索条件
const resetCriteria = async () => {
  searchCriteria.value = {};
  deptTreeRef.value && deptTreeRef.value.reset();
  await search();
};

/**
 * 处理数组
 * @param data
 */
const HandleArrays = (data: List[]) => {
  for (const item of data) {
    if (item['dispatch_status'] === 1) {
      item['dispatch_status'] = '未派发';
    } else if (item['dispatch_status'] === 2) {
      item['dispatch_status'] = '已派发';
    } else {
      item['dispatch_status'] = '未知';
    }
    // if (item['enabling_status'] === 1) {
    //   item['enabling_status'] = '启用';
    // } else if (item['enabling_status'] === 2) {
    //   item['enabling_status'] = '未启用';
    // } else {
    //   item['enabling_status'] = '未知';
    // }
  }
  return data;
};

// 切换部门
const handleDeptChange = async (dept: TreeType) => {
  searchCriteria.value.dept_id = dept.id;
  await loadData();
};
/**数组查询 */
const disabled = ref(false);
const loadData = async () => {
  loading.value = true;
  disabled.value = true;
  const response = await getVenueCode({
    ...searchCriteria.value,
    page: page.current,
    pageSize: page.size,
  });
  page.total = response.data.count;
  if (response.data.count === 0) {
    tableData.value = [];
  } else {
    tableData.value = HandleArrays(response.data.SceneCode);
    for (const i of tableData.value) {
      for (const j of site.value) {
        if (i.scene_type === j.code) {
          i.scene_code_name = j.name;
          break;
        } else {
          i.scene_code_name = '未知';
        }
      }
      i.dispatchTime = UTCFormat(i.dispatch_time);
    }
    console.log(tableData.value);
  }
  loading.value = false;
  disabled.value = false;
};
// 分页
const handleSizeChange = (val: number) => {
  page.size = val;
};
// 点击页面
const handleCurrentChange = (val: number) => {
  page.current = val;
};
// 监听 页码信息变化
watch(
  page,
  async () => {
    await loadData();
  },
  {
    deep: true,
  }
);
onMounted(async () => {
  getCode().then(res => {
    site.value = res.data;
    console.log(site.value);
  });
  await loadData();
});

/**
 * 场所状态启用
 */
const switchChange = async (row: props) => {
  if (loading.value) return;
  const res = await updateSceneStatus({
    enabling_status: parseInt(row.enabling_status),
    id: row.id,
  });
  if (res.code === 0) {
    ElMessage({
      type: 'success',
      message: '场所码状态切换成功',
    });
  }
};
</script>
<style lang="scss" scoped>
.venueCode {
  background: rgba(240, 242, 245, 1);
  padding: 20px;
  width: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  .header {
    // height: 108px;
    padding: 25px 15px 0 15px;
    margin-bottom: 13px;
    background: rgba(255, 255, 255, 1);
    border-radius: 2px;
  }
  .contariner {
    display: grid;
    grid-template-columns: repeat(2, auto);
    background-color: #ffffff;
    .pagination {
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>
