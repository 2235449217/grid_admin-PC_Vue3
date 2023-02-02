export enum NoticeTypeEnum {
  '派发通知' = 1,
  '转派通知',
  '预警通知',
}

export type NoticeType = {
  id: number;
  notice_back: string;
  notice_type: NoticeTypeEnum;
  is_read_status: number;
  created_at: number;
  section_type: number;
};

export type LoadNoticesResult = {
  Notice: NoticeType[];
  notice_count: number;
};

export type ReadNoticeResult = {
  flag_notice: boolean;
};

export type hasUnReadNoticesResult = {
  flag_notice: boolean;
};
