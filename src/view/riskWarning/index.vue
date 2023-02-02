<template>
  <div>
    <!-- todo 风险预警 -->
    <el-dialog v-model="dialogFormVisible" title="预警详情">
      <el-descriptions :column="2" border>
        <el-descriptions-item
          label="姓名"
          label-align="left"
          align="left"
          label-class-name="my-label"
          class-name="my-content"
          >{{ form[0].name }}</el-descriptions-item
        >
        <el-descriptions-item
          label="身份证号"
          label-align="left"
          align="left"
          >{{ form[0].id_card }}</el-descriptions-item
        >
        <el-descriptions-item
          label="手机号码"
          label-align="left"
          align="left"
          >{{ form[0].phone }}</el-descriptions-item
        >

        <!-- <el-descriptions-item
          label="是否核酸"
          label-align="left"
          align="left"
          >{{
            form[0].is_nucleic_acid === '1' ? '是' : '否'
          }}</el-descriptions-item
        > -->
        <el-descriptions-item label="亮码" label-align="left" align="left">
          <HealthCodeColor :color-data="form[0].code_color"></HealthCodeColor>
        </el-descriptions-item>
        <el-descriptions-item
          label="是否为返新人员"
          label-align="left"
          min-width="150px"
          align="left"
          >{{
            form[0].is_back_personnel === '1' ? '是' : '否'
          }}</el-descriptions-item
        >
        <el-descriptions-item label="扫码场所" label-align="left" align="left"
          >{{ form[0].scene_name }}
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
    <DialogTable
      :toptitle="toptitle"
      :visible="visible"
      :headercolumn="headercolumn"
      :information-data="informationData"
      :loading="littleloading"
      :total="total"
      @changeshow="changeshow"
      @paging-query="pagingQuery"></DialogTable>
    <!-- 顶部 -->
    <div class="gva-search-box">
      <!-- 搜索栏 -->
      <el-form :inline="true" :model="searchCriteria">
        <el-form-item label="身份证号码">
          <el-input
            v-model="searchCriteria.id_card"
            placeholder="请输入身份证号码" />
        </el-form-item>
        <el-form-item label="电话号码">
          <el-input
            v-model="searchCriteria.phone"
            placeholder="请输入电话号码" />
        </el-form-item>
        <el-form-item label="日期范围">
          <el-date-picker
            v-model="searchCriteria.time_frame"
            width="300"
            type="daterange"
            range-separator="至"
            start-placeholder="开始"
            end-placeholder="结束" />
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
          v-loading="loading"
          :data="tableData"
          border
          style="width: 100%">
          <!-- <el-table-column align="left" label="编码" /> -->
          <el-table-column
            align="left"
            label="姓名"
            prop="name"
            width="100"
            show-overflow-tooltip />
          <el-table-column
            align="left"
            label="身份证号"
            prop="id_card"
            show-overflow-tooltip />
          <el-table-column
            align=""
            label="手机号码"
            prop="phone"
            show-overflow-tooltip />
          <el-table-column
            align="left"
            label="扫码场所名称"
            prop="scene_name"
            width="180"
            show-overflow-tooltip />
          <el-table-column
            align="left"
            label="行政区划"
            prop="address"
            width="180"
            show-overflow-tooltip />
          <!-- <el-table-column
            align="left"
            label="是否核酸"
            prop="is_nucleic_acid"
            show-overflow-tooltip="true">
            <template #default="scope">
              {{ scope.row['is_nucleic_acid'] === 1 ? '是' : '否' }}
            </template>
          </el-table-column> -->
          <el-table-column
            align="left"
            label="码色"
            prop="code_color"
            show-overflow-tooltip>
            <template #default="scope">
              <HealthCodeColor
                :color-data="scope.row.code_color"></HealthCodeColor>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="240">
            <template #default="scope">
              <el-button
                link
                type="primary"
                icon="View"
                size="small"
                @click="examine(scope.$index, scope.row)"
                >查看</el-button
              >
              <el-button
                link
                icon="Document"
                type="primary"
                size="small"
                @click="nucleicAcidrecord(scope.row)"
                >核酸记录</el-button
              >
              <el-button
                link
                type="primary"
                icon="Tickets"
                size="small"
                @click="sweepCoderecord(scope.row)"
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
            layout="total, sizes, prev, pager, next, jumper"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange" />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
export default {
  name: 'RiskWarning',
};
</script>
<script setup lang="ts">
import DeptTree from '@/components/deptTree/index.vue';
import DialogTable from '@/components/dialogTable/index.vue';
import { ref, onMounted, watch } from 'vue';
import { TreeType } from '@/components/deptTree/types';
import { riskWarning, record } from '@/api/riskWarning';
import { nucleicAcid } from '@/api/keyPersonnel';
// import { Row } from 'element-plus/es/components/table-v2/src/components';
import HealthCodeColor from '../../components/healthCodeColor/index.vue';
import { sceneCode } from '@/api/venueCode';
const deptTreeRef = ref<InstanceType<typeof DeptTree> | null>(null);

/**对话框 */
const dialogFormVisible = ref(false);
/**
 * 封装数组处理
 */
interface List {
  code_color: number;
  name: string;
  id_card: string;
  phone: string;
  id: number;
  scene_name: string;
  is_nucleic_acid: string | number;
  is_back_personnel: string | number;
  is_risk_area: string | number;
  origin_place: string;
  destination_place: string;
  dept_id?: number;
  departure_time?: string | [];
}
const form = ref<List[]>([]);
//子组件
const visible = ref(false);
//核酸记录
const nucleicArr = [
  { label: '姓名', prop: 'patient_name' },
  { label: '身份证号', prop: 'certificate_num' },
  { label: '核酸检测结果', prop: 'state' },
  { label: '核酸报告时间', prop: 'upload_time' },
  { label: '核酸检测机构', prop: 'census_Address' },
];
//扫码记录
const scanArr = [
  { label: '单位名称', prop: 'scene_name' },
  { label: '场所代码', prop: 'scene_code' },
  { label: '证件号码', prop: 'id_card' },
  { label: '联系方式', prop: 'phone' },
  { label: '扫码时间', prop: 'scan_time' },
  { label: '亮码', prop: 'code_color' },
];
let headercolumn = ref<any[]>([]);
interface props {
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

let informationData = ref<props[]>([]);
//子组件修改
const littleloading = ref(true);
const id = ref(0);
const pagingQuery = async (page: number, pageSize: number) => {
  //记录页码
  littleloading.value = true;
  littlepageSize.value = pageSize;
  if (toptitle.value === '核酸记录') {
    const response = await nucleicAcid({
      id: id.value,
      section_type: 6,
      page: page,
      pageSize: pageSize,
    });
    informationData.value = response.data.AcidRecordInfo;
    littleloading.value = false;
  } else {
    const response = await record({
      id: id.value,
      section_type: 6,
      page: page,
      pageSize: pageSize,
    });
    informationData.value = response.data.ScanRecord;
    littleloading.value = false;
  }
};
const toptitle = ref('');
const total = ref(0);
//修改小表格中的 pageSize 所有的小表格 pagesize 都需要改变
const littlepageSize = ref(10);
//核酸记录
const nucleicAcidrecord = (row: List) => {
  //记录ID 给分页查修使用
  littleloading.value = true;
  id.value = row.id;
  toptitle.value = '核酸记录';
  headercolumn.value = nucleicArr;
  visible.value = true;
  nucleicAcid({
    id: row.id,
    section_type: 6,
    page: 1,
    pageSize: littlepageSize.value,
  }).then(res => {
    informationData.value = res.data.AcidRecordInfo;
    total.value = informationData.value.length;
    littleloading.value = false;
  });
};
//扫码记录
const sweepCoderecord = async (row: List) => {
  littleloading.value = true;
  id.value = row.id;
  toptitle.value = '扫码记录';
  headercolumn.value = scanArr;
  visible.value = true;
  const response = await record({
    id: row.id,
    section_type: 6,
    page: 1,
    pageSize: littlepageSize.value,
  });
  informationData.value = response.data.ScanRecord;
  total.value = response.data.count;

  littleloading.value = false;
};
// 搜索条件
type searchCriteriaType = {
  id_card?: string;
  time_frame?: [];
  dept_id?: number;
  phone?: string;
};
interface Tree {
  label: string;
  children?: Tree[];
}
// Table
const loading = ref(true);
const tableData = ref<List[]>([]);
// Table ---查询条件
const searchCriteria = ref<searchCriteriaType>({});
//信息处理字段
// const handlearrays = ['is_nucleic_acid', 'is_risk_area', 'is_back_personnel'];
// 分页数据
const page = ref({
  current: 1,
  size: 10,
  total: 0,
});

/**
 * 搜索
 */
const search = async () => {
  if (loading.value) return;
  await loadData();
};
//重置搜索条件
const resetCriteria = async () => {
  searchCriteria.value = {};
  deptTreeRef.value && deptTreeRef.value.reset();
  if (loading.value) return;
  await loadData();
};
/**
 * 加载数据
 */
const loadData = async () => {
  loading.value = true;
  const response = await riskWarning({
    ...searchCriteria.value,
    page: page.value.current,
    pageSize: page.value.size,
  });

  page.value.total = response.data.count;
  if (response.data.count === 0) {
    tableData.value = [];
  } else {
    tableData.value = response.data.RiskWarning;
  }
  loading.value = false;
};
/**
 * 部门查询
 * @param dept
 */
const handleDeptChange = (dept: TreeType) => {
  searchCriteria.value.dept_id = dept.id;
  loadData();
};
/**
 * 页码变化
 */
const handleCurrentChange = (current: number) => {
  if (loading.value) return;
  page.value.current = current;
};
/**
 * 每页数据量变化
 */
const handleSizeChange = (size: number) => {
  page.value.size = size;
};
watch(
  [() => page.value.size, () => page.value.current],
  async () => {
    loadData();
  },
  {
    deep: true,
  }
);

/**
 * 查看
 */
const examine = (index: number, row: List) => {
  dialogFormVisible.value = true;
  form.value[0] = row;
};

/**
 * 子组件相应事件
 */
const changeshow = (booblean: boolean) => {
  visible.value = booblean;
};

/**
 * 部门查询
 */

onMounted(() => {
  loadData();
});
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
