import { TreeType } from '@/components/deptTree/types';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { getDeptById } from '@/api/dept';

export const useDeptStore = defineStore('dept', () => {
  const depts = ref<TreeType[]>([]);

  /**
   * 根据 id 查询部门
   * @param dept 部门
   */
  const loadDepts = async (id: number) => {
    // const localData: TreeType[] = JSON.parse(
    //   localStorage.getItem('depts') as string
    // );
    // const findDept = (data: TreeType[]) => {
    //   for (const dept of data) {
    //     if (dept.id === id) {
    //       return dept;
    //     }
    //     if (dept.children && dept.children.length > 0) {
    //       findDept(dept.children);
    //     }
    //   }
    // };
    // const dept = findDept(localData);
    // if (dept) return dept;
    const response = await getDeptById({ id });
    const data: TreeType[] = response.data.list.map(
      (item: { ID: number; deptName: string }) => {
        return {
          label: item.deptName,
          id: item.ID,
        };
      }
    );
    return data;
  };

  /**
   * 初始化部门数据
   */
  const initDepts = async () => {
    let data: TreeType[] =
      JSON.parse(localStorage.getItem('depts') as string) || [];
    if (!data || data.length === 0) {
      data = await loadDepts(1);
      for await (const dept of data) {
        const children = await loadDepts(dept.id);
        dept.children = children;
      }
    }
    depts.value = data;
    localStorage.setItem('depts', JSON.stringify(depts.value));
  };

  /**
   * 加载子级部门
   * @param dept 部门
   */
  const loadDeptChildren = async (dept: TreeType) => {
    const data = dept.children || [];
    for await (const dept of data) {
      const children = await loadDepts(dept.id);
      dept.children = children;
    }
    localStorage.setItem('depts', JSON.stringify(depts.value));
  };

  return {
    depts,
    initDepts,
    loadDeptChildren,
  };
});
