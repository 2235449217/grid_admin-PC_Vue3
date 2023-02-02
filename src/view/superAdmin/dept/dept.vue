<template>
  <div class="authority">
    <div class="gva-table-box">
      <div class="gva-btn-list">
        <el-button
          size="small"
          type="primary"
          icon="plus"
          @click="addDept('0')">
          新增部门
        </el-button>
      </div>
      <el-table
        ref="lazyTableRef"
        :data="tableData"
        style="width: 100%"
        row-key="ID"
        lazy
        :load="loadChildList"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
        <el-table-column label="部门ID" min-width="180" prop="ID" />
        <el-table-column
          align="left"
          label="部门名称"
          min-width="180"
          prop="deptName" />
        <el-table-column
          align="left"
          label="负责人"
          min-width="180"
          prop="manager" />
        <el-table-column
          align="left"
          label="负责人联系方式"
          min-width="180"
          prop="manager_phone" />
        <el-table-column align="left" label="操作" width="300">
          <template #default="scope">
            <el-button
              icon="plus"
              size="small"
              type="text"
              @click="addDept(scope.row.ID)">
              新增子部门
            </el-button>
            <el-button
              icon="edit"
              size="small"
              type="text"
              @click="ediDept(scope.row)">
              编辑
            </el-button>
            <el-button
              icon="delete"
              size="small"
              type="text"
              @click="deleteDept(scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 新增部门弹窗 -->
    <el-dialog v-model="dialogFormVisible" :title="dialogTitle">
      <el-form ref="deptForm" :model="form" :rules="rules" label-width="110px">
        <!-- <el-form-item label="父级部门" prop="parentID"> -->
        <!-- <el-cascader
            v-model="form.parentID"
            style="width: 100%"
            :disabled="dialogType === 'add' || dialogType === 'edit'"
            :options="deptOption"
            :props="{
              checkStrictly: true,
              label: 'deptName',
              value: 'deptId',
              disabled: 'disabled',
              emitPath: false,
            }"
            :show-all-levels="false"
            filterable /> -->
        <!-- <el-input
            v-model="form.deptName"
            autocomplete="off"
            :disabled="dialogType === 'add' || dialogType === 'edit'" /> -->
        <!-- </el-form-item> -->
        <!-- <el-form-item label="部门排序" prop="deptSort">
          <el-input v-model="form.deptSort" autocomplete="off" />
        </el-form-item> -->
        <el-form-item label="部门名称" prop="deptName">
          <el-input v-model="form.deptName" autocomplete="off" />
        </el-form-item>
        <el-form-item label="负责人">
          <el-input v-model="form.manager" autocomplete="off" />
        </el-form-item>
        <el-form-item label="负责人手机号" prop="manager_phone">
          <el-input v-model="form.manager_phone" autocomplete="off" />
        </el-form-item>
        <el-form-item label="负责人身份证号" prop="manager_id_card">
          <el-input v-model="form.manager_id_card" autocomplete="off" />
        </el-form-item>
        <el-form-item label="经度" prop="longitude">
          <el-input v-model="form.longitude" autocomplete="off" />
        </el-form-item>
        <el-form-item label="纬度" prop="latitude">
          <el-input v-model="form.latitude" autocomplete="off" />
        </el-form-item>
        <el-form-item :hidden="true" label="部门ID" prop="ID">
          <el-input v-model="form.ID" autocomplete="off" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button size="small" @click="closeDialog"> 取 消 </el-button>
          <el-button size="small" type="primary" @click="enterDialog">
            确 定
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import {
  getDeptList,
  deleteDepartment,
  createDept,
  updateDept,
  getDeptById,
} from '@/api/dept';
import { getUserInfo } from '@/api/user';
import { onMounted, ref, inject } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
const alias = inject('reload');
const mustUint = (rule, value, callback) => {
  if (!/^[0-9]*[1-9][0-9]*$/.test(value)) {
    return callback(new Error('请输入正整数'));
  }
  return callback();
};

const deptOption = ref([
  {
    deptId: '0',
    deptName: '部门',
  },
]);

const dialogType = ref('add');

const dialogTitle = ref('新增部门');
const dialogFormVisible = ref(false);
const apiDialogFlag = ref(false);

const form = ref({
  ID: '',
  deptSort: 1,
  deptName: '',
  parentID: '0',
  manager: '',
  manager_phone: '',
  manager_id_card: '',
  longitude: '',
  latitude: '',
});
const rules = ref({
  deptSort: [
    { required: true, message: '请输入部门排序号', trigger: 'blur' },
    { validator: mustUint, trigger: 'blur' },
  ],
  deptName: [{ required: true, message: '请输入部门名', trigger: 'blur' }],
  parentID: [{ required: true, message: '请选择请求方式', trigger: 'blur' }],
  manager_phone: [
    {
      pattern:
        /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,
      message: '请输入正确的手机号',
      trigger: 'blur',
    },
  ],
  manager_id_card: [
    {
      pattern:
        /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
      message: '请输入正确的身份证号码',
      trigger: 'blur',
    },
  ],
  longitude: [
    {
      pattern: /^\d{1,3}\.\d{1,6}$/,
      // pattern: /^(([1-9]\\d?)|(1[0-7]\\d))(\\.\\d{1,6})|180|0(\\.\\d{1,6})?$/,
      message: '请输入正确的经度',
      trigger: 'blur',
    },
  ],
  latitude: [
    {
      pattern: /^\d{1,2}\.\d{1,6}$/,
      // pattern: /^(([1-8]\\d?)|([1-8]\\d))(\\.\\d{1,6})|90|0(\\.\\d{1,6})?$/,
      message: '请输入正确的纬度',
      trigger: 'blur',
    },
  ],
});

const page = ref(1);
const total = ref(0);
const pageSize = ref(50);
const tableData = ref([]);
const searchInfo = ref({});

// 查询
const getTableData = async () => {
  const table = await getDeptList({
    page: page.value,
    pageSize: pageSize.value,
    ...searchInfo.value,
  });
  if (table.code === 0) {
    tableData.value.push(table.data.list);
    total.value = table.data.total;
    page.value = table.data.page;
    pageSize.value = table.data.pageSize;
  }
};
/**
 * 懒加载
 */
onMounted(() => {
  getDeptById({}).then(res => {
    tableData.value = res.data.list.map(item => {
      item.hasChildren = true;
      return item;
    });
  });
});

const loadChildList = (tree, treeNode, resolve) => {
  getDeptById({ id: tree.ID }).then(res => {
    var data;
    if (res.data.list.length && res.data.list.length > 0) {
      let data = res.data.list.map(item => {
        item.hasChildren = true;
        return item;
      });
      resolve(data);
    } else {
      tree.hasChildren = false;
    }
  });
};

// 删除部门
const deleteDept = row => {
  ElMessageBox.confirm('此操作将永久删除该部门, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      const res = await deleteDepartment({ id: row.ID });
      if (res.code === 0) {
        ElMessage({
          type: 'success',
          message: '删除成功!',
        });
        if (tableData.value.length === 1 && page.value > 1) {
          page.value--;
        }
        getTableData();
        alias();
      }
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '已取消删除',
      });
    });
};
// 初始化表单
const deptForm = ref(null);
const initForm = () => {
  if (deptForm.value) {
    deptForm.value.resetFields();
  }
  form.value = {
    ID: '',
    deptSort: 1,
    deptName: '',
    parentID: '0',
    manager: '',
    manager_phone: '',
    manager_id_card: '',
    longitude: '',
    latitude: '',
  };
};
// 关闭窗口
const closeDialog = () => {
  initForm();
  dialogFormVisible.value = false;
  apiDialogFlag.value = false;
};
// 确定弹窗

const enterDialog = () => {
  if (form.value.deptSort <= 0) {
    ElMessage({
      type: 'error',
      message: '部门排序必须大于0',
    });
    return false;
  }
  deptForm.value.validate(async valid => {
    if (valid) {
      switch (dialogType.value) {
        case 'add':
          {
            const res = await createDept(form.value);
            if (res.code === 0) {
              ElMessage({
                type: 'success',
                message: '添加成功!',
              });
              getTableData();
              closeDialog();
              alias();
            }
          }
          break;
        case 'edit':
          {
            const res = await updateDept(form.value);
            if (res.code === 0) {
              ElMessage({
                type: 'success',
                message: '修改成功!',
              });
              getTableData();
              closeDialog();
              alias();
            }
          }
          break;
      }

      initForm();
      dialogFormVisible.value = false;
    }
  });
};
const setOptions = () => {
  deptOption.value = [
    {
      deptId: '0',
      deptName: '根部门',
    },
  ];
  setDepartMentOptions(tableData.value, deptOption.value, false);
};
const setDepartMentOptions = (deptData, optionsData, disabled) => {
  deptData &&
    deptData.forEach(item => {
      if (item.children && item.children.length) {
        const option = {
          deptId: item.ID,
          deptName: item.deptName,
          disabled: disabled || item.ID === form.value.ID,
          children: [],
        };
        setDepartMentOptions(
          item.children,
          option.children,
          disabled || item.ID === form.value.ID
        );
        optionsData.push(option);
      } else {
        const option = {
          deptId: item.ID,
          deptName: item.deptName,
          disabled: disabled || item.ID === form.value.ID,
        };
        optionsData.push(option);
      }
    });
};
// 增加部门
const userId = ref();
getUserInfo().then(res => {
  userId.value = res.data.userInfo.deptId;
});
const addDept = parentId => {
  initForm();
  dialogTitle.value = '新增部门';
  dialogType.value = 'add';
  form.value.parentID =
    parentId == '0' ? String(userId.value) : String(parentId);
  setOptions();
  dialogFormVisible.value = true;
};
// 编辑部门
const ediDept = row => {
  setOptions();
  dialogTitle.value = '编辑部门';
  dialogType.value = 'edit';
  for (const key in form.value) {
    form.value[key] = row[key];
  }
  form.value.parentID = String(form.value.parentID);
  setOptions();
  dialogFormVisible.value = true;
};
</script>

<script>
export default {
  name: 'Dept',
};
</script>

<style lang="scss">
.authority {
  .el-input-number {
    margin-left: 15px;

    span {
      display: none;
    }
  }
}

.role-box {
  .el-tabs__content {
    height: calc(100vh - 72px);
    overflow: auto;
  }
}
</style>
