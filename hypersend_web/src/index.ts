import {createApp} from 'vue';
import App from './App.vue';
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import {createPinia} from 'pinia'

const pinia = createPinia();
const app = createApp(App);
app.use(ElementPlus, {
    locale: zhCn,
});


app.use(pinia);
app.mount('#root');