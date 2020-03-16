<template>
  <div :class="`tic-number__list ${classname}`">
    
      <div ref="video-ref" v-bind:id="userId" class="tedu-component-video"></div>
      <div class="tic-number__list-ft">
          <ul class="tic-number__list-ft_icon">
              <li>
                <!-- 本地流 使用voice_status -->
                <!-- <a v-if="userId === Global.userId" href="javascript:;" :class="`tic-btn ${voice_status ? 'actived': 'disabled'}`">
                    <i class="tic-icon tic-icon-voice"></i>
                </a> -->
                <!-- 远端流 使用voice_right -->
                <!-- <a v-else href="javascript:;" :class="`tic-btn ${voice_status2 ? 'actived': 'disabled'}`">
                    <i class="tic-icon tic-icon-voice"></i>
                </a> -->
                <a href="javascript:;" :class="`tic-btn  ${hasAudio ? 'actived': 'disabled'}`">
                    <i class="tic-icon tic-icon-voice">{{ hasAudio }}</i>
                </a>
                <VolumeComponent :volume="volume"></VolumeComponent>
              </li>
          </ul>
          <span class="tic-number__list-ft_name">
              {{nickname}}
          </span>
      </div>
      <VideoControllerComponent
        v-if="showController"
        @micTap="micTap"
        @cameraTap="cameraTap"
        :userId="userId"
        :permission="permission"
      ></VideoControllerComponent>
  </div>
</template>

<script>
import Component from "../core/Component";
import util from "../../util/util";
import SoundMeter from "../../util/SoundMeter";
import VolumeComponent from "./VolumeComponent";
import VideoControllerComponent from "./VideoControllerComponent";
import api from "../../request/Api"
import Global from '../../config/Global'
import elkLog from '../../request/ELKlog';

export default {
  extends: Component,
  components: {
    VolumeComponent,
    VideoControllerComponent
  },
  props: {
    showController: {
      type: Boolean,
      default: false
    },
    userId: {
      type: String,
      default: util && util.tid()
    },
    type: {
      type: String,
      default: null
    },
    stream: {
      // type: Object,
      type: Object,
      default: null
    },
    info: {
      type: Object,
      default() {
        return {
          status: {},
        };
      }
    },
    classname: {
      type: String,
      default: null
    },
    permission: {
      immediate: true,
      type: Object,
      default() {
        return {};
      }
    }
  },
  watch: {
    stream(val) {
      console.debug('stream watch update', val)
      this.setStream(val);
      this.detectVolume(val);
    },
    "global.members": function(val) {
      // 更新right
      if(val){
        var item = val.find( (item) => {
          return item.user_id == this.userId && this.userId !== this.Global.userId
        })
        if( item ){
          this.video_right = !!item.status.camera
          this.voice_right = !!item.status.mic
        }
      }
    },
    userId:{
      immediate: true,
      handler: function (val) {
        if(val){
          api.getUserInfo({
            user_id: val
          }).then(
            res => {
              if(res.data.error_code === 0 && res.data.user_info) {
                this.nickname = res.data.user_info.nickname
              }
          })
        } else{
          this.nickname = null
        }

      }
    } 
  },
  data() {
    return {
      volume: 0,
      voice_status: true,
      voice_right: true,
      video_right: true,
      nickname: null,
      soundmeter: null,
      global: Global
    };
  },

  mounted() {
    this.setStream()
    this.detectVolume();

    // 获取初始状态信息
    if( this.userId === this.global.userId ) {
      this.video_right = this.global.camera
    } else if(this.global.members){
      var item = this.global.members.find( (item) => {
        return item.user_id == this.userId
      })
      if( item ){
        this.video_right = !!item.status.camera
      }
    }

    if( this.userId === this.global.userId ) {
      this.voice_right = this.global.mic
    }else if(this.global.members){
      var item = this.global.members.find( (item) => {
        return item.user_id == this.userId
      })
      if( item ){
        this.voice_right = !!item.status.mic
      }
    }
  },
  beforeDestroy() {
      if( this.soundmeter ){
        this.soundmeter.stop()
        this.soundmeter = null
      }
  },
  methods: {
    setStream(stream) {
      
      console.debug(`[trtc] setStream => ${this.userId}`, this.stream,  stream)
      // console.error('stream has audio' + JSON.stringify(stream.hasAudio()))
      stream = stream || this.stream
      if( stream ){
        console.debug(`[trtc] set stream => ${this.userId}`, stream)
        elkLog.report(elkLog.events.set_stream, {
          extra_info: `[trtc] stream , userId => ${this.userId}`
        })
        console.debug('[trtc]', this.userId, stream)
        try{
          stream.play(this.userId, {
            muted: this.userId === this.Global.userId
          })
        }catch(e){
          console.error('play error', e)
        }
      }
      // this.$refs["video-ref"].srcObject = ( stream && stream.getMediaStream()) || ( this.stream && this.stream.getMediaStream());
      //静音自己的流
      // if( this.userId === this.Global.userId){
      //   this.$refs["video-ref"].muted = true;
      // }else{
      //   this.$refs["video-ref"].muted = false;
      // }
    },

    micTap(status, userId) {
      this.voice_status = status
      if( !userId ){
      // 自己的流，传递给父组件
        this.$emit("micTap", status)
        elkLog.report(elkLog.events.mic_tap, {
          extra_info: `status: ${JSON.stringify(status)}`
        })
      }
    },

    cameraTap(status, userId) {
      // this.video_status = status
      if( !userId ){
      // 自己的流，传递给父组件
        this.$emit("cameraTap", status)
        elkLog.report(elkLog.events.camera_tap, {
          extra_info: `status: ${JSON.stringify(status)}`
        })
      }
    },

    detectVolume(stream) {
      if( this.soundmeter ){
        this.soundmeter.stop()
      }
      if( !stream && !this.stream || !this.stream.hasAudio()) return
      this.soundmeter = new SoundMeter({
        stream: (stream || this.stream).getMediaStream(),
        onprocess: (res) => {
          this.volume = parseInt(res.volume * 100)
        }
      })
    }
  },
  
  computed: {
    roleText() {
      return this.Constant.CLASS_ROLE_TEXT[this.info.role];
    },
    hasAudio() {
      console.debug('hasAudio', this.stream)
      return this.stream && this.stream.hasAudio()
    }
  }
};
</script>
<style scope>
  .tedu-component-video{
    width:100%;
    height:100%;
  }
</style>