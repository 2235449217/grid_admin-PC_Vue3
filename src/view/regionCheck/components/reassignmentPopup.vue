<template>
  <el-dialog v-model="dialogVisible" title="转派" :before-close="closeDialog">
    <div>
      <span>转派至：</span>
      <el-cascader
        ref="cascader"
        v-model="cascaderData"
        :props="cascaderProps"
        @change="cascaderChange" />
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" @click="submit">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts">
export default {
  name: 'ReassignmentPopup',
};
</script>
<script setup lang="ts">
import { getDepartment } from '@/api/healthCode';
import { ElMessage } from 'element-plus';
import { computed, ref, toRefs, watch } from 'vue';

const props = defineProps<{
  visible: number;
}>();

const { visible } = toRefs(props);

const dialogVisible = computed(() => {
  return visible.value > 0;
});

const emit = defineEmits<{
  (e: 'update:visible', visible: number): void;
  (
    e: 'submit',
    data: {
      id: number;
      dept_id: number;
    }
  ): void;
}>();

// 关闭弹窗
const closeDialog = () => {
  emit('update:visible', 0);
};

/************************************************
 * 数据
 ************************************************/

const cascaderData = ref({});

const dept_id = ref(0);

// 级联选择器 props
type ListType = {
  label: string;
  id: number;
  value: string;
  children: ListType[];
};
type NodeType = {
  data: {
    id: number;
  };
};
type ResolveType = (list: ListType[]) => void;
const cascaderProps = {
  checkStrictly: true,
  lazy: true,
  lazyLoad(node: NodeType, resolve: ResolveType) {
    console.log(node);
    getDepartment({
      id: node.data.id || 1,
    }).then(res => {
      const list = res.data.list.map((v: { ID: number; deptName: string }) => {
        return {
          label: v.deptName,
          id: v.ID,
          value: v.ID,
        };
      });
      resolve(list);
    });
  },
};

// 级联选择器改变
const cascaderChange = (v: number[]) => {
  dept_id.value = v.at(-1) || 0;
};

// 提交
const submit = () => {
  if (dept_id.value === 0) {
    ElMessage({
      showClose: true,
      message: '请选择转派区划',
      type: 'warning',
    });
    return;
  }
  emit('submit', {
    id: visible.value,
    dept_id: dept_id.value,
  });
};

watch(visible, val => {
  if (!val) {
    cascaderData.value = {};
  }
});
</script>
<style lang="scss" scoped></style>
