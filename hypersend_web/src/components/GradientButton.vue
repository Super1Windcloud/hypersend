<template>
  <el-button id="button" :class="buttonStyle" @click="shake"
             size="default">{{ content }}
  </el-button>

</template>

<script lang="ts" setup>
const props = defineProps(
    {
      content: {
        type: String,
        default: 'GradientButton',
        required: true
      }, buttonStyle: {
        type: String,
        default: 'btn-grad2',
        required: true
      }
    }
);
const content = props.content;
const style = props.buttonStyle;
const shake = () => {
  const button = document.getElementsByClassName(style)[0] as HTMLElement;
  button?.classList.add('shake');
  setTimeout(() => {
    button?.classList.remove('shake');
  }, 500); // 抖动持续时间
};

</script>
<style scoped>
.btn-grad1 {
  background-image: linear-gradient(to right, #2b5876 0%, #4e4376 51%, #2b5876 100%);
}

.btn-grad1 {
  margin: 10px;
  padding: 15px 45px;
  text-align: center;
  text-transform: uppercase;
  transition: 0.5s;
  background-size: 200% auto;
  color: white;
  box-shadow: 0 0 20px #eee;
  border-radius: 10px;
  display: flex;
}

.btn-grad1:hover {
  background-position: right center; /* change the direction of the change here */
  color: #fff;
  text-decoration: none;
}


.btn-grad2 {
  background-image: linear-gradient(to right, #16A085 0%, #F4D03F 51%, #16A085 100%);
}

.btn-grad2 {
  margin: 10px;
  padding: 15px 45px;
  text-align: center;
  text-transform: uppercase;
  transition: 0.5s;
  background-size: 200% auto;
  color: white;
  box-shadow: 0 0 20px #eee;
  border-radius: 10px;
  display: flex;
}

.btn-grad2:hover {
  background-position: right center; /* change the direction of the change here */
  color: #fff;
  text-decoration: none;
  scale: 1.1;
}

.btn-grad3 {
  background-image: linear-gradient(to right, #E55D87 0%, #5FC3E4 51%, #E55D87 100%);
}

.btn-grad3 {
  margin: 10px;
  padding: 15px 45px;
  text-align: center;
  text-transform: uppercase;
  transition: 0.5s;
  background-size: 200% auto;
  color: white;
  box-shadow: 0 0 20px #eee;
  border-radius: 10px;
  display: flex;
}

.btn-grad3:hover {
  background-position: right center; /* change the direction of the change here */
  color: #fff;
  text-decoration: none;
  scale: 1.1;
}

.btn-grad4 {
  background-image: linear-gradient(to right, #FC354C 0%, #0ABFBC 51%, #FC354C 100%);
}

.btn-grad4 {
  margin: 10px;
  padding: 15px 45px;
  text-align: center;
  text-transform: uppercase;
  transition: 0.5s;
  background-size: 200% auto;
  color: white;
  box-shadow: 0 0 20px #eee;
  border-radius: 10px;
  display: flex;
}

.btn-grad4:hover {
  background-position: right center; /* change the direction of the change here */
  color: #fff;
  text-decoration: none;
  scale: 1.1;
}

.btn-grad5 {
  background-image: linear-gradient(to right, #AAFFA9 0%, #11FFBD 51%, #AAFFA9 100%);
}

.btn-grad5 {
  margin: 10px;
  padding: 15px 45px;
  text-align: center;
  text-transform: uppercase;
  transition: 0.5s;
  background-size: 200% auto;
  color: white;
  box-shadow: 0 0 20px #eee;
  border-radius: 10px;
  display: flex;
}

.btn-grad5:hover {
  background-position: right center; /* change the direction of the change here */
  color: #fff;
  text-decoration: none;
  scale: 1.1;
}

.btn-grad6 {
  background-image: linear-gradient(to right, #D38312 0%, #A83279 51%, #D38312 100%);
}

.btn-grad6 {
  margin: 10px;
  padding: 15px 45px;
  text-align: center;
  text-transform: uppercase;
  transition: 0.5s;
  background-size: 200% auto;
  color: white;
  box-shadow: 0 0 20px #eee;
  border-radius: 10px;
  display: flex;
}

.btn-grad6:hover {
  background-position: right center; /* change the direction of the change here */
  color: #fff;
  text-decoration: none;
  scale: 1.1;
}

.btn-grad {
  background-image: linear-gradient(to right, #fc00ff 0%, #00dbde 51%, #fc00ff 100%);
}

.btn-grad {
  margin: 5px;
  padding: 10px 45px;
  text-align: center;
  text-transform: uppercase;
  transition: all 0.5s ease-in-out;
  background-size: 200% auto;
  color: white;
  box-shadow: 0 0 20px #eee;
  border-radius: 10px;
  display: flex;
  font-weight: bold;
  font-size: 15px;
}

.btn-grad:hover {
  background-position: right center; /* change the direction of the change here */
  color: #fff;
  text-decoration: none;
  scale: 1.2;
  transition: all 0.3s ease-in;
}

@keyframes shake {
  0% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-5px);
  }
  50% {
    transform: translateX(5px);
  }
  75% {
    transform: translateX(-5px);
  }
  100% {
    transform: translateX(0);
  }
}

.shake {
  animation: shake 0.5s;
}

 
</style>