import { controlModeList } from '@/api/healthCode';

export function dipatchStatus(status: string) {
  if (!status) return '-';
  if (status == '1') {
    return '未派发';
  } else if (status == '2') {
    return '已派发';
  } else {
    return '-';
  }
}
// let name = 'name';
// export function controlStatus(value: number, section_type: number): string {
//   controlModeList({ section_type: section_type }).then(res => {
//     for (const item of res.data) {
//       console.log(value, 'dfdfdfdfd', item.value);
//       if (item.value === value) {
//         name = item.label;
//         break;
//       } else {
//         name = '-';
//       }
//     }
//   });
//   console.log(name);
//   return name;
// }

// export const controlStatus = async (
//   value: number,
//   section_type: number
// ): string => {
//   const res = await controlModeList({ section_type: section_type });
//   let name = '';
//   return res.data.forEach((item: { value: number; label: string }) => {
//     if (item.value === value) {
//       name = item.label;
//     } else {
//       name = '-';
//     }
//   });
//   return name;
// };

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
