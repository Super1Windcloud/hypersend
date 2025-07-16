<script setup lang="ts">
import {ref, reactive, Ref} from "vue";
import {Cropper} from "vue-advanced-cropper";
import 'vue-advanced-cropper/dist/style.css';
import GradientButton from "@/components/GradientButton.vue";


const props = defineProps({
  imgUrl: {
    type: String,
    required: true,
    default: ''
  }
});

function defaultPosition() {
  return {
    left: 0,
    top: 100,
  };
}

function defaultSize() {
  return {
    width: 1000,
    height: 800,
  };
}

const data = reactive({
  coordinates: {
    width: 0,
    height: 0,
    left: 0,
    top: 0,
  },
  image: null,
});
const cropperRef = ref(null) as Ref<null | typeof Cropper>;
const emit = defineEmits(['update-message']);

const getCropResult = () => {
  const result = cropperRef.value?.getResult();
  if (result && result.canvas) {
    data.coordinates = result.coordinates;
    data.image = result.canvas.toDataURL();
    emit("update-message", data.image);
  } else {
    console.error('Canvas 未定义或未正确初始化');
  }
};

const cancelCrop = () => {
  emit("update-message", "");
}
</script>

<template>
  <div class="cropper-wrapper">
    <cropper
        ref="cropperRef"
        class="cropper"
        :src="props.imgUrl"
        :default-size="defaultSize"
        :default-position="defaultPosition"
    ></cropper>
    <GradientButton buttonStyle="btn-grad5" class="crop" @click.stop="getCropResult" content="裁剪">
    </GradientButton>

    <GradientButton class="cancel" @click.stop="cancelCrop" content="取消" buttonStyle="btn-grad">
    </GradientButton>
  </div>
</template>

<style scoped>
.cropper-wrapper {
  overflow: auto;
  position: fixed;
  height: 100vh;
  margin: 0;
  top: 0;
  left: 0;
  padding: 0;
  width: 100vw;
  background: transparent;
}

.cropper {
  padding: 0;
  margin: 0;
  width: 100%;
  height: 100%;
}

.cancel {
  position: absolute;
  bottom: 100px;
  text-align: center;
  right: 0;
  width: 100px;
}

.crop {
  position: absolute;
  bottom: 50px;
  text-align: center;
  right: 0;
  width: 100px;
}
</style>
