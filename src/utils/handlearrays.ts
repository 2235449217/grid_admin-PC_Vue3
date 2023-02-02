interface List {
  code_color: number | string;
  name: string;
  id_card: string;
  phone: string;
  scene_name: string;
  is_nucleic_acid: string | number;
  is_back_personnel: string | number;
  is_risk_area: string | number;
  origin_place: string;
  destination_place: string;
}
export const HandleArrays = (data: List[], arr: string[]) => {
  for (const item of data) {
    for (let i = 0; i < arr.length; i++) {
      const name = arr[i];
      if (item[name] === 1) {
        item[name] = '是';
      } else if (item[name] === 2) {
        item[name] = '否';
      } else {
        item[name] = '未知';
      }
    }
    if ('code_color' in item === false) continue;
    switch (item['code_color']) {
      case 1:
        item['code_color'] = '绿码';
        break;
      case 2:
        item['code_color'] = '黄码';
        break;
      case 3:
        item['code_color'] = '红码';
        break;
      case 4:
        item['code_color'] = '灰码';
        break;
    }
  }
  return data;
};
