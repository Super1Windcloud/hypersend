import {defineConfig} from '@farmfe/core';
import Vue from '@vitejs/plugin-vue'
import {getLocalWlanIp} from "./src/utils/script";
import * as path from "node:path";


let listeningAddress = getLocalWlanIp() ?? '';
if (listeningAddress === '' || listeningAddress === undefined || listeningAddress === null) {
    console.error("获取本机局域网IP地址失败");
    process.exit(1);
}
console.log("本机局域网IP地址: " + listeningAddress);
export default defineConfig({
    vitePlugins: [Vue()],
    root: path.join(process.cwd()),
    compilation: {
        resolve: {
            alias: {
                "@": path.join(process.cwd(), "src"),
            },
        },
        define: {
            MY_VAR: 123,
        },
        progress: true,
        input: {
            index: './static/farm.html',
        },
        output: {
            path: 'farmBuild',
        }
    },
    clearScreen: true,
    publicDir: "public",

    server: {
        port: 3333,
        open: false,
        host: '0.0.0.0',
        hmr: {
            port: 3333 ,
            host: 'localhost',
        },
        spa: true,
        proxy: {
            '/api': {
                target: `http://${listeningAddress}:33333`,
                changeOrigin: true,
                pathRewrite: (path: any) => path.replace(/^\/api/, ''),
            },
        },
    },
});
