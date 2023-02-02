<template>
  <el-sub-menu ref="subMenu" :index="routerInfo.name">
    <template #title>
      <el-icon v-if="routerInfo.meta.icon">
        <template v-if="icons.includes(routerInfo.meta.icon)">
          <addition-icon :icon="routerInfo.meta.icon" />
        </template>
        <template v-else>
          <component :is="routerInfo.meta.icon" />
        </template>
      </el-icon>
      <span>{{ routerInfo.meta.title }}</span>
    </template>
    <slot />
  </el-sub-menu>
</template>

<script lang="ts">
export default {
  name: 'AsyncSubmenu',
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
