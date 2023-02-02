/*
 * gin-vue-admin web框架组
 *
 * */
// 加载网站配置文件夹
import { App } from 'vue';
import { register } from './global';

export default {
  install: (app: App) => {
    register(app);
    console.log(`
       欢迎使用 GoSword
       当前版本:v1.0
    `);
  },
};
