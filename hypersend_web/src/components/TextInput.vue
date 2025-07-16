<template>
  <el-input
      v-model="textarea"
      maxlength="100"
      style="width: 100%;"
      placeholder="Please input"
      show-word-limit
      type="textarea"
      @change="storePrompt"
      clearable
  />
</template>

<script lang="ts" setup>
import {ref} from 'vue'
import {usePrompts} from "@/store";

const textarea = ref('');

// exposed to  parent  component
defineExpose({
  textarea
});

const prompts = usePrompts();
const storePrompt = () => {
  prompts.$state.prompts = textarea.value;

}

</script>
