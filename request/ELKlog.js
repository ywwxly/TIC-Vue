import Global from "../config/Global";
import Constant from "../config/Constant";

/**
 * ELK日志系统
 */
function ELKLog() {}

ELKLog.prototype = {
  // APIURL: 'https://ilivelog.qcloud.com',
  APIURL: "https://ilivelog.qcloud.com",
  method: "POST",
  //事件时机
  events: {
    // LoginComponent
    login: "login",
    logout: "logout",
    checkProtocol_SUCC: "checkProtocol_SUCC",
    checkProtocol_FAIL: "checkProtocol_FAIL",

    // Class.vue
    stop_class: "stop_class",
    start_class: "start_class",
    get_class_info: "get_class_info",
    join_class_succ: "join_class_succ",
    join_class_fail: "join_class_fail",

    on_im_receive_container_msg: "im_receive_container_msg",
    on_ctrl_command_emit: "ctrl_command_emit",
    on_send_chat_msg_succ: "on_send_chat_msg_succ",
    on_send_chat_msg_error: "on_send_chat_msg_error",
    on_send_chat_msg_empty_msg_error: "on_send_chat_msg_empty_msg_error",
    on_send_chat_max_length_mag_error: "on_send_chat_max_length_mag_error",
    im_send_container_msg: "im_send_container_msg",

    container_inited: "container_inited",
    container_loaded: "container_loaded",
    container_error: "container_error",

    new_toolbar: "new_toolbar",
    add_toolbar: "add_toolbar",
    on_toolbar_next: "on_toolbar_next",
    on_toolbar_play: "on_toolbar_play",
    on_toolbar_prev: "on_toolbar_prev",
    on_toolbar_minimize: "on_toolbar_minimize",
    on_toolbar_maximum: "on_toolbar_maximum",
    on_toolbar_toolrevoke: "on_toolbar_toolrevoke",
    on_toolbar_toolrecovery: "on_toolbar_toolrecovery",
    on_toolbar_tooldrag: "on_toolbar_tooldrag",
    on_toolbar_tooldel: "on_toolbar_tooldel",

    start_board: "start_board",
    on_board_outside_mousedown: "on_board_outside_mousedown",
    on_board_keydown_left: "on_board_keydown_left",
    on_board_keydown_right: "on_board_keydown_right",
    on_board_keydown_space: "on_board_keydown_space",
    on_teb_addview: "on_teb_addview",
    on_node_emit: "on_node_emit",
    on_node_del: "on_node_del",
    board_switch_file: "board_switch_file",

    on_teb_delview: "on_teb_delview",
    on_teb_zoom_drag_status: "on_teb_zoom_drag_status",
    // on_teb_onactive: 'on_teb_onactive',
    on_teb_error: "on_teb_error",
    on_teb_warning: "on_teb_warning",
    board_data_change: "board_data_change",

    get_class_members: "get_class_members",
    set_aux_stream: "set_aux_stream",
    delete_aux_stream: "delete_aux_stream",
    update_video: "update_video",
    update_show_mode: "update_show_mode",
    get_node: "get_node",

    //IMComponent.vue
    loginIM: "loginIM",
    joinIMGroup: "joinIMGroup",
    onKicked: "onKicked", //##
    im_receive_chat_msg: "im_receive_chat_msg",

    //IMhander.js
    send_board_group_custom_message: "send_board_group_custom_message",

    //BoardComponent.vue
    // new_board: 'new_board' // 与start_board重复
    on_setting_board_draw_type: "on_setting_board_draw_type",
    on_setting_board_color_type: "on_setting_board_color_type",
    on_setting_board_text_size: "on_setting_board_text_size",
    on_setting_board_text_color: "on_setting_board_text_color",
    on_setting_board_brush_type: "on_setting_board_brush_type",
    on_setting_board_brush_thin: "on_setting_board_brush_thin",
    on_setting_board_select_type: "on_setting_board_select_type",
    on_relevant_doc: "on_relevant_doc",
    on_im_receive_board_msg: "on_im_receive_board_msg", // 待完善

    //Control.js
    ctl_send_cmd: "ctl_send_cmd",
    ctl_process_control_cmd: "ctl_process_control_cmd", // 与ctrl_command_emit存在重复
    report_right_event: "report_right_event", //设置权限事件上报返回失败
    // ctl_set_rights: 'ctl_set_rights',

    // VideoContainer.vue
    join_rtc_room: "join_rtc_room",
    // quit_rtc_room: 'quit_rtc_room',
    on_remote_stream_update: "on_remote_stream_update",
    on_local_stream_add: "on_local_stream_add",
    on_remote_stream_remove: "on_remote_stream_remove",
    on_rtc_kicked: "on_rtc_kicked",
    on_rtc_relay_timeout: "on_rtc_relay_timeout",
    on_rtc_error_notify: "on_rtc_error_notify",
    preview_local_stream: "preview_local_stream",
    start_rtc: "start_rtc",
    stop_rtc: "stop_rtc",
    update_stream: "update_stream",

    global_mic_change: "global_mic_change",
    global_camera_change: "global_camera_change",
    global_autopush_change: "global_autopush_change",

    apiRequest_SUCC: "apiRequest_SUCC",
    apiRequest_ERROR: "apiRequest_FAIL",
    apiResponse_SUCC: "apiResponse_SUCC",
    apiResponse_ERROR: "apiResponse_ERROR",

    // DeviceDetectComponent.vue
    detect_result: "detect_result",

    //HeaderComponent.vue
    icon_tap: "icon_tap",
    cancel_people_handup: "cancel_people_handup",
    report_hand_up: "student_hand_up",
    report_hand_down: "student_hand_down",

    // MobileBoardToolsComponent.vue
    mobile_show_native_view: "mobile_show_native_view",
    mobile_tool_tab: "mobile_tool_tab",

    // SettingComponent.vue
    setting_rtc_localstream_add: "setting_rtc_localstream_add",

    // DetectUtil.js
    get_camera_devices: "get_camera_devices",
    get_micro_devices: "get_micro_devices",
    get_speaker_devices: "get_speaker_devices",
    detect_microphone: "detect_microphone",
    stop_detect_microphone: "stop_detect_microphone",

    // VideoComponent.vue
    set_stream: "set_stream",
    mic_tap: "mic_tap",
    camera_tap: "camera_tap",

    set_role: "set_role",
    update_rtc_role: "update_rtc_role"
  },

  events_map: {
    login: "登录",
    logout: "登出",
    checkProtocol_SUCC: "检测electron客户端安装成功",
    checkProtocol_FAIL: "检测electron客户端安装失败",

    // Class.vue
    stop_class: "下课",
    start_class: "上课",
    get_class_info: "获取课堂信息",
    join_class_succ: "加入课堂成功",
    join_class_fail: "加入课堂失败",

    on_im_receive_container_msg: "IM-收到容器消息",
    on_ctrl_command_emit: "IM-发送交互信令",
    on_send_chat_msg_succ: "IM-发送聊天信息成功",
    on_send_chat_msg_error: "IM-发送聊天信息失败",
    on_send_chat_msg_empty_msg_error: "IM-发送错误-空消息",
    on_send_chat_max_length_mag_error: "IM-发送错误-超限",
    im_send_container_msg: "IM-发送容器消息",

    container_inited: "容器-初始化",
    container_loaded: "容器-加载成功",
    container_error: "容器-服务异常",

    add_toolbar: "任务栏-初始化",
    on_toolbar_next: "任务栏-下一页",
    on_toolbar_play: "任务栏-播放",
    on_toolbar_prev: "任务栏-上一页",
    on_toolbar_minimize: "任务栏-缩放",
    on_toolbar_maximum: "任务栏-放大",
    on_toolbar_toolrevoke: "任务栏-撤回",
    on_toolbar_toolrecovery: "任务栏-恢复",
    on_toolbar_tooldrag: "任务栏-移动",
    on_toolbar_tooldel: "任务栏-删除",

    start_board: "白板-启动", // 待考
    on_board_outside_mousedown: "白板-失去焦点", // 待考
    on_board_keydown_left: "白板-键盘left",
    on_board_keydown_right: "白板-键盘right",
    on_board_keydown_space: "白板-键盘空格",
    on_teb_addview: "白板-增加view",
    on_node_emit: "容器-窗口-增加",
    on_node_del: "容器-窗口-删除",
    board_switch_file: "白板-文档切换",

    on_teb_delview: "白板-删除view",
    on_teb_zoom_drag_status: "白板-拖拽缩放同步",
    // on_teb_onactive: 'on_teb_onactive',
    on_teb_error: "白板-异常",
    on_teb_warning: "白板-警告",
    board_data_change: "白板-数据更新",

    get_class_members: "获取成员列表",
    set_aux_stream: "TRTC-add辅路",
    delete_aux_stream: "TRTC-del辅路",
    update_video: "TRTC-更新视频流",

    update_show_mode: "业务-更新显示模式",
    get_node: "容器-获取node",

    //IMComponent.vue
    loginIM: "登录IM",
    joinIMGroup: "加群",
    onKicked: "被T下线", //##
    im_receive_chat_msg: "IM-接收聊天消息",

    //BoardComponent.vue
    // new_board: 'new_board' // 与start_board重复
    on_setting_board_draw_type: "白板操作-draw_type",
    on_setting_board_color_type: "白板操作-color_type",
    on_setting_board_text_size: "白板操作-text_size",
    on_setting_board_text_color: "白板操作-text_color",
    on_setting_board_brush_type: "白板操作-brush_type",
    on_setting_board_brush_thin: "白板操作-brush_thin",
    on_setting_board_select_type: "白板操作-select_type",
    on_relevant_doc: "白板-关联文档",
    on_im_receive_board_msg: "白板-接收白板消息",

    //Control.js
    ctl_send_cmd: "发送控制信令",
    ctl_process_control_cmd: "处理控制信令", // 与ctrl_command_emit存在重复
    // ctl_set_rights: 'ctl_set_rights',

    // VideoContainer.vue
    join_rtc_room: "TRTC-进入房间",
    // quit_rtc_room: 'quit_rtc_room',
    on_remote_stream_update: "TRTC-远端流更新",
    on_local_stream_add: "TRTC-本地流更新",
    on_remote_stream_remove: "TRTC-远端流删除",
    on_rtc_kicked: "TRTC-被T下线",
    on_rtc_relay_timeout: "TRTC-relay超时（可能是被T）",
    on_rtc_error_notify: "TRTC-错误",
    preview_local_stream: "TRTC-获取本地视频流",
    start_rtc: "TRTC-开始推流",
    stop_rtc: "TRTC-停止推流",
    update_stream: "TRTC-更新视频流",

    global_mic_change: "状态变更-麦克风",
    global_camera_change: "状态变更-摄像头",
    global_autopush_change: "状态变更-自动推流",

    apiRequest_SUCC: "API请求成功",
    apiRequest_ERROR: "API请求失败",
    apiResponse_SUCC: "API回包成功",
    apiResponse_ERROR: "API回包失败",

    // DeviceDetectComponent.vue
    detect_result: "检测结果",

    //HeaderComponent.vue
    icon_tap: "点击按钮",
    cancel_people_handup: "取消举手",
    report_hand_up: "学生举手",
    report_hand_down: "取消举手",

    // MobileBoardToolsComponent.vue
    mobile_show_native_view: "mobile_show_native_view",
    mobile_tool_tab: "mobile_tool_tab",

    // SettingComponent.vue
    setting_rtc_localstream_add: "setting模块-本地流更新",

    // DetectUtil.js
    get_camera_devices: "获取摄像头",
    get_micro_devices: "获取麦克风",
    get_speaker_devices: "获取扬声器",
    detect_microphone: "检测声音",
    stop_detect_microphone: "停止检测声音",

    // VideoComponent.vue
    set_stream: "更新流",
    mic_tap: "麦克风按钮点击",
    camera_tap: "摄像头按钮点击",

    set_role: "切换角色",
    update_rtc_role: "切换TRTC角色"
  },

  levels: {
    info: "info",
    warn: "warn",
    error: "error"
  },

  reportData: {},
  businessData: {
    business: "saas",
    type: "log",
    platform: "web",
    version: Constant.VERSION,

    useragent: null,
    sdkappid: "",
    companyid: "",
    room_id: 0, // int	房间号
    userid: "",
    role: "",
    nickname: "",

    action: "",
    time_consume: 0 //事件耗时，单位毫秒
  },

  optionalData: {
    action_result: 0, // 事件错误码
    action_info: "", // 	错误详细信息
    action_url: "",
    extra_info: ""
  },

  getXHR() {
    var xmlhttp = null;
    if (window.XMLHttpRequest) {
      xmlhttp = new XMLHttpRequest();
    }
    if (xmlhttp == null) {
      return;
    }
    return xmlhttp;
  },

  post(report) {
    this.setGlobalData();

    var xhr = this.getXHR();
    xhr.open(this.method, this.APIURL, true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send(JSON.stringify(report));
  },

  datasParseToString: function(datas) {
    var tmp = [];
    for (var p in datas) {
      tmp.push(p + "=" + encodeURIComponent(datas[p]));
    }
    return tmp.join("&");
  },

  reporterHandel: function(xhr) {
    return function() {
      if (xhr && xhr.readyState) {
        switch (xhr.readyState) {
          case 0:
            break;
          case 1:
            break;
          case 2:
            break;
          case 3:
            break;
          case 4:
            break;
        }
      }
    };
  },

  log: function(key, value) {
    this.send({
      action: key,
      action_result: value || 0,
      log_msg: key,
      log_level: this.levels.info
    });
  },

  warn: function(key, value) {
    this.send({
      action: key,
      action_result: value || 0,
      log_msg: key,
      log_level: this.levels.warn
    });
  },
  error: function(key, value) {
    this.send({
      action: key,
      action_result: value || 0,
      log_msg: key,
      log_level: this.levels.error
    });
  },

  setGlobalData: function() {
    if (Global.sdkAppId) {
      this.businessData.sdkappid = Global.sdkAppId;
    }
    if (Global.companyId) {
      this.businessData.companyid = Global.companyId;
    }
    if (Global.userId) {
      this.businessData.userid = Global.userId;
    }
    if (Global.classId) {
      this.businessData.room_id = Global.classId;
    }
    if (Global.role) {
      this.businessData.role = Global.role;
    }
    if (Global.nickname) {
      this.businessData.nickname = Global.nickname;
    }
    this.businessData.useragent = navigator.userAgent;
    this.businessData.action_url = window.location.href;
  },

  //   boardAction(action, content) {
  //     this.report(action, content);
  //   },

  // 上报日志
  report(action, data = {}) {
    // console.debug("function ELKlog.js->report() ACTION:" + action)
    this.businessData.action = action;
    var report = {};
    Object.assign(
      report,
      this.businessData,
      {
        timestamp: Date.now(),
        action_info: this.events_map[action] ? this.events_map[action] : null
      },
      data
    );
    this.post(report);
  }
};

export default new ELKLog();
