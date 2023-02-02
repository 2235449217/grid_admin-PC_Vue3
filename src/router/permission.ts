import { UserStoreType, useUserStore } from '@/pinia/modules/user';
import { useRouterStore } from '@/pinia/modules/router';
import getPageTitle from '@/utils/page';
import router from '@/router';
import {
  NavigationGuardNext,
  RouteLocationNormalized,
  RouteRecordRaw,
} from 'vue-router';

let asyncRouterFlag = 0;

const whiteList = ['Login', 'Init'];

const getRouter = async (userStore: UserStoreType) => {
  const routerStore = useRouterStore();
  await routerStore.SetAsyncRouter();
  await userStore.GetUserInfo();
  const asyncRouters = routerStore.asyncRouters;
  asyncRouters.forEach(asyncRouter => {
    router.addRoute(asyncRouter as RouteRecordRaw);
  });
};

async function handleKeepAlive(to: RouteLocationNormalized) {
  if (to.matched.some(item => item.meta.keepAlive)) {
    if (to.matched && to.matched.length > 2) {
      for (let i = 1; i < to.matched.length; i++) {
        const element = to.matched[i - 1];
        if (element.name === 'layout') {
          to.matched.splice(i, 1);
          await handleKeepAlive(to);
        }
        // 如果没有按需加载完成则等待加载
        if (typeof element.components.default === 'function') {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          await element.components.default();
          await handleKeepAlive(to);
        }
      }
    }
  }
}

router.beforeEach(
  async (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
  ) => {
    const userStore = useUserStore();
    to.meta.matched = [...to.matched];
    handleKeepAlive(to);
    const token = userStore.token;
    // 在白名单中的判断情况
    document.title = getPageTitle(to.meta.title);
    if (whiteList.indexOf(to.name as string) > -1) {
      if (token) {
        if (!asyncRouterFlag && whiteList.indexOf(from.name as string) < 0) {
          asyncRouterFlag++;
          await getRouter(userStore);
        }
        next({ name: userStore.userInfo.authority.defaultRouter });
      } else {
        next();
      }
    } else {
      // 不在白名单中并且已经登陆的时候
      if (token) {
        // 添加flag防止多次获取动态路由和栈溢出
        if (!asyncRouterFlag && whiteList.indexOf(from.name as string) < 0) {
          asyncRouterFlag++;
          await getRouter(userStore);
          if (userStore.token) {
            next({ ...to, replace: true });
          } else {
            next({
              name: 'Login',
              query: { redirect: to.path },
            });
          }
        } else {
          if (to.matched.length) {
            next();
          } else {
            next({ path: '/layout/404' });
          }
        }
      }
      // 不在白名单中并且未登陆的时候
      if (!token) {
        next({
          name: 'Login',
          query: {
            redirect: document.location.hash,
          },
        });
      }
    }
  }
);
