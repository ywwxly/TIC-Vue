import TRTC from 'trtc-js-sdk'

export default {
  rtc: null,
  options: null,
  lisenters: {},

  RTCEvent: [
    'stream-added', 'stream-subscribed', 'stream-updated', 'stream-removed',
    'connection-state-changed',
    'peer-join', 'peer-leave', 
    'mute-audio', 'mute-video', 'unmute-audio', 'unmute-video',
    'client-banned',
    'error',
    'player-state-changed',
    'screen-sharing-stopped'
  ],

  addLisenters(lisenters) {
    for (var eventName in lisenters) {
      if (this.RTCEvent.indexOf(eventName) > -1) {
        this.lisenters[eventName] = lisenters[eventName];
        this.client.on(eventName, lisenters[eventName])
      }
    }
  },

  // 初始化
  init(options) {
    this.options = options;
    this.client = TRTC.createClient({
      mode: 'live',
      sdkAppId: options.sdkAppId,
      userId: options.userId,
      userSig: options.userSig
    })
    // this.rtc = new RTC({
    //   "userId": options.userId,
    //   "sdkAppId": options.sdkAppId,
    //   "userSig": options.userSig
    // });
    window.RTC = this.client;
    return this.client;
  },

  joinRoom(roomId, role) {
    return this.client.join({roomId, role: role ? role : 'audience'});
  },

  /**
   * 本地预览
   */
  previewLocalStream(options) {
    console.debug('previewLocalStream with options => ', JSON.stringify(options))

    var object = Object.assign({ audio: true, video: true }, options)
    this.localStream = TRTC.createStream( object );
    if( options.attributes ){
      this.localStream.setVideoProfile(options.attributes);
    }
    return this.localStream.initialize()
  },

  /**
   * 
   * @param {*} options 
   */
  // startRTC(options) {
  publish(stream) {
    console.debug('[RTC] - publish', stream)
    return this.client.publish(stream)
  },

  unpublish(stream) {
    console.error('[RTC] - unpublish', stream)
    return this.client.unpublish(stream)
  },


  /**
   * 停止推流
   */
  stopRTC(options = {}) {
    console.debug('[RTC] - stopRTC', options)
    return new Promise((resolve, reject) => {
      this.rtc.stopRTC(options, resolve, reject);
    })
  },

  /**
   * 
   * @param {*} options 
   */
  updateStream(options) {
    console.debug('[RTC] - updateStream', options)
    return new Promise((resolve, reject) => {
      this.rtc.updateStream(options, resolve, reject);
    })
  },
  

  /**
   * 退出
   */
  quit() {
    console.debug('[RTC] - quit')
    return new Promise((resolve, reject) => {
      this.rtc.quit(resolve, reject);
    })
  },

  /**
   * 获取摄像头设备
   */
  getCameraDevices() {
    return new Promise((resolve, reject) => {
      this.rtc.getVideoDevices(resolve);
    })
  },

  /**
   * 设置摄像头
   */
  setCamera(device) {
    this.rtc.chooseVideoDevice(device)
  },

  /**
   * 打开摄像头
   */
  openVideo() {
    return new Promise((resolve, reject) => {
      this.rtc.openVideo(resolve);
    })
  },

  /**
   * 关闭摄像头
   */
  closeVideo() {
    return new Promise((resolve, reject) => {
      this.rtc.closeVideo(resolve);
    })
  },

    /**
   * 打开麦克风
   */
  openAudio() {
    return new Promise((resolve, reject) => {
      this.rtc.openAudio(resolve);
    })
  },

  /**
   * 设置摄像头
   */
  setAudio(device) {
    this.rtc.chooseAudioDevice(device)
  },
    /**
   * 关闭麦克风
   */
  closeAudio() {
    return new Promise((resolve, reject) => {
      this.rtc.closeAudio(resolve);
    })
  },

  isPushing() {
    return this.rtc.global.peerConnections[0] || false
  }


};