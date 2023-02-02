/**
 *时间戳格式转日期格式化
 */
export function stampFormat(timestamp: number) {
  if (!timestamp) return '-';
  const date = new Date(timestamp * 1000);
  const Y = date.getFullYear();
  const M = ('0' + (date.getMonth() + 1)).slice(-2);
  const D = ('0' + date.getDate()).slice(-2);
  const h = ('0' + date.getHours()).slice(-2);
  const m = ('0' + date.getMinutes()).slice(-2);
  const s = ('0' + date.getSeconds()).slice(-2);
  return Y + '-' + M + '-' + D + ' ' + h + ':' + m + ':' + s;
}

/**
 * UTC时间格式化
 */
export function UTCFormat(time: string) {
  if (!time || time === '0001-01-01T00:00:00Z') return '-';
  const date = new Date(time);
  const y = date.getFullYear();
  const m = '0' + (date.getMonth() + 1);
  const d = '0' + date.getDate();
  const h = (date.getHours() + '').padStart(2, '0');
  const mm = (date.getMinutes() + '').padStart(2, '0');
  const ss = (date.getSeconds() + '').padStart(2, '0');
  return `${y}-${m.substring(m.length - 2, m.length)}-${d.substring(
    d.length - 2,
    d.length
  )} ${h}:${mm}:${ss}`;
}
