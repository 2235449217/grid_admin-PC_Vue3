<template>
  <el-dialog
    v-model="visible"
    :title="toptitle"
    :before-close="handleClose"
    width="60%">
    <!-- 内容 -->
    <el-table
      v-loading="loading"
      style="font-size: 10px"
      :data="informationData"
      border>
      <el-table-column
        v-for="(item, index) in headercolumn"
        :key="index"
        :min-width="item.width"
        :prop="item.prop"
        :label="item.label"
        show-overflow-tooltip>
        <template #default="scope">
          <span v-if="item.prop === 'code_color'">
            <HealthCodeColor
              :color-data="scope.row[item.prop]"></HealthCodeColor>
          </span>
          <span v-else>
            {{ conditionRender(item.prop, scope.row[item.prop]) }}
          </span>
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
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange" />
    </div>
  </el-dialog>
</template>
<script lang="ts">
export default {
  name: 'DialogTable',
};
</script>
<script setup lang="ts">
import TABLE_CODE_MAP, { DEFAULT_VALUE } from '@/constant/tableCodeMap';
import { stampFormat, UTCFormat } from '@/utils/dateFormat';
import { ref, toRefs, onMounted } from 'vue';
import HealthCodeColor from '../../components/healthCodeColor/index.vue';

// 条件渲染
const conditionRender = (prop: string, value: string | number) => {
  let res: string | number = '';
  switch (prop) {
    case 'travel_type':
    case 'code_color':
      res = TABLE_CODE_MAP[prop][value] || DEFAULT_VALUE;
      break;
    case 'dispatch_time':
    case 'transfer_time':
      res = stampFormat(value as number) || DEFAULT_VALUE;
      break;
    case 'record_time':
    case 'upload_time':
    case 'scan_time':
      res = UTCFormat(value as string) || DEFAULT_VALUE;
      break;
    default:
      res = value || DEFAULT_VALUE;
      break;
  }
  return res;
};

/**使用说明 */
/**
 *
 * headercolumn数组内对象属性分别为 label prop， 父组件应与 Colum 类型保持一致
 *
 */
const props = defineProps<{
  visible: boolean; //控制显示
  toptitle: string; //标题预设
  headercolumn: Column[]; //表格标头
  informationData: any[]; //表格信息 父组件中定义类型
  total: number;
  loading?: boolean;
}>();
type Column = {
  label: string;
  prop: string;
  width?: string;
};

const emit = defineEmits(['changeshow', 'pagingQuery']);

// 子组件在用defineProps接受到值以后，必须用toRefs来解构一下
const { visible, toptitle, informationData, total, loading } = toRefs(props);

const handleClose = () => {
  emit('changeshow', false);
};
const page = ref({
  current: 1,
  size: 10,
  total: 0,
});
const handleCurrentChange = async (val: number) => {
  page.value.current = val;
  await emit('pagingQuery', page.value.current, page.value.size);
};
const handleSizeChange = async (val: number) => {
  page.value.size = val;
  await emit('pagingQuery', page.value.current, page.value.size);
};
onMounted(() => {
  page.value.total = total.value;
});
</script>

<style scoped lang="scss">
.pagination {
  display: flex;
  justify-content: end;
}
</style>
