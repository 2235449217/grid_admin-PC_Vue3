<template>
  <!-- <div class="healthCodeColor"></div> -->
  <el-tag v-if="colorData === 1" type="success">绿码</el-tag>
  <el-tag v-if="colorData === 2" type="warning">黄码</el-tag>
  <el-tag v-if="colorData === 3" type="danger">红码</el-tag>
  <el-tag v-if="colorData === 0">未知</el-tag>
</template>
<script lang="ts">
export default { name: 'HealthCodeColor' };
</script>
<script setup lang="ts">
import { ref, toRefs } from 'vue';
const props = defineProps<{
  colorData: number;
}>();
const { colorData } = toRefs(props);
</script>
<style lang="scss" scoped>
.page {
  background-color: #fff;
  padding: 20px;
}
</style>
