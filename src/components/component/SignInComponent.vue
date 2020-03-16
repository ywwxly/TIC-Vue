<template>
  <div class="tic-login"></div>
</template>

<script>
import util from "../../util/util";
import Component from "../core/Component";
import Button from "../widget/ButtonWidget";
import api from "../../request/Api";
import Constant from "../../config/Constant";
import Global from "../../config/Global";
import ElectronProtocolCheck from "../../util/ElectronProtocolCheck";
import MessageBridge from "../../util/MessageBridge";
import Browser from "../../util/browser";
import elkLog from "../../request/ELKlog";
import Vue from "vue";
import Clipboard from "v-clipboard";
MessageBridge.platform = "web";

window.axios = axios;
var devMode = /localhost|test\.edu/gim.test(document.domain);
Vue.use(Clipboard);

export default {
  extends: Component,

  components: {
    Button
  },

  props: {},

  data() {
    return {
      version: Constant.VERSION,
      classid: null,
      userid: null,
      password: null,
      error_msg: null,
      showClassId: true,
      devMode: devMode,
      showWebLoginBtn: true, // 若页面同时展示“客户端登录”和“网页登录”时，此值为true；若先仅展示“客户端登录”，等待几秒后增加显示“网页登陆”，此值为false
      loginWithAcount: true, // true:账号登录 false:游客登录
      companyName: "互动课堂",
      companyId: null,
      classPassword: null,
      showPassword: false,
      nickname: null,
      focusInput: null,
      submit: false, //true：提交表单 false:未提交表单 用于确定“判断表单是否填写完整”的时机
      rememberPassword: true, //是否记住密码
      message: null,
      userAccount: null,
      showUserList: false //是否显示账号下拉菜单
    };
  },

  mounted() {
    MessageBridge.modal = this.$Modal;
    this.companyId = this.$route.params.companyId || Global.companyId;
    this.sdkAppId = this.$route.params.sdkAppId || Global.sdkAppId;
    this.userId = this.$route.params.userId;
    this.classId = this.$route.params.classId || Global.classId || null;
    this.nickName = this.$route.params.nickName || Global.nickname || null;
    this.userSig = this.$route.params.userSig;
    this.userToken = this.$route.params.userToken;
    this.userAccount = Global.userAccount || null;
    this.saveData();
  },

  methods: {
    saveData() {
      if (!this.companyId || !this.classId || !this.userId || !this.userToken) {
        return;
      }
      Global.del("classPassword");
      Global.set("guestFlag", false);
      Global.del("password");

      Global.set("sdkAppId", this.sdkAppId);
      Global.set("userId", this.userId);
      Global.set("userToken", this.userToken);
      Global.set("token", this.userToken);
      Global.set("userSig", this.userSig);
      Global.set("nickname", this.nickName || this.userId);
      Global.set("classId", parseInt(this.classId));

      Global.set(
        "userAccount",
        Object.assign(this.userAccount || {}, {
          [this.userid]: null
        })
      );

      elkLog.setGlobalData();
      elkLog.report(elkLog.events.login);

      util.getAppInfo(this.companyId).then(info => {
        this.joinClass();
      });
    },

    joinClass() {
      this.$router.replace(`/class/${Global.companyId}/${this.classId}`);
    },

    getCompanyInfo() {
      util.getAppInfo(this.companyId).then(info => {
        if (Global.company && Global.company[this.companyId]) {
          Global.set("companyId", this.companyId);
          this.$emit("updateLogo", info.icon);
          if (Global.company[this.companyId].sdkappid) {
            Global.set("sdkAppId", Global.company[this.companyId].sdkappid);
          }
          if (Global.company[this.companyId].name !== undefined) {
            this.companyName = Global.company[this.companyId].name;
            this.$emit(
              "updateCompanyName",
              Global.company[this.companyId].name
            );
          }
        } else {
          //
        }
      });
    }
  }
};
</script>

<style scoped lang="less">
</style>