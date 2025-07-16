<script setup lang="ts">
import 'element-plus/dist/index.css'
import SiderBar from '@/View/SiderBar.vue';
import AnswerScreenView from '@/View/AnswerScreenView.vue';
import StatusBar from '@/View/StatusBar.vue';
import {ElContainer, ElAside, ElMain, ElDivider} from 'element-plus';
import QuestionScreenView from '@/View/QuestionScreenView.vue';
import {onMounted, provide, ref, watch} from "vue";
import {useShowQuestion} from "@/store";

provide("currentHeaderView", ref(""));
const useQuestionView = useShowQuestion();
const isShowQuestionView = ref(true);
watch(() => useQuestionView.$state.isShowQuestion, (newValue, _) => {
  isShowQuestionView.value = newValue;
  // alert(newValue);
});
onMounted(() => {
  isShowQuestionView.value = useQuestionView.$state.isShowQuestion;
})
</script>


<template>
  <div class="common-layout">
    <el-container direction="vertical" class="full-container">
      <el-container class="content-container">
        <el-aside class="siderbar">
          <SiderBar/>
        </el-aside>
        <el-divider direction="vertical" class="divider"/>
        <el-main v-if="isShowQuestionView" class="question">
          <QuestionScreenView/>
        </el-main>
        <el-divider direction="vertical" class="divider"/>
        <el-main class="answer">
          <AnswerScreenView/>
        </el-main>
      </el-container>
    </el-container>
    <StatusBar class="status-bar"/>
  </div>
</template>


<style scoped lang="css">
.common-layout {
  width: 100%;
  height: 100%;
  display: flex;
  flex: 1;
  padding: 0;
  margin: 0;
  flex-direction: column;
  overflow: hidden; /* 禁止全局滚动条 */
}

.full-container {
  display: flex;
  flex: 1;
  padding: 0;
  margin: 0;
  width: 100%;
  height: 100%;
  flex-direction: column;
  overflow: hidden; /* 禁止容器溢出 */
}

.content-container {
  flex: 1;
  padding: 0;
  margin: 0;
  width: 100%;
  display: flex;
  overflow: hidden; /* 禁止内容溢出 */
}

.siderbar {
  width: 15%;
  background-color: #343d46;
  overflow: auto; /* 内部滚动条 */
}

.question {
  width: 35%;
  background-color: #343d46;
  overflow: auto; /* 内部滚动条 */
  padding: 0;
  margin: 0;
}

.answer {
  width: 50%;
  background-color: #343d46;
  overflow: auto; /* 内部滚动条 */
  padding: 0;
  margin: 0;
}

.divider {
  width: 2px;
  padding: 0;
  margin: 0;
  height: 100%;
  background-color: lightblue;
}

.status-bar {
  position: fixed;
  margin: 0;
  padding: 0;
  width: 100%;
  height: 40px;
  bottom: 0;
  background-color: #ffffff;
  box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: space-around;
  border-top: 1px solid #ccc;
}

.siderbar, .question, .answer {
  height: 100%; /* 确保子组件高度不会超出父容器 */
  overflow: auto;
  padding: 0;
  margin: 0;
}


</style>