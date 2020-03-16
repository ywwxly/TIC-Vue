<template>
  <div>
    <li class="chatroom-msg" v-if="msg.type==='tips'">
      <div class="chatroom-msg__tips">
        <span class="chatroom-msg--tips">{{formatTime(msg.time)}} {{msg.content}}</span>
      </div>
    </li>
    <li class="chatroom-msg" :class= "{'own-msg': msg.isSend,'teacher-msg': msg.isSend}" v-else>
      <div class="chatroom-msg__hd">
        <i class="tic-icon tic-icon-custom" :style="{'background-image': 'url('+ msg.iconUrl +')'}"></i>
        <div class="chatroom-msg_user">
          <span class="chatroom-msg--name">{{msg.sendNick || msg.send}}</span>
          <span class="chatroom-msg--time">({{formatTime(msg.time)}})</span>
        </div>
      </div>
      <div class="chatroom-msg__bd">
        <div class="tic-bubble">
          <div class="tic-bubble-inner">
            {{msg.content}}
          </div>
        </div>
      </div>
    </li>
  </div>
		

</template>

<script>
import util from "../../util/util";
import Component from "../core/Component";
import { constants } from 'crypto';
import axios from "axios";

window.axios = axios;

export default {
  extends: Component,

  props: {
    msg: {
      type: Object,
      default() {
        return {};
      }
    },
    index: {
      type: Number,
      default: 0
    }
  },

  data() {
    return {};
  },

  methods: {
    formatTime(time) {
      return util.formatTime(time, "HH:mm:ss");
    }
  }
};
</script>
