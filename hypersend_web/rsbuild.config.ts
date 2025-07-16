import {defineConfig} from '@rsbuild/core';
import {pluginVue} from '@rsbuild/plugin-vue';
import {getLocalWlanIp} from "./src/utils/script";




let   listeningAddress =   getLocalWlanIp() ?? '';
if (listeningAddress === '' || listeningAddress === undefined || listeningAddress === null ) {
     console.error("获取本机局域网IP地址失败");
     process.exit(1);
}
let ZhiPu = process.env.ZhiPu
let DouBao = process.env.DouBao
let Kimi = process.env.Kimi
let XunFei = process.env.XunFei
let SiliconCloud = process.env.SiliconCloud
let Siliconflow = process.env.Siliconflow
let DeepSeek = process.env.DeepSeek
let ALIBABA_CLOUD_ACCESS_KEY_ID = process.env.ALIBABA_CLOUD_ACCESS_KEY_ID
let ALIBABA_CLOUD_ACCESS_KEY_SECRET = process.env.ALIBABA_CLOUD_ACCESS_KEY_SECRET
let ALI_QWEN_QWQ = process.env.ALI_QWEN_QWEN_QWQ
export default defineConfig({
    source: {
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
        }
    },
    performance: {
        buildCache: true,
        profile: false
    },
    plugins: [pluginVue() ],
    server: {
        port: 33334,
        host: '0.0.0.0',
        cors: true ,
        proxy: {
            '/api': {
                target: `http://${listeningAddress}:33333`, // 后端服务的地址
                changeOrigin: true,
                pathRewrite: {'^/api': ''},
            }
        },
    },
    html: {
        template: './static/index.html',
        meta: {
            description: 'hyperSend的 前端Web ',
        },
        favicon: './src/assets/sea.jpg',
        title: 'HyperSend',
    },
});
