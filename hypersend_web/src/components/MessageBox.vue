<template>
  <div></div>
</template>
<script setup lang="ts">


import {ElMessage, ElMessageBox} from 'element-plus'
import {watch} from "vue";


let props = defineProps({
  isTextMessage: {
    type: String
    , default: ""
  }
});

const emit = defineEmits(['updateTextMessage']);
const customButton: any = {
  confirmButtonText: '复制到剪贴板',
  cancelButtonText: '取消',
  type: 'success',
  draggable: true,
  roundButton: true
};
const responseWSTextMessage = (text: string) => {
  ElMessageBox.confirm(
      text,
      'Server Message',
      customButton
  )
      .then(() => {
        ElMessage({
          type: 'success',
          message: '已经复制到剪贴板',
        });
        updateTextMessage("");
        copyToClipboard(text)
      }).catch((_) => {
    ElMessage({
      type: 'info',
      message: '取消操作',
    });
    updateTextMessage("");
  });
};

watch(() => props.isTextMessage, (message) => {
  if (message) {
    responseWSTextMessage(message)
  }
});


function updateTextMessage(text: string) {
  emit("updateTextMessage", text);
}


function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text);
}
</script>

<style scoped></style>