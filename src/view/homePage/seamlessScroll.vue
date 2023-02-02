<template>
  <vue3-seamless-scroll
    hover-stop="true"
    :list="listData"
    class="scroll"
    hover="true"
    step="0.3">
    <div
      v-for="(item, index) in listData"
      :id="moreId"
      :key="index"
      class="item"
      style="padding: 10px; margin: 5px; font-size: 14px">
      <span v-for="(value, key, ind) in item" :key="ind" class="spanClass">{{
        value
      }}</span>
    </div>
  </vue3-seamless-scroll>
</template>
<script lang="ts">
export default {
  name: 'Carousel',
};
</script>

<script setup lang="ts">
import { Vue3SeamlessScroll } from 'vue3-seamless-scroll';
import { onMounted, ref } from 'vue';
defineProps({
  listData: {
    type: Array,
    require: true,
    default: function () {
      return [];
    },
  },
  moreId: {
    type: String,
    require: true,
    default: function () {
      return [];
    },
  },
});
</script>
<style lang="scss" scoped>
.scroll {
  height: 15.5vh;
  overflow: hidden;
  #zoneData span:nth-child(1) {
    color: #000000;
  }
  #zoneData span:nth-child(2) {
    color: #02b66a;
  }
  #handOutData span:nth-child(1) {
    color: #000000;
  }
  #handOutData span:nth-child(2) {
    color: #02b66a;
  }
  #handOutData span:nth-child(3) {
    color: #ff5b5b;
  }
  #manageData span:nth-child(1) {
    color: #000000;
  }
  #manageData span:nth-child(2) {
    color: #ffca41;
  }
  #manageData span:nth-child(3) {
    color: #ffca41;
  }
  #manageData span:nth-child(4) {
    color: #ffca41;
  }
  #manageData span:nth-child(5) {
    color: #ff5b5b;
  }
  #returnXinData span:nth-child(1) {
    color: #000000;
  }
  #returnXinData span:nth-child(2) {
    color: #ffca41;
  }
  .item {
    display: flex;
    justify-content: space-around;
    padding: 3px 0;
    border-bottom: 0.5px solid #ebf4ff;
    .spanClass {
      width: 125px;
      text-align: center;
    }
  }
}
</style>
