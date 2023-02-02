import { RouteRecordRaw } from 'custom-vue-router';

const modules: Record<string, () => Promise<typeof import('*.vue')>> =
  import.meta.glob('../view/**/*.vue');

export const asyncRouterHandle = (asyncRouters: Array<RouteRecordRaw>) => {
  asyncRouters.forEach(item => {
    if (item.component) {
      const component = dynamicImport(modules, item.component);
      if (component) {
        item.component = component;
      } else {
        delete item['component'];
      }
    } else {
      delete item['component'];
    }
    if (item.children) {
      asyncRouterHandle(item.children);
    }
  });
};

function dynamicImport(
  dynamicViewsModules: Record<string, () => Promise<typeof import('*.vue')>>,
  component: string | (() => Promise<typeof import('*.vue')>)
) {
  const keys = Object.keys(dynamicViewsModules);
  const matchKeys = keys.filter(key => {
    const k = key.replace('../', '');
    return k === component;
  });
  const matchKey = matchKeys[0];
  return dynamicViewsModules[matchKey];
}
