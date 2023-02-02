import service from '@/utils/request';
import { PageType } from '../common';
import {
  hasUnReadNoticesResult,
  LoadNoticesResult,
  NoticeType,
  ReadNoticeResult,
} from './types';

/**
 * 获取通知列表
 */
export const loadNotices = async (params: PageType) => {
  return await service.post<LoadNoticesResult>('/notice/isRead', params);
};

/**
 * 阅读通知
 */
export const readNotice = async (params: { id: number }) => {
  return await service.post<ReadNoticeResult>('/notice/readNotice', params);
};

/**
 * 检查有无未读通知
 */
export const hasUnReadNotices = async () => {
  return await service.post<hasUnReadNoticesResult>('/notice/unRead');
};

/**
 * 获取风险通知
 */
export const getRiskNotice = async (params: PageType) => {
  return await service.post<LoadNoticesResult>(
    '/notice/riskAlertNotice',
    params
  );
};
