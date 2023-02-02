<template>
  <el-menu-item :index="routerInfo.name">
    <el-icon v-if="routerInfo.meta.icon">
      <template v-if="icons.includes(routerInfo.meta.icon)">
        <addition-icon :icon="routerInfo.meta.icon" />
      </template>
      <template v-else>
        <component :is="routerInfo.meta.icon" />
      </template>
    </el-icon>
    <template #title>
      <span class="gva-menu-item-title">{{ routerInfo.meta.title }}</span>
    </template>
  </el-menu-item>
</template>

<script lang="ts">
export default {
  name: 'MenuItem',
};
</script>

<script setup lang="ts">
import additionIcon from './additionIcon.vue';
import customIcons from '@/constant/customIcons';
defineProps({
  routerInfo: {
    default: function () {
      return null;
    },
    type: Object,
  },
});

const icons = customIcons;
defineExpose(icons);
</script>

<style lang="scss" scoped>
// .gva-menu-item-title {
//   min-width: 160px;
// }
</style>
