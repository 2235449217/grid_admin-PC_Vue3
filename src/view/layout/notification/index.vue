<template>
  <div class="notification-component">
    <el-dropdown
      trigger="click"
      max-height="75vh"
      @visible-change="handleDropdownVisibleChange">
      <el-icon :class="['bell-icon', { 'has-unread': hasUnread }]" :size="16"
        ><Bell
      /></el-icon>
      <template #dropdown>
        <div ref="dropdownRef" class="notification-dropdown">
          <div class="title-box">
            <span class="title-text">通知</span>
            <el-icon
              class="refresh-btn"
              :size="18"
              title="刷新"
              @click="handleRefresh"
              ><Refresh :class="['refresh-icon', { refreshing: isRefreshing }]"
            /></el-icon>
          </div>
          <div v-show="isRefreshing" class="refresh-mask">
            <span>刷新中...</span>
          </div>
          <div class="content-box">
            <NoticeItem
              v-for="notice in noticesData"
              :key="notice.id"
              :data="notice"
              @view="view" />
            <div class="loading-tip">
              <span>{{
                isRefreshing
                  ? ''
                  : isLoading
                  ? '加载中...'
                  : !page.next
                  ? '没有更多了'
                  : ''
              }}</span>
            </div>
          </div>
        </div>
      </template>
    </el-dropdown>
  </div>
</template>
<script lang="ts">
export default {
  name: 'Notification',
};
</script>
<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref } from 'vue';
import NoticeItem from './components/notice-item.vue';
import {
  hasUnReadNotices,
  loadNotices,
  NoticeType,
  getRiskNotice,
} from '@/api/notice';
import { ElMessage } from 'element-plus';
import handleNotice from './scripts/handleNotice';

const dropdownRef = ref<HTMLElement>();

const noticesData = ref<NoticeType[]>([]);

// 分页数据
const page = ref({
  current: 1,
  size: 6,
  next: true,
});

// 加载
let isLoading = ref(false);
const loadMore = async (init?: boolean) => {
  if (isLoading.value) return;
  if (init) {
    page.value = {
      current: 1,
      size: 10,
      next: true,
    };
  }
  if (!page.value.next) return;
  isLoading.value = true;
  const response = await loadNotices({
    page: page.value.current,
    pageSize: page.value.size,
  });
  noticesData.value = init
    ? response.data.Notice
    : [...noticesData.value, ...response.data.Notice];
  page.value.current++;
  page.value.next = noticesData.value.length < response.data.notice_count;
  isLoading.value = false;
  if (init) dropdownRef.value && dropdownRef.value.scrollIntoView();
};

// 刷新
let isRefreshing = ref(false);
const handleRefresh = async () => {
  if (isRefreshing.value) return;
  isRefreshing.value = true;
  await loadMore(true);
  isRefreshing.value = false;
};

// 下拉框可视性变化
const handleDropdownVisibleChange = (visible: boolean) => {
  if (visible) {
    // hasUnread.value = false;
  } else {
    noticesData.value = [];
    page.value = {
      current: 1,
      size: 10,
      next: true,
    };
  }
};

// 触底监听器
let observer: IntersectionObserver | null = null;

// 初始化触底监听器
onMounted(() => {
  observer = new IntersectionObserver(entries => {
    if (entries[0].intersectionRatio <= 0) return;
    loadMore();
  });
  observer.observe(document.querySelector('.loading-tip') as Element);
});

// 取消触底监听
onUnmounted(() => {
  observer?.disconnect();
  observer = null;
});

/************************************************
 * 轮询
 ************************************************/

let timer: number | null = null;

const hasUnread = ref(false);

onMounted(() => {
  timer = window.setInterval(async () => {
    const response = await hasUnReadNotices();
    hasUnread.value = response.data.flag_notice;
  }, 5000);
});

onUnmounted(() => {
  clearInterval(timer as number);
  timer = null;
});

/************************************************
 * 查看通知
 ************************************************/

const view = async () => {
  const response = await hasUnReadNotices();
  hasUnread.value = response.data.flag_notice;
};

/************************************************
 * 风险信息
 ************************************************/

let noticePage = 0;

const checkRiskNotice = async () => {
  noticePage++;
  const response = await getRiskNotice({
    page: noticePage,
    pageSize: 1,
  });
  const notice = response.data.Notice.pop();
  if (notice) {
    const message = ElMessage({
      dangerouslyUseHTMLString: true,
      message: `
        <div class="risk-message" title="${notice.notice_back}">
          <span class="text">${notice.notice_back}</span>
        </div>
      `,
      type: 'warning',
      duration: 0,
      showClose: true,
      onClose: async () => {
        await checkRiskNotice();
      },
    });
    nextTick(() => {
      document.querySelector('.risk-message')?.addEventListener('click', () => {
        handleNotice(notice.id, notice.section_type);
        message.close();
      });
    });
  }
};

onMounted(async () => {
  await checkRiskNotice();
});
</script>
<style lang="scss">
.el-dropdown {
  overflow: unset;
}
.notification-component {
  cursor: pointer;
  margin-right: 24px;
  .bell-icon.has-unread::after {
    content: '';
    position: absolute;
    display: block;
    width: 8px;
    height: 8px;
    border: solid 2px #fff;
    border-radius: 8px;
    top: -2px;
    right: -4px;
    background-color: red;
  }
}
.notification-dropdown {
  width: 360px;
  .refresh-mask {
    z-index: 13;
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background-color: rgba($color: #fff, $alpha: 0.7);
  }
  .title-box {
    z-index: 12;
    position: sticky;
    display: flex;
    justify-content: space-between;
    align-items: center;
    top: 0;
    height: 54px;
    padding: 0 20px;
    color: rgba(0, 0, 0, 0.6);
    background-color: #fff;
    .title-text {
      font-size: 20px;
      font-weight: bold;
      color: rgba(0, 0, 0, 0.8);
    }
    .refresh-btn {
      padding: 5px;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.1s;
      &:hover {
        background-color: #f5f5f5;
      }
      .refresh-icon {
        &.refreshing {
          animation: spin 0.5s linear infinite;
        }
      }
    }
  }
  .loading-tip {
    padding: 20px 0;
    text-align: center;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.6);
  }
}

.risk-message {
  position: relative;
  max-width: 240px;
  cursor: pointer;
  &:hover {
    &::after {
      content: ' 查看>';
      position: absolute;
      display: block;
      top: 50%;
      right: 0;
      padding-left: 5px;
      transform: translate(100%, -50%);
    }
  }
  .text {
    display: block;
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

@keyframes spin {
  0% {
    -webkit-transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(-360deg);
  }
}
</style>
