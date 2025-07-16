<template>
  <div v-if="questionContent">
    <MdPreview :id="id" :modelValue="questionContent" theme="light"
               noMermaid readOnly
               previewTheme="cyanosis" class="md-editor-dark"
    />
  </div>
  <div v-else>
    <h1>还没有题目</h1>
  </div>

</template>
<script lang="ts" setup>
import {onMounted, ref, inject, watch, watchEffect, Ref} from 'vue'
import {MdPreview} from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import {useSubject} from "@/store";

const id = 'preview-only';
const questionContent = ref<string>('');
const subject = useSubject();
const currentHeader = inject('currentHeaderView') as Ref<string>;

//watch 监听的对象需要包裹在匿名函数
watch(() => currentHeader.value, () => {
  let uuid = currentHeader.value;
  let index = subject.$state.subjects.findIndex((item) => {
    return item.uuid === uuid;
  });
  questionContent.value = subject.$state.subjects[index].questions;
});

watch(() => subject.$state.subjects, () => {
      if (subject.subjects.length === 0) {
        questionContent.value = "";
        return;
      }
      if (!Array.isArray(subject.subjects)) {
        questionContent.value = "";
        return;
      }
      questionContent.value = subject.getLastElement.questions;
    }, {deep: true}
);

watchEffect(() => {
  if (subject.subjects.length === 0) return;
  if (!Array.isArray(subject.subjects)) return;
  questionContent.value = subject.getLastElement.questions;
});

onMounted(() => {
  if (subject.subjects.length === 0) return;
  questionContent.value = subject.getLastElement.questions;
})

</script>


<style scoped>

.md-editor-dark {
  --md-bk-color: transparent;
  background-color: transparent;
  border-color: transparent;
  font-style: normal;
  font-synthesis: style;
  text-decoration: none;
  font-family: "Cascadia Mono", serif;
}

</style>