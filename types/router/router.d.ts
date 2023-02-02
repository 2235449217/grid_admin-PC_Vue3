declare module 'custom-vue-router' {
  interface RouteRecordRaw {
    meta?: {
      title?: string;
      btns?: Array<string>;
      hidden?: boolean;
      keepAlive?: boolean;
    };
    path: string;
    name?: string;
    btns?: Array<string>;
    hidden?: boolean;
    redirect?: string;
    component?: string | (() => Promise<typeof import('*.vue')>);
    children?: RouteRecordRaw[];
  }
}
