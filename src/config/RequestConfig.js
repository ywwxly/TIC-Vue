export default {
  platform: 'web',
  baseUrlEnv: 'https://iclass-preproduction.api.qcloud.com', // 后台测试环境
  baseUrl: 'https://iclass.api.qcloud.com', // 后台正式环境
  testHeartbeatUrl: 'https://yun.tim.qq.com/v4/ilvb_test/report_heartbeat?sdkappid=', // 心跳上报 测试服务
  heartbeatUrl: 'https://yun.tim.qq.com/v4/ilvb_edu/report_heartbeat?sdkappid=', // 心跳上报 正式服务
  contentType: 'application/json'
}