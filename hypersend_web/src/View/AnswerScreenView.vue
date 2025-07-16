<template>
  <div v-if="answerContent">
    <MdPreview :id="id" v-model="answerContent"
               theme="light"
               noMermaid readOnly
               :previewOnly="true"
               :hideToolbar="true"
               previewTheme="cyanosis" class="md-editor-dark"
    />
  </div>
  <div v-else>
    <h1>还没有操作历史</h1>
  </div>
</template>

<script lang="ts" setup async>
// :modelValue="answerContent"
import {inject, onMounted, Ref, ref, watch} from 'vue'
import {MdPreview} from "md-editor-v3";
import 'md-editor-v3/lib/style.css';
import {useSubject} from "@/store";

const id = 'preview-only';
const answerContent = ref<string>('');
const subject = useSubject();
const currentHeader = inject('currentHeaderView') as Ref<string>;


watch(() => subject.getLastAnswer, (newVal) => {
  if (subject.subjects.length === 0) {
    answerContent.value = "";
    return
  }
  answerContent.value = newVal;
});

watch(() => currentHeader.value, () => {
  let uuid = currentHeader.value;
  let index = subject.$state.subjects.findIndex((item) => {
    return item.uuid === uuid;
  });
  answerContent.value = subject.$state.subjects[index].answers;
});

watch(() => subject.$state.subjects, () => {
  if (subject.subjects.length === 0) {
    answerContent.value = "";
    return;
  }
  if (!Array.isArray(subject.subjects)) {
    answerContent.value = "";
    return;
  }
  answerContent.value = subject.getLastAnswer;
});


onMounted(async () => {
  if (subject.subjects.length === 0) return;
  answerContent.value = subject.getLastElement.answers;
})

</script>

<style scoped>
.md-editor-dark {
  --md-bk-color: transparent;
  background-color: transparent;
  border-color: transparent;
  font-style: normal;
  /**  color 无法覆盖生效 */
  color: lightseagreen;
  font-synthesis: style;
  text-decoration: none;
  font-family: "Cascadia Mono", serif;
}

</style>