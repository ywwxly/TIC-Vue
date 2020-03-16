
import EventBus from "../../core/Event";
import Constant from "../../../config/Constant";
import elkLog from "../../../request/ELKlog";

var ImHandler = {
  userId: null,
  userNick: null,

  // 白板房间的session
  cmdSess: null,
  // 聊天房间的session
  chatSess: null,

  sendMsgFailMap: {

  },

  /**
   * 传输白板数据
   * @param {*} content 
   */
  sendBoardGroupCustomMessage(content, userId, userNick) {
    var ext = 'TXWhiteBoardExt'
    if(!this.cmdSess) return
    var msg = new webim.Msg(this.cmdSess, true, -1, Math.round(Math.random() * 4294967296),
      Date.now(), userId, webim.GROUP_MSG_SUB_TYPE.COMMON, userNick || userId);
    var custom = new webim.Msg.Elem.Custom(content, '', ext);
    msg.addCustom(custom);
    msg.PushInfoBoolean = true;
    msg.PushInfo = {
      Ext: ext,
      PushFlag: 0
    };
    webim.sendMsg(msg, (resp) => {
      console.log(resp);
    }, (error) => {
      elkLog.report(elkLog.events.send_board_group_custom_message,{
        action_info: '[IM sendboardmsg] 传输白板数据失败',
        extra_info: JSON.stringify(error),
      })
      console.log("[IM sendboardmsg] 传输白板数据失败", error);
      this.retrySendMessage(ext, msg);
    });
  },

  /**
   * 重试逻辑
   * @param {*} msg 
   */
  retrySendMessage(type, msg) {
    if(!this.sendMsgFailMap[type]){
      this.sendMsgFailMap[type] = {}
    }
    // 重试3次
    if ((this.sendMsgFailMap[type][msg.seq + ''] || 0) > 1) {
      return;
    }
    this.sendMsgFailMap[type][msg.seq + ''] = (this.sendMsgFailMap[type][msg.seq + ''] || 0) + 1;
    webim.sendMsg(msg, function (resp) {
      console.log(resp);
    }, (error) => {
      elkLog.report(elkLog.events.send_board_group_custom_message,{
        action_info: '[IM sendboardmsg] 传输白板数据重试失败',
        extra_info: JSON.stringify(error),
      })
      console.log("[IM sendboardmsg] 传输白板数据重试失败", error);
      this.retrySendMessage(type, msg);
    })
  },

  
  /**
   * 传输容器数据
   * @param {*} content 
   */
  sendContainerCustomMessage(content, userId, userNick) {
    var ext = 'CONTAINER'
    if(!this.cmdSess) return
    var msg = new webim.Msg(this.cmdSess, true, -1, Math.round(Math.random() * 4294967296),
      Date.now(), userId, webim.GROUP_MSG_SUB_TYPE.COMMON, userNick || userId);
    var custom = new webim.Msg.Elem.Custom(content, '', ext);
    msg.addCustom(custom);
    msg.PushInfoBoolean = true;
    msg.PushInfo = {
      Ext: ext,
      PushFlag: 0
    };
    console.log('[IM sendmsg]', msg)
    webim.sendMsg(msg, (resp) => {
      console.log('[IM sendmsg] succ',resp);
    }, (error) => {
      console.log('[IM sendmsg] error',resp);
      this.retrySendMessage(ext, msg);
    });
  },

  
  /**
   * 传输容器数据
   * @param {*} content 
   */
  sendControlCustomMessage(content, userId, userNick) {
    var ext = 'CTRL'
    if(!this.cmdSess) return
    var msg = new webim.Msg(this.cmdSess, true, -1, Math.round(Math.random() * 4294967296),
      Date.now(), userId, webim.GROUP_MSG_SUB_TYPE.COMMON, userNick || userId);
    var custom = new webim.Msg.Elem.Custom(content, '', ext);
    msg.addCustom(custom);
    msg.PushInfoBoolean = true;
    msg.PushInfo = {
      Ext: ext,
      PushFlag: 0
    };
    webim.sendMsg(msg, (resp) => {
      console.log(resp);
    }, (error) => {
      this.retrySendMessage(ext, msg);
    });
  },

  /**
   * 发送普通文本消息
   * @param {*} selType 接收方类型（个人/群组）
   * @param {*} msgText 消息内容
   * @param {*} toUser 接收方ID
   */
  sendTextMessage(selType, msgText, toUser) {
    var maxLen, errInfo;
    if (selType == webim.SESSION_TYPE.C2C) {
      if (!toUser) {
        // EventBus.$emit(Constant.EVENT.IM.SEND_CHAT_MSG_EMPTY_RECEIVE_ERROR, msgText);
        return;
      }
      maxLen = webim.MSG_MAX_LENGTH.C2C;
      errInfo = "消息长度超出限制(最多" + Math.round(maxLen / 3) + "汉字)";
    } else {
      maxLen = webim.MSG_MAX_LENGTH.GROUP;
      errInfo = "消息长度超出限制(最多" + Math.round(maxLen / 3) + "汉字)";
    }

    if (msgText ===  null || msgText.length < 1) {
      EventBus.$emit(Constant.EVENT.IM.SEND_CHAT_MSG_EMPTY_MSG_ERROR, msgText);
      return;
    }
    var msgLen = webim.Tool.getStrBytes(msgText);

    if (msgLen > maxLen) {
      EventBus.$emit(Constant.EVENT.IM.SEND_CHAT_MAX_LENGTH_MSG_ERROR, errInfo);
      return;
    }

    var selSess = null;
    var subType; //消息子类型

    // 如果是发给群组
    if (selType == webim.SESSION_TYPE.GROUP) {
      selSess = this.chatSess;
      subType = webim.GROUP_MSG_SUB_TYPE.COMMON;
    } else {
      subType = webim.C2C_MSG_SUB_TYPE.COMMON;
      selSess = new webim.Session(selType, toUser, toUser, '', this.getUnixTimestamp());
    }

    var isSend = true; //是否为自己发送
    var seq = -1; //消息序列，-1表示 SDK 自动生成，用于去重
    var random = Math.round(Math.random() * 4294967296); //消息随机数，用于去重
    var msgTime = this.getUnixTimestamp(); //消息时间戳
    var msg = new webim.Msg(selSess, isSend, seq, random, msgTime, this.userId, subType, this.userNick);
    var text_obj, face_obj, tmsg, emotionIndex, emotion, restMsgIndex;

    //解析文本和表情
    var expr = /\[[^[\]]{1,3}\]/mg;
    var emotions = msgText.match(expr);
    if (!emotions || emotions.length < 1) {
      text_obj = new webim.Msg.Elem.Text(msgText);
      msg.addText(text_obj);
    } else {
      for (var i = 0; i < emotions.length; i++) {
        tmsg = msgText.substring(0, msgText.indexOf(emotions[i]));
        if (tmsg) {
          text_obj = new webim.Msg.Elem.Text(tmsg);
          msg.addText(text_obj);
        }
        emotionIndex = webim.EmotionDataIndexs[emotions[i]];
        emotion = webim.Emotions[emotionIndex];
        if (emotion) {
          face_obj = new webim.Msg.Elem.Face(emotionIndex, emotions[i]);
          msg.addFace(face_obj);
        } else {
          text_obj = new webim.Msg.Elem.Text(emotions[i]);
          msg.addText(text_obj);
        }
        restMsgIndex = msgText.indexOf(emotions[i]) + emotions[i].length;
        msgText = msgText.substring(restMsgIndex);
      }
      if (msgText) {
        text_obj = new webim.Msg.Elem.Text(msgText);
        msg.addText(text_obj);
      }
    }

    webim.sendMsg(msg, function (resp) {
      if (selType == webim.SESSION_TYPE.C2C) { //私聊时，在聊天窗口手动添加一条发的消息，群聊时，长轮询接口会返回自己发的消息
        EventBus.$emit(Constant.EVENT.IM.RECEIVE_C2C_MSG, msg);
      }
      EventBus.$emit(Constant.EVENT.IM.SEND_CHAT_MSG_SUCC);
    }, function (err) {
      EventBus.$emit(Constant.EVENT.IM.SEND_CHAT_MSG_ERROR, err);
    });
  },


  /**
   * 发送自定义消息
   * @param {*} selType 接收方类型（个人/群组）
   * @param {*} msgObj 消息内容
   * @param {*} toUser 接收方ID
   */
  sendCustomMsg(selType, msgObj, toUser) {
    var maxLen, errInfo;
    if (selType == webim.SESSION_TYPE.C2C) {
      if (!toUser) {
        EventBus.$emit(Constant.EVENT.IM.SEND_CHAT_MSG_EMPTY_RECEIVE_ERROR, JSON.stringify(msgObj));
        return;
      }

      maxLen = webim.MSG_MAX_LENGTH.C2C;
      errInfo = "消息长度超出限制(最多" + Math.round(maxLen / 3) + "汉字)";
    } else {
      maxLen = webim.MSG_MAX_LENGTH.GROUP;
      errInfo = "消息长度超出限制(最多" + Math.round(maxLen / 3) + "汉字)";
    }

    var data = msgObj.data;
    var desc = msgObj.desc;
    var ext = msgObj.ext;

    var msgLen = webim.Tool.getStrBytes(data);
    if (data.length < 1) {
      EventBus.$emit(Constant.EVENT.IM.SEND_CHAT_MSG_EMPTY_MSG_ERROR, JSON.stringify(msgObj));
      return;
    }

    if (msgLen > maxLen) {
      EventBus.$emit(Constant.EVENT.IM.SEND_CHAT_MAX_LENGTH_MSG_ERROR, JSON.stringify(msgObj));
      return;
    }

    var selSess = null;
    var subType; //消息子类型

    // 如果是发给群组
    if (selType == webim.SESSION_TYPE.GROUP) {
      selSess = this.chatSess;
      subType = webim.GROUP_MSG_SUB_TYPE.COMMON;
    } else {
      selSess = new webim.Session(selType, toUser, toUser, '', this.getUnixTimestamp());
      subType = webim.C2C_MSG_SUB_TYPE.COMMON;
    }

    var isSend = true; //是否为自己发送
    var seq = -1; //消息序列，-1表示 SDK 自动生成，用于去重
    var random = Math.round(Math.random() * 4294967296); //消息随机数，用于去重
    var msgTime = this.getUnixTimestamp(); //消息时间戳

    var msg = new webim.Msg(selSess, isSend, seq, random, msgTime, TICSDKConfig.authData.identifier, subType, TICSDKConfig.authData.identifierNick);

    var custom_obj = new webim.Msg.Elem.Custom(data, desc, ext);
    msg.addCustom(custom_obj);
    //调用发送消息接口
    webim.sendMsg(msg, function (resp) {
      if (selType == webim.SESSION_TYPE.C2C) { //私聊时，在聊天窗口手动添加一条发的消息，群聊时，长轮询接口会返回自己发的消息
        EventBus.$emit(Constant.EVENT.IM.RECEIVE_C2C_MSG, msg);
      }
    }, function (err) {
      EventBus.$emit(Constant.EVENT.IM.SEND_CHAT_MSG_ERROR, err);
    });
  },

  /**
   * 获取unixTimestamp时间戳
   */
  getUnixTimestamp() {
    return Math.round(new Date().getTime() / 1000);
  }
};

export default ImHandler;