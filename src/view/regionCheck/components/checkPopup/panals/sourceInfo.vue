<template>
  <el-descriptions title="待核查人员来源信息" border>
    <el-descriptions-item
      v-for="(item, index) in dataList"
      :key="index"
      :label="item.label"
      :span="item.span || 1"
      >{{ item.value || DEFAULT_VALUE }}</el-descriptions-item
    >
  </el-descriptions>
</template>
<script lang="ts">
export default {
  name: 'SourceInfoPanel',
};
</script>
<script setup lang="ts">
import { VerificationDetailsType } from '@/api/regionCheck/types';
import { stampFormat } from '@/utils/dateFormat';
import { ref, watch } from 'vue';
import { DEFAULT_VALUE } from '@/constant/tableCodeMap';

const props = defineProps<{
  data: VerificationDetailsType | null;
}>();

// 待核查人员来源信息
type DataType = {
  prop: string;
  label: string;
  value?: string;
  span?: number;
  required?: boolean;
};
const dataList = ref<DataType[]>([
  {
    prop: 'name',
    label: '姓名',
  },
  {
    prop: 'id_card_num',
    label: '证件号',
  },
  {
    prop: 'phone',
    label: '手机号',
  },
  {
    prop: 'live_province',
    label: '人员所在省份',
  },
  {
    prop: 'live_city',
    label: '人员所在地市',
  },
  {
    prop: 'live_area',
    label: '人员所在县区',
  },
  {
    prop: 'source_date',
    label: '来源日期',
  },
  {
    prop: 'source_type',
    label: '来源类型',
  },
  {
    prop: 'event_name',
    label: '事件名称',
  },
  {
    prop: 'batch_num',
    label: '批次号',
  },
  {
    prop: 'health_code',
    label: '健康码',
    span: 2,
  },
  {
    prop: 'address',
    label: '地址',
    span: 3,
  },
  {
    prop: 'comment',
    label: '备注',
    span: 3,
  },
]);

watch(
  props,
  val => {
    const data = val.data;
    if (data) {
      dataList.value.forEach(item => {
        let value = '';
        if (item.prop === 'source_date') {
          value = stampFormat(data[item.prop]);
        } else {
          value = data[item.prop];
        }
        item.value = value;
      });
    } else {
      // 信息展示
      dataList.value.forEach(item => {
        item.value = '';
      });
    }
  },
  {
    immediate: true,
    deep: true,
  }
);
</script>
