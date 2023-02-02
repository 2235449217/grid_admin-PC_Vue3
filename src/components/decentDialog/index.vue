<template>
  <div>
    <!-- 派发-弹窗 -->
    <el-dialog
      v-model="decentVisible"
      :title="isRoot ? '转派' : '派发'"
      :before-close="handleClose">
      <!-- 转派的操作部分 -->
      <div v-if="isRoot">
        <div class="transfer decent">
          <span>转派至：</span>
          <el-cascader
            v-model="form.resultPlace"
            :props="decentProps"
            @change="changeValue" />
        </div>
        <div v-if="controlShow" class="control">
          <span>管控方式 : </span>
          <el-select
            v-model="form.control_mode"
            class="control"
            placeholder="请选择管控方式"
            size="large"
            @change="controlChange">
            <el-option
              v-for="item in control_list"
              :key="item.value"
              :label="item.label"
              :value="item.value" />
          </el-select>
        </div>
      </div>
      <!-- 派发的操作部分 -->
      <div v-else>
        <div class="decent">
          <span>派发至：</span>
          <el-cascader
            v-model="form.resultPlace"
            :props="decentProps"
            @change="changeValue" />
        </div>
        <div v-if="controlShow" class="control">
          <span>管控方式 : </span>
          <el-select
            v-model="form.control_mode"
            class="control"
            placeholder="请选择管控方式"
            size="large"
            @change="controlChange">
            <el-option
              v-for="item in control_list"
              :key="item.value"
              :label="item.label"
              :value="item.value" />
          </el-select>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="consoleBtn()">取消</el-button>
          <el-button type="primary" @click="enterEditBtn()">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts">
export default { name: 'Test' };
</script>
<script setup lang="ts">
import { getDepartment } from '@/api/healthCode';
import { ref, toRefs } from 'vue';
import { useUserStore } from '@/pinia/modules/user';
import { ElMessage } from 'element-plus';

const { userInfo } = useUserStore();

const props = defineProps<{
  decentVisible: boolean;
  controlShow?: boolean;
  isRoot?: boolean;
}>();
const { decentVisible, isRoot, controlShow } = toRefs(props);

const handleClose = (done: () => void) => {
  done();
  consoleBtn();
};

const control_list = [
  {
    value: '1',
    label: '集中隔离',
  },
  {
    value: '2',
    label: '居家隔离',
  },
  {
    value: '3',
    label: '居家健康检测',
  },
  {
    value: '4',
    label: '失控状态',
  },
  {
    value: '5',
    label: '解除隔离',
  },
];

const emits = defineEmits(['change-visible', 'submit']);

const consoleBtn = () => {
  emits('change-visible', false);
  initForm();
};
const form = ref({
  resultPlace: '',
  control_mode: '',
});

// const options = ref<formDialog[]>([]);

/**
 * 表单初始化
 */
const initForm = () => {
  form.value = {
    resultPlace: '',
    control_mode: '',
  };
};
/**
 * 派发
 */
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
const decentProps = {
  checkStrictly: true,
  lazy: true,
  lazyLoad(node: NodeType, resolve: ResolveType) {
    console.log(node);
    // userInfo.dept
    getDepartment({
      id: node.data.id || (isRoot ? userInfo.dept.ID : 1),
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
const dept_id = ref();
const controlMode = ref<number>();
const changeValue = () => {
  dept_id.value = parseInt(form.value.resultPlace.slice(-1));
  console.log(5555555555555555, dept_id.value);
};
const controlChange = () => {
  controlMode.value = parseInt(form.value.control_mode);
};

const enterEditBtn = () => {
  let isEmperty = true;
  for (let i in form.value) {
    if (!form.value[i]) {
      isEmperty = false;
    }
  }
  if (controlShow?.value) {
    if (!isEmperty) {
      ElMessage({
        type: 'warning',
        message: '请填写完整信息',
      });
    } else {
      emits('submit', dept_id.value, controlMode.value);
      initForm();
    }
  } else {
    if (!form.value.resultPlace) {
      ElMessage({
        type: 'warning',
        message: '请填写完整信息',
      });
    } else {
      emits('submit', dept_id.value, controlMode.value);
      initForm();
    }
  }
  consoleBtn();
  console.log('派发成功');
};
</script>
<style lang="scss" scoped>
.decent {
  height: 50px;
  line-height: 50px;
  margin-right: 30px;
  display: inline-block;
}
.control {
  height: 50px;
  line-height: 50px;
  display: inline-block;
}
</style>
