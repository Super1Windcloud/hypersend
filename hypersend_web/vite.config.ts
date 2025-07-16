import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';
import {getLocalWlanIp} from "./src/utils/script";
import {createHtmlPlugin } from 'vite-plugin-html';
import * as path from "node:path";

let listeningAddress = getLocalWlanIp()  ||  '';
if (listeningAddress === '' || listeningAddress === undefined || listeningAddress === null) {
    console.error("获取本机局域网IP地址失败");
    process.exit(1);
}

const apiBaseUrl = process.env.NODE_ENV ? `http://${listeningAddress}:33333` : '/';

let ZhiPu = process.env.ZhiPu;
let DouBao = process.env.DouBao;
let Kimi = process.env.Kimi;
let XunFei = process.env.XunFei;
let SiliconCloud = process.env.SiliconCloud;
let Siliconflow = process.env.Siliconflow;
let DeepSeek = process.env.DeepSeek;
let ALIBABA_CLOUD_ACCESS_KEY_ID = process.env.ALIBABA_CLOUD_ACCESS_KEY_ID;
let ALIBABA_CLOUD_ACCESS_KEY_SECRET = process.env.ALIBABA_CLOUD_ACCESS_KEY_SECRET;
let ALI_QWEN_QWQ = process.env.ALI_QWEN_QWQ;

export default defineConfig({
    define: {
        'process.env.ZhiPu': JSON.stringify(ZhiPu),
        'process.env.DouBao': JSON.stringify(DouBao),
        'process.env.Kimi': JSON.stringify(Kimi),
        'process.env.XunFei': JSON.stringify(XunFei),
        'process.env.SiliconCloud': JSON.stringify(SiliconCloud),
        'process.env.Siliconflow': JSON.stringify(Siliconflow),
        'process.env.DeepSeek': JSON.stringify(DeepSeek),
        'process.env.ALIBABA_CLOUD_ACCESS_KEY_ID': JSON.stringify(ALIBABA_CLOUD_ACCESS_KEY_ID),
        'process.env.ALIBABA_CLOUD_ACCESS_KEY_SECRET': JSON.stringify(ALIBABA_CLOUD_ACCESS_KEY_SECRET),
        'process.env.ALI_QWEN_QWQ': JSON.stringify(ALI_QWEN_QWQ),
        'process.env.API_BASE_URL': JSON.stringify(apiBaseUrl),
    },

    plugins: [vue(),
        createHtmlPlugin ({
            template: './static/vite.html',
        })],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'), // 配置路径别名
        },
    },
    build :{
        outDir: 'dist-vite',
    },
    server: {
        port: 33334,
        host: '0.0.0.0',
        cors: true,
        proxy: {
            '/api': { //代理API仅适用于dev
                target: `http://${listeningAddress}:33333`,
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, ''),
            }
        },
        hmr: {
            protocol: 'ws',
            host: 'localhost',
            port: 33334,
        },
        open: false,
        watch: {
            usePolling: false,
        },
    },
    base: './',
    publicDir: 'public',
    optimizeDeps: {
        include: [],
    },
    css: {
        preprocessorOptions: {
            // 可以根据需要配置CSS预处理器
        },
    },
    cacheDir: './viteCache',
});