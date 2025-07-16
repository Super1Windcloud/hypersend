<script lang="ts" setup async>
// stop 阻止子组件到父组件冒泡,
// 在子组件上使用 @click.self 修饰符， 阻止父组件冒泡到子组件
import GradientButton from "@/components/GradientButton.vue";
import {onMounted, reactive, ref, watch} from 'vue';
import {ElSelect, ElOption} from 'element-plus';
import {default as PromptDialog} from '@/components/PromptDialog.vue'
import 'glow-gradient-button-vue/style.css'
import GlowGradientButtonComponent from '@/components/GlowButtonPink.vue'
import {useShowQuestion, useProgramLanguage, usePrompts, useSubject, useWebSocketStatus, useLLMModel} from "@/store";
import ImageCropper from "@/View/ImageCropper.vue";
import {AliOCR, getPaddleOCRResult, RequestAnswerFromLLM} from "@/utils/request.ts";
import {closeWSConnection, establishWSConnection} from "@/utils/websocket.ts";
import TextMessageBox from "@/components/MessageBox.vue";
import {ElLoading} from 'element-plus'
import {ElNotification} from 'element-plus'
import StarButton from "../../vuesfc/src/components/StarButton.vue";

const selectedLanguage = ref('python');
const selectedLLMAPI = ref('aliQwen2_5');
const popPromptDialog = ref(false);
const handleClick = () => {
  popPromptDialog.value = !popPromptDialog.value;
};
const isShowQuestionView = ref(true);
const isStartWS = ref(false);
const code = useProgramLanguage();
const imgUrl = ref("");

/// 所有异步操作只能放在 onMounted 中
const messageObj = reactive({
  textMessage: "",
  file: Blob, folder: Blob, clipboard: ""
});
onMounted(async () => {
  code.$state.language = selectedLanguage.value;
  llm.$state.model = selectedLLMAPI.value;
});


watch(selectedLanguage, () => {
  code.$state.language = selectedLanguage.value;
  ElNotification({
    title: '选择的编程语言',
    message: code.$state.language,
    type: 'success'
    , position: 'bottom-left',
    offset: 200
  })
});

watch(selectedLLMAPI, () => {
  llm.$state.model = selectedLLMAPI.value;
  ElNotification({
    title: '选择的LLM',
    message: llm.$state.model,
    type: 'success'
    , position: 'bottom-left',
    offset: 200
  })
});

watch(isShowQuestionView, () => {
  const capture = useShowQuestion();
  capture.$state.isShowQuestion = isShowQuestionView.value;
  // alert(capture.$state.isShowQuestion) ;
});

watch(isStartWS, () => {
  const capture = useWebSocketStatus();
  capture.$state.isConnection = isStartWS.value;
  if (isStartWS.value) {
    establishWSConnection(messageObj)
  } else if (!isStartWS.value) {
    closeWSConnection()
  }
});

const closeLoader = (loadingInstance) => {
  loadingInstance.close()
};
const getRemoteScreenShot = async () => {
  //  浏览器包装返回的 Response 对象是不可枚举的
  /**
   * text()
   * 类型：Promise<string>
   * 描述：读取响应体并返回其内容作为一个字符串。适用于文本类型的响应（如 HTML、JSON 等）。
   *
   * json()
   * 类型：Promise<string> 必须是标准的JSON字符串格式
   * 描述：读取响应体并将其解析为 JSON 对象。适用于响应体是 JSON 格式的情况。
   *
   * blob()
   * 类型：Promise<Blob>
   * 描述：读取响应体并返回一个 Blob 对象，适用于文件、图片等二进制数据。
   *
   * arrayBuffer()
   * 类型：Promise<ArrayBuffer>  包含缓冲区字节长度
   * 描述：读取响应体并返回一个 ArrayBuffer，用于处理二进制数据。
   *
   * formData()
   * 类型：Promise<FormData>
   * 描述：读取响应体并将其解析为 FormData 对象，适用于表单数据。
   *
   * bytes()
   * 类型：Promise<Uint8Array> 返回一个字节流数组
   *  描述：读取响应体并返回一个 Uint8Array，用于处理字节数据。
   * clone()
   * 类型：Response
   * 描述：创建响应的副本。由于响应体只能被读取一次，clone() 方法允许你创建一个新的响应对象，读取响应体多次。
   * */
  const response = await fetch("/api/capture");
  const bufferData = await response.blob();
  const blob = new Blob([bufferData], {type: "image/png"});
  // const blob = new Blob([bufferData], {type: "image/bmp"});
  const url = URL.createObjectURL(blob);
  // window.open(url);
  imgUrl.value = url;
};
const updateImg = async (url) => {
  if (url) {
    imgUrl.value = "";
    const loadingInstance = ElLoading.service({fullscreen: true});
    await ocrHandleFromPaddleOCR(url, closeLoader, loadingInstance);
  } else {
    imgUrl.value = "";
  }
};

const ocrFromAliApi = async (url) => {
  let text: string = await AliOCR(url);
  alert(text)
};

const langs = useProgramLanguage();
const prompts = usePrompts();
const llm = useLLMModel();
const ocrHandleFromPaddleOCR = async (url, closeLoader: (loadingInstance) => void, loadingInstance: any) => {
  let text = await getPaddleOCRResult(url);
  closeLoader(loadingInstance);
  if (!text) {
    alert("未识别到内容");
    return
  }

  let subjects = useSubject();
  subjects.addSubject(text, "this is superwindcloud(https://gitee.com/superwindcloud)");
  if (prompts.$state.prompts.length === 0) {
    text = `请使用${langs.$state.language} 编程语言\n` + text;
    console.log(text);
    await RequestAnswerFromLLM(text, (answer) => {
      subjects.updateLastAnswer(answer);
    });
  } else {
    text = ` 请使用${langs.$state.language} 编程语言, ${prompts.$state.prompts}\n` + text;
    console.log(text);
    await RequestAnswerFromLLM(text, (answer) => {
      subjects.updateLastAnswer(answer);
    });
  }

};
const ocrHandleFromTesseract = async (url: string) => {
  let response = await fetch('/api/ocr/tesseract', {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({url: url})
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  let text = await response.text();
  console.log(text);
  return text;
};

const ocrHandleFromESearchOCR = async (url) => {
  let response = await fetch('/api/ocr/esearch', {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({url: url})
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  let text = await response.text();
  console.log(text);
  return text;
};
const updateTextMessage = (text) => {
  messageObj.textMessage = text;
};

const languages = ref([
  "python", "java", "rust", "c++", "golang", "js", "ts", "csharp", "dart", "kotlin",
  "elixir", "php", "ruby"
]);
const llmApis = ref([
  "aliQwen2_5", "aliQwenPlus", "aliQwenMax", "aliQwenQwQ32B",
  "Siliconflow-Qwen2.5", "Deepseek-Chat", "codegeex-4",
  "kimi-moonshot-v1-auto", "doubao-1.5-lite-32k", "doubao-deepseek", "doubao-1.5-pro-32k"
]);
const colors = ref(["orange", "lightblue", "lightpink", "skyblue"
  , "lightblue", "lightblue", "lightpink", "hotpink", "lightpink", "lightpink"
  , "lightpink", "lightpink", "lightpink"])

</script>

<template>
  <div class="toolbar" v-if="!imgUrl">
    <PromptDialog :popPromptDialog="popPromptDialog"/>
    <div class="toolbar-item">
      <el-select class="selectLanguage" v-model="selectedLanguage"
                 placeholder="请选择" size="default">
        <el-option class="options" v-for="item in languages"
                   :label="item" :value="item" style="width: 150px;">
        </el-option>
      </el-select>

    </div>
    <div class="toolbar-item">
      <el-select class="selectLLMAPI" v-model="selectedLLMAPI"
                 placeholder="请选择" size="default">
        <el-option class="options" v-for="item in llmApis"
                   :label="item" :value="item" style="width: 270px;">
        </el-option>
      </el-select>
    </div>
    <StarButton class="prompts" content="自定义Prompts" @click="handleClick"/>
    <el-switch
        v-model="isShowQuestionView"
        class="selectButton-show"
        inline-prompt
        style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949;"
        active-text="显示问题视图"
        inactive-text="关闭问题视图"
    />
    <GradientButton class="remoteCapture" content="远程截图" @click.stop="getRemoteScreenShot" button-style="btn-grad"/>
    <el-switch
        v-model="isStartWS"
        class="selectButton-ws"
        inline-prompt
        style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949;"
        active-text="启用WS连接"
        inactive-text="关闭WS连接"
    />
    <GlowGradientButtonComponent class="connection"/>

    <TextMessageBox :isTextMessage="messageObj.textMessage" @updateTextMessage="updateTextMessage"/>

  </div>
  <div v-else>
    <ImageCropper :imgUrl="imgUrl" @update-message="updateImg"/>
  </div>

</template>

<style scoped>

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

.prompts {
  cursor: pointer;
  height: 30px;
  width: 150px;


  &:hover {
    scale: 1.2;
    transition: all 0.3s ease-in-out;
    animation-name: bounce;
    animation-duration: 1s;
    animation-fill-mode: both;
    transform-origin: center bottom;
  }

  &:active {
    animation-direction: alternate;
    animation-duration: 3s;
    animation-name: rubberBand;
    animation-fill-mode: both;
  }
}

.connection {
  height: 35px;
  cursor: pointer;

}

.selectLanguage, .options, .selectLLMAPI {
  cursor: pointer;
  crop: auto;
  font-size: 20px;
  font-weight: bold;
  margin-right: 20px;
}

.options {
  &:hover {
    scale: 1.2;
    transition: all 0.3s ease-in-out;
    animation: swing 1s both;
  }
}

.selectLLMAPI {
  width: 200px;

  &:active {
    animation: shakeX;
    animation-iteration-count: infinite;
    animation-duration: 3s;
  }

  &:hover {
    animation: rubberBand 1s both;
  }
}

.selectLanguage {
  width: 100px;

  &:hover, &:active {
    animation: rubberBand 1s both;
  }
}

.toolbar {
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  background-color: transparent;
  padding: 10px 20px;
  color: #fff;
  overflow: visible;

  height: 100%;
  display: flex;
  place-items: center;
}

.toolbar-item {
  margin: 0;
  padding: 0;
}

.selectButton-show, .selectButton-ws {
  scale: 1.2;
  cursor: pointer;
  color: white;
  font-style: normal;
  font-weight: bold;
  font-size: 20px;
  margin-left: 5px;


}

.selectButton-show {
  &:hover {
    animation: rubberBand 1s both;
    transition: all 0.3s ease-in-out;
  }
}

.selectButton-ws {
  &:hover {
    transform-origin: top center;
    animation: swing 1s both;
  }
}


.toolbar {
  width: 60vmin;
  height: 50vmin;
  display: flex;
  place-content: center;
  color: white;
  text-shadow: 0 1px 0 #000;
  --border-angle: 0turn;
  --main-bg: conic-gradient(
      from var(--border-angle),
      #343d46,
      #343d46 5%,
      #112 60%,
      #213 95%
  );
  border: solid 5px transparent;
  border-radius: 2em;
  --gradient-border: conic-gradient(from var(--border-angle), transparent 25%, #08f, #f03 99%, transparent);
  background: var(--main-bg) padding-box, var(--gradient-border) border-box, var(--main-bg) border-box;
  background-position: center center;
  animation: bg-spin 3s linear infinite;

  &:hover {
    animation-play-state: running;
  }
}

@keyframes bg-spin {
  to {
    --border-angle: 1turn;
  }
}

@property --border-angle {
  syntax: "<angle>";
  inherits: true;
  initial-value: 0turn;
}

@media (max-width: 1024px)  and    (orientation: landscape) {
  .prompts {
    cursor: pointer;
    height: 30px;
    width: 150px;
    padding-left: 10px;
    padding-right: 10px;

    &:hover {
      scale: 1.2;
      transition: all 0.3s ease-in-out;
    }
  }

  .selectLanguage {
    width: 100px;
    margin: 0;
  }

  .selectLLMAPI {
    width: 150px;
    margin-right: 0;
  }

  .remoteCapture {
    width: 100px;
  }

  .connection {
    display: none;
    width: 50px;
  }

}

</style>
