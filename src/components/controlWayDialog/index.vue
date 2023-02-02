<template>
  <div class="controlPage">
    <el-dialog
      v-model="controlVisible"
      title="管控方式"
      :before-close="closeFunc">
      <div class="control">
        <span>管控方式 : </span>
        <el-select
          v-model="form.control_mode"
          class="control"
          placeholder="请选择管控方式"
          size="large"
          @change="controlChange">
          <el-option
            v-for="(item, index) in control_list"
            :key="index"
            :label="item.label"
            :value="item.value" />
        </el-select>
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
export default { name: 'ControlWayDialog' };
</script>
<script setup lang="ts">
import { controlModeChange, controlModeList } from '@/api/healthCode';
import { ElMessage } from 'element-plus';
import { onMounted, ref, toRefs, inject } from 'vue';

const reload = inject<() => void>('reload');
const props = defineProps<{
  controlVisible: boolean;
  section_type: number;
  current_id: number;
}>();
const { controlVisible, section_type, current_id } = toRefs(props);
const emits = defineEmits(['change-control']);

const initForm = () => {
  form.value = {
    control_mode: '',
  };
};
type controlListType = {
  control_mode?: string;
};
const form = ref<controlListType>({});
const control_list = ref([
  {
    label: '',
    value: '',
  },
]);
const controlChange = () => {
  console.log('修改管控方式');
};
const closeFunc = () => {
  emits('change-control', false);
  initForm();
};
// 取消
const consoleBtn = () => {
  closeFunc();
};
// 确定
const enterEditBtn = async () => {
  // 调接口
  const res = await controlModeChange({
    section_type: section_type.value,
    id: current_id.value,
    code: Number(form.value.control_mode),
  });
  // console.log(res, 111111);
  if (res.code === 0) {
    ElMessage({
      type: 'success',
      message: '修改成功！',
    });
    reload && reload();
  }
  closeFunc();
};
// 页面初始化
onMounted(async () => {
  const res = await controlModeList({ section_type: section_type.value });
  // console.log(res.data);
  control_list.value = res.data;
});
</script>
<style lang="scss" scoped>
.page {
  background-color: #fff;
  padding: 20px;
}
</style>
