export default {
  VERSION: "1.2.1",
  COS_APPID: 1259648581,
  DETECT_TYPE: {
    'CAMERA': 'camera',
    'SPEAKER': 'speaker',
    'MICROPHONE': 'microphone',
    'RESULT': 'result'
  },

  MAX_VIDEO_COUNT: 6,
  MAX_AUDIO_COUNT: 64,

  DETECT_TYPE_TITLE: {
    'CAMERA': '摄像头检测',
    'SPEAKER': '扬声器检测',
    'MICROPHONE': '麦克风检测',
  },

  TOOL_STATUS: {
    EXPAND: 1, // 展开状态
    COLLAPSE: 0 // 折叠状态
  },

  STORAGE_KEY: {
    COMPANY: 'Q_EDU_SAAS_COMPANY',
    COMPANYID: 'Q_EDU_SAAS_COMPANYID',
    CLASSID: 'Q_EDU_SAAS_CLASSID',
    SDKAPPID: 'Q_EDU_SAAS_SDKAPPID',
    USERID: 'Q_EDU_SAAS_USERID',
    NICKNAME: 'Q_EDU_SAAS_NICKNAME',
    USERSIG: 'Q_EDU_SAAS_USERSIG',
    TOKEN: 'Q_EDU_SAAS_TOKEN',
    USERTOKEN: 'Q_EDU_SAAS_USERTOKEN',
    PASSWORD: 'Q_EDU_SAAS_PASSWORD',
    DEVICE_DETECT: 'Q_EDU_SAAS_DEVICE_DETECT',
    CLASSPASSWORD: 'Q_EDU_SAAS_CLASSPASSWORD',
    USERACCOUNT: 'Q_EDU_SAAS_USERACCOUNT',
    GUESTFLAG: 'Q_EDU_SAAS_GUESTFLAG',
    DRAW: 'Q_EDU_SAAS_DRAW',
    DEMOLOGININFO: 'Q_EDU_SAAS_DEMO_LOGIN_INFO',
  },


  DOCUMENT_TYPE: {
    PUBLIC: 'public',
    PRIVATE: 'private'
  },

  // 运行环境
  RUNTIME_ENV: {
    BROWSER: 'BROWSER', // 浏览器
    ELECTRON: 'ELECTRON' // electron
  },


  // 消息类型
  CHANNEL_TYPE: {
    CHAT: 'CHAT',
    CTRL: 'Ctrl',
    BOARD: 'BOARD',
  },

  // 设置二级窗口的tab
  SETTING_TABS: {
    'DEVICE-DETECT': 'device-detect',
    // 'CAPTION': 'caption',
    'LAYOUT': 'layout',
  },

  SETTING_TABS_TITLE: {
    'DEVICE-DETECT': '设备检测',
    'CAPTION': '字幕',
    'LAYOUT': '布局',
  },

  CLASS_STATUS: {
    END: 'end',//已经结束的课堂
    ING: 'ing',//进行中的课堂
    WILL: 'will',//未开始的课堂
  },

  // 课堂角色
  CLASS_ROLE: {
    SUPERADMIN: 'superadmin',//'超级管理员',
    ADMIN: 'admin',//'普通管理员',
    TEACHER: 'teacher',//'教师',
    ASSISTANT: 'assistant',//'助教',
    STUDENT: 'student',//'学生',
    SUPERVISOR: 'supervisor',//'巡课员',
    VISITOR: 'visitor',//'游客',
  },

  // 课堂角色
  CLASS_ROLE_TEXT: {
    superadmin: '超级管理员',
    admin: '普通管理员',
    teacher: '教师',
    assistant: '助教',
    student: '学生',
    supervisor: '巡课员',
    visitor: '游客',
  },

  // 转码状态
  TRANSCODE_STATUS: {
    prepare: '准备',
    queued: '准备', //这里没有bug，两个都是 准备
    processing: '转码中',
    prepared: '完成',
    finished: '完成',
  },

  // 可用状态
  TRANSCODE_VALID_STATUS: [ 'prepared', 'finished' ],
  
  PAGINATION_SIZE: 10, // 分页数

  //Class view status
  MessageBoxStatus: 'saas_msgboxstatus',
  BoardBoxStatus: 'saas_boardboxstatus',
  VideoBoxStatus: 'saas_videoboxstatus',


  
  EVENT: {
    IM: {
      SEND_CHAT_MSG_SUCC: 'send_chat_msg_succ',
      SEND_CHAT_MSG_ERROR: 'send_chat_msg_error',
      SEND_CHAT_MSG_EMPTY_MSG_ERROR: 'send_chat_msg_empty_msg_error',
      SEND_CHAT_MAX_LENGTH_MSG_ERROR: 'send_chat_max_length_msg_error',
      RECEIVE_C2C_MSG: 'receive_c2c_msg'
    }
  },


  LAYOUT: {
    SINGLE: 1,
    MULTIPLE: 2
  },

  CLASS_VIDEO_TYPE: {
    LIVE: 'live',
    TRTC: 'trtc'
  },

  ROLE: {
    MASTER: 'master',
    CLIENT: 'client'
  }
}
