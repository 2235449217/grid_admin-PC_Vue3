import { controlModeList } from '@/api/healthCode';
import { DEFAULT_VALUE } from '@/constant/tableCodeMap';
const map: Map<number, string> = new Map();
export function controlStatus(): Map<number, string> {
  controlModeList({ section_type: 0 }).then(res => {
    res.data.forEach((item: { value: number; label: string }) => {
      map.set(item.value, item.label);
    });
  });
  return map;
}

// export const controlStatus: () => Map<number, string> = () => {
//   const res = controlModeList({ section_type: 0 });
//   if (res) {
//     res.data.forEach((item: { value: number; label: string }) => {
//       map.set(item.value, item.label);
//     });
//     // map1 = map;
//   }
//   return map;
// };

export function changeMode(map: Map<number, string>, code: number): string {
  let name: string | undefined = map.get(code);
  if (!name) {
    name = DEFAULT_VALUE;
  }
  return name;
}
