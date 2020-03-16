<template>
  <div class="tic-login">
    <div class="tic-container__main">
      <div class="tic-container__main-inner">
        <!-- 登录弹窗 start-->
        <div class="tic-login">
          <div class="tic-dialog__flex">
            <div class="tic-dialog__img">
              <img src="../../assets/css/img/logo/demo.png" alt />
              <!-- <div class="tic-dialog__img-logo">
                <img src="../../assets/css/img/logo/logo.png" alt />
              </div>-->
            </div>
            <div class="tic-dialog__info">
              <div class="tic-dialog__info_hd">
                <!-- <a href="javascript:;" class="tic-btn">
                  <i class="tic-icon tic-icon-minshow1"></i>
                </a>-->
                <!-- <a href="javascript:;" class="tic-btn">
                    <i class="tic-icon tic-icon-minshow"></i>
                </a>
                <a href="javascript:;" class="tic-btn">
                    <i class="tic-icon tic-icon-dialog-close"></i>
                </a>-->
              </div>
              <div class="tic-dialog__info-body">
                <!-- tab s -->
                <div class="tic-tab">
                  <div class="tic-tab__list">
                    <ul>
                      <li class="actived">互动课堂登录</li>
                    </ul>
                  </div>
                  <div class="tic-tab__content">
                    <ul
                      class="form-list tea-form--vertical tic-login__form"
                      style="padding-bottom:20px"
                    >
                      <li
                        :class="[focusInput === 'classid' ? 'actived' : '', !classid&&submit ? 'error' : '']"
                        @click="clearErrorMsg()"
                      >
                        <label for="classid" class="form-list__name">
                          <span>课堂编号</span>
                        </label>
                        <span class="form-list__text">
                          <input
                            v-model.trim="classid"
                            @keyup.enter="login"
                            @input="clearErrorMsg"
                            type="number"
                            @focus="changeFocus('classid')"
                            class="tic-input"
                            placeholder
                            id="classid"
                            tabindex="0"
                          />
                          <span v-if="!classid&&submit" class="tic-login_tip-text">请输入课堂编号</span>
                        </span>
                      </li>
                      <li
                        :class="[focusInput === 'nickname' ? 'actived' : '', !nickname&&submit ? 'error' : '']"
                        @click="clearErrorMsg()"
                      >
                        <label for="nickname" class="form-list__name">
                          <span>昵称</span>
                        </label>
                        <span class="form-list__text">
                          <input
                            v-model.trim="nickname"
                            @keyup.enter="login"
                            @input="clearErrorMsg"
                            type="text"
                            class="tic-input"
                            @focus="changeFocus('nickname')"
                            placeholder
                            id="nickname"
                            tabindex="0"
                          />
                          <span v-if="!nickname&&submit" class="tic-login_tip-text">请输入昵称</span>
                        </span>
                      </li>
                    </ul>
                    <div class="tic-login__form-checkbox">
                      <!-- <label class="tic-label">
                        <input type="checkbox" class="tic-checkbox"  v-model="rememberPassword">记住密码
                      </label>-->
                      <label class="tic-label" style="vertical-align:top">
                        <input
                          name="demo_name"
                          style="vertical-align:top"
                          type="radio"
                          class="tic-radio"
                          value="demo_landscape"
                          v-model="demo_name"
                        /> 横屏布局
                      </label>
                      <label class="tic-label" style="vertical-align:top">
                        <input
                          name="demo_name"
                          style="vertical-align:top"
                          type="radio"
                          class="tic-radio"
                          value="demo_portrait"
                          v-model="demo_name"
                        /> 竖屏布局
                      </label>
                    </div>
                    <div class="tic-login__form-error_msg" v-if="error_msg">
                      <p>{{ error_msg }}</p>
                    </div>
                    <div class="tic-login__submit">
                      <button @click="login" class="tic-btn">登录</button>
                      <button
                        v-if="devMode || showWebLoginBtn"
                        @click="login(true)"
                        class="tic-btn"
                        style="margin-top:20px"
                      >Web登录</button>
                    </div>
                    <!-- <div class="tic-login__select">
                      <button class="tic-btn" @click="login(true)">进入网页版</button>
                      <button class="tic-btn" @click="login()">进入客户端</button>
                    </div>
                    <div class="tic-dialog__info-ft" @click="changeLoginMethod(true)">
                      <span class="logo-ft-text">账号登录</span>
                    </div>-->
                  </div>
                </div>
                <!-- tab s -->
              </div>
            </div>
          </div>
        </div>
        <!-- 登录弹窗 end-->
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
// import util from "../../util/util";
import Component from "../core/Component";
// import Button from "../widget/ButtonWidget";
import api from "../../request/Api";
import Constant from "../../config/Constant";
import Global from "../../config/Global";
import ElectronProtocolCheck from "../../util/ElectronProtocolCheck";
import MessageBridge from "../../util/MessageBridge";
MessageBridge.platform = "web";

window.axios = axios;
var devMode = /localhost|test\.edu/gim.test(document.domain);

export default {
  extends: Component,

  components: {
    // Button
  },

  props: {},

  data() {
    return {
      demo_name: "demo_portrait",
      version: Constant.VERSION,
      classid: null,
      nickname: Global.nickname,
      error_msg: null,
      showClassId: true,
      devMode: devMode,
      showWebLoginBtn: false,
      focusInput: null,
      submit: false //true：提交表单 false:未提交表单 用于确定“判断表单是否填写完整”的时机
    };
  },

  mounted() {
    console.log(this.$route);

    this.sdkAppId =
      this.$route.params.sdkAppId || Global.sdkAppId || 1400162216;
    this.userid = this.$route.params.userId || Global.userId || null;
    this.classid =
      this.$route.params.classId ||
      (Global.classId && Global.classId < 1000000 ? Global.classId : null) ||
      null;
    if (this.$route.params.userId && this.$route.params.classId) {
      this.login();
    }
    MessageBridge.modal = this.$Modal;
  },

  methods: {
    checkProtocol(succ, error) {
      console.debug(
        `electron url => tc-videochat://tclass/${this.sdkAppId}/${this.classid}?nick=${this.userid}`
      );
      ElectronProtocolCheck(
        `tc-videochat://tclass/${this.sdkAppId}/${this.classid}?nick=${this.userid}`,
        () => {
          console.debug("ElectronProtocolCheck => success");
          if (succ) {
            succ();
            setTimeout(() => {
              this.showWebLoginBtn = true;
            }, 1500);
          }
        },
        () => {
          console.debug("ElectronProtocolCheck => error");
          // 没有该协议，就走web
          if (error) {
            error();
          }
        }
      );
    },
    login(web = false) {
      this.submit = true;
      if (web) {
        this.doLogin();
      } else {
        this.checkProtocol(
          () => {},
          () => {
            this.doLogin();
          }
        );
      }
    },

    initHandler(data) {
      Global.set("sdkAppId", data.sdkappid || data.sdkAppId);
      if (data.user_id || data.userId) {
        Global.set("userId", data.user_id || data.userId);
      }
      if (data.user_token || data.userToken) {
        Global.set("userToken", data.user_token || data.userToken);
      }
      Global.set("userSig", data.user_sig || data.userSig);
      Global.set("nickname", this.nickname);
      Global.set("classId", parseInt(this.classid));

      return api.login({
        user_id: data.user_id || data.userId || Global.userId,
        password: data.user_token || data.userToken || Global.userToken
      });
    },

    afterLogin(data) {
      if (data && data.error_code === 0) {
        Global.set("token", data.token);
        this.$router.push(`/class/${Global.sdkAppId}/${this.classid}`);
      } else {
        this.error_msg = `${data.error_msg} [${data.error_code}]`;
        // Global.clear()
      }
    },

    doLogin() {
      var demoLoginInfo = Global.get("demoLoginInfo");
      var initParam = {
        class_id: parseInt(this.classid),
        nickname: this.nickname,
        demo_name: this.demo_name,
        platform: "Web"
      };
      if (demoLoginInfo && demoLoginInfo.nickname === this.nickname) {
        initParam.user_id = demoLoginInfo.userId;
        Global.set("userToken", demoLoginInfo.userToken);
        Global.set("userId", demoLoginInfo.userId);
      }
      api
        .init(initParam)
        .then(
          res => {
            if (res.data && res.data.error_code === 0) {
              if (res.data.user_id) {
                Global.set("demoLoginInfo", {
                  sdkAppId: res.data.sdkappid,
                  userId: res.data.user_id,
                  userToken: res.data.user_token,
                  userSig: res.data.user_sig,
                  nickname: this.nickname,
                  classId: parseInt(this.classid)
                });
              }
              return this.initHandler(res.data);
            } else {
              this.error_msg = `${res.data.error_msg} [${res.data.error_code}]`;
            }
          },
          error => {
            console.error(error);
          }
        )
        .then(
          res => {
            this.afterLogin(res.data);
          },
          error => {
            console.error(error);
          }
        );
    },

    clearErrorMsg() {
      this.submit = false;
      this.error_msg = null;
    },

    changeFocus(focusInput) {
      this.submit = false;
      this.focusInput = focusInput;
    }
  }
};
</script>

<style scoped lang="less">
.tedu-component-login-wrap {
  width: 100%;
  height: 100%;
}

.tedu-component-login-content {
  position: relative;
  width: 100%;
  height: 100%;

  .login-wrap {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background: rgba(255, 255, 255, 0.5);
    border-radius: 3px;
    padding: 20px 50px 20px 40px;

    .login-text {
      margin: 28px 0 8px;
      font-size: 20px;
      font-weight: bold;
      color: rgba(255, 255, 255, 1);
    }
  }

  .form-item {
    margin-top: 18px;
    display: flex;
    height: 32px;
    line-height: 32px;

    .form-label {
      width: 40px;
      height: 32px;
      line-height: 32px;
      font-size: 12px;
      color: #fff;
      margin-right: 12px;
    }

    .form-widget {
      input {
        width: 246px;
        color: rgba(55, 55, 55, 1);
        font-size: 12px;
        height: 32px;
        line-height: 32px;
        border-radius: 2px;
        background: rgba(255, 255, 255, 0.2);
        padding: 0 14px;
        &:focus {
          background: #fff;
        }
      }
    }
  }

  .login-btn-wrap {
    margin: 26px 0 20px;
  }
}

.tic-login__submit .tic-btn {
  // height: 44px;
  // line-height: 42px;
  // width: 130px;
  font-size: 14px;
}
.tic-label {
  // vertical-align: bottom
}
.ivu-tooltip {
  vertical-align: bottom;
}

.tic-login__form-error_msg {
  font-size: 14px;
  color: rgba(255, 104, 99, 0.9);
  text-align: left;
  margin-top: -21px;
  padding-bottom: 0px;
}
.tic-login__form-error_msg p {
  position: static;
}
</style>