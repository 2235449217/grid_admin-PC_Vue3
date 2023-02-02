import { createApp } from 'vue';
import 'element-plus/dist/index.css';
import './style/element_visiable.scss';
import './style/icon.scss';
import ElementPlus from 'element-plus';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
// 引入封装的router
import router from '@/router/index';
import run from '@/core/gin-vue-admin';
import auth from '@/directive/auth';
import { store } from '@/pinia';
import '@/router/permission';
//引入vue3SeamlessScroll组件
import vue3SeamlessScroll from 'vue3-seamless-scroll';

import App from '@/App.vue';
const app = createApp(App);

app
  .use(run)
  .use(store)
  .use(auth)
  .use(router)
  .use(ElementPlus, { locale: zhCn })
  .use(vue3SeamlessScroll)
  .mount('#app');

export default app;
