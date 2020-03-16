<template>
  <div id="class-app">
    <NormalLayout
      v-if="classInited && classVideoType === Constant.CLASS_VIDEO_TYPE.TRTC && layout === Constant.LAYOUT.MULTIPLE"
      :topHeight="176"
      :bottomHeight="0"
    >
      <template v-slot:top>
        <HeaderComponent
          :logo="logo"
          :companyName="companyName"
          :class_id="classData.class_id"
          :title="classData.class_topic"
          :classInfo="classData"
          :members="classMemberMap"
          :isMaster="isMaster"
          :role="role"
          @setClass="setClass"
          @logout="logout"
          ref="hc-ref"
        ></HeaderComponent>
      </template>
      <template v-slot:center>
        <!-- 视频区域 start -->
        <VideoContainer
          :layout="layout"
          ref="video-ref"
          :members="classMemberMap"
          :membersPermissionMap="membersPermissionMap"
          @setAuxStream="setAuxStream"
          @deleteAuxStream="deleteAuxStream"
          :permission="permission"
        ></VideoContainer>
        <!-- 视频区域 end -->
        <!-- 主视图 start -->
        <div
          ref="tic-player"
          :class="`tic-player ${boardMode === 'fullsize' ? 'fullsize' : ''} ${showMode==='fullsize' ? 'tic-player--full':''}  ${videoMode==='fullsize' ? 'hideVideo':''}`"
        >
          <!-- 白板区域 start -->
          <div class="tic-player__box">
            <!--课程播放信息 start  -->
            <div class="tic-player__course tic-data-player">
              <div class="tic-data-player-box" :style="playerBoxStyle">
                <div class="tic-player__course-inner">
                  <SaasScreenComponent ref="container-ref">
                    <div class="white-board-wrapper" ref="white-board-wrapper-ref">
                      <BoardComponent ref="board-ref" @boardDataChange="boardDataChange"></BoardComponent>
                    </div>
                  </SaasScreenComponent>
                </div>
                <!-- 默认白板区域 start -->
                <div ref="tic-default-board" class="tic-default_board__box"></div>
                <!-- 默认白板区域 end -->
              </div>
              <!-- 收缩按钮  start -->
              <div
                v-if="renderIMComponent"
                :class="`toggle-sidebar ${showMode==='fullsize'?'actived':''}`"
                @click="updateShowMode()"
              >
                <i
                  class="tic-icon--max tic-icon-toggle"
                  :title="showMode==='fullsize'?'打开聊天窗口':'隐藏聊天窗口'"
                ></i>
              </div>
              <!-- 收缩按钮 end -->
              <div
                :class="`toggle-board ${boardMode==='fullsize'?'':'maximum'}`"
                @click="updateBoardMode()"
              >
                <i
                  class="tic-icon--max tic-board-toggle"
                  :title="boardMode==='fullsize'?'恢复':'全屏白板窗口'"
                ></i>
              </div>
            </div>
            <!-- 课程播放信息 end -->

            <!-- 工具栏 start -->
            <BoardToolsComponent
              v-if="(Global.role === Constant.CLASS_ROLE.TEACHER || Global.draw) && classData.class_status === Constant.CLASS_STATUS.ING"
              :direction="direction"
              :isMaster="isMaster"
            ></BoardToolsComponent>
            <!-- 工具栏 end -->
          </div>
          <!-- 白板区域 end -->
          <!-- 聊天室 start -->
          <IMComponent
            v-if="renderIMComponent"
            ref="im-ref"
            :isMaster="isMaster"
            :platform="platform"
            :showMode="showMode"
            :role="role"
          ></IMComponent>
          <!-- 聊天室 end -->
        </div>
        <!-- 主视图 end -->
      </template>
    </NormalLayout>

    <!-- --------- -->
    <!-- 直播课 -->
    <!-- --------- -->
    <NormalLayout
      v-else-if="classInited && classVideoType === Constant.CLASS_VIDEO_TYPE.LIVE"
      :topHeight="38"
      :bottomHeight="0"
    >
      <template v-slot:top>
        <HeaderComponent
          :logo="logo"
          :companyName="companyName"
          :class_id="classData.class_id"
          :title="classData.class_topic"
          :classInfo="classData"
          :role="role"
          :isMaster="isMaster"
          :members="classMemberMap"
          @setClass="setClass"
          @logout="logout"
          ref="hc-ref"
        ></HeaderComponent>
      </template>
      <template v-slot:center>
        <!-- 主视图 start -->
        <div
          ref="tic-player"
          :class="`single-player ${boardMode === 'fullsize' ? 'fullsize' : ''} ${showMode==='fullsize' ? 'tic-player--full':''} `"
        >
          <!-- 白板区域 start -->
          <div class="tic-player__box">
            <!--课程播放信息 start  -->
            <div class="tic-player__course tic-data-player">
              <!-- <div class="tic-data-player-box" :style="playerBoxStyle"> -->
              <!-- <div class="tic-player__course-inner"> -->
              <iframe :src="`/player/#/${classData.live_url.replace('rtmp://', 'webrtc://')}`"></iframe>
              <!-- </div> -->
              <!-- </div> -->
            </div>
            <!-- 课程播放信息 end -->
            <div
              :class="`toggle-board ${boardMode==='fullsize'?'':'maximum'}`"
              @click="updateBoardMode()"
            >
              <i
                class="tic-icon--max tic-board-toggle"
                :title="boardMode==='fullsize'?'恢复':'全屏白板窗口'"
              ></i>
            </div>
          </div>
          <!-- 白板区域 end -->
          <div class="single-player__side">
            <div class="single-player__side-inner">
              <div class="single-player__number">
                <!-- 视频区域 end -->
                <IMComponent
                  v-if="renderIMComponent"
                  ref="im-ref"
                  :platform="platform"
                  :showMode="showMode"
                ></IMComponent>
              </div>
            </div>
          </div>
        </div>
        <!-- 主视图 end -->
      </template>
    </NormalLayout>

    <!-- --------- -->
    <!-- 大班课/1V1 -->
    <!-- --------- -->
    <NormalLayout v-else-if="classInited" :topHeight="38" :bottomHeight="0">
      <template v-slot:top>
        <HeaderComponent
          :logo="logo"
          :companyName="companyName"
          :class_id="classData.class_id"
          :title="classData.class_topic"
          :classInfo="classData"
          :role="role"
          :isMaster="isMaster"
          :members="classMemberMap"
          @setClass="setClass"
          @logout="logout"
          ref="hc-ref"
        ></HeaderComponent>
      </template>
      <template v-slot:center>
        <!-- 视频区域 start -->
        <!-- 视频区域 end -->
        <!-- 主视图 start -->
        <div
          ref="tic-player"
          :class="`single-player ${boardMode === 'fullsize' ? 'fullsize' : ''} ${showMode==='fullsize' ? 'tic-player--full':''} `"
        >
          <!-- 白板区域 start -->
          <div class="tic-player__box">
            <!--课程播放信息 start  -->
            <div class="tic-player__course tic-data-player">
              <div class="tic-data-player-box" :style="playerBoxStyle">
                <div class="tic-player__course-inner">
                  <SaasScreenComponent ref="container-ref">
                    <div class="white-board-wrapper" ref="white-board-wrapper-ref">
                      <BoardComponent ref="board-ref" @boardDataChange="boardDataChange"></BoardComponent>
                    </div>
                  </SaasScreenComponent>
                </div>
                <!-- 默认白板区域 start -->
                <div ref="tic-default-board" class="tic-default_board__box"></div>
                <!-- 默认白板区域 end -->
              </div>
            </div>
            <!-- 课程播放信息 end -->

            <!-- <div :class="`toggle-board ${boardMode==='fullsize'?'':'maximum'}`" @click="updateBoardMode()" >
              <i class="tic-icon--max tic-board-toggle" :title="boardMode==='fullsize'?'恢复':'全屏白板窗口'" ></i>
            </div>-->
            <!-- 工具栏 start -->
            <BoardToolsComponent
              v-if="(Global.role === Constant.CLASS_ROLE.TEACHER || global.draw) && classData.class_status === Constant.CLASS_STATUS.ING"
              :direction="direction"
              :isMaster="isMaster"
            ></BoardToolsComponent>
            <!-- 工具栏 end -->
          </div>
          <!-- 白板区域 end -->
          <div class="single-player__side">
            <div class="single-player__side-inner">
              <div class="single-player__number">
                <!-- 视频区域 start -->
                <VideoContainer
                  :layout="layout"
                  ref="video-ref"
                  :members="classMemberMap"
                  :membersPermissionMap="membersPermissionMap"
                  @setAuxStream="setAuxStream"
                  @deleteAuxStream="deleteAuxStream"
                  :permission="permission"
                ></VideoContainer>
                <!-- 视频区域 end -->
                <IMComponent
                  :isMaster="isMaster"
                  v-if="renderIMComponent"
                  ref="im-ref"
                  :platform="platform"
                  :showMode="showMode"
                ></IMComponent>
              </div>
            </div>
            <!-- 聊天室 start -->
            <!-- <IMComponent v-if="renderIMComponent" ref="im-ref" :platform="platform" :showMode="showMode"></IMComponent> -->
            <!-- 聊天室 end -->
          </div>
        </div>
        <!-- 主视图 end -->
      </template>
    </NormalLayout>

    <div v-show="showScreenShare" class="screenshare" ref="screenshare_video">
      <!-- <video ref="screenshare_video" autoplay muted></video> -->
    </div>
  </div>
</template>
<script>
import NormalLayout from "./components/layout/NormalLayout";
import BoardToolsComponent from "./components/component/BoardToolsComponent";
import BoardComponent from "./components/component/BoardComponent";
import SaasScreenComponent from "./components/component/SaasScreenComponent";
import IMComponent from "./components/component/IMComponent";

import VideoContainer from "./components/component/VideoContainer";
import HeaderComponent from "./components/component/HeaderComponent";

import MessageBridge from "./util/MessageBridge.js";
import util from "./util/util.js";
import Constant from "./config/Constant";
import Global from "./config/Global";
import Container from "./util/container.min.js";
import Toolbar from "./util/toolbar.min.js";

import Browser from "./util/browser";
import api from "./request/Api";
import control from "./request/Control";
import Heartbeat from "./request/Heartbeat";
import Request from "./request/Request";
import TWebIM from "./components/core/TWebIM";
import EventBus from "./components/core/Event.js";
import keycode from "keycode";
import elkLog from "./request/ELKlog";
export default {
  name: "app",
  components: {
    NormalLayout,
    BoardToolsComponent,
    IMComponent,
    BoardComponent,
    SaasScreenComponent,
    VideoContainer,
    HeaderComponent
  },

  data() {
    return {
      global: Global,
      logo: null,
      sdkAppId: null,
      userId: null,
      userSig: null,
      token: null,
      classId: null,
      platform: null,
      role: null, //角色 ，老师/学生/助教等 Constants.CLASS_ROLE
      isMaster: false, //是否具备操作权限 / 白板/上麦/用户列表查看等
      showBoardTools: false,
      heartbeatTask: null, // 定时上报任务
      heartbeatTaskFailCount: 0, // 定时上报任务
      whiteBoard: null,
      documentTab: {
        tabs: [],
        tab: "#DEFAULT"
      },
      classData: {
        class_id: "",
        class_topic: "",
        role: ""
      },
      layout: 0, // 1表示 1路/2路视频的布局， 2表示6路视频 （原大班课/1V1布局）
      classVideoType: "", // 表示课堂类型 live （原直播大班课）   trtc (1v1/1vN/大班课)
      paginationData: {
        total: 0,
        current: 0
      },
      // 课堂的实时成员-数组结构
      classMemberList: [],
      // 课堂的实时成员-Map结构
      classMemberMap: {},
      // 课堂有权限成员列表
      // membersPermissionList: [],
      membersPermissionMap: {},
      permission: {
        mic: undefined,
        camera: undefined
      },
      resizeSTO: null,
      showMode: localStorage.getItem(Constant.MessageBoxStatus) || "default",
      boardMode: localStorage.getItem(Constant.BoardBoxStatus) || "default",
      videoMode: localStorage.getItem(Constant.VideoBoxStatus) || "",
      direction: "ltr",
      remoteStreamData: {},
      videoNodeId: null,
      hideVideoTask: null,
      playerBoxHeight: null,
      playerBoxWidth: null,
      renderIMComponent: true,
      classInited: false,
      ratio: "218:100",
      companyName: "互动课堂",
      sender_nickname: null,
      historyStatus: {
        history_silence: null,
        history_enable_draw: null
      },
      showScreenShare: false,
      heartbeat: null,
      request: null
    };
  },

  watch: {
    logo: function(val) {
      var link =
        document.querySelector("link[rel*='icon']") ||
        document.createElement("link");
      link.type = "image/x-icon";
      link.rel = "shortcut icon";
      link.href = val;
      document.getElementsByTagName("head")[0].appendChild(link);
    },
    "global.draw"(val) {
      this.setRole(val ? "master" : "client");
    },
    "permission.mic": {
      immediate: true,
      handler: function(val, oldVal) {
        if (val !== undefined) {
          Global.set("mic", Boolean(val));
          if (val) {
            if (this.$refs["video-ref"]) {
              this.$toasted.show("老师允许你打开麦克风");
              this.$refs["video-ref"].openAudio();
            }
          } else {
            if (this.$refs["video-ref"]) {
              this.$toasted.show("老师禁止你打开麦克风");
              this.$refs["video-ref"].closeAudio();
            }
          }
        }
      }
    },
    "permission.camera": {
      immediate: true,
      handler: function(val, oldVal) {
        if (val !== undefined) {
          Global.set("camera", Boolean(val));
          if (val) {
            if (this.$refs["video-ref"]) {
              this.$toasted.show("老师允许你打开摄像头");
              this.$refs["video-ref"].openVideo();
            }
          } else {
            if (this.$refs["video-ref"]) {
              this.$toasted.show("老师禁止你打开摄像头");
              this.$refs["video-ref"].closeVideo();
            }
          }
        }
      }
    },
    "Global.hasInteract": {
      immediate: true,
      handler(val) {
        this.startWebRTC();
        console.debug(
          "watch Global.hasInteract" + JSON.stringify(Global.hasInteract)
        );
      }
    }
  },

  computed: {
    playerBoxStyle() {
      var inh = this.playerBoxHeight;
      var inw = this.playerBoxWidth;
      var width = this.ratio.split(":")[0];
      var height = this.ratio.split(":")[1];
      var fi = inw / inh - width / height;
      var css = "";
      if (fi > 0) {
        css = `
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom:0;
          margin: auto;
          height: 100%;
          width: ${(inh * width) / height + "px"};
        `;
      } else if (fi < 0) {
        css = `
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom:0;
          margin: auto;
          width: 100%;
          height: ${(inw * height) / width + "px"};
        `;
      } else {
        css = `
          height: 100%;
          width: 100%;
        `;
      }
      return css;
    }
  },

  created() {
    MessageBridge.platform = this.platform =
      this.$route.params.platform || "web";
    MessageBridge.modal = this.$Modal;
    this.request = new Request();
  },
  beforeMount() {
    if (!Global.hasInteract) {
      MessageBridge.showMessageBox({
        title: "成功进入课堂",
        options: ["确定"],
        callback: () => {
          Global.hasInteract = true;
        }
      });
    }
  },
  mounted() {
    console.debug(
      `mouted -> browser => ${Browser.browser} , device => ${Browser.device}`
    );
    if (
      typeof window.Config === "undefined" &&
      "mobile,tablet".indexOf(Browser.device.toLowerCase()) !== -1
    ) {
      var url = `${location.origin}/index-h5.html${location.hash.replace(
        "class",
        "login"
      )}`;
      console.debug(`redirect to url => ${url}`);
      location.replace(url);
      return;
    }
    if (
      "safari,chrome,qqbrowser,sogou".indexOf(Browser.browser.toLowerCase()) ===
      -1
    ) {
      MessageBridge.showMessageBox({
        title: "暂不支持当前浏览器，请使用最新的Chrome浏览器",
        options: ["确定"],
        callback: () => {
          location.href = "https://www.google.com/intl/zh-CN/chrome/";
        }
      });
      return;
    }
    console.log(this.$route);

    for (var a in this.$route.params) {
      if (this.$route.params[a]) {
        Global.set(a, this.$route.params[a]);
      }
    }
    if (window.Config && window.Config.companyId) {
      if (window.Config.logo) {
        this.logo = window.Config.logo;
      }
      Global.set("companyId", window.Config.companyId);
    }

    if (Global.companyId) {
      util.getAppInfo(Global.companyId).then(info => {
        this.logo = info.icon;
        if (
          Global.company &&
          Global.company[Global.companyId] &&
          Global.company[Global.companyId].name
        ) {
          this.companyName = Global.company[Global.companyId].name;
        } else {
          this.companyName = "互动课堂";
        }
        document.title = this.companyName;

        if (window.Config) {
          this.login().then(() => {
            this.joinClass(() => {
              this.joinIMGroup();
              this.heartbeat = new Heartbeat({
                classId: Global.classId,
                request: this.request,
                data: {
                  ClientVersion: Constant.VERSION,
                  Platform: "web",
                  HeartbeatList: [
                    {
                      BusinessType: "saas",
                      Submodule: "",
                      CustomData: {}
                    },
                    {
                      BusinessType: "saas",
                      Submodule: "classing",
                      CustomData: {
                        user_id: Global.userId,
                        class_id: Global.classId,
                        token: Global.token,
                        class_video_type: this.classVideoType,
                        resolution: this.classData.settings.resolution
                      }
                    }
                  ]
                }
              });
              this.heartbeat.start();
              this.resize();
            });
          });
        } else {
          this.joinClass(() => {
            this.joinIMGroup();
            this.heartbeat = new Heartbeat({
              classId: Global.classId,
              request: this.request,
              data: {
                ClientVersion: Constant.VERSION,
                Platform: "web",
                HeartbeatList: [
                  {
                    BusinessType: "saas",
                    Submodule: "",
                    CustomData: {
                      RoomId: Global.classId
                    }
                  },
                  {
                    BusinessType: "saas",
                    Submodule: "classing",
                    CustomData: {
                      user_id: Global.userId,
                      class_id: Global.classId,
                      token: Global.token,
                      class_video_type: this.classVideoType,
                      resolution: this.classData.settings.resolution
                    }
                  }
                ]
              }
            });
            this.heartbeat.start();
            this.resize();
          });
        }
      });
      window.removeEventListener("resize", this.resize);
      window.addEventListener("resize", this.resize);
    } else {
      console.error("lack of companyId");
      this.$toasted.show("机构信息不存在");
      this.$router.push(Global.loginUrl());
    }
  },
  beforeDestroy() {
    MessageBridge.modal.remove();
    if (this.heartbeat) {
      this.heartbeat.destroy();
    }
    EventBus.$off();
    // EventBus.$off(Constant.EVENT.IM.SEND_CHAT_MSG_EMPTY_MSG_ERROR)
    // EventBus.$off('ctrl_command_emit')
    // EventBus.$off('im_receive_ctrl_msg')

    if (this.rtcinstance) {
      this.rtcinstance.leave();
    }
    if (this.whiteBoard) {
      this.whiteBoard.off();
      this.whiteBoard = null;
    }

    TWebIM.logout();
  },

  methods: {
    resize() {
      var that = this;
      var box = document.querySelector(".tic-data-player");
      if (box) {
        that.playerBoxWidth = box.clientWidth;
        that.playerBoxHeight = box.clientHeight;
      }
    },
    start() {
      elkLog.report(elkLog.events.start_class);
      this.showBoardTools = true;
    },

    pause() {
      this.showBoardTools = false;
    },

    end() {
      this.showBoardTools = false;
    },

    setRole(role) {
      elkLog.report(elkLog.events.set_role, {
        extra_info: "set role => " + role
      });
      this.global.draw = role === "master" ? true : false;
      if (this.whiteBoard !== null) {
        this.whiteBoard.setDrawEnable(role === "master" ? true : false);
        this.ctn.setType(role);
        this.ctn.getNodes().forEach(item => {
          if (item.toolbar) {
            item.toolbar.setRole(role);
          }
        });
      }
    },
    renderIM() {
      this.renderIMComponent = true;
    },

    updateShowMode() {
      this.showMode = this.showMode === "fullsize" ? "" : "fullsize";
      elkLog.report(elkLog.events.update_show_mode, {
        extra_info: "newShowMode:" + this.showMode
      });
      localStorage.setItem(
        Constant.MessageBoxStatus,
        this.showMode || "default"
      ),
        (this.direction = this.showMode === "fullsize" ? "rtl" : "ltr");
      clearTimeout(this.resizeSTO);
      this.resizeSTO = setTimeout(() => {
        if (this.$refs["board-ref"]) {
          try {
            this.$refs["board-ref"].resize();
          } catch (e) {
            console.error(e);
          }
        }
      }, 250);
    },
    updateBoardMode() {
      this.boardMode = this.boardMode === "fullsize" ? "" : "fullsize";
      elkLog.report(elkLog.events.update_show_mode, {
        extra_info: "newBoardMode:" + this.boardMode
      });
      localStorage.setItem(
        Constant.BoardBoxStatus,
        this.boardMode || "default"
      ),
        (this.direction = this.boardMode === "fullsize" ? "rtl" : "ltr");
      clearTimeout(this.resizeSTO);
      this.resizeSTO = setTimeout(() => {
        if (this.$refs["board-ref"]) {
          try {
            this.$refs["board-ref"].resize();
          } catch (e) {
            console.error(e);
          }
        }
      }, 250);
    },
    detectDevice() {
      this.$refs["detect-module-module"].show();
    },

    joinIMGroup() {
      var imComponent = this.$refs["im-ref"];
      if (imComponent) {
        imComponent.joinGroup(
          {
            sdkAppId: Global.sdkAppId,
            userId: Global.userId,
            userSig: Global.userSig,
            groupId: Global.classId
          },
          () => {
            // if(this.layout === Constant.LAYOUT.SINGLE){
            try {
              control.ctlSendJoinExit("join");
            } catch (error) {
              console.error(error);
            }
            // }
          },
          error => {
            console.error(error);
            this.quitClass();
          }
        );
      }
    },

    startWebRTC() {
      if (Global.hasInteract) {
        this.getClassMembers();
        if (this.$refs["video-ref"]) {
          this.rtcinstance = this.$refs["video-ref"].start(
            {
              sdkAppId: Global.sdkAppId,
              userId: Global.userId,
              userSig: Global.userSig,
              groupId: Global.classId,
              classData: this.classData,
              role: this.role,
              isMaster: this.isMaster
            },
            Global.autoPush,
            Global.camera,
            Global.mic
          );

          elkLog.report(elkLog.events.start_rtc, {
            // 与VideoContainer.vue中的start_rtc区分
            extra_info: "start_rtc in class view"
          });
        }
      }
    },
    getNode(fid, file = null) {
      if (fid === "#DEFAULT") return;
      var node = null;
      if (this.ctn) {
        node = this.ctn.getNode(fid);
        console.debug("node", node);
      }
      var isWhiteBoard = file && file.fid === file.title;
      var title = isWhiteBoard
        ? "互动白板" +
          this.whiteBoard.getFileInfoList().filter(item => {
            return item.fid === item.title;
          }).length
        : file.title;
      if (file.type === 2) {
        title = file.title || "视频播放器";
      }

      var width = 640;
      var height = 480;

      var splits = [];

      if (file && file.ratio && !isWhiteBoard) {
        var clientHeight = this.$refs["container-ref"].$el.clientHeight;
        clientHeight *= 0.8;
        splits = file.ratio.split(":");
        width = parseInt(((clientHeight - 70) * splits[0]) / splits[1]);
        height = clientHeight;
      } else {
        splits = this.ratio.split(":");
        width = parseInt(((height - 30) * splits[0]) / splits[1]);
        console.error("height2", height);
      }
      if (!node) {
        var node_count = Object.keys(this.ctn.getNodes()).length;
        var max_count_each_row = 10;
        node = this.ctn.createNode({
          id: fid,
          title: title,
          type:
            file.type === 2 ? Container.Type.Player : Container.Type.Whiteboard,
          width: `${width}px`,
          height: isWhiteBoard ? `${height + 40}px` : `${height}px`,
          left: `${parseInt(node_count / max_count_each_row) * 100 +
            (node_count % max_count_each_row) * 30}px`,
          top: `${(node_count % max_count_each_row) * 30}px`,
          background: "#212224",
          borderRadius: "4px",
          titleBarCss: {
            background: "#212224",
            color: "#8A9099"
          }
        });
        if (file.downloadURL) {
          node.maximum();
        }
      }

      if (node && !node.toolbar && file.type !== 2) {
        this.addToolbar(fid, node);
      }
      elkLog.report(elkLog.events.get_node, {
        extra_info: `node: ${node.id}`
      });
      return node;
    },

    addToolbar(fid, node) {
      if (node) {
        var file = this.whiteBoard.getFileInfo(fid);
        console.debug("[addToolbar]", fid, file, {
          total: file.pageCount,
          current: file.currentPageIndex + 1
        });
        var currentBoard = this.whiteBoard.getFileBoardList(fid)[
          file.currentPageIndex
        ];
        node.toolbar = new Toolbar({
          scale: this.whiteBoard.getBoardScale(currentBoard),
          type: "normal",
          total: file.pageCount,
          role: this.isMaster || this.global.draw ? "master" : "viewer",
          // role: (Global.role === Constant.CLASS_ROLE.TEACHER || this.global.draw) ? 'master' :'viewer',
          current: file.currentPageIndex + 1
        });
        elkLog.report(elkLog.events.add_toolbar, {
          extra_info: `toolbar: ${JSON.stringify(node.toolbar)}`
        });
        node.toolbar.on("next", () => {
          elkLog.report(elkLog.events.on_toolbar_next, {
            extra_info: `totalPage: ${
              file.pageCount
            } pageBeforeAction:${file.currentPageIndex +
              1} toolbarAfterAction: ${JSON.stringify(
              node.toolbar
            )}  fileInfoBeforeAction: ${JSON.stringify(file)}`
          });
          this.whiteBoard.switchFile(fid);
          this.whiteBoard.nextBoard();
        });
        node.toolbar.on("play", () => {
          elkLog.report(elkLog.events.on_toolbar_play);
          this.whiteBoard.switchFile(fid);
          this.whiteBoard.nextBoard();
        });
        node.toolbar.on("prev", () => {
          elkLog.report(elkLog.events.on_toolbar_prev, {
            extra_info: `totalPage: ${
              file.pageCount
            } pageBeforeAction:${file.currentPageIndex +
              1} toolbarAfterAction: ${JSON.stringify(
              node.toolbar
            )}  fileInfoBeforeAction: ${JSON.stringify(file)}`
          });
          this.whiteBoard.switchFile(fid);
          this.whiteBoard.prevBoard();
        });
        node.toolbar.on("minimize", scale => {
          this.whiteBoard.switchFile(fid);
          console.debug("scale - minimize", scale);
          elkLog.report(elkLog.events.on_toolbar_minimize, {
            extra_info: `scale: ${JSON.stringify(
              scale
            )} fileInfoBeforeAction: ${JSON.stringify(file)}`
          });
          this.whiteBoard.setFileScale(fid, scale);
          if (scale === 100) {
            this.whiteBoard.setToolType(
              TEduBoard.TOOL_TYPE.TEDU_BOARD_TOOL_TYPE_MOUSE
            );
          }
        });
        node.toolbar.on("maximum", scale => {
          this.whiteBoard.switchFile(fid);
          console.debug("scale - maximum", scale);
          elkLog.report(elkLog.events.on_toolbar_maximum, {
            extra_info: `scale: ${JSON.stringify(
              scale
            )} fileInfoBeforeAction: ${JSON.stringify(file)}`
          });
          this.whiteBoard.setFileScale(fid, scale);
        });
        node.toolbar.on("toolrevoke", () => {
          this.whiteBoard.switchFile(fid);
          console.debug("toolrevoke");
          elkLog.report(elkLog.events.on_toolbar_toolrevoke, {
            extra_info: `fileInfoBeforeAction: ${JSON.stringify(file)}`
          });
          this.whiteBoard.undo();
        });
        node.toolbar.on("toolrecovery", () => {
          this.whiteBoard.switchFile(fid);
          console.debug("toolrecovery");
          elkLog.report(elkLog.events.on_toolbar_toolrecovery, {
            extra_info: `fileInfoBeforeAction: ${JSON.stringify(file)}`
          });
          this.whiteBoard.redo();
        });
        node.toolbar.on("toolrecovery", () => {
          this.whiteBoard.switchFile(fid);
          console.debug("toolrecovery");
          this.whiteBoard.set;
        });
        node.toolbar.on("tooldrag", active => {
          elkLog.report(elkLog.events.on_toolbar_tooldrag, {
            extra_info: `active: ${JSON.stringify(
              active
            )} fileInfoBeforeAction: ${JSON.stringify(file)}`
          });
          this.whiteBoard.switchFile(fid);
          if (active) {
            this.whiteBoard.setToolType(12);
          } else {
            this.whiteBoard.setToolType(
              TEduBoard.TOOL_TYPE.TEDU_BOARD_TOOL_TYPE_MOUSE
            );
          }
        });
        node.toolbar.on("tooldel", () => {
          MessageBridge.showMessageBox({
            title: "清空白板数据将不能恢复，您确定要清空白板数据吗？",
            options: ["清空", "取消"],
            callback: index => {
              if (index === 0) {
                elkLog.report(elkLog.events.on_toolbar_tooldel, {
                  extra_info: `fileInfoBeforeAction: ${JSON.stringify(file)}`
                });
                this.whiteBoard.switchFile(fid);
                this.whiteBoard.clear();
              }
            }
          });
        });
        node.$elem.appendChild(node.toolbar.$elem);
      }
    },

    renderBoard(opts = {}) {
      var whiteBoard = (this.whiteBoard = this.$refs["board-ref"].start({
        sdkAppId: Global.sdkAppId,
        userId: Global.userId,
        userSig: Global.userSig,
        groupId: Global.classId,
        platform: "web",
        opts: opts
      }));
      elkLog.report(elkLog.events.start_board, {
        extra_info: `opts: ${JSON.stringify(opts)}`
      });

      document.addEventListener("mousedown", () => {
        //容器以外点击，释放容器的激活态
        this.ctn.freeze();
      });
      document.addEventListener("keydown", e => {
        var key = keycode(e);
        if (["left", "right", "space"].indexOf(key) === -1) {
          return;
        }
        var fid = this.ctn.activatedId;
        if (!fid) {
          return;
        }
        var node = this.getNode(fid, whiteBoard.getFileInfo(fid));
        if (node) {
          whiteBoard.switchFile(fid);
          elkLog.report(elkLog.events.board_switch_file, {
            extra_info: `fid: ${JSON.stringify(
              fid
            )} whiteBoard.getTextInputStatus: ${JSON.stringify(
              whiteBoard.getTextInputStatus()
            )} `
          });
          switch (key) {
            case "left":
              elkLog.report(elkLog.events.on_board_keydown_left, {
                extra_info: `whiteBoard.getTextInputStatus: ${JSON.stringify(
                  whiteBoard.getTextInputStatus()
                )} toolbarBeforeAction: ${JSON.stringify(node.toolbar)} `
              });
              if (whiteBoard.getTextInputStatus() === 0) {
                whiteBoard.prevBoard();
              }
              break;
            case "right":
              elkLog.report(elkLog.events.on_board_keydown_right, {
                extra_info: `whiteBoard.getTextInputStatus: ${JSON.stringify(
                  whiteBoard.getTextInputStatus()
                )} toolbarBeforeAction: ${JSON.stringify(node.toolbar)} `
              });
              if (whiteBoard.getTextInputStatus() === 0) {
                whiteBoard.nextBoard();
              }
              break;
            case "space":
              elkLog.report(elkLog.events.on_board_keydown_space, {
                extra_info: `whiteBoard.getTextInputStatus: ${JSON.stringify(
                  whiteBoard.getTextInputStatus()
                )} toolbarBeforeAction: ${JSON.stringify(node.toolbar)} `
              });
              if (whiteBoard.getTextInputStatus() === 0) {
                whiteBoard.nextBoard();
              }
              break;
            default:
              break;
          }
        }
      });
      //新增白板视图
      whiteBoard.on("TEB_ADDVIEW", data => {
        var fid = data.fid;
        var view = data.view;
        elkLog.report(elkLog.events.on_teb_addview, {
          extra_info: `node id: ${fid} view:${view}`
        });
        // 学生隐藏播放器管理控制条
        if (!this.isMaster) {
          view.showVideoControl(false);
          view.setSyncVideoStatusEnable(false);
        }
        if (fid === "#DEFAULT") {
          if (this.$refs["tic-default-board"]) {
            view.renderTo(this.$refs["tic-default-board"]);
          }
        } else {
          var node = this.getNode(fid, whiteBoard.getFileInfo(fid));
          if (node) {
            node.on("*", (e, data) => {
              node.bindedEvent = true;
              console.debug(
                `node id: ${fid} event emit [${e}] and data [${data}]`
              );
              elkLog.report(elkLog.events.on_node_emit, {
                extra_info: `node id: ${fid} event emit: [${e}] data:[${data}]`
              });
              switch (e) {
                case "activate":
                  console.debug("[node] activate", fid);
                  break;
                case "freeze":
                  console.debug("[node] freeze", fid);
                  break;
                case "remove":
                  console.debug("[node] delete file", fid);
                  whiteBoard.deleteFile(fid);
                  break;
                case "show":
                case "resize":
                case "restore":
                case "maximum":
                case "toTop":
                case "keepTop":
                  console.debug(`node=> event =>${e}`, "resize");
                  whiteBoard.resize();
                  break;
                case "close":
                  if (document.domain.indexOf("localhost") !== -1) {
                    node.remove();
                    return;
                  }
                  MessageBridge.showMessageBox({
                    title: "关闭后数据将不能恢复，您确定要关闭吗？",
                    options: ["确认关闭", "取消"],
                    callback: index => {
                      if (index === 0) {
                        node.remove();
                      }
                    }
                  });
                  break;
                default:
                  break;
              }
            });

            setTimeout(() => {
              console.debug("view.renderTo", view.renderTo, node.$content);
              view.renderTo(node.$content);
            }, 150);
          } else {
            //补充一下删除逻辑
            console.debug("[node] recall delete file", fid);
            elkLog.report(elkLog.events.on_node_del, {
              extra_info: `node id: ${fid}`
            });
            whiteBoard.deleteFile(fid);
          }
        }
      });

      //删除白板视图
      whiteBoard.on("TEB_DELETEVIEW", data => {
        console.debug("[board] delete view notify ", data);
        elkLog.report(elkLog.events.on_teb_delview, {
          extra_info: `data: ${JSON.stringify(data)}`
        });
      });

      //白板放大缩小的同步
      whiteBoard.on("TEB_ZOOM_DRAG_STATUS", data => {
        console.debug("[board] zoom drag status ", data);
        elkLog.report(elkLog.events.on_teb_zoom_drag_status, {
          extra_info: `data: ${JSON.stringify(data)}`
        });
        var fid = data.fid;
        var file = whiteBoard.getFileInfo(fid);
        var node = this.getNode(fid, file);
        if (node && node.toolbar) {
          setTimeout(() => {
            node.toolbar.updateScale(whiteBoard.getFileScale(fid));
          }, 100);
        }
      });

      //当前激活的白板
      whiteBoard.on("TEB_ONACTIVE", data => {
        if (!data) return;
      });

      whiteBoard.on("TEB_ERROR", data => {
        console.debug("[board] TEB_ERROR ", data);
        elkLog.report(elkLog.events.on_teb_error, {
          extra_info: `data: ${JSON.stringify(data)}`
        });
        if (data) {
          var title = null;
          switch (data) {
            case 1:
              title = "白板初始化失败";
              break;
            case 2:
              title = "白板服务鉴权失败，请先购买服务 ";
              break;
            case 3:
              title = "白板文件加载失败";
              break;
            case 6:
              title = "同步白板历史数据失败";
              break;
            case 7:
              title = "白板运行内部错误 ";
              break;
            default:
              break;
          }
          if (title) {
            MessageBridge.showMessageBox({
              title: title,
              options: ["确认"],
              callback: () => {}
            });
          }
        }
      });
      whiteBoard.on("TEB_WARNING", data => {
        console.debug("[board] TEB_WARNING ", data);
        elkLog.report(elkLog.events.on_teb_warning, {
          extra_info: `data: ${JSON.stringify(data)}`
        });
        if (data) {
          switch (data) {
            case 1:
              break;
            case 3:
              MessageBridge.showMessageBox({
                title: "同一个文件只能添加一次",
                options: ["确认"],
                callback: () => {}
              });
              break;
            default:
              break;
          }
        }
      });
    },

    boardDataChange(data) {
      var fid = data.currentFile;
      var file = this.whiteBoard.getFileInfo(fid);
      console.debug(`boardDataChange fid => ${fid}`, data);
      elkLog.report(elkLog.events.board_data_change, {
        extra_info: `fid: ${fid} data: ${JSON.stringify(data)} file: ${
          file ? file : ""
        }`
      });
      if (file) {
        // var node = this.ctn.getNode(fid)
        var node = this.getNode(fid, file);
        if (node && node.toolbar) {
          setTimeout(() => {
            node.toolbar.updateScale(this.whiteBoard.getFileScale(fid));
          }, 100);
          node.toolbar.updatePage({
            current: file.currentPageIndex + 1,
            total: file.pageCount
          });
        }
      }
    },

    switchFile(fid) {
      this.$refs["board-ref"].switchFile(fid);
    },

    deleteFile(fid) {
      this.$refs["board-ref"].deleteFile(fid);
    },

    prevPageTap() {
      this.$refs["board-ref"].prevPage();
    },

    nextPageTap() {
      this.$refs["board-ref"].nextPage();
    },

    joinClass(succ, fail) {
      util.getAppInfo(Global.companyId).then(() => {
        this.joinClassHandler(succ, fail);
      });
    },

    // 进入demo课堂
    joinClassHandler(succ, fail) {
      api
        .joinClass({
          class_id: Global.classId * 1,
          password: Global.classPassword || "" //课堂密码，角色为老师时不需要此参数
          // status: {
          //   camera: 1,
          //   mic: 1,
          //   speaker: 1
          // }
        })
        .then(
          res => {
            console.debug(`joinClass with res =>${JSON.stringify(res.data)}`);
            if (res.data && res.data.error_code === 0) {
              this.role = res.data.role;
              this.isMaster =
                this.role === Constant.CLASS_ROLE.TEACHER ||
                this.role === Constant.CLASS_ROLE.ASSISTANT
                  ? true
                  : false;
              Global.set("role", this.role);

              this.changePermission(res.data.member_permission_list);
              this.permission.mic =
                this.role === Constant.CLASS_ROLE.TEACHER
                  ? true
                  : this.permission.mic;
              this.permission.camera =
                this.role === Constant.CLASS_ROLE.TEACHER
                  ? true
                  : this.permission.camera;
              this.historyStatus.history_silence =
                res.data.history_silence === -1 ? 0 : res.data.history_silence;
              this.historyStatus.history_enable_draw =
                res.data.history_enable_draw === -1
                  ? 0
                  : res.data.history_enable_draw;

              if (!this.isMaster) {
                Global.set(
                  "sendMsg",
                  this.historyStatus.history_silence ? false : true
                );
                api.reportEvent({
                  class_id: Global.classId,
                  event: this.historyStatus.history_silence
                    ? "slience"
                    : "del_slience"
                });
                Global.set(
                  "draw",
                  this.historyStatus.history_enable_draw ? true : false
                );
                api.reportEvent({
                  class_id: Global.classId,
                  event: this.historyStatus.history_enable_draw
                    ? "enable_draw"
                    : "disable_draw"
                });
              } else {
                Global.set("sendMsg", true);
                api.reportEvent({
                  class_id: Global.classId,
                  event: "del_slience"
                });
                Global.set("draw", false);
                api.reportEvent({
                  class_id: Global.classId,
                  event: "disable_draw"
                });
              }
              elkLog.report(elkLog.events.join_class_succ, {
                action_result: res.data.error_code,
                extra_info: `res =>${JSON.stringify(res.data)}`
              });
              return api.getClassDetailInfo({
                class_id: Global.classId
              });
            } else {
              elkLog.report(elkLog.events.join_class_fail, {
                action_result: res.data.error_code,
                extra_info: `res =>${JSON.stringify(res.data)}`
              });

              if (res.data.error_code === 10202) {
                this.$toasted.show("课堂已经结束");
              } else if (res.data.error_code === 10240) {
                this.$toasted.show("课堂不存在");
              } else if (res.data.error_code === 10226) {
                this.$toasted.show("你不在成员列表中，请联系课程老师");
              } else if (res.data.error_code === 10000) {
                // ?
              } else if (res.data.error_code === 10215) {
                this.$toasted.show("用户不存在");
              } else if (res.data.error_code === 10216) {
                this.$toasted.show("Token过期");
              } else if (res.data.error_code === 10300) {
                this.$toasted.show("最多只能提前一个小时进入课堂");
              } else if (res.data.error_code === 10270) {
                this.$toasted.show("机构信息不存在");
              } else if (res.data.error_code === 10227) {
                this.$toasted.show("课堂人数已达到上限");
              } else if (res.data.error_code === 10240) {
                this.$toasted.show("课堂不存在");
              } else {
                // 其他
                this.$toasted.show(res.data.error_msg);
              }
              // this.$router.push( Global.loginUrl() );
              if (Global.userId && Global.userId.indexOf("visitor_") === 0) {
                Global.clearAuth();
                this.$router.push("/demo");
              } else {
                Global.clearAuth();
                this.$router.push(Global.loginUrl());
              }
            }
          },
          error => {
            elkLog.report(elkLog.events.join_class_fail, {
              extra_info: `error =>${JSON.stringify(error)}`
            });
            if (fail) {
              fail();
            }
          }
        )
        .then(res => {
          if (res && res.data) {
            this.classData = res.data;
            if (this.classData.settings.layout === Constant.LAYOUT.SINGLE) {
              this.ratio = "4:3";
            }
            // 兼容老接口
            if (!this.classData.class_video_type) {
              // 1vN 就用多人布局， 其他用单/双路布局
              this.classData.settings.layout =
                this.classData.class_type === "1vN"
                  ? Constant.LAYOUT.MULTIPLE
                  : Constant.LAYOUT.SINGLE;
              // 直播课就透传，否则就是实时课
              this.classData.class_video_type =
                this.classData.class_type === Constant.CLASS_VIDEO_TYPE.LIVE
                  ? Constant.CLASS_VIDEO_TYPE.LIVE
                  : Constant.CLASS_VIDEO_TYPE.TRTC;
            }

            this.layout = this.classData.settings.layout;
            this.classVideoType = this.classData.class_video_type;
            if (
              this.classVideoType === Constant.CLASS_VIDEO_TYPE.LIVE &&
              this.role === Constant.CLASS_ROLE.TEACHER
            ) {
              MessageBridge.showMessageBox({
                title:
                  "直播大班课不支持教师角色使用Web端上课，请使用客户端登录",
                options: ["确定"],
                callback: () => {
                  this.$router.push(Global.loginUrl());
                }
              });
              return;
            }
            elkLog.report(elkLog.events.get_class_info, {
              action_result: res.data.error_code,
              extra_info: `res =>${JSON.stringify(res.data)}`
            });
            //test code start
            // this.classType = '1v1'
            // this.ratio = '4:3'
            //test code end

            this.classInited = true;
            this.$nextTick(() => {
              if (this.classData.class_status === Constant.CLASS_STATUS.ING) {
                this.showBoardTools = true;
              }
              Global.set("mic", this.permission.mic);
              Global.set("camera", this.permission.camera);
              if (this.classData.settings.enable_all_silence === 0) {
                Global.set("sendMsgAll", true);
              } else {
                Global.set("sendMsgAll", false);
              }
              if (
                this.classData.class_video_type !==
                Constant.CLASS_VIDEO_TYPE.LIVE
              ) {
                this.renderContainer();
              }
              if (succ) {
                succ();
              }

              // 签到功能后进逻辑
              if (this.classData.current_check_in_id) {
                this.showCheckin(this.classData.current_check_in_id);
              }

              // 答题卡功能后进逻辑
              if (this.classData.current_question_id) {
                if (Global.role === Constant.CLASS_ROLE.TEACHER) {
                  // 老师后进，取消答题
                  this.endQuestion(
                    "cancel_question",
                    this.classData.current_question_id
                  );
                } else if (Global.role === Constant.CLASS_ROLE.STUDENT) {
                  // 学生后进，展示答题
                  this.showAnswerer(this.classData.current_question_id);
                }
              }
            });
          }
        })
        .catch(e => {
          console.error(e);
          elkLog.report(elkLog.events.join_class, {
            extra_info: `error =>${JSON.stringify(e)}`
          });
        });
    },

    renderContainer() {
      var dom = this.$refs["container-ref"];

      window.container = this.ctn = new Container(dom.$el, {
        sdkappid: Global.sdkAppId,
        type: this.isMaster ? "master" : "client",
        enableCloseConfirm: true,
        service: {
          enable: true,
          user_id: Global.userId,
          class_id: Global.classId,
          user_sig: Global.userSig
        },
        sendMsgFunc: data => {
          console.log(`[container sendmsg] => ${JSON.stringify(data)}`, data);
          elkLog.report(elkLog.events.im_send_container_msg, {
            extra_info: JSON.stringify(data)
          });
          TWebIM.sendContainerCustomMessage(data);
        }
      });

      this.ctn.on("inited", () => {
        console.debug(`container inited`);
        elkLog.report(elkLog.events.container_inited);
      });
      this.ctn.on("loaded", info => {
        console.debug(`container loaded => ${JSON.stringify(info)}`);
        elkLog.report(elkLog.events.container_loaded, {
          extra_info: JSON.stringify(info)
        });
      });
      this.ctn.on("error", info => {
        this.$toasted.error(`容器服务异常 => ${JSON.stringify(info)}`);
        console.error(`container error => ${JSON.stringify(info)}`);
        elkLog.report(elkLog.events.container_error, {
          extra_info: JSON.stringify(info)
        });
      });

      this.detectVideoNode();
      this.hideVideoNode();
      this.initContainerEvent();
      this.initControlEvent();

      this.$nextTick(() => {
        this.renderBoard({
          ratio: this.ratio,
          drawEnable:
            Global.role === Constant.CLASS_ROLE.TEACHER || Global.draw,
          boardContentFitMode: 2,
          globalBackgroundColor: "#1a1b1d",
          toolType: 0,
          textColor: "#ffffff",
          brushColor: "#ffffff"
        });
      });
      //初始化默认白板容器
      //为默认白板容器添加默认白板
      //创建一个白板容器，添加一个新的默认白板

      //加载RTC
      this.startWebRTC();
    },
    initContainerEvent() {
      // 接收到容器消息
      EventBus.$on("im_receive_container_msg", msg => {
        elkLog.report(elkLog.events.on_im_receive_container_msg, {
          extra_info: `${(msg && msg.toHtml && msg.toHtml()) || ""}`
        });
        console.debug(
          `im_receive_container_msg => ${(msg && msg.toHtml && msg.toHtml()) ||
            ""}`,
          msg
        );
        var elems = msg.elems;
        elems.forEach(elem => {
          // 自定义消息 && 是白板的自定义消息
          if (
            elem.type === "TIMCustomElem" &&
            elem.content.ext === "CONTAINER" &&
            msg.getFromAccount() != Global.userId
          ) {
            try {
              this.ctn.notify(elem.content.data);
            } catch (error) {
              console.error(error);
            }
          }
        });
      });
    },

    initControlEvent() {
      //接收控制信息
      EventBus.$on("im_receive_ctrl_msg", msg => {
        elkLog.report(elkLog.events.on_im_receive_ctrl_msg, {
          extra_info: `${(msg && msg.toHtml && msg.toHtml()) || ""}`
        });
        console.debug(
          `im_receive_ctrl_msg => ${(msg && msg.toHtml && msg.toHtml()) || ""}`,
          msg
        );
        var elems = msg.elems;
        elems.forEach(elem => {
          if (
            elem.type === "TIMCustomElem" &&
            elem.content.ext === "CTRL"
            // && msg.getFromAccount() != Global.userId
          ) {
            try {
              control.ctlProcessCmd(elem.content.data, this);
            } catch (error) {
              console.error(error);
            }
          }
        });
      });

      EventBus.$on("ctrl_command_emit", msg => {
        elkLog.report(elkLog.events.on_ctrl_command_emit, {
          extra_info: `${(msg && msg.toHtml && msg.toHtml()) ||
            ""} action => ${(msg && msg.action) || ""}`
        });
        console.debug(
          `ctrl_command_emit => ${(msg && msg.toHtml && msg.toHtml()) || ""} $`,
          msg
        );
        switch (msg.action) {
          case "class_begin":
            this.$toasted.show("开始上课");
            this.classData.class_status = "ing";
            break;
          case "class_end":
            this.$toasted.show("课程结束");
            this.classData.class_status = "end";
            if (this.rtcinstance) {
              this.rtcinstance.leave();
            }
            MessageBridge.showMessageBox({
              title: "课程已结束",
              options: ["确定"],
              callback: () => {
                this.$router.push(Global.loginUrl());
              }
            });
            break;
          case "kickoff":
            this.$toasted.show("您已被移出课堂");
            this.$router.push(Global.loginUrl());
            this.quitClass();
            break;
          case "mutemsg":
            this.$toasted.show("你已被禁言");
            break;
          case "unmutemsg":
            this.$toasted.show("你已被解除禁言");
            break;
          case "mutemsg_all":
            this.$toasted.show("全体禁言");
            break;
          case "unmutemsg_all":
            this.$toasted.show("取消全体禁言");
            break;
          case "mic_open":
            if (this.$refs["video-ref"]) {
              this.$toasted.show("老师打开了你的麦克风");
              this.$refs["video-ref"].openAudio();
            }
            break;
          case "mic_close":
            if (this.$refs["video-ref"]) {
              this.$toasted.show("老师关闭了你的麦克风");
              this.$refs["video-ref"].closeAudio();
            }
            break;
          case "camera_open":
            if (this.$refs["video-ref"]) {
              this.$toasted.show("老师打开了你的摄像头");
              this.$refs["video-ref"].openVideo();
            }
            break;
          case "camera_close":
            if (this.$refs["video-ref"]) {
              this.$toasted.show("老师关闭了你的摄像头");
              this.$refs["video-ref"].closeVideo();
            }
            break;
          case "draw_open":
            this.$toasted.show("老师允许你进行白板操作");
            break;
          case "draw_close":
            this.$toasted.show("老师取消了你的白板操作权限");
            break;
          case "student_hand_up": // 通知老师，有人举手
            this.$toasted.show("有学生举手");
            this.$refs["hc-ref"].notifyHandUp();
            break;
          case "hand_down": // 通知学生，取消举手
            this.$refs["hc-ref"].setHand("down");
            break;
          case "student_hand_down": // 通知老师有人取消举手
            this.isStudentUp();
            break;
          case "change_member_permission": // 成员权限更新
            this.changePermission(msg.objectId);
            this.getClassMembers();
            break;
          case "join":
            api
              .getUserInfo({
                user_id: msg.sender
              })
              .then(res => {
                if (res.data.error_code === 0 && res.data.user_info) {
                  this.sender_nickname = res.data.user_info.nickname;
                  // this.$toasted.show(`${this.sender_nickname}加入课堂`);
                  this.$refs["im-ref"].showTipMsg({
                    content: `${this.sender_nickname}加入课堂`,
                    time: util.getUnixTimestamp()
                  });
                }
              });
            break;
          case "exit":
            api
              .getUserInfo({
                user_id: msg.sender
              })
              .then(res => {
                if (res.data.error_code === 0 && res.data.user_info) {
                  this.sender_nickname = res.data.user_info.nickname;
                  // this.$toasted.show(`${this.sender_nickname}离开课堂`);
                  this.$refs["im-ref"].showTipMsg({
                    content: `${this.sender_nickname}离开课堂`,
                    time: util.getUnixTimestamp()
                  });
                }
              });
            break;
          case "show_check_in": // 开始签到
            this.$refs["hc-ref"].showToolboxDialog("checkin", "show", msg);
            break;
          case "hide_check_in": // 隐藏签到
            this.$refs["hc-ref"].showToolboxDialog("checkin", "hide", msg);
            break;
          case "show_question": // 开始答题
            this.$refs["hc-ref"].showToolboxDialog("answerer", "show", msg);
            break;
          case "cancel_question": // 老师取消答题
            this.$refs["hc-ref"].showToolboxDialog("answerer", "hide", msg);
            break;
          case "timeout_question": // 超时取消答题
            this.$refs["hc-ref"].showToolboxDialog("answerer", "hide", msg);
            break;
          case "member_out_limit":
            this.$toasted.show("已达到上麦人数上限");
            this.$refs["hc-ref"].$refs["userlist-ref"].refresh();
            break;
          default:
            break;
        }
      });
      //消息收发
      EventBus.$on(Constant.EVENT.IM.SEND_CHAT_MSG_SUCC, msg => {
        console.debug("send msg succ.");
        elkLog.report(elkLog.events.on_send_chat_msg_succ, {
          extra_info: JSON.stringify(msg)
        });
      });
      EventBus.$on(Constant.EVENT.IM.SEND_CHAT_MSG_ERROR, msg => {
        console.error(Constant.EVENT.IM.SEND_CHAT_MSG_ERROR, msg);
        elkLog.report(elkLog.events.on_send_chat_msg_error, {
          extra_info: JSON.stringify(msg)
        });
        this.$toasted.error("发送消息失败，请降低发送频率稍后再试");
      });
      EventBus.$on(Constant.EVENT.IM.SEND_CHAT_MSG_EMPTY_MSG_ERROR, msg => {
        console.error(Constant.EVENT.IM.SEND_CHAT_MSG_EMPTY_MSG_ERROR, msg);
        elkLog.report(elkLog.events.on_send_chat_msg_empty_msg_error, {
          extra_info: JSON.stringify(msg)
        });
        this.$toasted.error("不能发送空消息");
      });
      EventBus.$on(Constant.EVENT.IM.SEND_CHAT_MAX_LENGTH_MSG_ERROR, msg => {
        console.error(Constant.EVENT.IM.SEND_CHAT_MAX_LENGTH_MSG_ERROR, msg);
        elkLog.report(elkLog.events.on_send_chat_max_length_mag_error, {
          extra_info: JSON.stringify(msg)
        });
        this.$toasted.error(msg);
      });
    },
    // 获取实时课堂成员列表
    getClassMembers() {
      api
        .getRumtimeMembers({
          class_id: Global.classId,
          index: 0,
          size: 20
        })
        .then(
          res => {
            console.debug(`members => ${JSON.stringify(res.data)}`);
            elkLog.report(elkLog.events.get_class_members, {
              extra_info: `members => ${JSON.stringify(res.data)}`
            });
            if (res.data && res.data.error_code === 0) {
              this.Global.members = res.data.list || [];
              this.classMemberList = res.data.list || [];
              let classMemberArray = [];
              this.classMemberList.forEach(item => {
                this.$set(this.classMemberMap, item.user_id, item);
                classMemberArray.push(item.user_id);
              });
              for (let key in this.classMemberMap) {
                if (!classMemberArray.includes(key)) {
                  this.$delete(this.classMemberMap, key);
                }
              }
            }
          },
          error => {
            elkLog.report(elkLog.events.get_class_members, {
              extra_info: `error => ${JSON.stringify(error)}`
            });
          }
        );
    },

    // 修改成员权限
    changePermission(objectId) {
      objectId = objectId || [];
      let objectIdArray = [];
      objectId.forEach(item => {
        this.$set(this.membersPermissionMap, item.user_id, item);
        objectIdArray.push(item.user_id);
      });
      for (let key in this.membersPermissionMap) {
        if (!objectIdArray.includes(key)) {
          this.$delete(this.membersPermissionMap, key);
        }
      }
      if (this.role !== Constant.CLASS_ROLE.TEACHER) {
        let ownPermission = objectId
          ? objectId.filter(item => item.user_id === Global.userId)
          : [];
        if (ownPermission.length != 0) {
          this.permission.mic = Boolean(ownPermission[0].mic);
          this.permission.camera = Boolean(ownPermission[0].camera);
        } else {
          this.permission.mic = false;
          this.permission.camera = false;
        }
      }
    },

    detectVideoNode() {
      var nodes = this.ctn.getNodes();
      for (var node of nodes) {
        if (node.type === "videoCtn") {
          this.videoNodeId = node.id;
        }
      }
    },

    hideVideoNode() {
      var that = this;
      this.hideVideoTask = setInterval(function() {
        if (
          that.videoNodeId !== null &&
          Object.keys(that.remoteStreamData).length === 0 &&
          that.ctn.getNode(that.videoNodeId)
        ) {
          that.ctn.getNode(that.videoNodeId).hide();
        }
      }, 30);
    },

    setAuxStream(data) {
      console.debug("set aux stream", data);
      elkLog.report(elkLog.events.set_aux_stream, {
        extra_info: {
          userId: data.getUserId()
        }
      });
      this.$set(this.remoteStreamData, data.getId(), data);
      clearInterval(this.hideVideoTask);
      var that = this;
      setTimeout(function() {
        that.detectVideoNode();
        that.updateVideo();
      }, 500);
    },

    deleteAuxStream(id) {
      elkLog.report(elkLog.events.delete_aux_stream, {
        extra_info: `id=>${id}`
      });
      console.debug("deleteAuxStream", id);
      this.$delete(this.remoteStreamData, id);
      this.deleteVideo(id);
      this.hideVideoNode();
    },

    createVideoElement(id, node, isLocal) {
      var videoDiv = document.createElement("div");
      videoDiv.style.width = "100%";
      videoDiv.style.height = "100%";
      videoDiv.innerHTML =
        '<video id="' +
        id +
        '" ' +
        'style="width: 100%; height: 100%; "' +
        " autoplay " +
        (isLocal ? "muted" : "") +
        " playsinline " +
        "  ></video>";
      node.appendChild(videoDiv);
      return document.getElementById(id);
    },

    updateVideo() {
      console.debug("updateVideo", this.remoteStreamData, this.videoNodeId);
      elkLog.report(elkLog.events.update_video);
      if (Object.keys(this.remoteStreamData).length === 0) return;

      for (var videoId in this.remoteStreamData) {
        var item = this.remoteStreamData[videoId];
        if (item.getMediaStream() && item.getMediaStream().active === true) {
          if (!this.videoNodeId && this.classData.class_live_type === "close") {
            this.$refs.screenshare_video.innerHTML = "";
            try {
              item.stop();
            } catch (e) {}
            item.play(this.$refs.screenshare_video);
            this.showScreenShare = true;
            return;
          }
          // var id = videoId;
          // var node = this.ctn.getNode(this.videoNodeId)
          // var video = document.getElementById(id);
          // if(!node) {
          //   console.debug('has no node', node)
          //   return
          // }
          // if (!video) {
          //     video = this.createVideoElement(id, node.$content);
          // }
          // setTimeout(function(){
          //     video.srcObject = item.stream
          //     video.muted = true
          //     video.autoplay = true
          //     video.playsinline = true
          //     video.play()
          // },50)
          // node.show()
        }
      }
    },

    deleteVideo(id) {
      if (this.videoNodeId !== null) {
        this.ctn.getNode(this.videoNodeId).hide();
      } else {
        var element = document.getElementById("video_" + id);
        if (
          element &&
          element.parentNode &&
          element.parentNode.parentNode.classList.contains("screenshare")
        ) {
          this.showScreenShare = false;
        }
      }
    },

    stopClass() {
      console.debug("stop class");
      MessageBridge.showMessageBox({
        title: "下课后课堂将被销毁，无法再次进入，确定下课吗？",
        options: ["确定", "取消"],
        callback: index => {
          if (index === 0) {
            if (this.classData.class_id == 1000619147) {
              this.$router.push(Global.loginUrl());
              return;
            }
            api
              .stopClass({
                class_id: this.classData.class_id
              })
              .then(() => {
                elkLog.report(elkLog.events.stop_class);
                control.ctlSetClass("class_end");
                this.classData.class_status = "end";
                this.$router.push(Global.loginUrl());
              });
          }
        }
      });
    },

    logout() {
      MessageBridge.showMessageBox({
        title: "确定退出吗？",
        options: ["确定", "取消"],
        callback: index => {
          if (index === 0) {
            console.debug(`call logout classid=> ${this.classData.class_id}`);
            this.quitClass();
          }
        }
      });
    },

    setClass(val) {
      if (val === "start") {
        this.start();
      } else if (val === "end") {
        this.stopClass();
      }
    },

    login() {
      return api
        .login({
          userid: this.$route.params.userId,
          password: this.$route.params.userToken
        })
        .then(res => {
          if (res.data && res.data.error_code === 0) {
            Global.set("token", res.data.token);
            elkLog.report(elkLog.events.login, {
              action_result: res.data.error_code,
              action_info: res.data.error_msg
            });
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
            elkLog.report(elkLog.events.login, {
              action_result: res.data.error_code,
              action_info: res.data.error_msg
            });
            console.error(`${res.data.error_msg} [${res.data.error_code}]`);
            Global.loginUrl();
          }
        })
        .catch(error => {
          elkLog.report(elkLog.events.login, {
            extra_info: `error: ${JSON.stringify(error)}`
          });
          console.error(error);
        });
    },

    quitClass() {
      api
        .quitClass({
          class_id: this.classData.class_id
        })
        .then(() => {
          if (this.layout === Constant.LAYOUT.SINGLE) {
            try {
              control.ctlSendJoinExit("exit");
            } catch (error) {
              console.error(error);
            }
          }
          console.debug(`call logout => ${Global.loginUrl()}`);
          elkLog.report(elkLog.events.logout);
          if (Global.userId && Global.userId.indexOf("visitor_") === 0) {
            Global.clearAuth();
            this.$router.push("/demo");
          } else {
            Global.clearAuth();
            this.$router.push(Global.loginUrl());
          }
        });
    },

    // 判断是否有学生处于举手态，若有返回true 若无调用notifyHandDown()通知老师端取消提醒，返回false。
    isStudentUp() {
      console.debug("function Class.vue->isStudentUp()");
      api
        .getRumtimeMembers({
          class_id: Global.classId,
          index: 0,
          size: 20
        })
        .then(
          res => {
            console.debug(`members => ${JSON.stringify(res.data)}`);
            if (res.data && res.data.error_code === 0) {
              this.classMemberList = res.data.list || [];
              this.Global.members = res.data.list || [];
              // let classMemberArray = []
              // this.classMemberList.forEach(item => {
              //   this.$set(this.classMemberMap,item.user_id, item )
              //   classMemberArray.push(item.user_id)
              // });
              // for (let key in this.classMemberMap){
              //   if(!classMemberArray.includes(key)){
              //     this.$delete(this.classMemberMap, key)
              //   }
              // }
            }
            for (var item of this.classMemberList) {
              if (item.status.hand_up === 1) {
                return true;
              }
            }
            this.$refs["hc-ref"].notifyHandDown();
            return false;
          },
          error => {
            console.error(error);
          }
        );
    },

    endQuestion(action, question_id) {
      let req = {
        class_id: Global.classId,
        question_id,
        action // 老师主动取消：cancel_question
      };

      api.questionCancel(req).then(res => {
        var data = res.data;
        if (data.error_code !== 0) {
          console.error(data.error_msg);
        }
      });
    },

    //
    showAnswerer(question_id) {
      api
        .questionInfo({
          class_id: Global.classId,
          question_id: question_id,
          reply_id: Global.userId
        })
        .then(res => {
          let msg = res.data;
          if (msg.error_code === 0) {
            msg.action = "show_question";
            this.$refs["hc-ref"].showToolboxDialog("answerer", "show", msg);
          } else {
            console.error(msg.error_msg);
          }
        });
    },

    //
    showCheckin(check_id) {
      if (Global.role === Constant.CLASS_ROLE.TEACHER) {
        this.$refs["hc-ref"].showToolboxDialog("checkin", "show", {
          action: "show_check_in",
          check_id: check_id
        });
      } else if (Global.role === Constant.CLASS_ROLE.STUDENT) {
        api
          .getCheckinInfo({
            class_id: Global.classId,
            check_id: check_id,
            check_in_member: Global.userId
          })
          .then(res => {
            let msg = res.data;
            if (msg.error_code === 0) {
              msg.action = "show_check_in";
              this.$refs["hc-ref"].showToolboxDialog("checkin", "show", msg);
            } else {
              console.error(msg.error_msg);
            }
          });
      }
    }
  }
};
</script>

<style>
#class-app {
  width: 100%;
  height: 100%;
}

.ivu-modal-content {
  border-radius: 0;
}

iframe {
  border: 0;
  width: 100%;
  height: 100%;
}
</style>
