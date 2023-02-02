import service from '@/utils/request';

export const barStatistics = () => {
  return service({
    url: '/homePage/barStatistics',
    method: 'post',
  });
};

export const getBackPersonal = () => {
  return service({
    url: '/homePage/backPersonal',
    method: 'post',
  });
};

export const getControlMode = () => {
  return service({
    url: '/homePage/controlMode',
    method: 'post',
  });
};

export const getScanCodeNumber = () => {
  return service({
    url: '/homePage/scanCodeNumber',
    method: 'post',
  });
};

export const getSceneCodeDispatch = () => {
  return service({
    url: '/homePage/sceneCodeDispatch',
    method: 'post',
  });
};
