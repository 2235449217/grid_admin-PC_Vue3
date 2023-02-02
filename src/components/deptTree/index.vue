<template>
  <div class="tree-box">
    <el-tree
      ref="treeRef"
      class="tree-body"
      accordion
      highlight-current
      node-key="id"
      :data="data"
      :props="defaultProps"
      @node-expand="handleNodeExpand"
      @node-click="handleNodeClick" />
  </div>
</template>
<script lang="ts">
export default {
  name: 'DeptTree',
};
</script>
<script setup lang="ts">
import { ElTree } from 'element-plus';
import { getDeptById } from '@/api/dept';
import { onMounted, ref, toRefs } from 'vue';
import { TreeType } from './types';
// import { useDeptStore } from '@/pinia/modules/dept';
import { useUserStore } from '@/pinia/modules/user';

const { userInfo } = useUserStore();

const props = defineProps<{
  onChange: (dept: TreeType) => void;
}>();

const { onChange } = toRefs(props);

const defaultProps = {
  label: 'label',
  children: 'children',
};

const treeRef = ref<InstanceType<typeof ElTree> | null>(null);

// const { depts, initDepts, loadDeptChildren } = useDeptStore();

// onMounted(async () => {
//   await initDepts();
//   console.log('initDepts', depts);
// });

// const handleNodeExpand = (dept: TreeType) => {
//   onChange.value(dept);
//   loadDeptChildren(dept);
// };

const data = ref<TreeType[]>([]);

onMounted(() => {
  getDeptById({ id: userInfo.dept.ID }).then(res => {
    const list = res.data.list.map((v: { ID: number; deptName: string }) => {
      return {
        label: v.deptName,
        id: v.ID,
      };
    });
    data.value = list;
    data.value.forEach(dept => {
      loadDeptChildren(dept);
    });
  });
});

/**
 * 获取子级部门
 */
const loadDeptChildren = (dept: TreeType) => {
  getDeptById({ id: dept.id }).then(res => {
    const list = res.data.list.map((v: { ID: number; deptName: string }) => {
      return {
        label: v.deptName,
        id: v.ID,
      };
    });
    dept.children = list;
  });
};

/**
 * 处理展开部门节点
 */
const handleNodeExpand = (dept: TreeType) => {
  const list = dept.children || [];
  if (list.length > 0 && list[0].children) {
    return;
  }
  list.forEach(v => {
    loadDeptChildren(v);
  });
};

/**
 * 处理点击部门节点
 */
const handleNodeClick = (dept: TreeType) => {
  onChange.value(dept);
};

/**
 * 重置
 */
const reset = () => {
  treeRef.value && treeRef.value.setCurrentKey(null);
};
defineExpose({
  reset,
});
</script>
<style scoped lang="scss">
.tree-box {
  padding: 15px 0 15px 15px;
  .tree-body {
    padding: 15px;
    border: 0.5px solid rgba(230, 230, 230, 1);
  }
}
</style>
