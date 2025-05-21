import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import VueSetupExtend from 'vite-plugin-vue-setup-extend';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';

export default defineConfig({
  // 关键：设置项目基础路径，GitHub Pages 仓库名作为路径前缀
  base: '/xinandasai/',
  plugins: [
    vue(),
    VueSetupExtend(),
    AutoImport({
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      resolvers: [ElementPlusResolver()]
    })
  ],
  optimizeDeps: {
    include: ['schart.js']  // 如果是你的依赖，请确认名称正确
  },
  resolve: {
    alias: {
      '@': '/src',
      '~': '/src/assets'
    }
  },
  define: {
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'true'
  },
  // 如果你想开启构建后文件名带hash，默认就带hash，这里不需要特别配置
  build: {
    // 确保资源路径正确
    assetsDir: 'assets',
    // 生成 sourcemap
    sourcemap: true,
    // 分块策略
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['vue', 'vue-router', 'pinia'],
          'element-plus': ['element-plus']
        }
      }
    }
  }
});
