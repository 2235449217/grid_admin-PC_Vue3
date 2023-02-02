<template>
  <el-dialog
    v-model="dialogVisible"
    title="核查信息"
    :before-close="handleClose"
    width="1300px">
    <!-- 待核查人员来源面板 -->
    <SourceInfo :data="data" />
    <br />
    <!-- 核查表单 -->
    <CheckFrom ref="fromRef" :data="data" />
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="$emit('close')">关闭</el-button>
        <el-button type="primary" @click="submit">立即提交</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts">
export default {
  name: 'CheckPopup',
};
</script>
<script setup lang="ts">
import { getVerificationDetails } from '@/api/regionCheck';
import { VerificationDetailsType } from '@/api/regionCheck/types';
import { ElMessage } from 'element-plus';
import { computed, ref, toRefs, watch } from 'vue';
import CheckFrom from './panals/checkFrom.vue';
import SourceInfo from './panals/sourceInfo.vue';
const props = defineProps<{
  visible: number;
  handleClose: () => void;
}>();

const { visible, handleClose } = toRefs(props);

const emit = defineEmits<{
  (e: 'close'): void;
  (
    e: 'submit',
    res: Record<
      string,
      | string[]
      | string
      | number[]
      | number
      | boolean
      | Date[]
      | Date
      | [Date | null, Date | null]
      | undefined
    >
  ): void;
}>();

const dialogVisible = computed(() => {
  return visible.value > 0;
});

const data = ref<VerificationDetailsType | null>(null);

watch(visible, async (id: number) => {
  if (id > 0) {
    const response = await getVerificationDetails({
      id,
    });
    data.value = response.data;
  } else {
    data.value = null;
  }
});

const fromRef = ref<InstanceType<typeof CheckFrom> | null>(null);

const submit = async () => {
  let res = fromRef.value && (await fromRef.value.getReult());
  if (!res) {
    ElMessage({
      showClose: true,
      type: 'error',
      message: '请完善必填表单项',
    });
    return;
  }
  res['id'] = visible.value;
  delete res['type'];
  console.log(res);

  emit('submit', res);
};
</script>
