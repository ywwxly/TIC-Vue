<template>
  <div id="app">
    <img alt="Vue logo" src="../../assets/logo.png" />
    <Class msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
import Class from "../../views/Class";

export default {
  name: "App",
  components: {
    Class
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
