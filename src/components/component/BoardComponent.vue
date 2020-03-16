<template>
  <div class="tedu-component-board-wrap">
    <div v-bind:id="elId" class="tedu-component-board-content"></div>
  </div>
</template>

<script>
import util from "../../util/util";
// import TBoard from "../core/TBoard";
import axios from "axios";
import Component from "../core/Component";
import IMHandler from "../core/imcore/IMHandler";
import Vue from "vue";
import Constant from "../../config/Constant";
import { constants } from "crypto";
import MessageBridge from "../../util/MessageBridge.js";
import elkLog from '../../request/ELKlog';
window.axios = axios;

export default {
  extends: Component,

  data() {
    return {
      tboard: null,
      elId: util.tid(),
      sdkAppId: null,
      userId: null,
      userSig: null,
      roomId: null,
      eventList: []
    };
  },

  mounted() {
    this.bindEvent();
    window.addBoardData = data => {
      this.tboard && this.tboard.addSyncData(data);
    };

    window.addFile = data => {
      this.addFile(data);
    };
  },

  beforeDestroy(){
    this.unbindEvent();
  },

  methods: {
    bindEvent() {
      this.on("setting_board_draw_type", (type, data) => {
        console.debug(
          `setting_board_draw_type  type =>${type} , data => ${JSON.stringify(
            data
          )}`
        );
        elkLog.report(elkLog.events.on_setting_board_draw_type, {
          extra_info: `type : ${type} , data : ${JSON.stringify(data)}`
        })
        switch (type) {
          case "toolchoose":
            this.tboard.setToolType(
              TEduBoard.TOOL_TYPE.TEDU_BOARD_TOOL_TYPE_MOUSE
            );
            break;
          case "tooltext":
            this.tboard.setToolType(
              TEduBoard.TOOL_TYPE.TEDU_BOARD_TOOL_TYPE_TEXT
            );
            break;
          case "toollaser":
            this.tboard.setToolType(
              TEduBoard.TOOL_TYPE.TEDU_BOARD_TOOL_TYPE_LASER
            );
            break;
          case "toolrubber":
            this.tboard.setToolType(
              TEduBoard.TOOL_TYPE.TEDU_BOARD_TOOL_TYPE_ERASER
            );
            break;

          case "toolrevoke":
            this.tboard.undo();
            break;

          case "toolrecovery":
            this.tboard.redo();
            break;

          case "tooldel":
            MessageBridge.showMessageBox({
              title: "清空白板数据将不能恢复，您确定要清空白板数据吗？",
              options: ["清空", "取消"],
              callback: index => {
                if (index === 0) {
                  this.tboard.switchFile("#DEFAULT");
                  this.tboard.clear();
                }
              }
            });
            break;
          case "tooladd":
            // if (this.tboard.getCurrentFile() == "#DEFAULT") {
            //   this.tboard.addBoard();
            // } else {
            //   this.$toasted.show("不能在文件中添加白板，请切换至默认白板");
            // }
            this.tboard.addCustomerGroup();
            break;
        }
      });

      this.on("setting_board_color_type", color => {
        console.debug(`setting_board_color_type => ${color}`);
        elkLog.report(elkLog.events.on_setting_board_color_type, {
          extra_info: `color : ${JSON.stringify(color)}`
        })
        if (color.rgba) {
          var rgba = color.rgba;
          this.tboard.setBrushColor(
            `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`
          );
        } else {
          this.tboard.setBrushColor(color);
        }
      });

      this.on("setting_board_text_size", size => {
        console.debug(`setting_board_text_size => ${size}`);
        elkLog.report(elkLog.events.on_setting_board_text_size, {
          extra_info: `size : ${JSON.stringify(size)}`
        })
        this.tboard.setTextSize(size);
      });

      this.on("setting_board_text_color", color => {
        console.debug(`setting_board_text_color => ${color}`);
        elkLog.report(elkLog.events.on_setting_board_text_color, {
          extra_info: `color : ${JSON.stringify(color)}`
        })
        this.tboard.setTextColor(color);
      });

      this.on("setting_board_brush_type", brush => {
        console.debug(`setting_board_brush_type => ${brush}`);
        elkLog.report(elkLog.events.on_setting_board_brush_type, {
          extra_info: `brush : ${JSON.stringify(brush)}`
        })
        this.tboard.setToolType(brush);
      });

      this.on("setting_board_brush_thin", thin => {
        console.debug(`setting_board_brush_thin => ${thin}`);
        elkLog.report(elkLog.events.on_setting_board_brush_thin, {
          extra_info: `thin : ${JSON.stringify(thin)}`
        })
        this.tboard.setBrushThin(thin);
      });

      this.on("setting_board_select_type", select => {
        console.debug(`setting_board_select_type => ${select}`);
        elkLog.report(elkLog.events.on_setting_board_select_type, {
          extra_info: `select : ${JSON.stringify(select)}`
        })
        this.tboard.setToolType(select);
      });

      // 关联文档
      this.on("relevant_doc", data => {
        elkLog.report(elkLog.events.on_relevant_doc, {
          extra_info: `data : ${JSON.stringify(data)}`
        })
        this.addFile(data);
      });

      // 接收到白板消息
      this.on("im_receive_board_msg", msg => {
        var elems = msg.elems;
        elems.forEach(elem => {
          // 自定义消息 && 是白板的自定义消息
          // elkLog.report(elkLog.events.on_im_receive_board_msg) // 与白板SDK上报重复
          console.debug('msg.getFromAccount() != this.userId', msg.getFromAccount(), this)
          if (
            elem.type === "TIMCustomElem" &&
            elem.content.ext === "TXWhiteBoardExt" &&
            msg.getFromAccount() != this.userId
          ) {
            try {
              this.tboard.addSyncData(JSON.parse(elem.content.data));
            } catch (error) {
              // event.fire(this, Constant.EVENT.BOARD.ADD_DATA_ERROR, error);
            }
          } else if (
            elem.type === "TIMFileElem" &&
            elem.content.name === "TXWhiteBoardExt"
          ) {
            axios.get(elem.content.downUrl).then(function(response) {
              try {
                this.tboard.addSyncData(response && response.data);
              } catch (error) {
                // event.fire(this, Constant.EVENT.BOARD.ADD_DATA_ERROR, error);
              }
            });
          }
        });
      });
    },

    on(tag, callback){
      this.eventList.push(tag)
      this.EventBus.$on(tag, callback)
    },
    
    unbindEvent(){
      this.eventList.forEach(item => {
        this.EventBus.$off(item)
      })
    },


    start({ sdkAppId, userId, userSig, groupId, platform = null, opts = {} }) {
      this.sdkAppId = sdkAppId;
      this.userId = userId;
      this.userSig = userSig;
      this.roomId = groupId;
      this.platform = platform;
      this.opts = opts;

      MessageBridge.platform = platform;

      this.tboard = window.boardSDK = new TEduBoard(
        Object.assign(
          {
            sdkAppId: sdkAppId,
            userId: userId,
            userSig: userSig,
            classId: groupId,
            platform: platform
          },
          opts,
          {
            smoothLevel: 0
          }
        )
      );
      this.initBoardEvent();
      return this.tboard;
    },

    initBoardEvent() {
      this.tboard.on(TEduBoard.EVENT.TEB_SYNCDATA, data => {
        if (Vue.runtimeEnv == Constant.RUNTIME_ENV.BROWSER) {
          IMHandler.sendBoardGroupCustomMessage(
            JSON.stringify(data),
            this.userId,
            this.userId
          );
        } else {
          MessageBridge.sendChannel({
            type: Constant.CHANNEL_TYPE.BOARD,
            data: JSON.stringify(data)
          });
        }
      });

      this.tboard.on(TEduBoard.EVENT.TEB_ADDBOARD, data => {
        this.fireBoardDataChangeEvent(data);
      });

      this.tboard.on(TEduBoard.EVENT.TEB_DELETEBOARD, data => {
        this.fireBoardDataChangeEvent(data);
      });

      this.tboard.on(TEduBoard.EVENT.TEB_GOTOBOARD, data => {
        this.fireBoardDataChangeEvent(data);
      });

      this.tboard.on(TEduBoard.EVENT.TEB_SWITCHFILE, data => {
        this.fireBoardDataChangeEvent(data);
      });
    },

    fireBoardDataChangeEvent(data) {
      var boardData = {
        currentBoard: this.tboard.getCurrentBoard(),
        currentFile: this.tboard.getCurrentFile(),
        files: this.tboard.getFileInfoList()
      };
      if (!boardData.currentFile) {
        // 有时候addFile协议还没有下来， 获取当前文件信息会获取不到
        return;
      }
      this.$emit("boardDataChange", boardData);
    },

    switchFile(fid) {
      this.tboard.switchFile(fid);
    },

    deleteFile(fid) {
      this.tboard.deleteFile(fid);
    },

    nextPage() {
      this.tboard.nextBoard();
    },

    prevPage() {
      this.tboard.prevBoard();
    },

    resize() {
      this.tboard.resize();
    },

    addFile(data) {
      if (!this.tboard) {
        console.error("tboard undefined");
        return;
      }

      if (data) {
        // 如果其他端传递进来的是字符串
        if (util.isString(data)) {
          try {
            data = JSON.parse(data);
          } catch (error) {
            data = {};
          }
        }

        // 如果是图片
        if (/\.(bmp|jpg|jpeg|png|gif|webp|svg)/i.test(data.doc_url)) {
          // 直接设置背景
          this.tboard.addCustomBackgroundGroup({
            title: data.doc_name,
            url: data.doc_url,
            width: data.doc_width,
            height: data.doc_height
          });
        } else if (/\.(mp4|avi|mpeg|mpg)/i.test(data.doc_url)) {
          // 是视频文件
          this.tboard.addVideoFile(data.doc_url, data.doc_name);
        } else if (data.is_transcode) {
          // 是转码
          this.tboard.addTranscodeFile({
            title: data.doc_name,
            pages: data.pages,
            resolution: `${data.doc_width}x${data.doc_height}`,
            url: data.transcode_result
          });
        } else if (!data.is_transcode) {
          // 非转码文件
          this.tboard.addFile(data.doc_url);
        }
        return;
      }
    }
  }
};
</script>

<style scoped>
.tedu-component-board-wrap {
  position: absolute;
  width: 100%;
  height: 100%;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  -o-user-select: none;
  user-select: none;
}

.tedu-component-board-content {
  width: 100%;
  height: 100%;
}
</style>