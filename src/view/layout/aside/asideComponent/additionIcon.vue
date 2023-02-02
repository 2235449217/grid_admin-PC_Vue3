<template>
  <div>
    <i-icon-data-statistical v-if="icon == 'i-icon-data-statistical'" />
    <i-icon-health-code v-if="icon === 'i-icon-health-code'" />
    <i-icon-home v-if="icon === 'i-icon-home'" />
    <i-icon-key-personnel v-if="icon === 'i-icon-key-personnel'" />
    <i-icon-key-sites v-if="icon === 'i-icon-key-sites'" />
    <i-icon-nat-infos v-if="icon === 'i-icon-nat-infos'" />
    <i-icon-region-check v-if="icon === 'i-icon-region-check'" />
    <i-icon-return-yu v-if="icon === 'i-icon-return-yu'" />
    <i-icon-risk-personnel v-if="icon === 'i-icon-risk-personnel'" />
    <i-icon-risk-warning v-if="icon === 'i-icon-risk-warning'" />
    <i-icon-system v-if="icon === 'i-icon-system'" />
    <i-icon-venue-code v-if="icon === 'i-icon-venue-code'" />
  </div>
</template>
<script lang="ts">
export default {
  name: 'AdditionIcon',
};
</script>
<script setup lang="ts">
const props = defineProps<{
  icon: string;
}>();
</script>
<style scoped lang="scss"></style>
