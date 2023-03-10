import { App } from 'vue';
import { emitter } from '@/utils/bus';

import config from './config';

// 统一导入el-icon图标
import * as ElIconModules from '@element-plus/icons-vue';

// 导入转换图标名称的函数
export const closeThisPage = () => {
  emitter.emit('closeThisPage');
};

export const register = (app: App) => {
  // 统一注册el-icon图标
  for (const iconName in ElIconModules) {
    app.component(iconName, ElIconModules[iconName]);
  }
  app.config.globalProperties.$GIN_VUE_ADMIN = config;
};
