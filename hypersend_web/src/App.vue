<template>
  <div :class="{'dark' :isDark  }" class="root">
    <div class="layout"
         v-if="screenOrientation === '横屏'">
      <Layout/>
    </div>
    <div
        v-else
        class="content">
      <h1>请将设备横屏以获得更好的体验</h1>
      <h3><i>并且关闭手机方向锁定</i></h3>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted, onUnmounted, watch, onBeforeUnmount} from 'vue';
import Layout from '@/Layout.vue';

const screenOrientation = ref('');
const isDark = ref(true);
const checkDarkMode = () => {
  isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches;
};
const checkOrientation = () => {
  if (window.innerWidth > window.innerHeight) {
    screenOrientation.value = '横屏';
  } else {
    screenOrientation.value = '竖屏';
  }
};

watch(screenOrientation, (newVal: string, oldVal: string) => {
  console.log(`屏幕方向改变: ${oldVal} -> ${newVal}`);
  if (newVal === '竖屏') {
    alert('请将设备横屏以获得更好的体验');
  }
});

// 在组件挂载时添加 resize 事件监听器
onMounted(() => {
  checkOrientation();
  window.addEventListener('resize', checkOrientation);
  checkDarkMode();
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', checkDarkMode);
});

// 在组件卸载时移除 resize 事件监听器
onUnmounted(() => {
  window.removeEventListener('resize', checkOrientation);
});
onBeforeUnmount(() => {
  window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', checkDarkMode);
});

</script>
<style scoped>
.content {
  display: flex;
  line-height: 1.1;
  text-align: center;
  margin-top: 50%;
  align-items: center;
  height: auto;
  flex-direction: column;
  justify-content: center;
}

.content h1 {
  font-size: 3.6rem;
  font-weight: 700;
}

.content p {
  font-size: 1.2rem;
  font-weight: 400;
  opacity: 0.5;
}

.root, .layout {
  padding: 0;
  margin: 0;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  overscroll-behavior-y: none !important; /**禁用移动端下拉刷新 */
}


</style>
