import IMHandler from "../components/core/imcore/IMHandler";
import EventBus from "../components/core/Event.js";
import Global from "../../src/config/Global"
import api from "../request/Api"
import elkLog from "../request/ELKlog"
import Constant from "../config/Constant";
import MessageBridge from '../util/MessageBridge.js';

export default {
    ctlGetCom(type) {
        return {
            user_id: Global.userId,
            time: + new Date(),
            type: type,
            role: Global.role,
            seq: new Date().getMilliseconds()
        }
    },

    ctlSendCmd(req) {
        var jsonStr = JSON.stringify(req);
        elkLog.report(elkLog.events.ctl_send_cmd, {
            extra_info: jsonStr
        })
        console.debug("[TAG-CTL] ctlSendCmd->req:" + jsonStr);
        IMHandler.sendControlCustomMessage(jsonStr, this.userId, this.userId);
    },

    // 设置权限
    ctlSetRights(enable, rights, ids) {
        // 老师修改学生camera和mic 权限，上报
        if(rights === 'camera' || rights === 'mic' || rights === 'platform' || rights === ''){
            let req = {
                class_id: Global.classId,
                event: 'PermissionControl',
                data: {
                    enable: (enable ? 1 : 0),
                    rights: rights === 'platform'? ['camera', 'mic'] : [rights],
                    objectId: typeof (ids) === 'string' ? [ids] : ids
                }
            }
            api.reportEvent(req).then( res => {
                if (res.data && res.data.error_code === 0) {
                    console.log(`[TAG-CTL] ctlSetRights EVENT->req => ${JSON.stringify(req)}`)
                } else {
                    if(res.data && res.data.error_code === 10228){
                        console.log(`[TAG-CTL] ctlSetRights EVENT->req => member_out_limit`)
                        EventBus.$emit("ctrl_command_emit", {
                            action: 'member_out_limit'
                        });
                    } else if(res.data){
                        console.error(`[TAG-CTL] ctlSetRights EVENT->error => ${JSON.stringify(res.data)}`)
                        elkLog.report(elkLog.events.report_right_event, {
                          action_result:res.data.error_code,
                          extra_info: `res =>${JSON.stringify(res.data)}`
                        })
                    }
                }
            })
        } else {
            let req = this.ctlGetCom("control");
            req["data"] = {
                action: (enable ? "on" : "off"),
                rights: typeof (rights) === 'string' ? [rights] : rights,
                objectId: typeof (ids) === 'string' ? [ids] : ids
            }
            this.ctlSendCmd(req);
            console.log(`[TAG-CTL] ctlSetRights IM->req => ${JSON.stringify(req)}`)
        }
        
    },

    // 控制
    ctlControl(action, ids) {
        var req = this.ctlGetCom("control");
        req["data"] = {
            action: action,
            objectId: typeof (ids) === 'string' ? [ids] : ids
        }
        this.ctlSendCmd(req);
    },

    // 上课下课
    ctlSetClass(action) {
        var req = this.ctlGetCom("control");
        req["data"] = {
            action: action,
        }
        this.ctlSendCmd(req);
    },

    // 进入退出
    ctlSendJoinExit(action) {
        var req = this.ctlGetCom("control");
        req["data"] = {
            action: action,
        }
        this.ctlSendCmd(req);
    },

    // 更新成员信息(用于视频位的状态展示)
    ctlRefreshMemberInfo() {
        var req = this.ctlGetCom("control");
        req["data"] = {
            action: "refresh_member_info",
        }
    },

    // 互动协议通用方法
    ctlGeneral(data) {
        var req = this.ctlGetCom("control");
        req["data"] = data;
        this.ctlSendCmd(req);
    },

    // 改变全员权限
    /* 
    1. action: on_all/off_all
    2. rights： mic/camera/draw/sendMsg 
    3. rights 与Global.js中的变量名一致，但禁言权限在发送控制消息中 action 取值"unmutemsg_all/mutemsg_all"，上报事件中 event 取值 "del_all_silence/all_silence"
    */
    ctlAllStatus(action, rights, env=Constant.RUNTIME_ENV.BROWSER) {
        var req = this.ctlGetCom("control");
        switch (rights) {
            // case "mic":
            // case "camera":
            case "draw":
                req["data"] = {
                    action: action, //action 取值 "off_all"
                    rights: typeof (rights) === 'string' ? [rights] : rights
                }
                break;
            case "sendMsg":
                req["data"] = {
                    action: action === "off_all" ? "mutemsg_all" : "unmutemsg_all", //发控制消息 action 取值 "mutemsg_all/unmutemsg_all"
                }
                api.reportEvent({
                    class_id: Global.classId,
                    event: action === "off_all" ? "all_silence" : "del_all_silence", // 上报事件 event 取值 "all_silence/del_all_silence"
                })
                break;
            default:
                break;
        }
        if(env==Constant.RUNTIME_ENV.BROWSER){
            this.ctlSendCmd(req);            
        } else {
            MessageBridge.platform = env
            let jsonStr = JSON.stringify(req);
            MessageBridge.sendChannel({
                type: Constant.CHANNEL_TYPE.CTRL,
                data: jsonStr
            })
        }
    },


    // 上报Apply事件
    reportApplyEvent(operate, enable, userId) {
        console.debug('report Control.js->reportApplyEvent')
        api.reportEvent({
            class_id: Global.classId,
            event: 'apply',
            data: {
                user_id: userId,
                operate: operate,
                enable: enable
            }
        });
    },



    //处理信令
    ctlProcessCmd(data) {
        var req = JSON.parse(data)
        console.log(`[TAG-CTL] ctlProcessCmd->req => ${data}`);
        if (req.type == "control") {   // 控制信令
            this.ctlProcessControlCmd(req.data, req.user_id, req.role);
        } else if (req.type == "Media") {  // 播片信令
        } else if (req.typ == "tools") {  // 组件信令
        }
    },



    // 处理控制信令
    ctlProcessControlCmd(req, sender_id, sender_role) {
        elkLog.report(elkLog.events.ctl_process_control_cmd, {
            extra_info: `${JSON.stringify(req)}`
        })
        if(req.rights) {
            req.rights = typeof (req.rights) === 'string' ? req.rights : req.rights[0]
        }
        console.debug(`[TAG-CTL] ctlProcessControlCmd => ${JSON.stringify(req)}`)
        switch (req.action) {
            case "apply": // 请求权限信令
                var handsArr = Global.handupStu;
                if (handsArr.indexOf(sender_id) == -1) {
                    // handsArr.push(sender);
                    // Global.handupStu = handsArr;
                    // sendIpcMessage("CTL:Status", sender);
                }
                break;
            case "on":  // 授权信令
                if (req.objectId.indexOf(Global.userId) != -1) {
                    this.setControlMessage(true, req.rights);
                }
                break;
            case "off": // 禁用信令
                if (req.objectId.indexOf(Global.userId) != -1) {
                    this.setControlMessage(false, req.rights);
                }
                break;
            case "mutemsg": // 禁言
                if (req.objectId.indexOf(Global.userId) != -1) {
                    api.reportEvent({
                        class_id: Global.classId,
                        event: 'slience',
                    })
                    Global.sendMsg = false;
                    EventBus.$emit("ctrl_command_emit", {
                        action: 'mutemsg'
                    });
                }
                break;
            case "unmutemsg": // 解除禁言
                if (req.objectId.indexOf(Global.userId) != -1) {
                    api.reportEvent({
                        class_id: Global.classId,
                        event: 'del_slience',
                    })
                    Global.sendMsg = true
                    EventBus.$emit("ctrl_command_emit", {
                        action: 'unmutemsg'
                    });
                }
                break;
            case "kickoff": //// 被踢
                if (req.objectId.indexOf(Global.userId) != -1) {
                    api.reportEvent({
                        class_id: Global.classId,
                        event: 'kicked',
                    })
                    EventBus.$emit("ctrl_command_emit", {
                        action: 'kickoff'
                    });
                }
                break;
            case "grant": // 角色信令
                break;
            case "layout_change": // 布局信令
                break;
            case "content_show": // 主屏显示
                break;
            case "content_hide": // 主屏隐藏
                break;
            case "class_begin": // 课程开始
                if(sender_role === Constant.CLASS_ROLE.TEACHER){
                    EventBus.$emit("ctrl_command_emit", {
                        action: 'class_begin'
                    });
                }
                break;
            case "class_end": // 课程结束
                if(sender_role === Constant.CLASS_ROLE.TEACHER){
                    EventBus.$emit("ctrl_command_emit", {
                        action: 'class_end'
                    });
                }
                break;
            case "hand_up": // 举手
                // 通知老师，有人举手
                if (Global.role === Constant.CLASS_ROLE.TEACHER || Global.role === Constant.CLASS_ROLE.ASSISTANT) {
                    EventBus.$emit("ctrl_command_emit", {
                        action: 'student_hand_up'
                    });
                }
                break;
            case "hand_down": // 取消举手
                // 学生取消举手(学生自己放下或被老师端操作都会收到此通知)
                if (req.objectId.indexOf(Global.userId) != -1) {
                    EventBus.$emit("ctrl_command_emit", {
                        action: 'hand_down'
                    });
                }
                // 通知老师，有人取消举手
                else if (Global.role === Constant.CLASS_ROLE.TEACHER || Global.role === Constant.CLASS_ROLE.ASSISTANT) {
                    EventBus.$emit("ctrl_command_emit", {
                        action: 'student_hand_down'
                    });
                }
                break;
            case "join": // 有人成员进入课堂
                EventBus.$emit("ctrl_command_emit", {
                    action: 'join',
                    sender: sender_id
                });
                break;
            case "exit": // 有人成员离开课堂
                EventBus.$emit("ctrl_command_emit", {
                    action: 'exit',
                    sender: sender_id
                });
                break;
            case "refresh_member_info": // 更新成员列表
                EventBus.$emit("ctrl_command_emit", {
                    action: 'refresh_member_info'
                });
                break;
            case "on_all": // 全员开权限 mic camera draw
                if (Global.role !== Constant.CLASS_ROLE.TEACHER) {
                    if (req.rights === "mic" || req.rights === "camera" || req.rights === "draw") {
                        this.setControlMessage(true, req.rights);
                    }
                }
                break;
            case "off_all": // 全员关权限 mic camera draw
                if (Global.role !== Constant.CLASS_ROLE.TEACHER) {
                    if (req.rights === "mic" || req.rights === "camera" || req.rights === "draw") {
                        this.setControlMessage(false, req.rights);
                    }
                }
                break;
            case "mutemsg_all":
                // if (Global.role === Constant.CLASS_ROLE.STUDENT) {
                    // api.reportEvent({
                    //     class_id: Global.classId,
                    //     event: 'slience',
                    // })
                    Global.sendMsgAll = false;
                    EventBus.$emit("ctrl_command_emit", {
                        action: 'mutemsg_all'
                    });
                // }
                break;
            case "unmutemsg_all":
                // if (Global.role !== Constant.CLASS_ROLE.TEACHER) {
                    // api.reportEvent({
                    //     class_id: Global.classId,
                    //     event: 'del_slience',
                    // })
                    Global.sendMsgAll = true;
                    EventBus.$emit("ctrl_command_emit", {
                        action: 'unmutemsg_all'
                    });
                // }
                break;
            case "show_question": // 通知学生 开始答题  
            case "cancel_question": // 通知学生 老师取消答题 
            case "timeout_question": // 通知学生 超时取消答题
            case "show_check_in": // 通知学生 开始签到
            case "hide_check_in": // 通知学生 结束签到
                if (Global.role === Constant.CLASS_ROLE.STUDENT) {
                    EventBus.$emit("ctrl_command_emit", req);
                }
                break;
            case "change_member_permission": // 成员权限变化
                EventBus.$emit("ctrl_command_emit", req);
                break;
            default:
                break;
        }
    },

    setControlMessage(type, right) {
        right = typeof (right) === 'string' ? right : right[0]
        switch (right) {
            case 'mic':
            case 'camera':
                // if(Global[right] == type) {
                EventBus.$emit("ctrl_command_emit", {
                    action: right + '_' + (type ? 'open' : 'close')
                });
                console.debug(`[TAG-CTL] setControlMessage - ${right} => ${Global[right]}`)
                // }
                break;
            case 'draw':
                EventBus.$emit("ctrl_command_emit", {
                    action: right + '_' + (type ? 'open' : 'close')
                });
                Global.draw = type
                api.reportEvent({
                    class_id: Global.classId,
                    event: (type ? 'enable' : 'disable') + '_draw',
                })
                console.debug(`[TAG-CTL] setControlMessage - ${right} => ${Global[right]}`)
                break;
            default:
                break;
        }

    }
}