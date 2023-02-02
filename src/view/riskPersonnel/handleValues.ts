export function transferStatus(status: string) {
  if (!status) return '-';
  if (status == '1') {
    return '未转派';
  } else if (status == '2') {
    return '转派中';
  } else if (status == '3') {
    return '转派成功';
  } else if (status == '4') {
    return '转派拒绝';
  } else {
    return '-';
  }
}
export function dispatchStatus(status: number) {
  if (!status) return '-';
  if (status === 1) {
    return '未派发';
  } else if (status === 2) {
    return '已派发';
  } else {
    return '-';
  }
}

export function codeStatus(status: number) {
  if (!status) return '-';
  if (status === 1) {
    return '绿码';
  } else if (status === 2) {
    return '黄码';
  } else if (status === 3) {
    return '红码';
  } else if (status === 4) {
    return '灰码';
  } else {
    return '-';
  }
}

export function isRiskPersoneel(status: number) {
  if (!status) return '-';
  if (status === 1) {
    return '是';
  } else if (status === 2) {
    return '否';
  } else {
    return '-';
  }
}
