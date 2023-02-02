import { formatTimeToStr } from '@/utils/date';

export const formatBoolean = (bool: null) => {
  if (bool !== null) {
    return bool ? '是' : '否';
  } else {
    return '';
  }
};
export const formatDate = (time: string | number | Date | null) => {
  if (time !== null && time !== '') {
    const date = new Date(time);
    return formatTimeToStr(date, 'yyyy-MM-dd hh:mm:ss');
  } else {
    return '';
  }
};

export const filterDict = (
  value: string,
  options: Array<{ label: string; value: string }>
) => {
  const rowLabel =
    options &&
    options.filter((item: { value: string }) => item.value === value);
  return rowLabel && rowLabel[0] && rowLabel[0].label;
};
