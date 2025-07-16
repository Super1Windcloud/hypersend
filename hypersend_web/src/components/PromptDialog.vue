<template>

  <el-dialog
      v-model="centerDialogVisible"
      title="请输入自定义的Prompt"
      width="500"
      align-center @close="renderCallback"
      :close-on-press-escape="false"
  >
    <span>
      <TextInput ref="textarea"/>
    </span>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="cancelHandle">取消</el-button>
        <el-button type="primary" @click="okHandle">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import {ref, Ref, watch} from 'vue';
import {ElDialog, ElButton, ElNotification} from 'element-plus'
import {usePrompts} from "@/store";

type TextInput = {
  textarea: string
}
const promptStore = usePrompts();
const textarea = ref(null) as Ref<TextInput | null>;
const cancelHandle = () => {
  centerDialogVisible.value = false;
  promptStore.$reset();
  if (textarea.value) {
    textarea.value.textarea = '';
  }
};
const okHandle = () => {
  centerDialogVisible.value = false;
  if (textarea.value) {
    promptStore.$state.prompts = textarea.value.textarea;
    promptStore.renderCustomPrompts()
  }

};

const renderCallback = () => {
  if (promptStore.$state.prompts) {
    ElNotification({
      title: '自定义的Prompts',
      message: promptStore.$state.prompts || "prompts 为空",
      type: 'success',
      position: 'bottom-left'
      , offset: 200
    })
  } else {
    promptStore.$reset();
    ElNotification({
      title: '自定义的Prompts',
      message: promptStore.$state.prompts || "prompts 为空",
      type: 'success',
      position: 'bottom-left'
      , offset: 200
    });
    return;
  }
};
const props = defineProps({
  popPromptDialog: {
    type: Boolean,
    default: false,
    required: true
  }
});

const centerDialogVisible = ref(false);

watch(() => props.popPromptDialog,
    (newVal: boolean, _: boolean) => {
      centerDialogVisible.value = true;
    })

</script>
