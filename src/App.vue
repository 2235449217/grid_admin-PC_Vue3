<template>
  <div id="app">
    <router-view v-if="isRouterAlive" />
  </div>
</template>

<script lang="ts">
export default {
  name: 'App',
  created() {
    this.$nextTick(() => {
      // 禁用右键
      document.oncontextmenu = new Function('event.returnValue=false');
      // 禁用选择
      document.onselectstart = new Function('event.returnValue=false');
    });
  },
};
</script>
<script setup lang="ts">
import { nextTick, ref, provide } from 'vue';

const isRouterAlive = ref(true);
const reload = () => {
  isRouterAlive.value = false;
  nextTick(() => {
    isRouterAlive.value = true;
  });
};
provide('reload', reload);
</script>

<style lang="scss">
// 引入初始化样式
@import '@/style/main.scss';
@import '@/style/base.scss';
@import '@/style/mobile.scss';
#app {
  background: #eee;
  height: 100vh;
  overflow: hidden;
  font-weight: 400 !important;
}
.el-button {
  font-weight: 400 !important;
}
.el-button + .el-button {
  margin-left: 8px !important;
}
</style>
