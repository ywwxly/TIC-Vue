<template>
  <NormalLayout
   :topHeight="46"
   :leftWidth="0"
   :rightWidth="0"
   :bottomHeight="0"
  >

   <template v-slot:top>
    <HeaderComponent :onlyShowLogo="true"></HeaderComponent>
   </template>

   <template v-slot:center>
    <LoginComponent></LoginComponent>
   </template>
  </NormalLayout>
</template>

<script>
import NormalLayout from "../components/layout/NormalLayout";
import HeaderComponent from "../components/component/HeaderComponent";
import LoginComponent from "../components/component/DemoLoginComponent";

export default {
  components: {
    NormalLayout,
    HeaderComponent,
    LoginComponent
  },

  data() {
    return {
      sdkAppId: null,
      userId: null,
      userSig: null,
      roomId: null
    };
  },

  methods: {}
};
</script>

<style>
#login-view {
  width: 100%;
  height: 100%;
  background: url("../assets/login_bg.png") center center no-repeat;
  background-size: cover;
  background-color: rgba(27, 28, 30, 1);
}
</style>