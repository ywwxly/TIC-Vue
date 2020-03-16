<template>
  <div class="tic-container__menu-inner">
    <DocumentManagerComponent
      v-if="!onlyShowLogo"
      ref="dm-ref"
    ></DocumentManagerComponent>
    <UserListComponent
      v-if="!onlyShowLogo"
      :role="role"
      :classInfo="classInfo"
      ref="userlist-ref"
    ></UserListComponent>
    <SettingComponent v-if="!onlyShowLogo" ref="setting-ref"></SettingComponent>
    <ToolboxComponent
      v-if="!onlyShowLogo"
      ref="toolbox-ref"
      @showToolboxDialog="showToolboxDialog"
    ></ToolboxComponent>
    <!-- <ControlAllComponent v-if="!onlyShowLogo" :classInfo="classInfo" ref="control-all-ref"></ControlAllComponent> -->
    <AnswererComponent
      v-if="!onlyShowLogo"
      ref="answerer-ref"
      :members="members"
    ></AnswererComponent>
    <CheckinComponent
      v-if="!onlyShowLogo"
      ref="checkin-ref"
      :members="members"
    ></CheckinComponent>
    <VersionComponent v-if="!onlyShowLogo" ref="version-ref"></VersionComponent>

    <div class="menu-float-left">
      <div class="menu-logo">
        <img :src="logo" />
      </div>
      <span class="menu-line"></span>
      <div class="menu-title">
        <h3>{{ class_id }}</h3>
      </div>
    </div>

    <div v-if="!onlyShowLogo" class="menu-operation">
      <a
        v-if="role === Constant.CLASS_ROLE.TEACHER"
        href="javascript:;"
        class="tic-btn"
        @click="setClass"
        :title="!isClassStarted() ? '上课' : '下课'"
      >
        <i
          :class="['tic-icon', !isClassStarted() ? 'start-class' : 'end-class']"
        ></i>
      </a>
      <a
        v-if="role === Constant.CLASS_ROLE.STUDENT"
        href="javascript:;"
        class="tic-btn"
        @click="setHand"
        :title="!isHandUp() ? '举手' : '取消举手'"
      >
        <i :class="['tic-icon', !isHandUp() ? 'hand-up' : 'hand-down']"></i>
      </a>
      <a
        v-if="global.companyId == 100001"
        href="javascript:;"
        class="tic-btn mini-program"
        @click="getQRCode"
        title="小程序码"
      >
      </a>
      <ul class="menu-operation__list">
        <li v-for="(item, index) in operations" :key="index">
          <a href="javascript:;" class="tic-btn" @click="iconTap(item.action)">
            <i
              :class="`tic-icon tic-icon-${item.class}`"
              :title="item.title || item.name"
            ></i>
          </a>
        </li>
      </ul>
      <span class="menu-line"></span>
      <div class="menu-user">
        <div
          :class="[
            'menu-user__img',
            isMaster ? 'icon_teacher' : 'icon_student'
          ]"
          :style="{ 'background-image': 'url(' + this.iconurl + ')' }"
        ></div>
        <div
          class="menu-user__text"
          v-if="this.nickname"
          v-text="this.nickname"
        ></div>
      </div>
    </div>

    <div class="menu-course">
      <h3 class="menu-course__title">
        {{ title }}<span class="menu-course__time">{{ hms }}</span>
      </h3>
    </div>
  </div>
</template>

<script>
import Constant from '../../config/Constant'
import api from '../../request/Api'
import Component from '../core/Component'
import DocumentManagerComponent from './DocumentManagerComponent'
import SettingComponent from './SettingComponent'
import UserListComponent from './UserListComponent'
import ToolboxComponent from './ToolboxComponent'
// import ControlAllComponent from './ControlAllComponent'
import AnswererComponent from './AnswererComponent'
import CheckinComponent from './CheckinComponent'
import VersionComponent from './VersionComponent'
import Control from '../../request/Control'
import elkLog from '../../request/ELKlog'
import Global from '../../config/Global'

export default {
  extends: Component,
  components: {
    DocumentManagerComponent,
    UserListComponent,
    SettingComponent,
    ToolboxComponent,
    // ControlAllComponent,
    AnswererComponent,
    CheckinComponent,
    VersionComponent
  },

  props: {
    logo: {
      type: String,
      default:
        'https://tic-res-1259648581.file.myqcloud.com/saas/web/tic-logo.png'
    },
    onlyShowLogo: {
      type: Boolean,
      default: false
    },
    isMaster: {
      type: Boolean,
      default: false
    },
    role: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    classInfo: {
      type: Object,
      default: () => {
        return {}
      }
    },
    members: {
      type: Object,
      default() {
        return {}
      }
    },
    companyName: {
      type: String,
      default: '互动课堂'
    },
    class_id: {
      type: Number,
      default: null
    }
  },

  data() {
    return {
      hms: null,
      operations: [],
      timer: null,
      qrcodeModal: null,
      qrcodeUrl: null,
      nickname: null,
      iconurl: null,
      global: Global
    }
  },

  watch: {
    'classInfo.class_status': function(val) {
      if (val === 'ing') {
        this.startTimer()
      } else if (val === 'end') {
        clearInterval(this.timer)
        this.timer = null
      }
    },
    'Global.userId': {
      immediate: true,
      handler(val) {
        if (!this.onlyShowLogo) {
          api
            .getUserInfo({
              user_id: val
            })
            .then(res => {
              if (res.data.error_code === 0 && res.data.user_info) {
                this.nickname = res.data.user_info.nickname
                if (
                  res.data.user_info.avatar &&
                  res.data.user_info.avatar.length > 0
                ) {
                  this.iconurl = res.data.user_info.avatar
                } else {
                  // 默认头像
                  this.iconurl =
                    'https://main.qcloudimg.com/raw/45e1cd2f9378299a093a6ffa3bb8b9fb.svg'
                }
              }
            })
        }
      }
    }
  },

  mounted() {
    console.debug('isMaster:' + this.isMaster)
    if (this.Global.companyId == '100001') {
      this.img = new Image()
      this.img.src =
        'http://mp.qcloudtrtc.com/getQRCode?enterprise_id=' +
        (this.Global.companyId || 100001) +
        '&classId=' +
        this.classInfo.class_id
    }
    if (this.onlyShowLogo) {
      return
    }
    var operations = []

    if (this.classInfo.class_status === 'ing') {
      this.startTimer()
    }
    if (this.isMaster) {
      operations = [
        {
          name: '课件',
          action: 'document',
          class: 'courseware'
        },
        {
          name: '成员',
          action: 'member',
          class: 'people'
        }
        // {
        //   name: '全体控制',
        //   action: 'controlall',
        //   class: 'controlall'
        // }
      ]
    }
    if (this.role === Constant.CLASS_ROLE.TEACHER) {
      operations.push({
        name: '工具箱',
        action: 'toolbox',
        class: 'toolbox'
      })
    }

    // operations.push({
    //   name: '成员',
    //   action: 'member',
    //   class: 'people'
    // })
    //直播大班课不需要上麦，不允许检测音视频设备
    if (this.classInfo.class_video_type !== Constant.CLASS_VIDEO_TYPE.LIVE) {
      operations.push({
        name: '设置',
        action: 'setting',
        class: 'setting'
      })
    }
    // if(this.role === 'master'){
    //   operations.push({
    //     name: '下课',
    //     action: 'finish',
    //     class: 'waiting'
    //   })
    // }
    operations.push({
      name: '版本',
      action: 'version',
      class: 'info',
      title: Constant.VERSION
    })
    operations.push({
      name: '退出',
      action: 'exit',
      class: 'exit'
    })
    this.operations = operations
  },

  methods: {
    iconTap(type) {
      console.debug(`iconTap type => ${type}`)
      elkLog.report(elkLog.events.icon_tap, {
        extra_info: `type: ${JSON.stringify(type)}`
      })
      switch (type) {
        case 'document':
          this.$refs['dm-ref'].show()
          break
        case 'member':
          this.$refs['userlist-ref'].show()
          this.cancelPeopleHandup()
          break
        case 'toolbox':
          this.$refs['toolbox-ref'].show()
          break
        // case "controlall":
        //   this.$refs["control-all-ref"].show();
        //   break;
        case 'setting':
          this.$refs['setting-ref'].show()
          break
        case 'finish':
          this.$emit('stopClass')
          break
        case 'exit':
          this.$emit('logout')
          break
        case 'tool':
          break
        case 'version':
          this.$refs['version-ref'].show()
          // this.$toasted.show(`当前版本: ${Constant.VERSION}`);
          break
        default:
          break
      }
    },

    // 通知老师有学生举手，修改成员icon的样式为提醒样式
    notifyHandUp() {
      console.debug('function HeaderComponent.vue->notifyHandUp()')
      for (var item of this.operations) {
        if (item.name === '成员') {
          item.class = 'people-handup'
        }
      }
    },

    // 通知老师有学生取消举手，并且无学生处于举手态；若此时老师处仍显示通知红点，则调用cancelPeopleHandup（）修改成员icon的样式为默认样式
    notifyHandDown() {
      console.debug('function HeaderComponent.vue->notifyHandDown()')
      for (var item of this.operations) {
        if (item.name === '成员' && item.class === 'people-handup') {
          this.cancelPeopleHandup()
        }
      }
    },

    cancelPeopleHandup() {
      console.debug('function HeaderComponent.vue->cancelPeopleHandup()')
      elkLog.report(elkLog.events.cancel_people_handup)
      for (var item of this.operations) {
        if (item.name === '成员') {
          item.class = 'people'
        }
      }
    },

    isClassStarted() {
      return this.classInfo.class_status === 'ing'
    },

    isHandUp() {
      // ??this.classInfo.hand_statu先放在classInfo里
      return this.classInfo.hand_status === 'up'
    },

    startTimer() {
      this.timer = setInterval(() => {
        this.classInfo.duration_time++
        var hour = Math.floor(this.classInfo.duration_time / 3600)
        var min = Math.floor((this.classInfo.duration_time % 3600) / 60)
        var sec = Math.floor(this.classInfo.duration_time % 60)
        this.hms =
          ' 已经开课: ' +
          (hour <= 9 ? '0' + hour : hour) +
          ':' +
          (min <= 9 ? '0' + min : min) +
          ':' +
          (sec <= 9 ? '0' + sec : sec)
      }, 1000)
    },

    setClass() {
      if (this.classInfo.class_status === 'ing') {
        this.$emit('setClass', 'end')
      } else {
        api
          .startClass({
            class_id: this.classInfo.class_id
          })
          .then(res => {
            if (res.data.error_code === 0) {
              this.$emit('setClass', 'start')
              this.classInfo.class_status = 'ing'
              Control.ctlSetClass('class_begin')
            } else {
              this.$toasted.error(
                `失败 [${res.data.error_msg} (${res.data.error_code}) ]`
              )
            }
          })
      }
    },

    setHand(type) {
      if (type != undefined && type === 'down') {
        // 响应IM信令中的hand_down，type="down"
        this.$set(this.classInfo, 'hand_status', 'down')
      } else if (this.classInfo.hand_status === 'up') {
        // 学生取消举手，上报hand_down事件
        api
          .reportEvent({
            class_id: this.classInfo.class_id,
            event: 'hand_down'
          })
          .then(res => {
            elkLog.report(elkLog.events.report_hand_up, {
              action_result: JSON.stringify(res.data.error_code)
            })
            if (res.data.error_code === 0) {
              this.$set(this.classInfo, 'hand_status', 'down')
            }
          })
      } else {
        api
          .reportEvent({
            // 学生举手，上报hand_up事件
            class_id: this.classInfo.class_id,
            event: 'hand_up'
          })
          .then(res => {
            elkLog.report(elkLog.events.report_hand_down, {
              action_result: JSON.stringify(res.data.error_code)
            })
            if (res.data.error_code === 0) {
              this.$set(this.classInfo, 'hand_status', 'up')
            }
          })
      }
    },

    showToolboxDialog(type, action, msg = null) {
      this.$refs['toolbox-ref'].hide()
      switch (type) {
        case 'checkin':
          if (action === 'show') {
            this.$refs['checkin-ref'].show(msg)
          } else if (action === 'hide') {
            this.$refs['checkin-ref'].hide(msg)
          }
          break
        case 'answerer':
          if (action === 'show') {
            this.$refs['answerer-ref'].show(msg)
          } else if (action === 'hide') {
            this.$refs['answerer-ref'].hide(msg)
          }
          break
        default:
          break
      }
    },

    getQRCode() {
      this.qrcodeModal = true
      this.$Modal.info({
        title: '小程序码',
        content:
          '<img style="width:85%" src="http://mp.qcloudtrtc.com/qrcode/' +
          (this.Global.companyId || 100001) +
          '/' +
          this.classInfo.class_id +
          '.png"/>'
      })
      
    }
  }
}
</script>

<style scoped>
.start-class {
  background-image: url('../../assets/css/img/slice/svg/start_class.svg');
  width: 40px;
  margin-right: 10px;
}
.end-class {
  background-image: url('../../assets/css/img/slice/svg/stop_class.svg');
  width: 40px;
  margin-right: 10px;
}
.hand-up {
  background-image: url('../../assets/css/img/slice/svg/hand_up.svg');
  width: 40px;
  margin-right: 10px;
}
.tic-btn:hover .hand-up {
  background-image: url('../../assets/css/img/slice/svg/hand_up_hover.svg');
  width: 40px;
  margin-right: 10px;
}
.hand-down {
  background-image: url('../../assets/css/img/slice/svg/hand_down.svg');
  width: 70px;
  margin-right: 10px;
  margin-left: -30px;
}
.tic-btn:hover .hand-down {
  background-image: url('../../assets/css/img/slice/svg/hand_down_hover.svg');
  width: 70px;
  margin-right: 10px;
  margin-left: -30px;
}
.mini-program {
  background-image: url('../../assets/css/img/mini-program.png');
  background-size: auto 100%;
  background-repeat: no-repeat;
  width: 24px;
  height: 20px;
  display: inline-block;
  vertical-align: middle;
}
.mini-program:hover {
  opacity: 0.7;
}
</style>
