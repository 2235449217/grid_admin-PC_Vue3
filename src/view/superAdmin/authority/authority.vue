<template>
  <div class="authority">
    <div class="gva-table-box">
      <div class="gva-btn-list">
        <el-button
          size="small"
          type="primary"
          icon="plus"
          @click="addAuthority()">
          新增角色
        </el-button>
      </div>
      <el-table :data="tableData" row-key="authorityId" style="width: 100%">
        <el-table-column label="角色ID" min-width="160" prop="authorityId" />
        <el-table-column
          align="left"
          label="角色名称"
          min-width="150"
          prop="authorityName" />
        <el-table-column align="left" label="数据范围" min-width="200">
          <template #default="scope">
            <el-cascader
              v-model="scope.row.dataScope"
              :options="dataScopeOption"
              :show-all-levels="false"
              collapse-tags
              :props="{
                multiple: false,
                checkStrictly: true,
                label: 'dataScopeText',
                value: 'dataScope',
                disabled: 'disabled',
                emitPath: false,
              }"
              :clearable="false"
              @visible-change="
                flag => {
                  changeDataScope(scope.row, flag);
                }
              "
              @remove-tag="
                () => {
                  changeDataScope(scope.row, false);
                }
              " />
          </template>
        </el-table-column>
        <el-table-column align="left" label="数据权限" min-width="200">
          <template #default="scope">
            <el-cascader
              v-model="scope.row.deptId"
              :options="deptOptions"
              :show-all-levels="false"
              :disabled="scope.row.dataScope !== '自定义'"
              collapse-tags
              :props="{
                multiple: true,
                checkStrictly: true,
                label: 'deptName',
                value: 'deptId',
                disabled: 'disabled',
                emitPath: false,
              }"
              :clearable="false"
              @visible-change="
                flag => {
                  changeDataScope(scope.row, flag);
                }
              "
              @remove-tag="
                () => {
                  changeDataScope(scope.row, false);
                }
              " />
          </template>
        </el-table-column>
        <el-table-column align="left" label="操作" width="300">
          <template #default="scope">
            <el-button
              icon="setting"
              size="small"
              type="text"
              @click="opdendrawer(scope.row)">
              设置权限
            </el-button>
            <el-button
              icon="edit"
              size="small"
              type="text"
              @click="editAuthority(scope.row)">
              编辑
            </el-button>
            <el-button
              icon="delete"
              size="small"
              type="text"
              @click="deleteAuth(scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 新增角色弹窗 -->
    <el-dialog v-model="dialogFormVisible" :title="dialogTitle">
      <el-form
        ref="authorityForm"
        :model="form"
        :rules="rules"
        label-width="80px">
        <el-form-item label="角色名" prop="authorityName">
          <el-input
            v-model="form.authorityName"
            placeholder="请输入角色名"
            autocomplete="off" />
        </el-form-item>
        <el-form-item label="角色级别" prop="level">
          <el-input
            v-model="form.level"
            type="number"
            placeholder="请输入一个正整数作为角色级别,0为最高级"
            autocomplete="off" />
        </el-form-item>
        <el-form-item label="数据范围" prop="dataScope">
          <el-cascader
            v-model="form.dataScope"
            style="width: 100%"
            :options="dataScopeOption"
            :show-all-levels="false"
            :props="{
              multiple: false,
              checkStrictly: true,
              label: 'dataScopeText',
              value: 'dataScope',
              disabled: 'disabled',
              emitPath: false,
            }"
            :clearable="false" />
        </el-form-item>
        <el-form-item
          :hidden="form.dataScope !== '自定义'"
          label="数据权限"
          prop="deptId">
          <el-cascader
            v-model="form.deptId"
            style="width: 100%"
            :options="deptOptions"
            :show-all-levels="false"
            :props="{
              multiple: true,
              checkStrictly: true,
              label: 'deptName',
              value: 'deptId',
              disabled: 'disabled',
              emitPath: false,
            }"
            :clearable="false" />
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

    <el-drawer
      v-if="drawer"
      v-model="drawer"
      :with-header="false"
      size="40%"
      title="角色配置">
      <el-tabs :before-leave="autoEnter" class="role-box" type="border-card">
        <el-tab-pane label="角色菜单">
          <Menus ref="menus" :row="activeRow" @change-row="changeRow" />
        </el-tab-pane>
        <el-tab-pane label="角色api">
          <Apis ref="apis" :row="activeRow" @change-row="changeRow" />
        </el-tab-pane>
      </el-tabs>
    </el-drawer>
  </div>
</template>

<script setup>
import {
  getAuthorityList,
  deleteAuthority,
  createAuthority,
  updateAuthority,
} from '@/api/authority';

import Menus from '@/view/superAdmin/authority/components/menus.vue';
import Apis from '@/view/superAdmin/authority/components/apis.vue';

import { ref, watch, nextTick } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { getDeptList } from '@/api/dept';

const mustUint = (rule, value, callback) => {
  if (!/^[0-9]*[1-9][0-9]*$/.test(value)) {
    return callback(new Error('请输入正整数'));
  }
  return callback();
};

const dataScopeOption = ref([
  {
    dataScope: '全部',
    dataScopeText: '全部',
  },
  {
    dataScope: '本级',
    dataScopeText: '本级及以下',
  },
  {
    dataScope: '自定义',
    dataScopeText: '自定义',
  },
]);
const drawer = ref(false);
const dialogType = ref('add');
const activeRow = ref({});

const dialogTitle = ref('新增角色');
const dialogFormVisible = ref(false);
const apiDialogFlag = ref(false);

const form = ref({
  authorityId: '',
  authorityName: '',
  level: '',
  dataScope: '',
  deptId: [],
});

const rules = ref({
  level: [
    { required: true, message: '请输入角色级别', trigger: 'blur' },
    { validator: mustUint, trigger: 'blur' },
  ],
  authorityName: [{ required: true, message: '请输入角色名', trigger: 'blur' }],
  dataScope: [
    { required: true, message: '请选择角色数据权限', trigger: 'blur' },
  ],
});

const page = ref(1);
const total = ref(0);
const pageSize = ref(999);
const tableData = ref([]);
const searchInfo = ref({});

// 查询
const getTableData = async () => {
  const table = await getAuthorityList({
    page: page.value,
    pageSize: pageSize.value,
    ...searchInfo.value,
  });
  if (table.code === 0) {
    tableData.value = table.data.list;
    total.value = table.data.total;
    page.value = table.data.page;
    pageSize.value = table.data.pageSize;
  }
};

watch(tableData, () => {
  setDeptIds();
});

const initPage = async () => {
  getTableData();
  const depTs = await getDeptList({ page: 1, pageSize: 999 });
  setDeptOptions(depTs.data.list);
  setDataScopeOptions();
};

initPage();

const changeRow = (key, value) => {
  activeRow.value[key] = value;
};
const menus = ref(null);
const apis = ref(null);
const datas = ref(null);
const autoEnter = (activeName, oldActiveName) => {
  const paneArr = [menus, apis, datas];
  if (oldActiveName) {
    if (paneArr[oldActiveName].value.needConfirm) {
      paneArr[oldActiveName].value.enterAndNext();
      paneArr[oldActiveName].value.needConfirm = false;
    }
  }
};

const changeDataScope = async (row, flag) => {
  if (flag) {
    return;
  }

  await nextTick();
  const res = await updateAuthority({
    authorityId: row.authorityId,
    level: row.level,
    authorityName: row.authorityName,
    dataScope: row.dataScope,
    deptId: row.deptId,
  });
  if (res.code === 0) {
    ElMessage({ type: 'success', message: '角色设置成功' });
  }
};

const opdendrawer = row => {
  drawer.value = true;
  activeRow.value = row;
};
// 删除角色
const deleteAuth = row => {
  ElMessageBox.confirm('此操作将永久删除该角色, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      const res = await deleteAuthority({ authorityId: row.authorityId });
      if (res.code === 0) {
        ElMessage({
          type: 'success',
          message: '删除成功!',
        });
        if (tableData.value.length === 1 && page.value > 1) {
          page.value--;
        }
        getTableData();
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
const authorityForm = ref(null);
const initForm = () => {
  if (authorityForm.value) {
    authorityForm.value.resetFields();
  }
  form.value = {
    authorityId: '',
    authorityName: '',
    level: '',
    dataScope: '',
    deptId: [],
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
  if (form.value.authorityId === '0') {
    ElMessage({
      type: 'error',
      message: '角色id不能为0',
    });
    return false;
  }
  authorityForm.value.validate(async valid => {
    if (valid) {
      switch (dialogType.value) {
        case 'add':
          {
            form.value.level = Number(form.value.level);
            const res = await createAuthority(form.value);
            if (res.code === 0) {
              ElMessage({
                type: 'success',
                message: '添加成功!',
              });
              getTableData();
              closeDialog();
            }
          }
          break;
        case 'edit':
          {
            form.value.level = Number(form.value.level);
            const res = await updateAuthority(form.value);
            if (res.code === 0) {
              ElMessage({
                type: 'success',
                message: '添加成功!',
              });
              getTableData();
              closeDialog();
            }
          }
          break;
      }

      initForm();
      dialogFormVisible.value = false;
    }
  });
};

const setDeptIds = () => {
  tableData.value &&
    tableData.value.forEach(auth => {
      const deptIds =
        auth.depts &&
        auth.depts.map(i => {
          return i.ID;
        });
      auth.deptId = deptIds;
    });
};

const setDataScopeOptions = () => {
  dataScopeOption.value = [
    {
      dataScope: '全部',
      dataScopeText: '全部',
    },
    {
      dataScope: '本级',
      dataScopeText: '本级及以下',
    },
    {
      dataScope: '自定义',
      dataScopeText: '自定义',
    },
  ];
};

const deptOptions = ref([]);
const setDeptOptions = deptData => {
  deptOptions.value = [];
  setDepartmentOptions(deptData, deptOptions.value);
};

const setDepartmentOptions = (DeptData, optionsData) => {
  // DeptData &&
  //   DeptData.forEach(item => {
  //     if (item.children && item.children.length) {
  //       const option = {
  //         deptId: item.ID,
  //         deptName: item.deptName,
  //         children: [],
  //       };
  //       setDepartmentOptions(item.children, option.children);
  //       optionsData.push(option);
  //     } else {
  //       const option = {
  //         deptId: item.ID,
  //         deptName: item.deptName,
  //       };
  //       optionsData.push(option);
  //     }
  //   });
};

// const setOptions = () => {
//   AuthorityOption.value = [
//     {
//       authorityId: '0',
//       authorityName: '根角色',
//     },
//   ]
//   setAuthorityOptions(tableData.value, AuthorityOption.value, false)
// }
// const setAuthorityOptions = (AuthorityData, optionsData, disabled) => {
//   form.value.authorityId = String(form.value.authorityId)
//   AuthorityData &&
//   AuthorityData.forEach(item => {
//     if (item.children && item.children.length) {
//       const option = {
//         authorityId: item.authorityId,
//         authorityName: item.authorityName,
//         disabled: disabled || item.authorityId === form.value.authorityId,
//       }
//       setAuthorityOptions(
//         item.children,
//         option.children,
//         disabled || item.authorityId === form.value.authorityId,
//       )
//       optionsData.push(option)
//     } else {
//       const option = {
//         authorityId: item.authorityId,
//         authorityName: item.authorityName,
//         disabled: disabled || item.authorityId === form.value.authorityId,
//       }
//       optionsData.push(option)
//     }
//   })
// }
// 增加角色
const addAuthority = () => {
  initForm();
  dialogTitle.value = '新增角色';
  dialogType.value = 'add';

  dialogFormVisible.value = true;
};
// 编辑角色
const editAuthority = row => {
  dialogTitle.value = '编辑角色';
  dialogType.value = 'edit';
  for (const key in form.value) {
    form.value[key] = row[key];
  }
  dialogFormVisible.value = true;
};
</script>

<script>
export default {
  name: 'Authority',
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
