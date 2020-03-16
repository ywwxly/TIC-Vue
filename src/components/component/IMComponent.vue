<template>
  <div class="tic-player__chatroom">
    <div
      ref="msg-scroll"
      class="tic-player__chatroom-bd roll-scroll"
    >
    <ul class="chatroom-msg-list">
      <template v-for="(msg, index) in msgs">
        <MsgComponent
          :key="index"
          :msg="msg"
          :index="index"
        ></MsgComponent>
      </template>
      </ul>
    </div>

  <div class="tic-player__chatroom-ft">
    <a href="javascript:;" v-if="isMaster" class="tic-btn" @click="changeAllStatus('sendMsg')">
      <i :class="`tic-icon ${Global.sendMsgAll ? 'tic-icon-forbidden':'tic-icon-cancel-forbidden'}`" :title="Global.sendMsgAll ? '禁言':'取消禁言'"></i>
    </a>
    <input ref="input" type="text" class="tic-input" placeholder="输入你想说的话"        
     v-model.trim="msgText"
     :readonly="(showMode === 'fullsize' && platform !=='web') ? true : false"
     @click.stop="inputTrigger('click')"
     @focus.stop="inputTrigger('focus')"
     @blur="inputTrigger('blur')"
     @keyup.enter="msgInputEnterKeyup">
    <button class="tic-btn sendmsg"
     @click="sendMsg"
     :disabled="!msgText"
     >发送</button>
  </div>

 </div>
</template>

<script>
import TWebIM from "../core/TWebIM";
import Component from "../core/Component";
import util from "../../util/util";
import MsgComponent from "./IMMsgComponent";
import Vue from "vue";
import Constant from "../../config/Constant";
import MessageBridge from '../../util/MessageBridge.js';
import Global from '../../../src/config/Global'
import Control from '../../request/Control'
import api from '../../request/Api'
import elkLog from '../../request/ELKlog';
import { stringify } from 'querystring';

export default {
  extends: Component,

  components: {
    MsgComponent
  },

  props: {
    platform: {
      type: String,
      default: 'web'
    },
    showMode: {
      type: String,
      default: 'default'
    },
    role: {
      type: String,
      default: ""
    },
    isMaster: {
      type: Boolean,
      default: false
    },
  },

  data() {
    return {
      sdkAppId: null,
      userId: null,
      userSig: null,
      groupId: null,
      msgs: [],
      msgText: null,
      groupMapId: {}
    };
  },

  watch: {
    msgs() {
      this.$nextTick(() => {
        var msgScroll = this.$refs["msg-scroll"];
        msgScroll.scrollTop = msgScroll.scrollHeight;
      });
    }
  },

  mounted() {
    //this.login();
    window.clientUpdateIMmsg = data => {
      // send: msg.getFromAccount(),
      // sendNick: msg.getFromAccountNick(),
      // content: content.getText(),
      // time: msg.getTime()
      console.debug(`[IM] clientUpdateIMmsg => ${ JSON.stringify(data) }`)
      this.msgs.push(data);
    };
    
    // 收到electron系统消息
    // data: {
    //   content: content, // 内容,string
    //   time: timeStamp // 秒级时间戳
    // }
    window.clientUpdateSysMsg = data => {
      console.debug(`[IM] clientUpdateSysMsg => ${ JSON.stringify(data) }`)
      this.showTipMsg(data)
    };

    window.clientSetState = (action, enable) => {
      console.debug(`[IM] clientSetState => ${ JSON.stringify(action)  } ${ JSON.stringify(enable)  }`)
      if(action === 'enable_all_silence'){
        Global.sendMsgAll = !enable
      }
    };
  },

  methods: {
    joinGroup({ sdkAppId, userId, userSig, groupId }, succ, fail) {
      this.sdkAppId = sdkAppId;
      this.userId = userId;
      this.userSig = userSig;
      this.groupId = groupId + "";
      this.login().then(
        () => {
          console.log(`登录成功  sdkAppId => ${sdkAppId}, userId => ${userId}, userSig => ${userSig}, groupId => ${groupId}`);
          elkLog.report(elkLog.events.loginIM,{
            action_info: '登录成功',
          })
          var groupMapId = (this.groupMapId = util.generateGroupId(
            this.groupId
          ));
          Promise.all([
            this.joinChatGroup(groupMapId.chatGroupId),
            this.joinCmdGroup(groupMapId.cmdGroupId)
          ]).then(
            res => {
              succ && succ(res);
              elkLog.report(elkLog.events.joinIMGroup,{
                action_info: '加群成功'
              })
              console.log("加群成功");
            },
            error => {
              fail && fail(error);
              elkLog.report(elkLog.events.joinIMGroup,{
                action_info: '加群失败',
                extra_info: stringify(error),
              })
              console.log("加群失败", error);
            }
          );
        },
        error => {
          fail && fail(error);
          elkLog.report(elkLog.events.loginIM,{
            action_info: '登录失败',
            extra_info: stringify(error),
          })
          console.log("登录失败", error);
        }
      );
    },

    login() {
      var self = this
      return TWebIM.login(
        {
          sdkAppId: this.sdkAppId,
          userId: this.userId,
          userSig: this.userSig,
          userNick: this.userId
        },
        {
          // 链接状态
          onConnNotify() {},

          // 大群
          onBigGroupMsgNotify() {},

          // C2C, 普通群消息
          onMsgNotify: msgs => {
            if (msgs.length) {
              // 如果有消息才处理
              // var chatMsgs = [];
              msgs.forEach(msg => {
                var sess = msg.getSession();
                var msgType = sess.type();
                // 如果是群组消息
                if (msgType === "GROUP") {
                  var groupid = sess.id();
                  // 如果是信令通道群
                  if (groupid == this.groupMapId.cmdGroupId) {
                    var elems = msg.elems;
                    if (elems.length) {
                      if (
                        elems[0].type === "TIMCustomElem" &&
                        elems[0].content.ext === "TXConferenceExt"
                      ) {
                        return;
                      } else if (
                        elems[0].type === "TIMCustomElem" &&
                        elems[0].content.ext === "CONTAINER"
                      ){
                        this.EventBus.$emit("im_receive_container_msg", msg);
                      }else if (
                        elems[0].type === "TIMCustomElem" &&
                        elems[0].content.ext === "CTRL"
                      ){
                        this.EventBus.$emit("im_receive_ctrl_msg", msg);
                      }else if (
                        elems[0].type === "TIMCustomElem" &&
                        elems[0].content.ext === "TXWhiteBoardExt"
                      ) {
                        // var msgDate = new Date(msg.time * 1000);
                        // var nowDate = new Date();
                        // DB.add(
                        //   TICSDKConfig.authData.identifier,
                        //   msg.fromAccount,
                        //   msg.seq,
                        //   `${msgDate.getHours()}:${msgDate.getMinutes()}:${msgDate.getSeconds()}:${msgDate.getMilliseconds()}`,
                        //   `${nowDate.getHours()}:${nowDate.getMinutes()}:${nowDate.getSeconds()}:${nowDate.getMilliseconds()}`
                        // );
                        // event.fire(
                        //   this,
                        //   Constant.EVENT.IM.RECEIVE_BOARD_ROOM_MSG,
                        //   msg
                        // );
                        this.EventBus.$emit("im_receive_board_msg", msg);
                      } else if (
                        elems[0].type === "TIMFileElem" &&
                        elems[0].content.name === "TXWhiteBoardExt"
                      ) {
                        this.EventBus.$emit("im_receive_board_msg", msg);
                        // event.fire(
                        //   this,
                        //   Constant.EVENT.IM.RECEIVE_BOARD_ROOM_MSG,
                        //   msg
                        // );
                      } else {
                        // event.fire(
                        //   this,
                        //   Constant.EVENT.IM.RECEIVE_CHAT_ROOM_MSG,
                        //   msg
                        // );
                      }
                    }
                  } else if (groupid == this.groupMapId.chatGroupId) {
                    // 如果是IM聊天群
                    this.receiveChatMsg(msg);
                  }
                } else {
                  // 如果是C2C消息
                  // event.fire(this, Constant.EVENT.IM.RECEIVE_C2C_MSG, msg);
                }
              });
              // event.fire(this, Constant.EVENT.IM.MSG_NOTIFY, msgs);
            }
          },

          // 账号被踢事件
          onKickedEventCall() {
            console.debug('onKickedEventCall')
            elkLog.report(elkLog.events.onKicked)
            self.$toasted.show("帐号在其他地方登录");
            self.$router.push( Global.loginUrl() );
            Global.clearAuth()
          },

          // 监听 C2C 消息通道的处理
          onC2cEventNotifys: {
            //消息已读通知
            "92": () => {},

            // 多终端互踢
            "96": () => {
              console.debug('onKickedEventCall')
              elkLog.report(elkLog.events.onKicked)
              self.$toasted.show("帐号在其他地方登录");
              self.$router.push( Global.loginUrl() );
              Global.clearAuth()
            }
          }
        }
      );
    },

    joinChatGroup(groupId) {
      return TWebIM.joinGroup(this.userId, groupId);
    },

    joinCmdGroup(groupId) {
      return TWebIM.joinGroup(this.userId, groupId);
    },

    sendC2CTextMessage(msg) {
      TWebIM.sendC2CTextMessage(msg);
    },

    sendC2CTextMessageToUser(userId, msg) {
      TWebIM.sendC2CTextMessage(userId, msg);
    },

    sendGroupTextMessage(msg) {
      TWebIM.sendGroupTextMessage(msg);
    },

    msgInputEnterKeyup() {
      this.sendMsg();
    },

    inputTrigger(status) {
      console.debug('inputTrigger', status)
    },

    blurInput() {
      console.debug('blurInput')
      this.$refs.input.blur()
    },

    sendMsg() {
      if(Global.role === Constant.CLASS_ROLE.TEACHER || (Global.sendMsgAll && Global.sendMsg )) {
        if (Vue.runtimeEnv == Constant.RUNTIME_ENV.BROWSER) {
          this.sendGroupTextMessage(this.msgText);
        } else {
          MessageBridge.platform = this.platform
          if (this.msgText === null || this.msgText.length < 1) {
            MessageBridge.showMessageBox({
                title: '不能发送空消息',
                options: ['确认'],
                callback: () => {
                }
            })
          } else {
            MessageBridge.sendChannel({
              type: Constant.CHANNEL_TYPE.CHAT,
              data: this.msgText
            })
          }

        }
        this.msgText = "";
      }else if(this.platform !== 'electron' && !Global.sendMsgAll){
        this.$toasted.show("全体禁言");
      }else if(this.platform !== 'electron' && !Global.sendMsg){
        this.$toasted.show("你已被禁言");
      }

    },

    // 接收到聊天室消息
    receiveChatMsg(msg) {
      msg.elems.forEach(elem => {
        var content = elem.getContent();
        var type = elem.getType();
        api.getUserInfo({
          user_id: msg.getFromAccount()
        }).then(
          res => {
            //console.log('userinfo',res.data)
            if(res.data.error_code === 0 && res.data.user_info) {
              var nickname = res.data.user_info.nickname
              var icourl = 'https://main.qcloudimg.com/raw/45e1cd2f9378299a093a6ffa3bb8b9fb.svg'  // 默认头像
              if (res.data.user_info.avatar && res.data.user_info.avatar.length>0){
                  icourl = res.data.user_info.avatar
              }
              if (type === "TIMTextElem") {
                elkLog.report(elkLog.events.im_receive_chat_msg, {
                  send: msg.getFromAccount(),
                  sendNick: nickname,
                  content: content.getText(),
                  time: msg.getTime(),
                  isSend: msg.getIsSend(),
                  type: elem.getType()
                })
                this.msgs.push({
                  send: msg.getFromAccount(),
                  sendNick: nickname,
                  content: content.getText(),
                  time: msg.getTime(),
                  isSend: msg.getIsSend(),
                  iconUrl: icourl
                });
              } else if (type === "TIMCustomElem") {
                elkLog.report(elkLog.events.im_receive_chat_msg, {
                  send: msg.getFromAccount(),
                  sendNick: nickname,
                  content: `data: ${content.getData()} desc: ${content.getDesc()} ext: ${content.getExt()}`,
                  time: msg.getTime(),
                  isSend: msg.getIsSend(),
                  type: elem.getType()
                })
                this.msgs.push({
                  send: msg.getFromAccount(),
                  sendNick: nickname,
                  content: `data: ${content.getData()} desc: ${content.getDesc()} ext: ${content.getExt()}`,
                  time: msg.getTime(),
                  isSend: msg.getIsSend(),
                  iconUrl: icourl
                });
              }
            }
          }
        )
      });
    },

    // 展示tip消息
    showTipMsg(data){
      this.msgs.push({
        content: data.content,
        time: data.time,
        type: "tips"
      });
    },

    changeAllStatus(rights){
      switch(rights){
        case "sendMsg": // 取消全体禁言 on_all sendMsg; 全体禁言 off_all sendMsg
          Global.sendMsgAll = !Global.sendMsgAll
          Control.ctlAllStatus((Global.sendMsgAll ? 'on' : 'off') + "_all", rights, Vue.runtimeEnv)
          break
      }
     
    }
  }
};
</script>
