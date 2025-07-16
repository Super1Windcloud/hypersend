<template>
  <div v-if="subjectLen>0">
    <el-scrollbar>
      <p v-for="item   in subjectList" :key="item.uuid" class="scrollbar-demo-item"
         @click.stop="jumpToSpecificSubject(item)" :data-uuid="item.uuid">
        <el-text line-clamp="2" class="catalog"
                 size="small" type="primary">
          {{ item.header }}
        </el-text>
      </p>

    </el-scrollbar>
    <div class="handle">
      <el-space direction="vertical" size="large">
        <el-col class="clear" :span="10" @click.stop="clearCategory">
          <StarButton content="清空"/>
        </el-col>
        <el-col :span="10" class="delete" @click.stop="deleteTop">
          <StarButton content="删除"/>
        </el-col>
      </el-space>
    </div>

  </div>
  <div v-else>
    <section class="no-subject">
      <h1>还没有任何题目的历史记录</h1>
    </section>
  </div>
</template>
<script lang="ts" setup>
import {onMounted, ref, watch, inject, Ref} from 'vue'
import {useSubject} from "@/store";

type HeaderType = {
  uuid: string,   // , 和 ; 都可以
  header: string
}
const subjectLen = ref(0);

const subjectList = ref<HeaderType  []>([]);
const subjectStore = useSubject();
const currentHeader = inject('currentHeaderView') as Ref<string>;

// Vue内置的属性不会暴露到DOM 上
const jumpToSpecificSubject = (item: HeaderType) => {
  const uuid = item.uuid;
  currentHeader.value = uuid;
};

const clearCategory = () => {
  subjectStore.$reset();
};

const deleteTop = () => {
  subjectStore.deleteTopSubject();
};
onMounted(() => {
  for (const {uuid, headers} of subjectStore.$state.subjects) {
    const header = headers;
    subjectList.value.push({uuid, header});
  }
  subjectLen.value = subjectList.value.length;
  if (subjectLen.value === 0) return;
  currentHeader.value = subjectList.value[subjectLen.value - 1].uuid;
});

watch(subjectList, () => {
  subjectLen.value = subjectList.value.length;
});
watch(
    () => subjectStore.$state.subjects,
    (newSub) => {
      try {
        subjectList.value = [];
        for (const {uuid, headers,} of newSub)  // 解构剩余自动忽略
        {
          const header = headers;
          subjectList.value.push({uuid, header});
        }
        subjectLen.value = subjectList.value.length;
        if (subjectLen.value === 0) return;
        currentHeader.value = subjectList.value[subjectLen.value - 1].uuid;

      } catch (error) {
        console.error('更新 subjectList 时发生错误:', error);
      }
    },
    {deep: true} // 深度监听
);

import {renderQuestionTemplate} from "@/utils";
import StarButton from "vuesfc/src/components/StarButton.vue";

const subject = useSubject();
onMounted(async () => {
  let template = await renderQuestionTemplate() ?? '';
  subject.addSubject(template, "# Welcome come to hypersend by superwindcloud");
  console.log(subject.subjects.length);
})


</script>


<style scoped>
.no-subject {
  display: flex;
  text-align: center;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: large;
  margin-top: 50%;
  color: lightpink;
}

.scrollbar-demo-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  margin: 10px;
  text-align: center;
  border-radius: 15px;
  background-color: darkslateblue;;
  opacity: 0.8;
  box-sizing: border-box;
  box-shadow: deepskyblue 0 0 10px 1px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    scale: 1.1;
  }
}

.catalog {
  color: lightskyblue;
  opacity: 1;
  font-weight: bold;
  font-style: normal;
  font-synthesis: style;
  text-decoration: underline;
  font-family: "Cascadia Mono", serif;

}

html, body {
  margin: 0;
  padding: 0;
  height: 100%;
}

.handle {
  padding: 0;
  margin: 0;
  position: fixed;
  bottom: 60px;

}

.handle .delete {
  transition: all 0.3s ease-in-out;

  &:hover, &:active {
    scale: 1.2;
    animation: wobble 1s both;
  }
}

.handle .clear {
  transition: all 0.3s ease-in-out;

  &:hover, &:active {
    scale: 1.2;
    animation: rubberBand 1s both;
  }
}

@keyframes wobble {
  from {
    transform: translate3d(0, 0, 0);
  }
  15% {
    transform: translate3d(-25%, 0, 0) rotate3d(0, 0, 1, -5deg);
  }
  30% {
    transform: translate3d(20%, 0, 0) rotate3d(0, 0, 1, 3deg);
  }
  45% {
    transform: translate3d(-15%, 0, 0) rotate3d(0, 0, 1, -3deg);
  }
  60% {
    transform: translate3d(10%, 0, 0) rotate3d(0, 0, 1, 2deg);
  }
  75% {
    transform: translate3d(-5%, 0, 0) rotate3d(0, 0, 1, -1deg);
  }
  to {
    transform: translate3d(0, 0, 0);
  }
}

@keyframes swing {
  20% {
    transform: rotate3d(0, 0, 1, 15deg);
  }
  40% {
    transform: rotate3d(0, 0, 1, -10deg);
  }
  60% {
    transform: rotate3d(0, 0, 1, 5deg);
  }
  80% {
    transform: rotate3d(0, 0, 1, -5deg);
  }
  to {
    transform: rotate3d(0, 0, 1, 0deg);
  }
}

@keyframes shakeX {
  from, to {
    transform: translate3d(0, 0, 0);
  }
  10%, 30%, 50%, 70%, 90% {
    transform: translate3d(-10px, 0, 0);
  }
  20%, 40%, 60%, 80% {
    transform: translate3d(10px, 0, 0);
  }
}

@keyframes rubberBand {
  from {
    transform: scale3d(1, 1, 1);
  }
  30% {
    transform: scale3d(1.25, 0.75, 1);
  }
  40% {
    transform: scale3d(0.75, 1.25, 1);
  }
  50% {
    transform: scale3d(1.15, 0.85, 1);
  }
  65% {
    transform: scale3d(0.95, 1.05, 1);
  }
  75% {
    transform: scale3d(1.05, 0.95, 1);
  }
  to {
    transform: scale3d(1, 1, 1);
  }
}

@keyframes bounce {
  from, 20%, 53%, 80%, to {
    animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);
    transform: translate3d(0, 0, 0);
  }

  40%, 43% {
    animation-timing-function: cubic-bezier(0.755, 0.050, 0.855, 0.060);
    transform: translate3d(0, -30px, 0);
  }

  70% {
    animation-timing-function: cubic-bezier(0.755, 0.050, 0.855, 0.060);
    transform: translate3d(0, -15px, 0);
  }

  90% {
    transform: translate3d(0, -4px, 0);
  }
}

</style>