<!-- 封装的表格组件 -->
<template>
  <div class="myTable">
    <!-- 按钮组 -->
    <el-button-group v-if="isBtn">
      <el-button icon="plus" color="rgba(23, 125, 220, 1)" pluin
        >新增</el-button
      >
      <el-button icon="upload" color="rgb(33, 197, 196)">导入</el-button>
      <el-button icon="download" color="rgb(255, 141, 26, 1)">导出</el-button>
    </el-button-group>
    <el-table
      ref="tableRef"
      :data="tableData"
      size="small"
      :row-style="{ height: '44px' }"
      :header-cell-style="{ height: '50px', lineHeight: '50px' }"
      style="font-size: 12px; width: 100%; line-height: 20px"
      max-height="500">
      <!-- 序号列 -->
      <el-table-column prop="sort" label="序号" type="index" width="80" />
      <!-- 文本 -->
      <template v-for="(item, key) in tableTitleData" :key="key">
        <el-table-column
          :prop="item.prop"
          :label="item.label"
          :min-width="item.width"
          :sortable="item.sortable"
          :align="item.align || 'left'" />
      </template>
      <el-table-column v-if="isEdit" fixed="right" label="操作" width="280px">
        <template #default="scope">
          <el-button
            type="text"
            :icon="View"
            size="small"
            plain
            @click="seeInfoFunc(scope.row)"
            >查看</el-button
          >

          <el-button type="text" :icon="Position" size="small" color="" plain
            >派发</el-button
          >
          <el-button type="text" :icon="BottomRight" size="small" color="" plain
            >转派</el-button
          >Tickets

          <el-button type="text" :icon="MoreFilled" size="small" plain
            >更多</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 查看弹窗 -->
    <el-dialog v-model="dialogFormVisiable" title="查看" draggable>
      <el-form ref="dialogForm" :model="form" disabled>
        <el-row :gutter="20">
          <el-col v-for="(item, key) in tableTitleData" :key="key" :span="12">
            <el-form-item :prop="item.prop" :label="item.label">
              <el-input v-model="form"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>
<script lang="ts">
export default { name: '' };
</script>
<script setup lang="ts">
import { ref, onMounted, toRefs } from 'vue';

import {
  BottomRight,
  View,
  Position,
  MoreFilled,
} from '@element-plus/icons-vue';
import { toReactive } from '@vueuse/shared';
// table元素
const tableRef = ref();
const tableHeight = ref(750); //表格高度

onMounted(() => {
  // 设置表格初始高度为innerHeight-offsetTop-表格底部与浏览器底部距离85
  tableHeight.value = window.innerHeight - tableRef.value.$el.offsetTop - 85;
  // 监听浏览器高度变化
  window.onresize = () => {
    tableHeight.value = window.innerHeight - tableRef.value.$el.offsetTop - 85;
  };
});
const props = defineProps({
  tableTitleData: {
    type: Object,
    default: () => {
      return [{}];
    },
  },
  tableData: {
    type: Array,
    default: () => {
      return [{}];
    },
  },
  isEdit: {
    type: Boolean,
    default: false,
  },
  isBtn: {
    type: Boolean,
    default: false,
  },
  isTransfer: {
    type: Boolean,
    default: false,
  },
});

const dialogFormVisiable = ref(false);
const form = ref({});
const seeInfoFunc = (row: any) => {
  dialogFormVisiable.value = true;
  form.value = row;
};
</script>
<style lang="scss" scoped>
.myTable {
  background-color: #fff;
  font-size: 14px;
}
</style>
