<template>
  <div class="tedu-component-userlist-wrap">
    <div class="tedu-component-userlist-content">
      <DialogWidget ref="userlist-dialog-ref" @hide="onDialogHide">
        <template v-slot:header>{{title}}</template>
        <template v-slot:main>
          <div class="tic-justify align-middle">
            <div class="col">
              <div class="user-box">
                <div class="user-img" :style="{'background-image': 'url('+ teacher_icon +')'}"></div>
                <div class="user-info">
                  <div class="user-name">{{ teacher_nick }}</div>
                </div>
                <div class="user-info"  style="width:25px;margin-left: 20px;">
                  <a @click="refresh" href="javascript:;" class="tic-btn">
                    <i class="tic-icon tic-icon-refresh"></i>
                  </a>
                </div>
              </div>
            </div>
            <div class="col tic-btn" style="width:40px;margin-left: 20px;">
              <a href="javascript:;" class="tic-btn" title="全体下台" @click="ctlAllStatus('off_all', 'platform')">
                <i class="tic-icon tic-toolbox-camera"></i>
              </a>
            </div>
            <div class="col tic-btn"  style="width:40px;margin-left: 20px;margin-right: 20px;">
              <a href="javascript:;" class="tic-btn" title="全体静音" @click="ctlAllStatus('off_all', 'mic')">
                <i class="tic-icon tic-toolbox-voice"></i>
              </a>
            </div>
            <div class="col">
              <div class="tic-input-search">
                <button @click="search" class="tic-btn weak">
                  <i class="tic-icon tic-icon-search"></i>
                </button>
                <input type="search" class="tic-input" v-model="keyword" placeholder="请输入想要搜索的用户" />
              </div>
            </div>
            <!-- <div class="col tic-justify-btn" style="width:25px">
              <a @click="refresh" href="javascript:;" class="tic-btn">
                <i class="tic-icon tic-icon-refresh"></i>
              </a>
            </div> -->
          </div>
          <div class="tic-table">
            <div class="tic-table__head">
              <table style="table-layout: fixed;">
                <colgroup>
                  <col style="width: 130px;"/>
                  <col v-if="classInfo.class_video_type!==Constant.CLASS_VIDEO_TYPE.LIVE"/>
                  <col v-if="classInfo.class_video_type!==Constant.CLASS_VIDEO_TYPE.LIVE"/>
                  <col/>
                  <col v-if="classInfo.class_video_type!==Constant.CLASS_VIDEO_TYPE.LIVE"/>
                  <col v-if="classInfo.class_video_type!==Constant.CLASS_VIDEO_TYPE.LIVE"/>
                  <col/>
                  <col/>
                </colgroup>
                <thead>
                  <tr>
                    <th>
                      <div class>
                        <span class="text">姓名</span>
                      </div>
                    </th>
                    <th v-if="classInfo.class_video_type!==Constant.CLASS_VIDEO_TYPE.LIVE">
                      <div class>
                        <span class="text">上下台</span>
                      </div>
                    </th>
                    <th  v-if="classInfo.class_video_type!==Constant.CLASS_VIDEO_TYPE.LIVE">
                      <div class>
                        <span class="text">授权</span>
                      </div>
                    </th>
                    <th>
                      <div class>
                        <span class="text">举手</span>
                      </div>
                    </th>
                    <th  v-if="classInfo.class_video_type!==Constant.CLASS_VIDEO_TYPE.LIVE">
                      <div>
                        <span class="text">麦克风</span>
                      </div>
                    </th>
                    <th v-if="classInfo.class_video_type!==Constant.CLASS_VIDEO_TYPE.LIVE">
                      <div class>
                        <span class="text">摄像头</span>
                      </div>
                    </th>
                    <th>
                      <div class>
                        <span class="text">禁言</span>
                      </div>
                    </th>
                    <th>
                      <div class>
                        <span class="text is-error">移出</span>
                      </div>
                    </th>
                  </tr>
                </thead>
              </table>
            </div>
            <div class="tic-table__body roll-scroll">
              <table style="table-layout: fixed;">
                <colgroup>
                  <col style="width: 130px;"/>
                  <col v-if="classInfo.class_video_type!==Constant.CLASS_VIDEO_TYPE.LIVE"/>
                  <col v-if="classInfo.class_video_type!==Constant.CLASS_VIDEO_TYPE.LIVE"/>
                  <col/>
                  <col v-if="classInfo.class_video_type!==Constant.CLASS_VIDEO_TYPE.LIVE"/>
                  <col v-if="classInfo.class_video_type!==Constant.CLASS_VIDEO_TYPE.LIVE"/>
                  <col/>
                  <col/>
                </colgroup>
                <tbody>
                  <tr v-if="currentList.length === 0" class="table-empty">
                    <td colspan="5">
                      <div style="font-size:12px">当前列表为空</div>
                    </td>
                  </tr>
                  <tr
                    v-else
                    v-for="item in currentList"
                    :key="item.user_id"
                  >
                    <td>
                      <span :class="`text ${item.role === Constant.CLASS_ROLE.ASSISTANT ? 'is-error' :''}`">{{ item.nickname }}{{ item.role === Constant.CLASS_ROLE.ASSISTANT ? '(助教)' :'' }}</span>
                    </td>
                    <td v-if="classInfo.class_video_type!==Constant.CLASS_VIDEO_TYPE.LIVE">
                      <a
                        @click="controlTap('platform', item)"
                        href="javascript:;"
                        :class="`tic-btn ${item.status.mic === 0 && item.status.camera === 0 ? 'disabled':''}`"
                      >
                        <i class="tic-icon tic-icon-platform"></i>
                      </a>
                    </td>
                    <td v-if="classInfo.class_video_type!==Constant.CLASS_VIDEO_TYPE.LIVE"> 
                      <a
                        @click="controlTap('enable_draw', item)"
                        href="javascript:;"
                        :class="`tic-btn ${item.status.enable_draw === 0 ? 'disabled':''}`"
                      >
                        <i class="tic-icon tic-icon-draw"></i>
                      </a>
                    </td>
                    <td>
                      <a
                        @click="item.status.hand_up && controlTap('hand_up', item)"
                        href="javascript:;"
                        :class="`tic-btn ${item.status.hand_up === 0 ? 'disabled':''}`"
                      >
                        <i class="tic-icon tic-icon-hands"></i>
                      </a>
                    </td>
                    <td v-if="classInfo.class_video_type!==Constant.CLASS_VIDEO_TYPE.LIVE">
                      <a
                        @click="controlTap('mic', item)"
                        href="javascript:;"
                        :class="`tic-btn ${item.status.mic === 0 ? 'disabled':''}`"
                      >
                        <i class="tic-icon tic-icon-microphone"></i>
                      </a>
                    </td>
                    <td v-if="classInfo.class_video_type!==Constant.CLASS_VIDEO_TYPE.LIVE">
                      <a
                        @click="controlTap('camera', item)"
                        href="javascript:;"
                        :class="`tic-btn ${item.status.camera === 0 ? 'disabled':''}`"
                      >
                        <i class="tic-icon tic-icon-camera"></i>
                      </a>
                    </td>
                    <td>
                      <a
                        @click="(Global.role !== Constant.CLASS_ROLE.ASSISTANT || item.role !== Constant.CLASS_ROLE.ASSISTANT) && controlTap('silence', item)"
                        href="javascript:;"
                        :class="`tic-btn  ${Global.role === Constant.CLASS_ROLE.ASSISTANT && item.role === Constant.CLASS_ROLE.ASSISTANT? 'absent':''} ${item.status.silence === 1 ? 'disabled':''}`"
                      >
                        <i class="tic-icon tic-icon-speak"></i>
                      </a>
                    </td>
                    <td>
                      <a
                        @click="(Global.role !== Constant.CLASS_ROLE.ASSISTANT || item.role !== Constant.CLASS_ROLE.ASSISTANT) && controlTap('kick', item)"
                        href="javascript:;"
                        :class="`tic-btn ${Global.role === Constant.CLASS_ROLE.ASSISTANT && item.role === Constant.CLASS_ROLE.ASSISTANT? 'absent':''}`"
                      >
                        <i class="tic-icon tic-icon-prohibit"></i>
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <PaginationWidget :current="page.current" :total="page.total" @pageChange="pageChange"></PaginationWidget>
        </template>
      </DialogWidget>
    </div>
  </div>
</template>

<script>
import util from "../../util/util";
import DialogWidget from "../widget/DialogWidget";
import PaginationWidget from "../widget/PaginationWidget";
import Component from "../core/Component";
import api from "../../request/Api";
import Constant from "../../config/Constant";
import Button from "../widget/ButtonWidget";
import control from "../../request/Control";
import MessageBridge from "../../util/MessageBridge.js";
import { setTimeout } from "timers";

export default {
  extends: Component,

  components: {
    Button,
    DialogWidget,
    PaginationWidget
  },

  props: {
    role: {
      type: String,
      default: ""
    },
    classInfo: {
      type: Object,
      default: {}
    }
  },

  data() {
    return {
      title: "成员管理",
      index: 0,
      classId: 0,
      teacher_nick: null,
      teacher_icon: null,
      page: {
        size: 5,
        current: 1,
        total: 1
      },
      keyword: "",
      users: [],
      userlist: [],
      timer: null,
      resultTimer: null
    };
  },

  mounted() {
    this.classId = this.$route.params.classId * 1;
    api
      .getUserInfo({
        user_id: this.classInfo.teacher_id
      })
      .then(res => {
        if (res.data.error_code === 0 && res.data.user_info) {
          this.teacher_nick = res.data.user_info.nickname;
          if (res.data.user_info.avatar && res.data.user_info.avatar.length>0){
            this.teacher_icon = res.data.user_info.avatar
          }else{  // 默认头像
            this.teacher_icon = 'https://main.qcloudimg.com/raw/660a0f4ffed15f717dbc7c6e357bfbdc.svg'
          }
        }
      });
  },

  watch: {
    users(val) {
      var current = this.page.current;
      // this.userlist = val.slice((current - 1) * this.page.size, current * this.page.size)
      this.page.current = current;

      this.search(false);
    }
  },

  computed: {
    currentList() {
      var list = this.userlist.slice(
        (this.page.current - 1) * this.page.size,
        this.page.current * this.page.size
      );
      return list;
    }
  },

  methods: {
    show() {
      this.$refs["userlist-dialog-ref"].show(
        {
          width: 700
        },
        () => {
          this.startResultTimer()
        }
      );
    },

    pageChange(val) {
      // this.userlist = this.users.slice((val - 1) * this.page.size, val * this.page.size)
      this.page.current = val;
      // this.getRumtimeMembers({
      //   index: (val - 1) * this.page.size
      // }).then((data)=>{
      //   this.page.current = val
      // })
    },

    refresh() {
      this.getRumtimeMembers();
    },

    startResultTimer() {
      this.getRumtimeMembers()
      if(this.resultTimer !== null){
        clearInterval(this.resultTimer)
        this.resultTimer = null
      }
      this.resultTimer = setInterval(() => {
        this.getRumtimeMembers()
      }, 3000);
    },

    endResultTimer() {
      if(this.resultTimer !== null){
        clearInterval(this.resultTimer)
        this.resultTimer = null
      }
    },

    onDialogHide() {
      this.endResultTimer()
    },

    getRumtimeMembers(opts = {}) {
      var param = Object.assign(
        {
          class_id: this.classId,
          index: 0,
          // index: this.index,
          // size: this.page.size
          size: 100
        },
        opts
      );
      return api.getRumtimeMembers(param).then(
        res => {
          if (res.data && res.data.error_code === 0) {
            res.data.total = res.data.list.length;
            this.users = res.data.list.filter(item => {
              return item.role !== "teacher";
            });
          }
        },
        error => {}
      );
    },

    checkAvailable(user) {
      var videoList = this.users.filter(item => {
        return item.status.camera == 1 && item.user_id !== user.user_id;
      });
      var audioList = this.users.filter(item => {
        return item.status.mic == 1 && item.user_id !== user.user_id;
      });

      if (videoList.length >= Constant.MAX_VIDEO_COUNT - 1) {
        MessageBridge.showMessageBox({
          title: `已达到上麦人数上限`,
          options: ["确定"],
          callback: () => {}
        });
        return false;
      } else if (audioList.length >= Constant.MAX_AUDIO_COUNT - 1) {
        this.$toasted.error("已达到上麦人数上限");
        return false;
      } else {
        return true;
      }
    },

    controlTap(type, item) {
      this.endResultTimer()
      console.debug(type, item, this.classInfo);
      if ((type === "camera" || type === "mic") && !item.status[type]) {
        let available = this.checkAvailable(item);
        if (!available) {
          return;
        }
      }
      if (typeof item.status[type] !== "undefined") {
        item.status[type] = !item.status[type] ? 1 : 0;
      }
      if ((type === "platform") && (!item.status.mic && !item.status.camera)) { // 优先认为状态为上台
        let available = this.checkAvailable(item);
        if (!available) {
          return;
        }
      }

      // 操作信令
      switch (type) {
        case "kick":
          MessageBridge.showMessageBox({
            title: `是否将${item.role === Constant.CLASS_ROLE.ASSISTANT ? '助教' : '学生'} ${item.nickname} 移出课堂`,
            options: ["是", "否"],
            callback: index => {
              if (index === 0) {
                control.ctlControl("kickoff", [item.user_id]);
                setTimeout(() => {
                  this.refresh();
                }, 1000);
              }
            }
          });
          break;
        case "silence":
          if (item.status.silence === 0) {
            control.ctlControl("unmutemsg", [item.user_id]);
            control.reportApplyEvent("silence", 1, item.user_id);
          } else if (item.status.silence === 1) {
            control.ctlControl("mutemsg", [item.user_id]);
            control.reportApplyEvent("silence", 0, item.user_id);
          }
          break;
        case "hand_up":
          control.ctlSetRights(1, "", item.user_id);
          break;
        case "mic":
          if (item.status.mic === 0) {
            control.ctlSetRights(false, "mic", item.user_id)
            // control.reportApplyEvent("mic", 1, item.user_id);
          } else if (item.status.mic === 1) {
            control.ctlSetRights(true, "mic", item.user_id)
            // control.reportApplyEvent("mic", 0, item.user_id);
          }
          break;
        case "camera":
          if (item.status.camera === 0) {
            control.ctlSetRights(false, "camera", item.user_id)
            // control.reportApplyEvent("camera", 1, item.user_id);
          } else if (item.status.camera === 1) {
            control.ctlSetRights(true, "camera", item.user_id)
            // control.reportApplyEvent("camera", 0, item.user_id);
          }
          break;
        case "enable_draw":
          if (this.classInfo.class_status !== 'ing'){
            this.$toasted.error("还未上课不能给学生授权");
            item.status[type] = 0;
            return
          }
          if (item.status.enable_draw === 0) {
            control.ctlSetRights(false, "draw", item.user_id);
            control.reportApplyEvent("enable_draw", 1, item.user_id);
          } else if (item.status.enable_draw === 1) {
            control.ctlSetRights(true, "draw", item.user_id);
            control.reportApplyEvent("enable_draw", 0, item.user_id);
          }
          break;
        case "platform":
          if(item.status.mic === 0 && item.status.camera === 0) { // 上台 此处改变item.status.camera item.status.mic，与单独更改逻辑不同
              item.status.mic = 1
              item.status.camera = 1
              control.ctlSetRights(true, "platform", item.user_id);
          } else { // 下台
            if (item.status.mic === 1 && item.status.camera === 1) {
              item.status.mic = 0
              item.status.camera = 0
              control.ctlSetRights(false, "platform", item.user_id);
            }
            else if (item.status.camera === 1) {
              item.status.camera = 0
              control.ctlSetRights(false, "camera", item.user_id);
            }
            else if (item.status.mic === 1) {
              item.status.mic = 0
              control.ctlSetRights(false, "mic", item.user_id);
            }
          }
          break;
        default:
          break;
      }
      setTimeout(() => {
        this.startResultTimer()
      }, 1000);
    },

    search(updateCurrentPage = true) {
      if (updateCurrentPage) {
        this.page.current = 1;
      }
      this.userlist = this.users.slice(0).filter(item => {
        if (this.keyword) {
          return item.nickname.indexOf(this.keyword) !== -1;
        } else {
          return true;
        }
      });

      this.page.total = Math.max(
        Math.ceil(this.userlist.length / this.page.size),
        1
      );
    },
    ctlAllStatus(action, rights){
      this.endResultTimer()
      api.getRumtimeMembers({
        class_id: this.classId,
        index: 0,
        size: 100
      }).then(
        res => {
          let members = []
          let membersId = []
          if (res.data && res.data.error_code === 0) {
            res.data.total = res.data.list.length;
            members = res.data.list
            for(let key in members){
              if(members[key].role !== Constant.CLASS_ROLE.TEACHER){
                membersId.push(members[key].user_id)
              }
            }
            switch (rights) {
              case "mic":
              case "camera":
              case "platform":
                control.ctlSetRights(
                  action === 'on_all' ? 1 : 0,
                  rights,
                  membersId
                )
                break
              default:
                control.ctlAllStatus(action, rights, membersId)
                break
            }
            setTimeout(() => {
              this.startResultTimer()
            }, 1000);
          }
        },
        error => {}
      );
    }
  }
};
</script>