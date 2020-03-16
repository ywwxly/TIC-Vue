<template>
  <NormalLayout :topHeight="46" :leftWidth="0" :rightWidth="0" :bottomHeight="0">
    <template v-slot:top>
      <HeaderComponent :onlyShowLogo="true" :logo="logo" :companyName="companyName"></HeaderComponent>
    </template>

    <template v-slot:center>
      <LiteLoginComponent @updateLogo="updateLogo" @updateCompanyName="updateCompanyName"></LiteLoginComponent>
    </template>
  </NormalLayout>
</template>

<script>
import NormalLayout from "../components/layout/NormalLayout";
import HeaderComponent from "../components/component/HeaderComponent";
import LiteLoginComponent from "../components/component/LiteLoginComponent";

export default {
  components: {
    NormalLayout,
    HeaderComponent,
    LiteLoginComponent
  },

  data() {
    return {
      logo: null,
      sdkAppId: null,
      userId: null,
      userSig: null,
      roomId: null,
      companyName: "互动课堂"
    };
  },

  methods: {
    updateLogo(val) {
      this.logo = val;
      var link =
        document.querySelector("link[rel*='icon']") ||
        document.createElement("link");
      link.type = "image/x-icon";
      link.rel = "shortcut icon";
      link.href = this.logo;
      document.getElementsByTagName("head")[0].appendChild(link);
    },
    updateCompanyName(val) {
      this.companyName = val;
      document.title = val;
    }
  }
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