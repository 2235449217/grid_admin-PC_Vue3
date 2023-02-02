import Banner from 'vite-plugin-banner';
import { ConfigEnv, loadEnv } from 'vite';
import legacyPlugin from '@vitejs/plugin-legacy';
import vue from '@vitejs/plugin-vue';
import { viteLogo } from './src/core/config';
import * as path from 'path';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import Icons from 'unplugin-icons/vite';
import { FileSystemIconLoader } from 'unplugin-icons/loaders';
import IconsResolver from 'unplugin-icons/resolver';
import Components from 'unplugin-vue-components/vite';
import { createHtmlPlugin } from 'vite-plugin-html';

export default ({ mode }: ConfigEnv) => {
  const env = loadEnv(mode, process.cwd());

  const NODE_ENV = process.env.NODE_ENV || 'development';
  const envFiles = [`.env.${NODE_ENV}`];
  for (const file of envFiles) {
    const envConfig = dotenv.parse(fs.readFileSync(file));
    for (const k in envConfig) {
      process.env[k] = envConfig[k];
    }
  }

  viteLogo();

  const timestamp = Date.parse(new Date().toString());

  const rollupOptions = {
    output: {
      entryFileNames: `gva/gin-vue-admin-[name].${timestamp}.js`,
      chunkFileNames: `js/gin-vue-admin-[name].${timestamp}.js`,
      assetFileNames: `assets/gin-vue-admin-[name].${timestamp}.[ext]`,
    },
  };

  const optimizeDeps = {};

  const alias = {
    '@': path.resolve(__dirname, './src'),
    '#': path.resolve(__dirname, './stypes'),
    vue$: 'vue/dist/vue.runtime.esm-bundler.js',
  };

  const esbuild = {};

  return {
    base: './', // index.html文件所在位置
    root: './', // js导入的资源路径，src
    resolve: {
      alias,
    },
    define: {
      'process.env': {},
    },
    server: {
      // 如果使用docker-compose开发模式，设置为false
      open: true,
      port: process.env.VITE_CLI_PORT,
      proxy: {
        // 把key的路径代理到target位置
        // detail: https://cli.vuejs.org/config/#devserver-proxy
        [process.env.VITE_BASE_API as string]: {
          // 需要代理的路径   例如 '/api'
          target: `${process.env.VITE_BASE_PATH}:${process.env.VITE_SERVER_PORT}/`, // 代理到 目标路径
          changeOrigin: true,
          rewrite: (path: string) =>
            path.replace(new RegExp('^' + process.env.VITE_BASE_API), ''),
        },
      },
    },
    build: {
      target: 'es2020',
      minify: 'terser', // 是否进行压缩,boolean | 'terser' | 'esbuild',默认使用terser
      manifest: false, // 是否产出maifest.json
      sourcemap: false, // 是否产出soucemap.json
      outDir: 'dist', // 产出目录
      rollupOptions,
    },
    esbuild,
    optimizeDeps,
    plugins: [
      legacyPlugin({
        targets: [
          'Android > 39',
          'Chrome >= 60',
          'Safari >= 10.1',
          'iOS >= 10.3',
          'Firefox >= 54',
          'Edge >= 15',
        ],
      }),
      vue(),
      createHtmlPlugin({
        inject: {
          data: {
            ...env,
            injectScript: `<script type="module" src="./static.env.config.js"></script>`,
          },
        },
      }),
      Icons({
        compiler: 'vue3',
        customCollections: {
          icon: FileSystemIconLoader('./src/assets/icons'),
        },
        defaultClass: 'custom-icon',
      }),
      Components({
        dts: true,
        resolvers: [
          IconsResolver({
            customCollections: ['icon'],
          }),
        ],
      }),
      [Banner(`\n Build based on gin-vue-admin \n Time : ${timestamp}`)],
    ],
    css: {
      preprocessorOptions: {
        less: {
          // 支持内联 JavaScript
          javascriptEnabled: true,
        },
      },
    },
  };
};
