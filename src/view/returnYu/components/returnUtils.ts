/**
 * 返乡方式
 */
export function returnMethod(method: string) {
  if (!method) return '-';
  if (method == '1') {
    return '驾车';
  } else if (method == '2') {
    return '火车';
  } else if (method == '3') {
    return '飞机';
  } else {
    return '其他';
  }
}

/**
 *派发状态
 */
export function dipatchStatus(status: string) {
  if (!status) return '-';
  if (status == '1') {
    return '未派发';
  } else {
    return '已派发';
  }
}

/**
 * 转派状态
 */
export function transferStatus(status: string) {
  if (!status) return '-';
  if (status == '1') {
    return '未转派';
  } else if (status == '2') {
    return '转派中';
  } else if (status == '3') {
    return '转派成功';
  } else {
    return '转派拒绝';
  }
}
