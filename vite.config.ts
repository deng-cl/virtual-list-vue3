import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import { resolve } from "path"

import dts from 'vite-plugin-dts'
import libCss from 'vite-plugin-libcss';

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        dts({
            rollupTypes: true, // -- 是否将说有的类型声明，合并到一个文件中
            tsconfigPath: "./tsconfig.build.json" // -- 指定对应的 tsconfig 文件，会根据该配置文件中的 include 配置生成对应的类型声明
        }),
        libCss()
    ],

    build: {
        copyPublicDir: false,
        lib: {
            entry: resolve(__dirname, 'lib/main.ts'), // -- 配置打包的库的入口文件
            name: 'virtual-list-vue3',
            fileName: 'index' // -- 配置打包的文件名
        },
        rollupOptions: {
            external: ['vue'],
        }
    }
})
