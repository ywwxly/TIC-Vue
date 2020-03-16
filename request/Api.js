import http from './HttpCore';
// import request from './Request';

export default {
  register() {

  },

  init(data) {
    var path = '/demo/v1/init';
    return http.post(path, data);
  },

  getBusinessInfo(data) {
    var path = '/saas/v1/business/base/info';
    return http.post(path, data);
  },

  login(data) {
    var path = '/saas/v1/user/login';
    return http.post(path, data);
  },

  // 查询课堂列表
  classlist(data) {
    var path = '/saas/v1/class/list';
    return http.post(path, data);
  },

  // 公开课
  publicClassList(data) {
    var path = '/saas/v1/class/public/list';
    return http.post(path, data);
  },

  // 加入课堂
  joinClass(data) {
    var path = '/saas/v1/member/join';
    return http.post(path, data);
  },

  // 退出课堂
  quitClass(data) {
    var path = '/saas/v1/member/quit';
    return http.post(path, data);
  },

  // 课堂心跳上报
  heartbeat(data) {
    var path = '/saas/v1/report/heartbeat';
    return http.post(path, data);
  },

  // 获取课堂课件
  getDocumentList(data) {
    var path = '/saas/v1/document/list';
    return http.post(path, data);
  },

  // 添加文档
  addDocument(data) {
    var path = '/saas/v1/document/add';
    return http.post(path, data);
  },

  // 添加文档
  deleteDocument(data) {
    var path = '/saas/v1/document/delete';
    return http.post(path, data);
  },

  // 获取课堂详情
  getClassDetailInfo(data) {
    var path = '/saas/v1/class/info';
    return http.post(path, data);
  },

  // 进入demo课堂
  enterDemoClass(data) {
    var path = '/paas/demo/class/enter';
    return http.post(path, data);
  },

  //下课
  stopClass(data) {
    var path = '/saas/v1/class/stop';
    return http.post(path, data);
  },

  //上课
  startClass(data) {
    var path = '/saas/v1/class/start';
    return http.post(path, data);
  },

  // 获取实时课堂成员列表
  getDemoRumtimeMembers(data) {
    var path = '/paas/demo/member/runtime/list';
    return http.post(path, data);
  },


  // 获取实时课堂成员列表
  getRumtimeMembers(data) {
    var path = '/saas/v1/member/runtime/list';
    return http.post(path, data);
  },

  // 获取游客账号
  guestGetAccount(data) {
    var path = '/saas/v1/user/visitor/get';
    return http.post(path, data);
  },

  // 游客进房
  guestJoinClass(data) {
    var path = '/saas/v1/member/visitor/join';
    return http.post(path, data);
  },

  //事件上报
  reportEvent(data) {
    var path = '/saas/v1/report/event';
    return http.post(path, data);
  },

  //获取个人详细资料
  getUserInfo(data) {
    var path = '/saas/v1/user/info';
    return http.post(path, data);
  },

  //获取签到结果
  getCheckinResult(data) {
    var path = '/saas/v1/checkIn/result';
    return http.post(path, data);
  },

  // 后进学生获取签到信息
  getCheckinInfo(data) {
    var path = '/saas/v1/checkIn/info';
    return http.post(path, data);
  },

  // 发起答题
  questionLaunch(data) {
    var path = '/saas/v1/question/launch';
    return http.post(path, data);
  },

  // 取消答题
  questionCancel(data) {
    var path = '/saas/v1/question/cancel';
    return http.post(path, data);
  },

  // 获取答题结果
  questionResult(data) {
    var path = '/saas/v1/question/result';
    return http.post(path, data);
  },

  // 学生答题
  questionReply(data) {
    var path = '/saas/v1/question/reply';
    return http.post(path, data);
  },

  // 获取答题卡信息
  questionInfo(data) {
    var path = '/saas/v1/question/info';
    return http.post(path, data);
  },

  // 获取回放视频信息
  getRecord(data) {
    var path = '/saas/v1/record/query';
    return http.post(path, data);
  },

  // 获取回放视频信息
  getIMStorageList(data) {
    var path = '/saas/v1/imstorage/list';
    return http.post(path, data);
  },

  // 获取回放视频信息
  getIMStorageMsg(data) {
    var path = '/saas/v1/imstorage/msg';
    return http.post(path, data);
  },

}