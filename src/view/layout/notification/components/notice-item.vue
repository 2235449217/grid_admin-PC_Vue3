<template>
  <div :class="['notice-item', { viewed: data.is_read_status > 1 }]">
    <div class="notice-item-icon">
      <template v-if="data.notice_type === NoticeTypeEnum['派发通知']">
        <el-icon class="icon" :size="24"><Promotion /></el-icon>
      </template>
      <template v-if="data.notice_type === NoticeTypeEnum['转派通知']">
        <el-icon class="icon" :size="24"><Promotion /></el-icon>
      </template>
      <template v-if="data.notice_type === NoticeTypeEnum['预警通知']">
        <el-icon class="icon warning" :size="24"><WarningFilled /></el-icon>
      </template>
    </div>
    <div class="notice-item-main">
      <div class="title">
        <span class="title-text">{{ NoticeTypeEnum[data.notice_type] }}</span>
        <span class="date-text">{{
          ` · ${stampFormat(data.created_at)}`
        }}</span>
      </div>
      <div class="content">
        <span>{{ data.notice_back }}</span>
      </div>
      <div class="bottom-button-box">
        <el-button type="primary" @click="viewDetails">查看</el-button>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
export default {
  name: 'NoticeItem',
};
</script>
<script setup lang="ts">
import { toRefs } from 'vue';
import { NoticeTypeEnum, NoticeType } from '@/api/notice';
import { stampFormat } from '@/utils/dateFormat';
import handleNotice from '../scripts/handleNotice';

const props = defineProps({
  data: {
    type: Object as () => NoticeType,
    required: true,
  },
});
const { data } = toRefs(props);

const emit = defineEmits<{
  (e: 'view'): void;
}>();

/**
 * 查看
 */
const viewDetails = async () => {
  handleNotice(data.value.id, data.value.section_type);
  data.value.is_read_status = 2;
  emit('view');
};
</script>
<style scoped lang="scss">
.notice-item {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 15px 20px 15px 15px;
  /* &:nth-child(2n-1) {
    background-color: #f8f8f8;
  } */
  &:hover {
    background-color: #f8f8f8;
  }
  &.viewed > * {
    opacity: 0.4;
  }
  .notice-item-icon {
    color: #4d70ff;
    margin-right: 5px;
    .warning {
      color: #ff4d6b;
    }
  }
  .notice-item-main {
    display: flex;
    flex-direction: column;
    flex: 1;
    margin-top: 2px;
    .title {
      display: flex;
      flex-direction: row;
      align-items: center;
      margin-bottom: 5px;
      .title-text {
        font-size: 16px;
        font-weight: bold;
        color: rgba($color: #000, $alpha: 0.8);
        margin-right: 5px;
      }
      .date-text {
        font-size: 13px;
        color: rgba($color: #000, $alpha: 0.4);
      }
    }
    .content {
      font-size: 14px;
      color: rgba($color: #000, $alpha: 0.6);
    }
    .bottom-button-box {
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      margin-top: 20px;
      .el-button {
        margin-left: 10px;
      }
    }
  }
}
</style>
