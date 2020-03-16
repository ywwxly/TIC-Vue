<template>
  <div class="tic-number__list-icon">
      <a v-if="permission.mic" href="javascript:;" :class="`tic-btn ${ voice_status ? '' : 'disabled'}`" @click="micTap">
          <i class="tic-icon tic-icon-voice1"></i>
      </a>
      <a v-if="permission.camera" href="javascript:;" :class="`tic-btn  ${ video_status ? '' : 'disabled'}`" @click="cameraTap">
          <i class="tic-icon tic-icon-video"></i>
      </a>
      <!-- <a href="javascript:;" class="tic-btn disabled">
          <i class="tic-icon tic-icon-out"></i>
      </a>
      <a href="javascript:;" class="tic-btn disabled">
          <i class="tic-icon tic-icon-success"></i>
      </a> -->
  </div>
</template>

<script>
/* 
  麦克风/摄像头开关

  1. 麦克风摄像头操作后，立即更新当前状态（不同步）
  2. 同步修改的状态至上层处理函数
  3. 上层处理完后会更新Global.mic / Global.camera / Global.members
  4. 根据更新的信息再次更新当前的按钮状态即可
*/
  import Component from '../core/Component'
  import Global from '../../config/Global'
  import Control from '../../request/Control'

  export default {
    extends: Component,
    props: {
      userId: {
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
      "permission.mic": function(val){
        this.voice_status = val
      },
      "permission.camera": function(val){
        this.video_status = val
      },
      // 本地流发布失败时，会修改global值
      "global.mic": function(val){
        this.voice_status = val
      },
      "global.camera": function(val){
        this.video_status = val
      }
    },

    data() {
      return {
        // voice_right: true,
        // video_right: true,
        voice_status: true,//this.voice,
        video_status: true,//this.video,
        global: Global
      }
    },

    methods: {
      micTap() {
        // 本人操作自己
        if( this.global.userId === this.userId){
          this.$emit("micTap", !this.voice_status)
        }
        this.voice_status = !this.voice_status
        Global.set('mic', (this.voice_status && this.permission.mic))
      },
      cameraTap() {
        if(this.userId === this.global.userId ) {
          this.$emit("cameraTap", !this.video_status)
        }
        this.video_status = !this.video_status
        Global.set('camera', (this.video_status && this.permission.camera))
      }
    },
    
    mounted() {
      // 获取初始状态信息
      if( this.userId === this.Global.userId ) {
        this.voice_status = this.permission.mic
        this.video_status = this.permission.camera
      } else if(this.global.members){
        var item = this.global.members.find( (item) => {
          return item.user_id == this.userId
        })
      }
    }
  }
</script>
