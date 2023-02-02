<template>
  <div>
    <!-- 重点人员 -->
    <el-dialog v-model="dialogFormVisible" title="重点人员详情">
      <el-descriptions :column="2" border>
        <el-descriptions-item
          label="姓名"
          label-align="left"
          align="left"
          label-class-name="my-label"
          class-name="my-content"
          min-width="150px"
          >{{ form.name }}</el-descriptions-item
        >
        <el-descriptions-item
          label="身份证号"
          label-align="left"
          align="left"
          >{{ form.id_card }}</el-descriptions-item
        >
        <el-descriptions-item
          label="手机号码"
          label-align="left"
          align="left"
          >{{ form.phone }}</el-descriptions-item
        >
        <el-descriptions-item
          label="核酸是否达标"
          label-align="left"
          align="left"
          ><el-tag size="small">{{ form.is_nucleic_acid }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item
          label="扫码场所名称"
          label-align="left"
          align="left"
          >{{ form.scene_name }}</el-descriptions-item
        >
        <el-descriptions-item
          label="本周核酸次数"
          label-align="left"
          align="left"
          >{{ form.nucleic_acid_count }}</el-descriptions-item
        >
      </el-descriptions>
    </el-dialog>
    <DialogTable
      :toptitle="toptitle"
      :visible="visible"
      :headercolumn="headercolumn"
      :information-data="informationData"
      :total="total"
      :loading="littleloading"
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
        <el-form-item label="所属重点场所">
          <el-input
            v-model="searchCriteria.scene_name"
            placeholder="请输入场所名" />
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
          <el-button size="small" type="primary" icon="search" @click="search">
            查询
          </el-button>
          <el-button size="small" icon="refresh" @click="resetCriteria">
            重置
          </el-button>
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
          <el-table-column
            align="left"
            label="姓名"
            prop="name"
            width="150"
            show-overflow-tooltip />
          <el-table-column
            align="left"
            label="身份证号"
            prop="id_card"
            show-overflow-tooltip />
          <el-table-column
            align=""
            label="电话号码"
            prop="phone"
            show-overflow-tooltip />
          <el-table-column
            align="left"
            label="扫码场所名称"
            prop="scene_name"
            show-overflow-tooltip
            ><template #default="scope">
              {{ scope.row['scene_name'] || DEFAULT_VALUE }}
            </template>
          </el-table-column>
          <el-table-column
            align="left"
            label="核酸是否达标"
            prop="is_nucleic_acid"
            show-overflow-tooltip />
          <el-table-column
            align="left"
            label="本周核酸次数"
            prop="nucleic_acid_count"
            show-overflow-tooltip />
          <el-table-column align="left" label="操作" fixed="right" width="200">
            <template #default="scope">
              <el-button
                link
                type="primary"
                size="small"
                icon="View"
                @click="examine(scope.$index, scope.row)"
                >查看</el-button
              >
              <el-button
                link
                type="primary"
                size="small"
                icon="Document"
                @click="showMessage(scope.$index, scope.row)"
                >核酸记录</el-button
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
  name: 'KeyPersonnel',
};
</script>
<script setup lang="ts">
import { reactive, ref, onMounted, watch } from 'vue';
import DialogTable from '@/components/dialogTable/index.vue';
import DeptTree from '@/components/deptTree/index.vue';
import { TreeType } from '@/components/deptTree/types';
import { DEFAULT_VALUE } from '@/constant/tableCodeMap';
import { conditionQuery, nucleicAcid } from '@/api/keyPersonnel';
const deptTreeRef = ref<InstanceType<typeof DeptTree> | null>(null);

//详细信息
const form = ref<List>({
  id: 0,
  name: '',
  id_card: '',
  phone: '',
  scene_name: '',
  is_nucleic_acid: '',
  nucleic_acid_count: 0,
});
/**
 * 查看
 * @param index
 * @param row
 */
const dialogFormVisible = ref(false);
const examine = (index: number, row: List) => {
  dialogFormVisible.value = true;
  form.value = row;
};
// 核算记录信息
const visible = ref(false);
const headercolumn = reactive([
  { label: '姓名', prop: 'patient_name' },
  { label: '身份证号', prop: 'certificate_num' },
  { label: '核酸检测结果', prop: 'state' },
  { label: '核酸报告时间', prop: 'upload_time' },
  { label: '核酸检测机构', prop: 'census_Address' },
]);

// Table 表格

interface List {
  id: number;
  name: string;
  dept_id?: number;
  is_nucleic_acid: string | number;
  id_card: string;
  phone: string;
  scene_name: string;
  nucleic_acid_count?: number;
}
const loading = ref(true);
const tableData = ref<List[]>([]);

/**
 * 搜索
 */
// 搜索条件 { 部门 ID 身份证件 时间范围 地点}
type searchCriteriaType = {
  dept_id?: number;
  id_card?: string;
  time_frame?: [];
  scene_name?: string;
};
const searchCriteria = ref<searchCriteriaType>({});

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
 * 部门树形组件选择回调
 */
const handleDeptChange = async (dept: TreeType) => {
  searchCriteria.value.dept_id = dept.id;
  loadData();
};
//页码搜索条件
const page = ref({
  current: 1,
  size: 10,
  total: 0,
});
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
  [() => page.value.current, () => page.value.size],
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
  loading.value = true;
  const response = await conditionQuery({
    ...searchCriteria.value,
    page: page.value.current,
    pageSize: page.value.size,
  });
  page.value.total = response.data.count;
  if (response.data.count === 0) {
    tableData.value = [];
  } else {
    tableData.value = HandleArrays(
      response.data.KeyPlacePerson,
      'is_nucleic_acid'
    );
  }
  loading.value = false;
};
//查看
const toptitle = ref('核酸信息');

/**
 * 子组件回显
 * @param booblean
 */

const changeshow = (booblean: boolean) => {
  visible.value = booblean;
};
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
//修改小表格中的 pageSize 所有的小表格 pagesize 都需要改变
const littleloading = ref(true);
let littlepageSize = 10;
const id = ref(0);
const pagingQuery = (page: number, pageSize: number) => {
  littleloading.value = true;
  littlepageSize = pageSize;
  nucleicAcid({
    section_type: 8,
    id: id.value,
    page: page,
    pageSize: pageSize,
  }).then(res => {
    informationData.value = res.data.AcidRecordInfo;
    littleloading.value = false;
  });
};
//子组件表格数据总数量
const total = ref(0);
/**
 * 展示当前信息
 * @param index
 * @param row
 */
const showMessage = (index: number, row: List) => {
  littleloading.value = true;
  id.value = row.id;
  visible.value = true;
  nucleicAcid({
    id: row.id,
    section_type: 8,
    page: 1,
    pageSize: littlepageSize,
  }).then(res => {
    informationData.value = res.data.AcidRecordInfo;
    total.value = res.data.Count;
    littleloading.value = false;
  });
};
/**
 * 处理数组
 */
const HandleArrays = (data: List[], str: string) => {
  for (const item of data) {
    if (item['is_nucleic_acid'] === '1') {
      item['is_nucleic_acid'] = '达标';
    } else if (item['is_nucleic_acid'] === '2') {
      item['is_nucleic_acid'] = '未达标';
    }
  }
  return data;
};
onMounted(async () => {
  await loadData();
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
