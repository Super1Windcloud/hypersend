<script setup lang="ts">

import {onMounted, ref} from "vue";
import {RequestAnswerFromLLMTest} from './request.ts'
import GlowSpan from "../components/GlowSpan.vue";
import BorderEffect from "../components/BorderEffect.vue";
import BorderGlow from "../components/BorderGlow.vue";


const content = ref('');
const textareaRef = ref<HTMLTextAreaElement | null>(null);

async function invokeLLM() {
  await RequestAnswerFromLLMTest("冒泡排序", (answer) => {
    content.value = answer;
  });
}

async function handleClick() {
  await invokeLLM();
  if (textareaRef.value) {
    textareaRef.value.style.height = 'auto';
    textareaRef.value.style.height = textareaRef.value.scrollHeight + 'px';
  }
}

onMounted(() => {
  if (textareaRef.value) {
    textareaRef.value.style.height = 'auto';
    textareaRef.value.style.height = textareaRef.value.scrollHeight + 'px';
  }
});
</script>
<template>
  <div>
<!--    <div>-->
<!--      <button @click="handleClick">点击开始</button>-->
<!--    </div>-->
<!--    <textarea v-model="content" ref="textareaRef"-->
<!--              placeholder="please input">-->
<!--    </textarea>-->
    <border-effect/>
    <border-glow />
  </div>
</template>


<style scoped>
textarea {
  resize: none;
  overflow: hidden;
}
</style>