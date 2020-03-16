import IMHandler from './imcore/IMHandler'

export default {
  userId: null,
  userNick: null,

  login(data, lisenter) {
    return new Promise((resolve, reject) => {
      window.webim.login({
        'sdkAppID': data.sdkAppId, //用户所属应用id,必填
        'appIDAt3rd': data.sdkAppId, //用户所属应用id，必填
        'accountType': 1, //用户所属应用帐号类型，必填
        'identifier': data.userId, //当前用户ID,必须是否字符串类型，选填
        'identifierNick': data.userNick || data.userId,
        'userSig': data.userSig
      }, lisenter, {
        isAccessFormalEnv: true,
        isLogOn: false
      }, res => {
        this.userId = data.userId;
        this.userNick = data.userNick || data.userId;
        resolve(res);
      }, reject);
    });
  },

  logout() {
    return new Promise((resolve, reject) => {
      if (window.webim.checkLogin()) {
        window.webim.logout(resolve, reject);
      } else {
        resolve();
      }
    });
  },

  // setProfilePortrait() {
  //   var authData = TICSDKConfig.authData;
  //   var profile_item = [{
  //     "Tag": "Tag_Profile_IM_Nick",
  //     "Value": authData.identifierNick || authData.identifier
  //   }];

  //   if (authData.userHeadImg) {
  //     profile_item.push({
  //       "Tag": "Tag_Profile_IM_Image",
  //       "Value": authData.userHeadImg
  //     });
  //   }

  //   var options = {
  //     'ProfileItem': profile_item
  //   };

  //   webim.setProfilePortrait(
  //     options,
  //     function (resp) {},
  //     function (err) {}
  //   );
  // },


  // createRoom() {
  //   var groupID = TICSDKConfig.classRoomData.roomID + '';
  //   var groupType = TICSDKConfig.classRoomData.roomType || 'Public';
  //   var options = {
  //     'GroupId': groupID,
  //     'Owner_Account': String(TICSDKConfig.authData.identifier),
  //     'Type': groupType, //Private/Public/ChatRoom/AVChatRoom
  //     'ApplyJoinOption': 'FreeAccess',
  //     'Name': groupID,
  //     'Notification': "",
  //     'Introduction': "",
  //     'MemberList': [],
  //   };

  //   // if (options.Type == 'Private' || options.Type == 'Public') {
  //   //   options['ApplyJoinOption'] = 'FreeAccess'; // 申请加群处理方式。包含FreeAccess（自由加入）
  //   // }

  //   return new Promise((resolve, reject) => {
  //     var startTime = Date.now();
  //     webim.createGroup(
  //       options,
  //       function (resp) {
  //         resolve(resp);
  //       },
  //       function (err) {
  //         if (err.ErrorCode == 10025) {
  //           resolve(err);
  //         } else if (err.ErrorCode == 10021) {
  //           elkLog.createClassroom(err.ErrorCode, new Date().getTime() - startTime, {
  //             action_info: err.ErrorInfo
  //           });
  //           // event.fire(this, Constant.EVENT.IM.GROUP_IS_ALREADY_USED_ERROR, err);
  //           reject(err);
  //         } else {
  //           reject(err);
  //         }
  //       }
  //     );
  //   });
  // },

  // // joinBoardRoom() {
  // //   // 先创建群，成功后加入群
  // //   return new Promise((resolve, reject) => {
  // //     var groupId = TICSDKConfig.classRoomData.wbchannel;
  // //     this.createRoom(groupId, () => {
  // //       webim.applyJoinGroup({
  // //           GroupId: String(groupId)
  // //         },
  // //         function (resp) {
  // //           //JoinedSuccess:加入成功; WaitAdminApproval:等待管理员审批
  // //           if (resp.JoinedStatus && resp.JoinedStatus == 'JoinedSuccess') {
  // //             IMHandler.boardselSess = new webim.Session(webim.SESSION_TYPE.GROUP, TICSDKConfig.classRoomData.wbchannel, TICSDKConfig.classRoomData.wbchannel);
  // //             resolve(resp);
  // //           } else {
  // //             reject(resp);
  // //           }
  // //         },

  // //         function (err) {
  // //           if (err.ErrorCode == 10013) { // 被邀请加入的用户已经是群成员,也表示成功
  // //             IMHandler.boardselSess = new webim.Session(webim.SESSION_TYPE.GROUP, TICSDKConfig.classRoomData.wbchannel, TICSDKConfig.classRoomData.wbchannel);
  // //             resolve(err);
  // //           } else {
  // //             reject(err);
  // //           }
  // //         }
  // //       );
  // //     }, reject);
  // //   });
  // // },


  createGroup(userId, groupId) {
    var groupType = 'Public';
    var options = {
      'GroupId': groupId,
      'Owner_Account': userId,
      'Type': groupType, //Private/Public/ChatRoom/AVChatRoom
      'ApplyJoinOption': 'FreeAccess', // 自由加入
      'Name': groupId,
      'Notification': "",
      'Introduction': "",
      'MemberList': [],
    };

    return new Promise((resolve, reject) => {
      webim.createGroup(
        options,
        function (resp) {
          resolve(resp);
        },
        function (err) {
          if (err.ErrorCode == 10025) {
            resolve(err);
          } else if (err.ErrorCode == 10021) {
            resolve(err);
          } else {
            reject(err);
          }
        }
      );
    });
  },


  /**
   * 加入IM聊天群
   */
  joinGroup(userId, groupId) {
    // 直接加入群
    return new Promise((resolve, reject) => {

      // this.createGroup(userId, groupId).then(res => {
        webim.applyJoinGroup({
            GroupId: groupId
          },
          (resp) => {
            //JoinedSuccess:加入成功; WaitAdminApproval:等待管理员审批
            if (resp.JoinedStatus && resp.JoinedStatus == 'JoinedSuccess') {
              if (groupId.indexOf('chat') > -1) {
                IMHandler.chatSess = new webim.Session(webim.SESSION_TYPE.GROUP, groupId, groupId);
              } else {
                IMHandler.cmdSess = new webim.Session(webim.SESSION_TYPE.GROUP, groupId, groupId);
              }
              IMHandler.userId = this.userId;
              IMHandler.userNick = this.userNick;
              resolve(resp);
            } else {
              reject(resp);
            }
          },

          (err) => {
            if (err.ErrorCode == 10013) { // 被邀请加入的用户已经是群成员,也表示成功
              if (groupId.indexOf('chat') > -1) {
                IMHandler.chatSess = new webim.Session(webim.SESSION_TYPE.GROUP, groupId, groupId);
              } else {
                IMHandler.cmdSess = new webim.Session(webim.SESSION_TYPE.GROUP, groupId, groupId);
              }
              IMHandler.userId = this.userId;
              IMHandler.userNick = this.userNick;
              resolve(err);
            } else {
              reject(err);
            }
          }
        );
      // }, (err) => {
      //   reject(err);
      // });
    });
  },

  // /**
  //  * 销毁群组
  //  */
  // destroyGroup() {
  //   var groupID = TICSDKConfig.classRoomData.roomID + '';
  //   var groupType = TICSDKConfig.classRoomData.roomType || 'Public';
  //   if (groupType === 'AvChatRoom') {
  //     return this.quitBigGroup();
  //   }
  //   return new Promise((resolve, reject) => {
  //     console.log(groupID);
  //     webim.destroyGroup({
  //         GroupId: groupID
  //       },
  //       function (resp) {
  //         resolve(resp);
  //       },
  //       function (err) {
  //         reject(err);
  //       }
  //     );
  //   });
  // },

  // /**
  //  * 退出群组
  //  */
  // quitGroup() {
  //   var groupID = TICSDKConfig.classRoomData.roomID + '';
  //   var groupType = TICSDKConfig.classRoomData.roomType || 'Public';
  //   if (groupType === 'AvChatRoom') {
  //     return this.quitBigGroup();
  //   }
  //   return new Promise((resolve, reject) => {
  //     webim.quitGroup({
  //         GroupId: groupID
  //       },
  //       function (resp) {
  //         resolve(resp);
  //       },
  //       (err) => {
  //         // 群主想退群,则也认为成功
  //         if (err.ErrorCode == 10009) {
  //           resolve();
  //           return;
  //         }
  //         reject(err);
  //       }
  //     );
  //   });
  // },

  // /**
  //  * 退出大群
  //  */
  // quitBigGroup() {
  //   var groupID = TICSDKConfig.classRoomData.roomID + '';
  //   return new Promise((resolve, reject) => {
  //     webim.quitBigGroup({
  //         GroupId: groupID
  //       },
  //       function (resp) {
  //         resolve(resp);
  //       },
  //       function (err) {
  //         reject(err);
  //       }
  //     );
  //   });
  // },

  /**
   * 发送C2C文本消息
   */
  sendC2CTextMessage(toUserIdentifier, msg) {
    IMHandler.sendTextMessage(webim.SESSION_TYPE.C2C, msg, toUserIdentifier);
  },

  /**
   * 发送C2C自定义消息
   */
  sendC2CCustomMessage(toUserIdentifier, msg) {
    IMHandler.sendCustomMsg(webim.SESSION_TYPE.C2C, msg, toUserIdentifier);
  },

  /**
   * 发送群文本消息
   */
  sendGroupTextMessage(msg) {
    IMHandler.sendTextMessage(webim.SESSION_TYPE.GROUP, msg);
  },

  /**
   * 发送群组自定义消息
   */
  sendGroupCustomMessage(msg) {
    IMHandler.sendCustomMsg(webim.SESSION_TYPE.GROUP, msg);
  },

  // 发送白板数据
  sendBoardGroupCustomMessage(msg) {
    IMHandler.sendBoardGroupCustomMessage(JSON.stringify(msg));
  },

  // 发送容器数据
  sendContainerCustomMessage(msg) {
    IMHandler.sendContainerCustomMessage(JSON.stringify(msg));
  },

  // 控制信令
  sendControlCustomMessage(msg) {
    IMHandler.sendControlCustomMessage(JSON.stringify(msg));
  }

}