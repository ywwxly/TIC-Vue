<template>
  <!-- 1VN template -->
  <div v-if="layout === Constant.LAYOUT.MULTIPLE" class="tic-number">
    <div v-if="started" class="tic-number__inner">
      <!-- 老师的视频 end-->
      <!-- v-if="isMaster" -->
      <VideoComponent
        v-if="role === Constant.CLASS_ROLE.TEACHER"
        :type="`teacher`"
        ref="local-video-component-ref"
        :userId="userId"
        :stream="localStream"
        :info="localStream && members[localStream.getUserId()]"
        :classname="`bg-teacher`"
        :showController="true"
        @micTap="micTap"
        @cameraTap="cameraTap"
        :permission="permission"
      ></VideoComponent>
      <template v-else>
        <!-- remoteItem.videoType == 2 表示是主流 / 屏幕分享应该走创建容器播放的逻辑 -->
        <template v-if="showMaster">
          <template v-for="(remoteItem) in remoteStreamData">
            <VideoComponent
              v-if="classData.teacher_id === remoteItem.getUserId()"
              :type="`teacher`"
              :key="remoteItem.getUserId()"
              :userId="remoteItem.getUserId()"
              :stream="remoteItem"
              :info="members[remoteItem.getUserId()]"
              :classname="`bg-teacher`"
              :showController="false"
            ></VideoComponent>
          </template>
        </template>
        <template v-else>
          <VideoComponent
            :type="`teacher`"
            :userId="null"
            :stream="null"
            key="teacherPlaceholder"
            :classname="`bg-teacher`"
            :showController="false"
          ></VideoComponent>
        </template>
      </template>
      <!-- 老师的视频 end-->

      <div class="tic-tab--seamless">
        <div class="tic-tab__list">
          <!-- 通过改变left的值实现滑动 -->
          <div class="tic-tab__list-inner" style="left: 0%">
            <!-- sub videos start-->
            <!-- sub item start-->
            <VideoComponent
              v-if="classData.teacher_id !== userId && membersPermissionMap[userId] !== undefined"
              ref="local-video-component-ref"
              :userId="userId"
              :stream="localStream"
              :info="localStream && members[localStream.getUserId()]"
              :classname="`bg-student`"
              @micTap="micTap"
              @cameraTap="cameraTap"
              :showController="true"
              :permission="permission"
            ></VideoComponent>
            <template v-for="(remoteItem) in remoteStreamData">
              <VideoComponent
                v-if="classData.teacher_id !== remoteItem.getUserId() && (remoteItem.getUserId() in membersPermissionMap)"
                :key="remoteItem.getUserId()"
                :userId="remoteItem.getUserId()"
                :stream="remoteItem"
                :info="members[remoteItem.getUserId()]"
                :classname="`bg-student`"
                :showController="false"
              ></VideoComponent>
            </template>
            <template v-for="(userPermissionItem, userPermissionId) in membersPermissionMap">
              <VideoComponent
                v-if="userPermissionId !== userId && !(userPermissionId in remoteStreamData)"
                :key="userPermissionId + 'Placeholder'"
                :userId="userPermissionId"
                :stream="null"
                :info="null"
                :classname="`bg-student`"
                :showController="false"
              ></VideoComponent>
            </template>
            <!-- sub item end-->
            <!-- sub videos end-->
          </div>
        </div>
        <div class="tic-tab__pre" @click="next_video">
          <!-- 禁止：disabled -->
          <a href="javascript:;" class="tic-btn">
            <i class="tic-icon--max tic-icon-pre"></i>
          </a>
        </div>
        <div class="tic-tab__next" @click="prev_video">
          <a href="javascript:;" class="tic-btn">
            <i class="tic-icon--max tic-icon-next"></i>
          </a>
        </div>
      </div>
    </div>
  </div>
  <!-- 1v1 / Public -->
  <div v-else>
    <div v-if="started" style="padding-bottom:20px">
      <!-- 老师的视频 end-->
      <!-- v-if="isMaster" -->
      <VideoComponent
        v-if="role === Constant.CLASS_ROLE.TEACHER"
        :type="`teacher`"
        ref="local-video-component-ref"
        :userId="userId"
        :stream="localStream"
        :info="localStream && members[localStream.getUserId()]"
        :classname="`bg-teacher`"
        :showController="true"
        @micTap="micTap"
        @cameraTap="cameraTap"
        :permission="permission"
      ></VideoComponent>
      <template v-else>
        <!-- remoteItem.videoType == 2 表示是主流 / 屏幕分享应该走创建容器播放的逻辑 -->
        <template v-if="showMaster">
          <template v-for="(remoteItem) in remoteStreamData">
            <VideoComponent
              v-if="classData.teacher_id === remoteItem.getUserId()"
              :type="`teacher`"
              :key="remoteItem.getUserId()"
              :userId="remoteItem.getUserId()"
              :stream="remoteItem"
              :info="members[remoteItem.getUserId()]"
              :classname="`bg-teacher`"
              :showController="false"
            ></VideoComponent>
          </template>
        </template>
        <template v-else>
          <VideoComponent
            :type="`teacher`"
            :userId="null"
            :stream="null"
            key="teacherPlaceholder"
            :classname="`bg-teacher`"
            :showController="false"
          ></VideoComponent>
        </template>
      </template>
      <!-- 老师的视频 end-->
      <!-- sub item start-->
      <VideoComponent
        v-if="classData.teacher_id !== userId && membersPermissionMap[userId] !== undefined"
        ref="local-video-component-ref"
        :userId="userId"
        :stream="localStream"
        :info="localStream && members[localStream.getUserId()]"
        @micTap="micTap"
        @cameraTap="cameraTap"
        :classname="subVideoClass"
        :showController="true"
        :permission="permission"
      ></VideoComponent>
      <template v-for="(remoteItem) in remoteStreamData">
        <VideoComponent
          v-if="classData.teacher_id !== remoteItem.getUserId() && (remoteItem.getUserId() in membersPermissionMap)"
          :key="remoteItem.getUserId()"
          :userId="remoteItem.getUserId()"
          :stream="remoteItem"
          :info="members[remoteItem.getUserId()]"
          :classname="subVideoClass"
          :showController="false"
        ></VideoComponent>
      </template>
      <template v-for="(userPermissionItem, userPermissionId) in membersPermissionMap">
        <VideoComponent
          v-if="userPermissionId !== userId && !(userPermissionId in remoteStreamData)"
          :key="userPermissionId + 'Placeholder'"
          :userId="userPermissionId"
          :stream="null"
          :info="null"
          :classname="subVideoClass"
          :showController="false"
        ></VideoComponent>
      </template>
      <!-- sub item end-->
    </div>
  </div>
</template>

<script>
import TWebRTC from "../core/TWebRTC";
import VideoComponent from "./VideoComponent";
import Component from "../core/Component";
import Global from "../../config/Global";
import MessageBridge from "../../util/MessageBridge.js";
import util from "../../util/util.js";
import Constant from "../../config/Constant";
import elkLog from "../../request/ELKlog";
import TRTC from "trtc-js-sdk";

export default {
  extends: Component,

  components: {
    VideoComponent
  },

  props: {
    members: {
      type: Object,
      default() {
        return {};
      }
    },
    layout: {
      type: Number,
      default: 0
    },
    permission: {
      type: Object,
      default() {
        return {};
      }
    },
    membersPermissionMap : {
      type: Object,
      default() {
        return {};
      }
    }
  },

  computed: {
    subVideoClass() {
      // this.membersPermissionMap 包含 __ob__ 属性
      return Object.getOwnPropertyNames(this.membersPermissionMap).length > 2 ? 'sm-student' : 'bg-student'
    }
  },

  watch: {
    "global.autoPush": function(val) {
      console.debug("global autoPush change ", val);
      elkLog.report(elkLog.events.global_autopush_change, {
        extra_info: "global autoPush change " + val
      });
      if (val) {
        this.previewLocalStream();
      } else {
        // this.stopRTC()
      }
    },
    // members: {
    //   immediate: true,
    //   deep: true,
    //   handler: function (val) {
    //     console.error("##members change in VC")
    //     // console.error(val)
    //   }
    // },
    // membersPermissionMap: {
    //   immediate: true,
    //   handler: function (val, oldVal) { 
    //     console.error("##membersPermissionMap change in VC")
    //     // console.error(val)
    //    },
    //   deep: true
    // },
    // localStream: {
    //   immediate: true,
    //   handler: function (val, oldVal) { 
    //     console.error("##localStream change")
    //     console.error(oldVal)
    //     console.error(val)
    //    },
    //   deep: true
    // }

  },

  data() {
    return {
      autoPush: false, // 是否自动推流
      sdkAppId: null,
      userId: null,
      userSig: null,
      roomId: null,
      showMaster: false,
      started: false,
      classData: null,
      global: Global,
      remoteStreamData: {}, // 远端流
      localStream: null,
      subVideo: 0,
      index: 0,
      scrollLeft: 0,
      role: '',
      rtcRole: 'audience',
      isMaster: false,
      rtcOptions: {
        audio: true,
        video: true,
        attributes: {
          width: 640,
          height: 320,
          bitrate: 400,
          frameRate: 15
        }
      },
      startingFlag: false,
      waitTimer: null,
    };
  },
  mounted() {
    MessageBridge.platform = "web";
    MessageBridge.modal = this.$Modal;
  },
  methods: {
    remoteStreamHandler(event) {
      //订阅远端流
      const remoteStream = event.stream;
      console.log("[trtc] 远端流增加/更新: " + remoteStream.getId());
      // 若需要观看该远端流，则需要订阅它
      this.rtc.subscribe(remoteStream);
      // 若不需要观看该远端流，请取消订阅它，否则SDK会接收远端流数据。
      // client.unsubscribe(remoteStream);
      elkLog.report(elkLog.events.on_remote_stream_update, {
        extra_info: JSON.stringify({ userId: remoteStream.getUserId() })
      });
      if (remoteStream.getUserId() === this.classData.teacher_id) {
        this.showMaster = true;
      }
      console.debug("[trtc] remoteStream.getType()", remoteStream.getType());
      if (remoteStream.getType() === "auxiliary") {
        this.$emit("setAuxStream", remoteStream);
      } else {
        console.debug(
          "[trtc] remote stream set => ",
          remoteStream.getType(),
          remoteStream.getUserId()
        );
        this.$nextTick(() => {
          this.$set(
            this.remoteStreamData,
            remoteStream.getUserId(),
            remoteStream
          );
          console.debug(
            "remoteStream remoteStream",
            remoteStream,
            this.remoteStreamData
          );
        });
      }
    },
    start({ sdkAppId, userId, userSig, groupId, classData ,role, isMaster }, autoPush = false) {
      this.sdkAppId = sdkAppId;
      this.userId = userId;
      this.userSig = userSig;
      this.roomId = groupId;
      this.autoPush = autoPush;
      this.classData = classData;
      this.role = role;
      this.isMaster = isMaster;
      this.started = true;
      this.rtcRole = (this.role === Constant.CLASS_ROLE.TEACHER || this.role === Constant.CLASS_ROLE.ASSISTANT) ? 'anchor' : 'audience'

      this.rtcOptions = {
        audio: true,
        video: true,
        attributes: {
          width: classData.settings.resolution.split("x")[0],
          height: classData.settings.resolution.split("x")[1],
          frameRate: classData.settings.fps,
          bitrate: classData.settings.bitrate
        }
      };

      this.rtc = Global.RTC = TWebRTC.init({
        sdkAppId: this.sdkAppId,
        userId: this.userId,
        userSig: this.userSig
      });

      // util.reportEvent(Global.camera ? "camera_open" : "camera_close");
      // util.reportEvent(Global.mic ? "mic_open" : "mic_close");

      // 'stream-added', 'stream-subscribed', 'stream-updated', 'stream-removed',
      // 'connection-state-changed',
      // 'peer-join', 'peer-leave',
      // 'mute-audio', 'mute-video', 'unmute-audio', 'unmute-video',
      // 'client-banned',
      // 'error',
      // 'player-state-changed',
      // 'screen-sharing-stopped'

      this.rtc.on("stream-added", event => {
        console.debug("[trtc] stream-added", event);
        this.remoteStreamHandler(event);
      });
      this.rtc.on("stream-updated", event => {
        console.debug("[trtc] stream-updated", event);
        this.remoteStreamHandler(event);
      });

      this.rtc.on("stream-subscribed", event => {
        console.debug("[trtc] stream-subscribed", event);
        const remoteStream = event.stream;
        console.log("远端流订阅成功：" + remoteStream.getId(), remoteStream);
      });
      this.rtc.on("stream-removed", event => {
        console.debug("[trtc] stream-removed", event);
        const remoteStream = event.stream;
        console.log(
          `[RTC] onRemoteStreamRemove userId=> ${remoteStream.getUserId()} , videoId=> ${remoteStream.getId()}`
        );
        elkLog.report(elkLog.events.on_remote_stream_remove, {
          extra_info:
            "userId:" +
            remoteStream.getUserId() +
            " videoId:" +
            remoteStream.getId()
        });

        if (remoteStream.getUserId() === this.classData.teacher_id) {
          this.showMaster = false;
        }
        if (remoteStream.getType() === "auxiliary") {
          this.$emit("deleteAuxStream", remoteStream.getId());
        } else {
          this.$delete(this.remoteStreamData, remoteStream.getUserId());
        }
      });

      this.rtc.on("connection-state-changed", event => {
        console.debug(
          "[trtc] connection-state-changed",
          event.prevState,
          event.curState
        );
      });

      this.rtc.on("peer-join", event => {
        console.debug("[trtc] peer-join", event.userId);
      });

      this.rtc.on("peer-leave", event => {
        console.debug("[trtc] peer-leave", event.userId);
      });

      this.rtc.on("peer-leave", event => {
        console.debug("[trtc] peer-leave", event.userId);
      });

      this.rtc.on("mute-audio", event => {
        console.debug("[trtc] mute-audio", event.userId);
      });

      this.rtc.on("unmute-audio", event => {
        console.debug("[trtc] unmute-audio", event.userId);
      });

      this.rtc.on("mute-video", event => {
        console.debug("[trtc] mute-video", event.userId);
      });

      this.rtc.on("unmute-video", event => {
        console.debug("[trtc] unmute-video", event.userId);
      });

      this.rtc.on("client-banned", error => {
        console.error("[trtc] client-banned observed: " + error);
        elkLog.report(elkLog.events.on_rtc_relay_timeout, {
          extra_info: JSON.stringify(error)
        });
        this.$toasted.show("帐号在其他地方登录");
        this.$router.push(Global.loginUrl());
        Global.clearAuth();
      });

      this.rtc.on("error", error => {
        console.error("[trtc] client error observed: " + error);
        const errorCode = error.getCode();
        switch (errorCode) {
          case 10001:
          case 10005:
          case 10006:
            MessageBridge.showMessageBox({
              title: "websocket 初始化失败，是否刷新重连？",
              options: ["确定", "取消"],
              callback: index => {
                if (index === 0) {
                  location.reload();
                }
              }
            });
            break;
          case 10014:
          case 10036:
          case 10041:
          case 10042:
            MessageBridge.showMessageBox({
              title: "音视频连接异常，是否刷新重连？",
              options: ["确定", "取消"],
              callback: index => {
                if (index === 0) {
                  location.reload();
                }
              }
            });
            break;
        }
        elkLog.report(elkLog.events.on_rtc_error_notify, {
          action_result: JSON.stringify(error)
        });
      });
      this.joinRoom();
      return this.rtc;
    },

    joinRoom() {
      TWebRTC.joinRoom(this.roomId, this.rtcRole).then(
        () => {
          console.debug(`[trtc] - joinRoom succ [roomId=>${this.roomId} , rtcRole => ${this.rtcRole}]`);
          if (this.autoPush && (Global.camera || Global.mic)) {
            this.previewLocalStream({
              video: Global.camera,
              audio: Global.mic
            });
          } else {
            // this.stopRTC()
          }
          elkLog.report(elkLog.events.join_rtc_room,{
            extra_info: "[roomId=>${this.roomId} , rtcRole => ${this.rtcRole}]" 
          });
        },
        e => {
          elkLog.report(elkLog.events.join_rtc_room, {
            extra_info: "join_rtc_room error:" + JSON.stringify(e)
          });
          console.error("[trtc] - joinRoom Error");
        }
      );
    },

    checkAvailable(succ, fail) {
      if (this.isMaster) {
        succ();
        return;
      }
      setTimeout(() => {
        var hasTeacher = false;
        for (var a in this.remoteStreamData) {
          if (this.classData.teacher_id === this.remoteStreamData[a].userId) {
            hasTeacher = true;
            break;
          }
        }
        var videoList = this.global.members.filter(item => {
          return item.user_id != this.userId && item.status.camera == 1;
        });
        console.warn(
          `checkAvailable => members count => ${
            videoList.length
          } , streams count => ${Object.keys(this.remoteStreamData).length}`
        );
        if (
          videoList.length >=
          Constant.MAX_VIDEO_COUNT - (hasTeacher ? 0 : 1)
        ) {
          if (fail) {
            fail();
          }
        } else if (
          Object.keys(this.remoteStreamData).length >=
          Constant.MAX_VIDEO_COUNT - (hasTeacher ? 0 : 1)
        ) {
          if (fail) {
            fail();
          }
        } else {
          succ();
        }
      }, 2000);
    },

    checkRTCRoleIsAnchor() {
      if( this.rtcRole === 'anchor' ){
        console.debug('checkRTCRoleIsAnchor rtcRole => anchor')
        elkLog.report(elkLog.events.update_rtc_role, {
          extra_info: 'already anchor'
        })
        return new Promise((resolve, reject) => {
          resolve()
        })
      }else{
        return this.rtc.switchRole('anchor').catch( error => {
          console.error('角色切换失败 ' + error);
        }).then( () => {
          console.debug('update rtcRole => anchor')
          elkLog.report(elkLog.events.update_rtc_role, {
            extra_info: this.rtcRole + ' => anchor'
          })
          this.rtcRole = 'anchor'
        })
      }
    },

    previewLocalStream(opt) {
      console.debug("[trtc] previewLocalStream" + JSON.stringify(opt))
      this.startingFlag = true
      this.checkAvailable(
        () => {
          var object = Object.assign(
            {
              video: Global.camera,
              audio: Global.mic
            },
            opt
          );
          if( this.localStream ){
            this.localStream.close()
          }
          var localStream = TRTC.createStream(object);
          if (this.rtcOptions.attributes) {
            localStream.setVideoProfile(this.rtcOptions.attributes);
          }
          localStream
            .initialize()
            .catch(error => {
              console.error("[trtc] 初始化本地流失败 " + error);
              this.$toasted.error(`打开本地摄像头失败 ${error}`);
              // this.stopWaitTimer()
              this.startingFlag = false
            })
            .then(() => {
              console.debug("[trtc] 初始化本地流成功", localStream);

              this.EventBus.$emit("rtc_localstream_add", localStream);

              if (opt) {
                if (typeof opt.audio !== "undefined") {
                  opt.audio
                    ? localStream.unmuteAudio()
                    : localStream.muteAudio();
                }
                else if (!Global.mic) {
                  localStream.muteAudio();
                }
                if (typeof opt.video !== "undefined") {
                  opt.video
                    ? localStream.unmuteVideo()
                    : localStream.muteVideo();
                }
                else if (!Global.camera) {
                  localStream.muteVideo();
                }
              }
              this.checkRTCRoleIsAnchor().then( () => {
                // if(this.localStream){
                  this.rtc
                    .unpublish(this.localStream)
                    .then(() => {
                      console.debug("[trtc] 取消发布本地流成功 ");
                      this.rtc
                        .publish(localStream)
                        .then(() => {
                          this.localStream = localStream;
                          Global.set('localStream', this.localStream)
                          console.debug("[trtc] 发布本地流成功 ");
                          // this.stopWaitTimer()
                          this.startingFlag = false
                        })
                        .catch(error => {
                          console.error("[trtc] 发布本地流失败 " + error);
                          // this.stopWaitTimer()
                          this.startingFlag = false
                          Global.set('camera', false)
                          Global.set('mic', false)
                          // util.reportEvent("mic_close");
                          // util.reportEvent("camera_close");
                        });
                    }).catch(error => {
                      if(error.getCode() == 4096){ // 无流正在发布
                        console.debug("[trtc] 无正在发布的本地流 ");
                        this.rtc
                          .publish(localStream)
                          .then(() => {
                            this.localStream = localStream;
                            Global.set('localStream', this.localStream)
                            Global.localStream = localStream;
                            console.debug("[trtc] 发布本地流成功");
                            // this.stopWaitTimer()
                            this.startingFlag = false
                          })
                          .catch(error => {
                            console.error("[trtc] 发布本地流失败 " + error);
                            // this.stopWaitTimer()
                            this.startingFlag = false
                            Global.set('camera', false)
                            Global.set('mic', false)
                            // util.reportEvent("mic_close");
                            // util.reportEvent("camera_close");
                          });
                      } else {
                        console.error("[trtc] 取消发布本地流失败 " + error);
                      }
                    });
              })
            });
        },
        () => {
          //超出视频限制
          this.$toasted.error("已达到上麦人数上限");
          // this.stopWaitTimer()
          this.startingFlag = false
          util.reportEvent("mic_close");
          util.reportEvent("camera_close");
        }
      );

    },

    stopRTC() {
      TWebRTC.stopRTC().then(
        () => {
          elkLog.report(elkLog.events.stop_rtc);
        },
        e => {
          console.error("stopRTC Error", e);
          elkLog.report(elkLog.events.stop_rtc, {
            extra_info: "stop_rtc error:" + JSON.stringify(e)
          });
          this.$toasted.error("推流失败");
        }
      );
    },

    updateStream(opt) {
      console.debug("updatestream", opt);
      // TWebRTC.stopRTC({}).then( () => {
      TWebRTC.updateStream(opt).then(
        () => {
          elkLog.report(elkLog.events.update_stream);
        },
        e => {
          console.error("startRTC Error", e);
          elkLog.report(elkLog.events.update_stream, {
            extra_info: "update_stream error:" + JSON.stringify(e)
          });
          this.$toasted.error("推流失败");
        }
      );
      // })
    },
    openAudio() {
      console.debug("openAudio" + JSON.stringify(this.startingFlag))
      if(this.startingFlag && !this.localStream){
        if(this.waitTimer !== null){
          clearInterval(this.waitTimer)
          this.waitTimer = null
        }
        this.waitTimer = setInterval(() => {
          this.openAudio()
        }, 3000);
        return
      } 
      this.stopWaitTimer()

      // if (this.localStream) {
      //   this.localStream.unmuteAudio();
      // } else if (!this.localStream) {
      //   this.rtcOptions.video = true;
      //   this.rtcOptions.audio = true;
        this.previewLocalStream({ audio: true });
      // }
    },
    closeAudio() {
      console.debug("closeAudio" + JSON.stringify(this.startingFlag))
      if(this.startingFlag){
        if(this.waitTimer !== null){
          clearInterval(this.waitTimer)
          this.waitTimer = null
        }
        this.waitTimer = setInterval(() => {
          this.closeAudio()
        }, 3000);
        return
      } 
      this.stopWaitTimer()
      if( (!Global.camera|| !this.permission.camera) && this.localStream){
        this.stopPush()
      } 
      // else if (this.localStream) {
      //   this.localStream.muteAudio();
      // } 
      else {
        // this.rtcOptions.video = true;
        // this.rtcOptions.audio = true;
        this.previewLocalStream({ audio: false });
      }
    },
    openVideo() {
      console.debug("openVideo" + JSON.stringify(this.startingFlag))
      if(this.startingFlag && !this.localStream){
        if(this.waitTimer !== null){
          clearInterval(this.waitTimer)
          this.waitTimer = null
        }
        this.waitTimer = setInterval(() => {
          this.openVideo()
        }, 3000);
        return
      }
      this.stopWaitTimer()
      // if (this.localStream) {
      //   this.localStream.unmuteVideo();
      // } else {
      //   this.rtcOptions.video = true;
      //   this.rtcOptions.audio = true;
        this.previewLocalStream({ video: true });
      // }
    },
    closeVideo() {
      console.debug("closeVideo" + JSON.stringify(this.startingFlag))
      if(this.startingFlag){
        if(this.waitTimer !== null){
          clearInterval(this.waitTimer)
          this.waitTimer = null
        }
        this.waitTimer = setInterval(() => {
          this.closeVideo()
        }, 3000);
        return
      } 
      this.stopWaitTimer()
      if((!Global.mic || !this.permission.mic) && this.localStream){
        this.stopPush()
      } 
      // else if (this.localStream) {
      //   this.localStream.muteVideo();
      // } 
      else {
        // this.rtcOptions.video = true;
        // this.rtcOptions.audio = true;
        this.previewLocalStream({ video: false });
      }
    },

    stopWaitTimer(){
      this.startingFlag = false
      if(this.waitTimer){
        clearInterval(this.waitTimer)
        this.waitTimer = null
      }
    },
    stopPush() {
      console.error("[trtc] stop pushing", this.localStream);
      this.rtc
        .unpublish(this.localStream)
        .then(() => {
          console.debug("[trtc] 取消发布本地流成功 ");
          if(this.localStream) {
            this.localStream.close();
            this.localStream = null;
            if (this.role !== Constant.CLASS_ROLE.TEACHER && this.role !== Constant.CLASS_ROLE.ASSISTANT) {
              
              return this.rtc.switchRole('audience').catch( error => {
                console.error('角色切换失败 ' + error);
              }).then( () => {
                console.debug('update rtcRole => audience')
                elkLog.report(elkLog.events.update_rtc_role, {
                  extra_info: this.rtcRole + ' => audience'
                })
                this.rtcRole = 'audience'
              })
            }
          }
        }).catch(error => {
          console.error("[trtc] 取消发布本地流失败 " + error);
        })

    },
    prev_video() {
      var list = document.querySelector(".tic-tab__list-inner");
      var video = document.querySelectorAll(".tic-number__list.bg-student");
      if (video && video.length == 0) return;

      var videoWidth = list.scrollWidth / video.length;
      var scrollLeft = this.scrollLeft;
      scrollLeft -= videoWidth;
      if (list.clientWidth - scrollLeft > list.scrollWidth) {
        scrollLeft = list.clientWidth - list.scrollWidth;
      }
      console.debug(scrollLeft);
      this.scrollLeft = scrollLeft;
      list.style.transform = "translate(" + this.scrollLeft + "px)";
    },

    next_video() {
      var list = document.querySelector(".tic-tab__list-inner");
      var video = document.querySelectorAll(".tic-number__list.bg-student");
      if (video && video.length == 0) return;

      var videoWidth = list.scrollWidth / video.length;
      var scrollLeft = this.scrollLeft;
      scrollLeft += videoWidth;
      if (scrollLeft > 0) {
        scrollLeft = 0;
      }
      this.scrollLeft = scrollLeft;
      list.style.transform = "translate(" + this.scrollLeft + "px)";
    },

    micTap(status) {
      status ? this.openAudio() : this.closeAudio();
    },

    cameraTap(status) {
      status ? this.openVideo() : this.closeVideo();
    },

    // updatePermission() {
    //   status ? this.openVideo() : this.closeVideo();
    // },
  }
};
</script>

<style scoped lang="less">
.tedu-video-container-wrap {
  height: 130px;
  background: rgba(33, 33, 35, 1);

  .video-arrow {
    height: 100%;
    line-height: 130px;
    width: 44px;
    .arrow-img {
      width: 31px;
      height: 36px;
    }
  }
  .class-video-item {
    margin: 10px 10px 10px 0;
    height: 110px;
    width: calc(4 * 110px / 3);
    border-radius: 2px;
  }
}

.tic-tab__list-inner {
  transition: all 0.5s ease-in-out;
}
</style>