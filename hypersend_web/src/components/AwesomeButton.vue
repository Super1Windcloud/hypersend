<script setup lang="ts">
import {defineProps, PropType} from 'vue';

enum ButtonType {
  Hold = "hold",
  Center1 = "center1",
  Center2 = "center2"
}

let props = defineProps({
  content: {
    type: String as PropType<string>,
    default: "按钮"
  },
  buttonType: {
    type: String as PropType<ButtonType>,
    default: ButtonType.Hold
  }
})
</script>

<template>
  <div>
    <button class="hold-button" v-if="buttonType===ButtonType.Hold ">
      {{ props.content }}
    </button>
    <button class="center1" v-else-if="props.buttonType===ButtonType.Center1 ">
      {{ props.content }}
    </button>
    <button v-else-if="props.buttonType===ButtonType.Center2 " class="center2"
    >
      {{ props.content }}
    </button>
  </div>

</template>

<style scoped>
/* From Uiverse.io by mrtqzbek11 */
.hold-button {
  width: 165px;
  height: 62px;
  cursor: pointer;
  color: #fff;
  font-size: 17px;
  border-radius: 1rem;
  border: none;
  position: relative;
  background: darkgray;
  transition: 0.1s;
}

.hold-button::after {
  content: '';
  width: 100%;
  height: 100%;
  background-image: radial-gradient(circle farthest-corner at 10% 20%, rgba(255, 94, 247, 1) 17.8%, rgba(2, 245, 255, 1) 100.2%);
  filter: blur(15px);
  z-index: -1;
  position: absolute;
  left: 0;
  top: 0;
}

.hold-button:active {
  transform: scale(0.9) rotate(3deg);
  background: radial-gradient(circle farthest-corner at 10% 20%, rgba(255, 94, 247, 1) 17.8%, rgba(2, 245, 255, 1) 100.2%);
  transition: 0.5s;
}

.center1, .center2 {
  position: relative;
  display: inline-block;
  height: 4rem; /* h-16 */
  width: 16rem; /* w-64 */
  border: 1px solid;
  text-align: left; /* text-left */
  padding: 0.75rem; /* p-3 */
  font-size: 1rem; /* text-base */
  font-weight: bold; /* font-bold */
  border-radius: 0.5rem; /* rounded-lg */
  overflow: hidden;
  background-color: #2d2d2d; /* bg-neutral-800 for center1, bg-indigo-800 for center2 */
  color: #f5f5f5; /* text-gray-50 for center1, text-indigo-200 for center2 */
  text-decoration: underline;
  text-underline-offset: 0.5rem; /* underline-offset-2 */
}

.center1 {
  background-color: #2d2d2d; /* bg-neutral-800 */
  color: #f5f5f5; /* text-gray-50 */
}

.center2 {
  background-color: #3f51b5; /* bg-indigo-800 */
  color: #e3f2fd; /* text-indigo-200 */
}

.center1:before, .center2:before {
  content: '';
  position: absolute;
  width: 3rem; /* w-12 */
  height: 3rem; /* h-12 */
  right: 0.25rem; /* right-1 */
  top: 0.25rem; /* top-1 */
  z-index: 10;
  background-color: #8e24aa; /* before:bg-violet-500 for center1, before:bg-orange-500 for center2 */
  border-radius: 9999px; /* rounded-full */
  filter: blur(4px); /* blur-lg */
}

.center1:after, .center2:after {
  content: '';
  position: absolute;
  z-index: 10;
  width: 5rem; /* w-20 */
  height: 5rem; /* h-20 */
  right: 2rem; /* right-8 */
  top: 0.75rem; /* top-3 */
  background-color: #f06292; /* after:bg-rose-300 for center1, after:bg-pink-500 for center2 */
  border-radius: 9999px; /* rounded-full */
  filter: blur(6px); /* blur-lg */
}

.center1:hover {
  border-color: #f06292; /* hover:border-rose-300 */
  color: #f06292; /* hover:text-rose-300 */
}

.center2:hover {
  border-color: rgb(102, 187, 106); /* hover:border-green-500 */
  color: rgb(102, 187, 106); /* hover:text-green-500 */
}

.center1:hover:before {
  box-shadow: 20px 20px 20px 30px #a21caf; /* hover:before:[box-shadow:_20px_20px_20px_30px_#a21caf] */
}

.center2:hover:before {
  box-shadow: 20px 20px 20px 30px #2ecc71; /* hover:before:[box-shadow:_20px_20px_20px_30px_#2ecc71] */
}

.center1:hover:after {
  right: -2rem; /* hover:after:-right-8 */
}

.center2:hover:after {
  right: -2rem; /* hover:after:-right-8 */
}

.center1:hover:before {
  right: 3rem; /* hover:before:right-12 */
  bottom: -2rem; /* hover:before:-bottom-8 */
}

.center2:hover:before {
  right: 3rem; /* hover:before:right-12 */
  bottom: -2rem; /* hover:before:-bottom-8 */
}

.center1:hover {
  text-decoration: underline; /* hover:underline */
  text-underline-offset: 1rem; /* hover:underline-offset-4 */
}

.center2:hover {
  text-decoration: underline; /* hover:underline */
  text-underline-offset: 1rem; /* hover:underline-offset-4 */
}


</style>
