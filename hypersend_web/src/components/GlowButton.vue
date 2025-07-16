<template>
  <button class="glow-button">Click Me</button>

</template>

<script>
export default {
  name: 'GlowButton',
};
</script>

<style scoped>
.glow-button {
  padding: 10px 20px;
  font-size: 16px;
  color: white;
  background: linear-gradient(45deg, #ff7e5f, #feb47b);
  border: none;
  border-radius: 5px;
  box-shadow: 0 0 10px #ff7e5f, 0 0 20px #ff7e5f, 0 0 40px #ff7e5f;
  transition: box-shadow 0.3s ease;
}

.glow-button:hover {
  box-shadow: 0 0 20px #ff7e5f, 0 0 40px #ff7e5f, 0 0 80px #ff7e5f;
}
</style>