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
              <div class="tic-dialog__info_hd"></div>
              <div class="tic-dialog__info-body">
                <!-- tab s -->
                <div class="tic-tab">
                  <div class="tic-tab__list">
                    <ul>
                      <li :class="[loginWithAcount ? '' : 'actived']">登录</li>
                    </ul>
                  </div>
                  <!-- 帐号登录 -->
                  <div class="tic-tab__content" v-if="loginWithAcount===true">
                    <ul
                      class="form-list tea-form--vertical tic-login__form"
                      @click="clearErrorMsg()"
                    >
                      <li
                        :class="[focusInput === 'companyId' ? 'actived' : '', !companyId&&submit ? 'error' : '']"
                      >
                        <label for="companyId" class="form-list__name">
                          <span>机构编号</span>
                        </label>
                        <span class="form-list__text form-list__mechanism">
                          <input
                            v-model.trim="companyId"
                            @keyup.enter="login"
                            @input="clearErrorMsg()"
                            @focus="changeFocus('companyId')"
                            type="text"
                            class="tic-input"
                            placeholder
                            id="companyId"
                            tabindex="0"
                          />
                          <!-- <span class="mechanism-name">{{ companyName }}</span> -->
                          <span v-if="!companyId&&submit" class="tic-login_tip-text">请输入机构编号</span>
                        </span>
                      </li>
                      <li
                        :class="[focusInput === 'classid' ? 'actived' : '', !classid&&submit ? 'error' : '']"
                      >
                        <label for="classid" class="form-list__name">
                          <span>课堂编号</span>
                        </label>
                        <span class="form-list__text">
                          <input
                            v-model.trim="classid"
                            @keyup.enter="login"
                            @input="clearErrorMsg"
                            @focus="changeFocus('classid')"
                            type="text"
                            class="tic-input"
                            placeholder
                            id="classid"
                            tabindex="0"
                          />
                          <span v-if="!classid&&submit" class="tic-login_tip-text">请输入课堂编号</span>
                        </span>
                      </li>
                      <input name="userid" type="text" class="hidden-input" tabindex="-1" />
                      <li
                        :class="[focusInput === 'userid' ? 'actived' : '', !userid&&submit ? 'error' : '']"
                      >
                        <label for="userid" class="form-list__name">
                          <span>账号</span>
                        </label>
                        <span class="form-list__text">
                          <div :class="['tic-dropdown', showUserList? 'actived' : '']">
                            <div class="tic-dropdown-link">
                              <input
                                v-model.trim="userid"
                                @keyup.enter="login"
                                @input="clearErrorMsg"
                                @focus="changeFocus('userid')"
                                type="text"
                                class="tic-input"
                                placeholder
                                id="userid"
                                name="userid"
                                autocomplete="off"
                                tabindex="0"
                              />
                              <i
                                class="tic-icon tic-icon-drop"
                                v-if="userAccount"
                                @click="showUserList = showUserList ? false : true"
                              ></i>
                            </div>
                            <ul class="tic-filtrate-menu">
                              <li
                                class="tic-filtrate-optgroup"
                                v-for="(value, key) in userAccount"
                                :key="key"
                                @click="chooseUserid(key)"
                              >
                                <a href="javascript:;">{{key}}</a>
                              </li>
                            </ul>
                            <!-- <select class="tic-filtrate-menu" v-model="userid" @focus="changeFocus('userid')">
                              <option class="tic-filtrate-optgroup">请选择</option>
                              <option class="tic-filtrate-optgroup" v-for="(value, key) in userAccount" :key="key">key</option>
                            </select>-->
                          </div>
                          <!-- <input
                            v-else
                            v-model.trim="userid"
                            @keyup.enter="login"
                            @input="clearErrorMsg"
                            @focus="changeFocus('userid')"
                            type="text"
                            class="tic-input"
                            placeholder
                            id="userid"
                            name="userid"
                            autocomplete="off"
                          />-->
                          <span v-if="!userid&&submit" class="tic-login_tip-text">请输入账号</span>
                        </span>
                      </li>
                      <input name="password" type="password" class="hidden-input" tabindex="-1" />
                      <li
                        :class="[focusInput === 'password' ? 'actived' : '', !password&&submit ? 'error' : '']"
                      >
                        <label for="password" class="form-list__name">
                          <span>密码</span>
                        </label>
                        <span class="form-list__text">
                          <input
                            v-if="showPassword"
                            v-model.trim="password"
                            @keyup.enter="login"
                            @input="clearErrorMsg"
                            @focus="changeFocus('password')"
                            type="text"
                            class="tic-input"
                            placeholder
                            id="password"
                            autocomplete="off"
                            tabindex="0"
                          />
                          <input name="password" type="text" class="hidden-input" tabindex="-1" />
                          <input name="password" type="password" class="hidden-input" tabindex="-1" />
                          <input
                            v-if="!showPassword"
                            v-model.trim="password"
                            @keyup.enter="login"
                            @input="clearErrorMsg"
                            @focus="changeFocus('password')"
                            type="password"
                            class="tic-input"
                            placeholder
                            id="password"
                            name="password"
                            autocomplete="off"
                            tabindex="0"
                          />
                          <input name="password" type="password" class="hidden-input" tabindex="-1" />
                          <!-- <span class="tic-login_tip-icon"  @click="changeShowPassword">
                            <a href="javascript:;" :class="['tic-btn', showPassword ? 'actived': '']">
                              <i class="tic-icon--min tic-icon-show"></i>
                            </a>
                          </span>-->
                          <span v-if="!password&&submit" class="tic-login_tip-text">请输入密码</span>
                        </span>
                      </li>
                    </ul>
                    <div class="tic-login__form-checkbox">
                      <label class="tic-label">
                        <input
                          type="checkbox"
                          class="tic-checkbox"
                          v-model="rememberPassword"
                          tabindex="-1"
                        />记住密码
                      </label>
                    </div>
                    <div class="tic-login__select">
                      <button class="tic-btn" @click="login(true)">进入网页版</button>
                      <button class="tic-btn" @click="login()">进入客户端</button>
                    </div>
                    <div class="tic-dialog__info-ft" @click="changeLoginMethod(false)">
                      <span class="logo-ft-text">游客登录</span>
                      <!-- <span class="logo-ft-code">
                        <a href="javascript:;" class="tic-btn">
                          <i class="tic-icon--min tic-icon-code"></i>
                        </a>
                      </span>-->
                    </div>
                  </div>
                  <!-- 游客登录 -->
                  <div class="tic-tab__content" v-if="loginWithAcount===false">
                    <ul
                      class="form-list tea-form--vertical tic-login__form"
                      style="padding-bottom:20px"
                      @click="clearErrorMsg()"
                    >
                      <li
                        :class="[focusInput === 'classid' ? 'actived' : '', !classid&&submit ? 'error' : '']"
                      >
                        <label for="classid" class="form-list__name">
                          <span>课堂编号</span>
                        </label>
                        <span class="form-list__text">
                          <input
                            v-model.trim="classid"
                            @keyup.enter="login"
                            @input="clearErrorMsg"
                            @focus="changeFocus('classid')"
                            type="text"
                            class="tic-input"
                            placeholder
                            id="classid"
                            tabindex="0"
                            disabled
                            style="color:#737882"
                          />
                          <span v-if="!classid&&submit" class="tic-login_tip-text">请输入课堂编号</span>
                        </span>
                      </li>
                      <li
                        :class="[focusInput === 'nickname' ? 'actived' : '', !nickname&&submit ? 'error' : '']"
                      >
                        <label for="nickname" class="form-list__name">
                          <span>昵称</span>
                        </label>
                        <span class="form-list__text">
                          <input
                            v-model.trim="nickname"
                            @keyup.enter="login"
                            @input="clearErrorMsg"
                            @focus="changeFocus('nickname')"
                            type="text"
                            class="tic-input"
                            placeholder
                            id="nickname"
                            tabindex="0"
                          />
                          <span v-if="!nickname&&submit" class="tic-login_tip-text">请输入昵称</span>
                        </span>
                      </li>
                    </ul>
                    <div class="tic-login__select">
                      <button class="tic-btn" @click="login(true)">进入网页版</button>
                      <button class="tic-btn" @click="login()">进入客户端</button>
                    </div>
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
      loginWithAcount: false, // false:游客登录
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
    console.debug(
      `mounted -> browser => ${Browser.browser} , device => ${Browser.device}`
    );
    if ("mobile,tablet".indexOf(Browser.device.toLowerCase()) !== -1) {
      var url = `${location.origin}/index-h5.html${location.hash.replace(
        "class",
        "login"
      )}`;
      console.debug(`redirect to url => ${url}`);
      location.replace(url);
      return;
    }
    this.companyId = this.$route.params.companyId || Global.companyId;
    // 此逻辑移到点击网页登录后
    // if( 'safari,chrome,qqbrowser,sogou'.indexOf(Browser.browser.toLowerCase()) === -1 ){
    //   MessageBridge.showMessageBox({
    //     title: '暂不支持当前浏览器，请使用最新的Chrome浏览器',
    //     options: ['确定'],
    //     callback: (index) => {
    //         location.href = 'https://www.google.com/intl/zh-CN/chrome/'
    //     }
    //   })
    //   return
    // }
    this.sdkAppId = this.$route.params.sdkAppId || Global.sdkAppId;
    this.userid =
      this.$route.params.userId ||
      (Global.guestFlag ? null : Global.userId) ||
      null;
    if (this.userid && this.userid.indexOf("visitor_") !== -1) {
      this.userid = "";
    }
    this.classid = this.$route.params.classId || Global.classId || null;
    this.nickname = this.$route.params.nickname || Global.nickname || null;
    if (this.companyId) {
      util.getAppInfo(this.companyId).then(info => {
        Global.set("companyId", this.companyId);
        Global.set("sdkAppId", Global.company[this.companyId].sdkappid);
        this.$emit("updateLogo", info.icon);
        if (
          Global.company &&
          Global.company[this.companyId] &&
          Global.company[this.companyId].name !== undefined
        ) {
          this.companyName = Global.company[this.companyId].name;
          this.$emit("updateCompanyName", Global.company[this.companyId].name);
        } else {
          this.$emit("updateCompanyName", "互动课堂");
        }
      });
    }

    if (this.$route.params.userToken) {
      for (var a in this.$route.params) {
        if (this.$route.params[a]) {
          Global.set(a, this.$route.params[a]);
        }
      }
      this.password = this.$route.params.userToken;
      this.login(this.$route.params.web ? 1 : 0);
    }

    console.debug(`login mounted => ${JSON.stringify(this.$route.params)}`);
  },

  methods: {
    checkBrowser(succ, error) {
      if (
        "safari,chrome,qqbrowser,sogou".indexOf(
          Browser.browser.toLowerCase()
        ) === -1
      ) {
        if (error) {
          error();
        }
      } else {
        if (succ) {
          succ();
        }
      }
      return;
    },
    selectAppDownloadUrl() {
      if (/macintosh|mac os x/i.test(navigator.userAgent)) {
        return "http://dldir1.qq.com/hudongzhibo/Saas/TClass_Saas.dmg";
      } else if (/windows|win32/i.test(navigator.userAgent)) {
        return "http://dldir1.qq.com/hudongzhibo/Saas/TClass_Setup_Saas.exe";
      }
      return "http://dldir1.qq.com/hudongzhibo/Saas/TClass_Setup_Saas.exe";
    },
    checkProtocol(succ, error) {
      this.message = `tc-videochat://tclass/${this.companyId}/${Global.classId}?user_id=${Global.userId}&user_token=${Global.userToken}&&user_sig=${Global.userSig}`;
      if (!this.loginWithAcount) {
        this.message += `&class_token=${this.classPassword}`;
      }
      // this.$clipboard(this.message)
      console.debug(`electron url => ${this.message}`);
      ElectronProtocolCheck(
        this.message,
        res => {
          if (succ) {
            succ();
            setTimeout(() => {
              this.showWebLoginBtn = true;
            }, 5000);
          }
          elkLog.report(elkLog.events.checkProtocol_SUCC);
        },
        res => {
          // 没有该协议，就不作出反应
          if (error) {
            error();
          }
          elkLog.report(elkLog.events.checkProtocol_FAIL);
        }
      );
    },
    login(web = false) {
      this.getCompanyInfo();
      this.submit = true;
      // 游客登录
      if (this.loginWithAcount === false) {
        if (!this.nickname || !this.classid) {
          //classPassword 房间无密码时不需要填写
          return;
        }

        api
          .guestGetAccount({
            class_id: this.classid,
            nickname: this.nickname
          })
          .then(res => {
            Global.set("companyId", this.companyId);
            Global.set("nickname", this.nickname);
            Global.set("classId", this.classid);
            if (res.data && res.data.error_code === 0) {
              if (res.data.password) {
                this.password = res.data.password || null;
              }
              if (res.data.enterprise_id) {
                this.companyId = res.data.enterprise_id;
                // Global.set('companyId', this.companyId)
              }
              if (res.data.user_id) {
                this.userid = res.data.user_id || null;
              }
              this.token = res.data.token || null;

              return res;
            } else {
              // console.error(res.data.error_code)
              if (res.data.error_code === 10215) {
                this.error_msg = "用户不存在";
              } else if (res.data.error_code === 10216) {
                this.error_msg = "Token过期";
              } else if (res.data.error_code === 10300) {
                this.error_msg = "最多只能提前一个小时进入课堂";
              } else if (res.data.error_code === 10270) {
                this.error_msg = "机构信息不存在";
              } else if (res.data.error_code === 10227) {
                this.error_msg = "课堂人数已达到上限";
              } else if (
                res.data.error_code === 10240 ||
                res.data.error_code === 10202
              ) {
                this.error_msg = "课堂不存在";
              } else {
                this.error_msg = `${res.data.error_msg} [${res.data.error_code}]`;
              }
              this.$toasted.show(`${this.error_msg}`);
              elkLog.report("guest_get_account", {
                action_result: res.data.error_code,
                action_info: res.data.error_msg
              });
            }
          })
          .then(res => {
            if (res) {
              util.getAppInfo(this.companyId).then(info => {
                this.loginHandler(web);
              });
            }
          });
      }
      // 账号登录
      else {
        if (
          !this.companyId ||
          !this.classid ||
          !this.userid ||
          !this.password
        ) {
          return;
        }
        Global.del("classPassword");
        util.getAppInfo(this.companyId).then(info => {
          this.loginHandler(web);
        });
      }
    },

    loginHandler(web = false) {
      var that = this;
      var startLoadTime = util.getUnixTimestamp();
      api
        .login({
          userid: this.userid,
          password: this.password
        })
        .then(
          res => {
            if (res.data && res.data.error_code === 0) {
              Global.set("sdkAppId", res.data.sdkappid);
              if (this.loginWithAcount) {
                if (res.data.user_id) {
                  Global.set("userId", res.data.user_id);
                } else {
                  Global.set("userId", this.userid);
                }
                Global.set("guestFlag", false);
                if (this.rememberPassword) {
                  Global.set("password", this.password);
                  Global.set(
                    "userAccount",
                    Object.assign(this.userAccount || {}, {
                      [this.userid]: this.password
                    })
                  );
                } else {
                  Global.del("password");
                  Global.set(
                    "userAccount",
                    Object.assign(this.userAccount || {}, {
                      [this.userid]: null
                    })
                  );
                }
              } else {
                if (res.data.user_id) {
                  Global.set("userId", res.data.user_id);
                } else {
                  Global.set("userId", this.userid);
                }
                Global.set("guestFlag", false);

                Global.set("guestFlag", true);
                if (this.rememberPassword) {
                  Global.set("classPassword", this.classPassword);
                } else {
                  Global.del("classPassword");
                }
                Global.set("nickname", this.nickname || null);
              }
              if (res.data.user_token) {
                Global.set("userToken", res.data.user_token || this.token);
              } else {
                Global.set("userToken", this.password);
              }
              Global.set("userSig", res.data.user_sig);
              Global.set("nickname", this.nickname || this.userid);
              Global.set("classId", parseInt(this.classid));
              elkLog.setGlobalData();
              elkLog.report(elkLog.events.login);

              return res;
              // if (
              // localStorage.getItem(this.Constant.STORAGE_KEY.DEVICE_DETECT)
              // ) {
              // 设备检测工序完成
              // this.$router.push(`/classlist/`);
              // } else {
              // this.$router.push(`/detect`);
              // }
            } else {
              // console.error(res.data.error_code)
              if (res.data.error_code === 10215) {
                this.error_msg = "用户不存在";
              } else if (res.data.error_code === 10216) {
                this.error_msg = "Token过期";
              } else if (res.data.error_code === 10300) {
                this.error_msg = "最多只能提前一个小时进入课堂";
              } else if (res.data.error_code === 10270) {
                this.error_msg = "机构信息不存在";
              } else if (res.data.error_code === 10227) {
                this.error_msg = "课堂人数已达到上限";
              } else if (res.data.error_code === 10240) {
                this.error_msg = "课堂不存在";
              } else {
                this.error_msg = `${res.data.error_msg} [${res.data.error_code}]`;
              }
              this.$toasted.show(`${this.error_msg}`);
              elkLog.report("login", {
                action_result: res.data.error_code,
                action_info: res.data.error_msg
              });
            }
          },
          error => {
            console.error(error);
          }
        )
        .then(
          res => {
            if (res.data && res.data.error_code === 0) {
              Global.set("token", res.data.token);
              // 点击“网页登录”

              if (web) {
                this.checkBrowser(
                  () => {
                    // 浏览器支持
                    this.$router.push(
                      `/class/${Global.companyId}/${this.classid}`
                    );
                  },
                  () => {
                    // 浏览器不支持
                    this.checkProtocol(
                      () => {
                        // 浏览器不支持，已经安装客户端
                        MessageBridge.showMessageBox({
                          title:
                            "<p>您当前使用的浏览器不支持进入课堂，<b>检测到您已安装客户端，可点击“进入客户端课堂”。</b></br>或更换为Chrome、Safari、QQ、搜狗浏览器。</p>",
                          options: ["进入客户端课堂", "取消"],
                          callback: index => {
                            if (index === 0) {
                              // 再次call Electron进入课堂，避免用户在上次call起时浏览器native弹出框中点击取消
                              this.checkProtocol();
                            }
                          }
                        });
                        return;
                      },
                      () => {
                        // 浏览器不支持，尚未安装客户端
                        MessageBridge.showMessageBox({
                          // title: "<p>您当前使用的浏览器不支持进入课堂，请通过客户端登录或更换浏览器。<br/><br/><a href='" + this.selectAppDownloadUrl() + "' target='_blank'>客户端下载</a>。<br/>可支持的浏览器：Chrome、Safari、QQ、搜狗",
                          title:
                            "<p>您当前使用的浏览器不支持进入课堂，请通过客户端登录或更换浏览器。<br/><br/>可支持的浏览器：Chrome、Safari、QQ、搜狗",
                          options: ["下载客户端", "取消"],
                          callback: index => {
                            if (index === 0) {
                              this.$clipboard(this.message);
                              window.open(this.selectAppDownloadUrl());
                            }
                          }
                        });
                        return;
                      }
                    );
                  }
                );
              } else {
                // 点击“客户端登录”
                this.checkProtocol(
                  () => {
                    // 已经安装客户端，尝试唤起客户端
                  },
                  () => {
                    // 尚未安装客户端
                    MessageBridge.showMessageBox({
                      // title: "<p>您尚未安装互动课堂客户端，请<a href='" +  this.selectAppDownloadUrl()  + "' @click='clipboard' target='_blank'>下载</a>并安装后登录。</p>",
                      title:
                        "<p>您尚未安装互动课堂客户端，请下载并安装后登录。</p>",
                      options: ["下载客户端", "取消"],
                      callback: index => {
                        if (index === 0) {
                          this.$clipboard(this.message);
                          window.open(this.selectAppDownloadUrl());
                        }
                      }
                    });
                  }
                );
              }
            } else {
              this.error_msg = `${res.data.error_msg} [${res.data.error_code}]`;
              this.$toasted.show(`${this.error_msg}`);
              this.$router.push(Global.loginUrl());
            }
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
      this.focusInput = focusInput;
    },

    // changeShowPassword(){
    //   this.showPassword = this.showPassword ? false : true
    // },

    changeLoginMethod(loginWithAcount) {
      this.loginWithAcount = loginWithAcount;
      this.submit = false;
    },

    chooseUserid(key) {
      this.showUserList = false;
      this.userid = key;
      this.password = this.userAccount[key] || null;
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
.hidden-input {
  position: absolute !important;
  left: -3000px !important;
}
</style>