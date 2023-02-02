import { readNotice } from '@/api/notice';
import router from '@/router';

export default async (id: number, type: number) => {
  await readNotice({
    id,
  });
  switch (type) {
    case 1:
      // 健康码管理
      router.push('/layout/healthCode');
      break;
    case 2:
      // 场所码管理
      router.push('/layout/venueCode');
      break;
    case 3:
      // 入豫人员管理
      router.push('/layout/returnYu');
      break;
    case 4:
      // 重点场所管理
      router.push('/layout/keySites');
      break;
    case 5:
      // 风险人员管理
      router.push('/layout/riskPersonnel');
      break;
    case 6:
      // 风险预警
      router.push('/layout/riskWarning');
      break;
    case 7:
      // 区域核查
      router.push('/layout/regionCheck');
      break;
    case 8:
      // 重点人员管理
      router.push('/layout/keyPersonnel');
      break;
    default:
      break;
  }
};
