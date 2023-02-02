# 网格化管理系统 管理端

## 项目结构
``` lua
grid_admin
 ├── .dockerignore              
 ├── .env.development              
 ├── .env.production              
 ├── .eslintignore              
 ├── .eslintrc.js              
 ├── .gitignore              
 ├── .prettierignore              
 ├── .prettierrc.js              
 ├── babel.config.js
 ├── Dockerfile
 ├── favicon.ico
 ├── index.html                 -- 主页面
 ├── limit.js                   -- 助手代码
 ├── openDocument.js            -- 广告
 ├── package.json               -- 包管理器代码
 ├── README.md                  -- readme 文档
 ├── tsconfig.json              -- ts 配置文件
 ├── vite.config.ts             -- vite 配置文件
 ├── src                        -- 源代码
 │   ├── api                    -- api 组
 │   ├── App.vue                -- 主页面
 │   ├── main.ts                -- 主文件
 │   ├── assets                 -- 静态资源
 │   ├── components             -- 全局组件
 │   ├── core                   -- gva 组件包
 │   │   ├── config.ts          -- gva网站配置文件
 │   │   ├── gin-vue-admin.ts   -- 注册欢迎文件
 │   │   └── global.ts          -- 统一导入文件
 │   ├── directive              -- v-auth 注册文件
 │   ├── pinia                  -- pinia 状态管理器，取代vuex
 │   │   ├── index.ts           -- 入口文件
 │   │   └── modules            -- modules
 │   │       ├── router.ts
 │   │       └── user.ts
 │   ├── router                 -- 路由声明文件
 │   │   ├── permission.ts      -- 路由中间件
 │   │   └── index.ts
 │   ├── style                  -- 全局样式
 │   │   ├── base.scss
 │   │   ├── basics.scss
 │   │   ├── element_visiable.scss  -- 此处可以全局覆盖 element-plus 样式
 │   │   ├── iconfont.css           -- 顶部几个icon的样式文件
 │   │   ├── main.scss
 │   │   ├── mobile.scss
 │   │   └── newLogin.scss
 │   ├── utils                  -- 方法包库
 │   │   ├── asyncRouter.ts     -- 动态路由相关
 │   │   ├── btnAuth.ts         -- 动态权限按钮相关
 │   │   ├── bus.ts             -- 全局mitt声明文件
 │   │   ├── date.ts            -- 日期相关
 │   │   ├── downloadImg.ts     -- 下载图片方法
 │   │   ├── format.ts          -- 格式整理相关
 │   │   ├── image.ts           -- 图片相关方法
 │   │   ├── page.ts            -- 设置页面标题
 │   │   ├── request.ts         -- 请求
 │   │   └── stringFun.ts       -- 字符串文件
 |   ├── view -- 主要view代码
 |   |   ├── about -- 关于我们
 |   |   ├── dashboard -- 面板
 |   |   ├── error -- 错误
 |   |   ├── example --上传案例
 |   |   ├── iconList -- icon列表
 |   |   ├── init -- 初始化数据  
 |   |   |   ├── index -- 新版本
 |   |   |   ├── init -- 旧版本
 |   |   ├── layout  --  layout约束页面 
 |   |   |   ├── aside 
 |   |   |   ├── bottomInfo     -- bottomInfo
 |   |   |   ├── screenfull     -- 全屏设置
 |   |   |   ├── setting        -- 系统设置
 |   |   |   └── index.vue      -- base 约束
 |   |   ├── login              --登录 
 |   |   ├── person             --个人中心 
 |   |   ├── superAdmin         -- 超级管理员操作
 |   |   ├── system             -- 系统检测页面
 |   |   ├── systemTools        -- 系统配置相关页面
 |   |   └── routerHolder.vue   -- page 入口页面 
 ├── types                      -- ts 类型
 └── yarn.lock

```