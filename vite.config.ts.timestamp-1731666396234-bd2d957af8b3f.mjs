// vite.config.ts
import { defineConfig } from "file:///C:/Users/KXH/Desktop/share/vue-virtual-list-dir/virtual-list-vue3/node_modules/vite/dist/node/index.js";
import vue from "file:///C:/Users/KXH/Desktop/share/vue-virtual-list-dir/virtual-list-vue3/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import { resolve } from "path";
import dts from "file:///C:/Users/KXH/Desktop/share/vue-virtual-list-dir/virtual-list-vue3/node_modules/vite-plugin-dts/dist/index.mjs";
import libCss from "file:///C:/Users/KXH/Desktop/share/vue-virtual-list-dir/virtual-list-vue3/node_modules/vite-plugin-libcss/index.js";
var __vite_injected_original_dirname = "C:\\Users\\KXH\\Desktop\\share\\vue-virtual-list-dir\\virtual-list-vue3";
var vite_config_default = defineConfig({
  plugins: [
    vue(),
    dts({
      rollupTypes: true,
      // -- 是否将说有的类型声明，合并到一个文件中
      tsconfigPath: "./tsconfig.build.json"
      // -- 指定对应的 tsconfig 文件，会根据该配置文件中的 include 配置生成对应的类型声明
    }),
    libCss()
  ],
  build: {
    copyPublicDir: false,
    lib: {
      entry: resolve(__vite_injected_original_dirname, "lib/main.ts"),
      // -- 配置打包的库的入口文件
      name: "virtual-list-vue3",
      fileName: "index"
      // -- 配置打包的文件名
    },
    rollupOptions: {
      external: ["vue"]
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxLWEhcXFxcRGVza3RvcFxcXFxzaGFyZVxcXFx2dWUtdmlydHVhbC1saXN0LWRpclxcXFx2aXJ0dWFsLWxpc3QtdnVlM1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcS1hIXFxcXERlc2t0b3BcXFxcc2hhcmVcXFxcdnVlLXZpcnR1YWwtbGlzdC1kaXJcXFxcdmlydHVhbC1saXN0LXZ1ZTNcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL0tYSC9EZXNrdG9wL3NoYXJlL3Z1ZS12aXJ0dWFsLWxpc3QtZGlyL3ZpcnR1YWwtbGlzdC12dWUzL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCB2dWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJ1xuXG5pbXBvcnQgeyByZXNvbHZlIH0gZnJvbSBcInBhdGhcIlxuXG5pbXBvcnQgZHRzIGZyb20gJ3ZpdGUtcGx1Z2luLWR0cydcbmltcG9ydCBsaWJDc3MgZnJvbSAndml0ZS1wbHVnaW4tbGliY3NzJztcblxuLy8gaHR0cHM6Ly92aXRlLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICAgIHBsdWdpbnM6IFtcbiAgICAgICAgdnVlKCksXG4gICAgICAgIGR0cyh7XG4gICAgICAgICAgICByb2xsdXBUeXBlczogdHJ1ZSwgLy8gLS0gXHU2NjJGXHU1NDI2XHU1QzA2XHU4QkY0XHU2NzA5XHU3Njg0XHU3QzdCXHU1NzhCXHU1OEYwXHU2NjBFXHVGRjBDXHU1NDA4XHU1RTc2XHU1MjMwXHU0RTAwXHU0RTJBXHU2NTg3XHU0RUY2XHU0RTJEXG4gICAgICAgICAgICB0c2NvbmZpZ1BhdGg6IFwiLi90c2NvbmZpZy5idWlsZC5qc29uXCIgLy8gLS0gXHU2MzA3XHU1QjlBXHU1QkY5XHU1RTk0XHU3Njg0IHRzY29uZmlnIFx1NjU4N1x1NEVGNlx1RkYwQ1x1NEYxQVx1NjgzOVx1NjM2RVx1OEJFNVx1OTE0RFx1N0Y2RVx1NjU4N1x1NEVGNlx1NEUyRFx1NzY4NCBpbmNsdWRlIFx1OTE0RFx1N0Y2RVx1NzUxRlx1NjIxMFx1NUJGOVx1NUU5NFx1NzY4NFx1N0M3Qlx1NTc4Qlx1NThGMFx1NjYwRVxuICAgICAgICB9KSxcbiAgICAgICAgbGliQ3NzKClcbiAgICBdLFxuXG4gICAgYnVpbGQ6IHtcbiAgICAgICAgY29weVB1YmxpY0RpcjogZmFsc2UsXG4gICAgICAgIGxpYjoge1xuICAgICAgICAgICAgZW50cnk6IHJlc29sdmUoX19kaXJuYW1lLCAnbGliL21haW4udHMnKSwgLy8gLS0gXHU5MTREXHU3RjZFXHU2MjUzXHU1MzA1XHU3Njg0XHU1RTkzXHU3Njg0XHU1MTY1XHU1M0UzXHU2NTg3XHU0RUY2XG4gICAgICAgICAgICBuYW1lOiAndmlydHVhbC1saXN0LXZ1ZTMnLFxuICAgICAgICAgICAgZmlsZU5hbWU6ICdpbmRleCcgLy8gLS0gXHU5MTREXHU3RjZFXHU2MjUzXHU1MzA1XHU3Njg0XHU2NTg3XHU0RUY2XHU1NDBEXG4gICAgICAgIH0sXG4gICAgICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgICAgICAgIGV4dGVybmFsOiBbJ3Z1ZSddLFxuICAgICAgICB9XG4gICAgfVxufSlcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBbVksU0FBUyxvQkFBb0I7QUFDaGEsT0FBTyxTQUFTO0FBRWhCLFNBQVMsZUFBZTtBQUV4QixPQUFPLFNBQVM7QUFDaEIsT0FBTyxZQUFZO0FBTm5CLElBQU0sbUNBQW1DO0FBU3pDLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQ3hCLFNBQVM7QUFBQSxJQUNMLElBQUk7QUFBQSxJQUNKLElBQUk7QUFBQSxNQUNBLGFBQWE7QUFBQTtBQUFBLE1BQ2IsY0FBYztBQUFBO0FBQUEsSUFDbEIsQ0FBQztBQUFBLElBQ0QsT0FBTztBQUFBLEVBQ1g7QUFBQSxFQUVBLE9BQU87QUFBQSxJQUNILGVBQWU7QUFBQSxJQUNmLEtBQUs7QUFBQSxNQUNELE9BQU8sUUFBUSxrQ0FBVyxhQUFhO0FBQUE7QUFBQSxNQUN2QyxNQUFNO0FBQUEsTUFDTixVQUFVO0FBQUE7QUFBQSxJQUNkO0FBQUEsSUFDQSxlQUFlO0FBQUEsTUFDWCxVQUFVLENBQUMsS0FBSztBQUFBLElBQ3BCO0FBQUEsRUFDSjtBQUNKLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
