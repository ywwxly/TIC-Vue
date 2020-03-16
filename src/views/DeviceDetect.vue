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
    <DeviceDetectComponent>
    </DeviceDetectComponent>
   </template>
  </NormalLayout>
</template>

<script>
import NormalLayout from "../components/layout/NormalLayout";
import HeaderComponent from "../components/component/HeaderComponent";
import DeviceDetectComponent from "../components/component/DeviceDetectComponent";

export default {
  components: {
    NormalLayout,
    HeaderComponent,
    DeviceDetectComponent
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