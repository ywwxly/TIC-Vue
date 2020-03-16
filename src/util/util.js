import moment from "moment";
import Global from "../config/Global";
import Api from "../request/Api";
import Control from '../request/Control'

export default {
  /**
   * 获取unixTimestamp时间戳(秒级时间戳)
   */
  getUnixTimestamp() {
    return Math.round(new Date().getTime() / 1000);
  },

  /**
   * 生成唯一的id
   * @param {*} len 
   * @param {*} radix 
   */
  tid(len = 8, radix = 16) {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    var uuid = [],
      i;
    radix = radix || chars.length;

    if (len) {
      for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
    } else {
      var r;
      uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
      uuid[14] = '4';
      for (i = 0; i < 36; i++) {
        if (!uuid[i]) {
          r = 0 | Math.random() * 16;
          uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
        }
      }
    }
    return 'tid-' + uuid.join('').toLowerCase();
  },

  isString(o) {
    return Object.prototype.toString.call(o) == '[object String]';
  },

  isObject(o) {
    return Object.prototype.toString.call(o) == '[object Object]';
  },

  isArray(o) {
    return Object.prototype.toString.call(o) == '[object Array]';
  },

  isFunction(o) {
    return Object.prototype.toString.call(o) == '[object Function]';
  },

  getCurrentHms() {
    return moment().format('HH:mm:ss');
  },

  formatTime(time, format) {
    return moment.unix(time).format(format);
  },

  generateGroupId(groupId) {
    return {
      cmdGroupId: `${groupId}`,
      chatGroupId: `${groupId}_chat`
    }
  },


  getQuery: function (n) {
    var m = window.location.search.match(new RegExp("(\\?|&)" + n + "=([^&]*)(&|$)"));
    return !m ? "" : decodeURIComponent(m[2]);
  },

  getHash: function (n) {
    var m = window.location.hash.match(new RegExp("(#|&)" + n + "=([^&]*)(&|$)"));
    return !m ? "" : decodeURIComponent(m[2]);
  },
  getOS: function () {
    var OSName="Unknown OS";
    if (navigator.appVersion.indexOf("Win")!=-1) OSName="Windows";
    if (navigator.appVersion.indexOf("Mac")!=-1) OSName="Mac";
    if (navigator.appVersion.indexOf("iPad")!=-1) OSName="iOS";
    if (navigator.appVersion.indexOf("iPhone")!=-1) OSName="iOS";
    if (navigator.appVersion.indexOf("Android")!=-1) OSName="Android";
    return OSName
  },

  isSdkAppId: function (id) {
    return /140\d{7}/.test(id)
  },

  getAppInfo: function(companyId){
    // demo 的兼容逻辑
    if (this.isSdkAppId(companyId)) {
      var demoCompanyInfo = {
        icon: "https://tedu.qcloudtrtc.com/img/tic.643fc1ab.png",
        name: "互动课堂Demo",
        sdkappid: 1400162216
      }
      Global.mode = 'demo'
      Global.set("companyId", 1400162216)
      Global.set("sdkAppId", 1400162216)
      Global.set("company",{
        100001: demoCompanyInfo
      } )
      return new Promise((resolve) => {
        resolve(demoCompanyInfo);
      });
    }

    Global.mode = 'product'
    var map = Global.get('company') || {};
    if( map && map[companyId] ){
      return new Promise((resolve) => {
        resolve(map[companyId]);
      });
    }else{
      Global.del('sdkAppId')
      Global.del('companyId')
      return this.getBusinessInfo(companyId).then( () => {
        var company = Global.get('company')
        return company[companyId]
      })
    }
  },

  getBusinessInfo: function (id) {
    var companyId = Global.get("companyId")
    var company = Global.get('company')
    var sdkAppId = Global.get('sdkAppId')
    if (companyId === id && sdkAppId && company && company[companyId] && company[companyId].sdkappid == sdkAppId) {
      return new Promise((resolve) => {
        resolve(company[companyId]);
      });
    } else {
      return Api.getBusinessInfo({
        enterprise_id: parseInt(id)
      }).then((res) => {
        console.debug(`getBusinessInfo => ${JSON.stringify(res.data)}`)
        if (res && res.data && res.data.error_code === 0) {
          var map = {};
          map[id] = {
            icon: res.data.icon || 'https://tedu.qcloudtrtc.com/img/tic.643fc1ab.png',
            sdkappid: res.data.sdkappid,
            name: res.data.name
          };
          Global.set("companyId", id)
          Global.set("sdkAppId", res.data.sdkappid)
          Global.set('company', map)
          return res.data.sdkappid;
        }
      })
    }
  },

  reportEvent: function (event) {
    var changed = false
    console.debug('reportEvent =>' + event)
    return Api.reportEvent({
      class_id: Global.classId,
      event: event,
    }).then( res => {
      var data = res.data
      if(data.error_code === 0){
        switch(event){
          case 'mic_open':
            if( !Global.mic){
              Global.mic = true
              changed = true
            }
            break;
          case 'mic_close':
            if(Global.mic){
              Global.mic = false
              changed = true
            }
            break;
          case 'camera_open':
            if(!Global.camera){
              Global.camera = true
              changed = true
            }
            break;
          case 'camera_close':
            if(Global.camera){
              Global.camera = false
              changed = true
            }
            break;
          default:
            break;
        }
        if( changed ){
          console.debug('reportEvent  changed  while event =>' + event)
          Control.ctlRefreshMemberInfo()
        }
      } else {
        console.error(data.error_msg)
        throw new Error(data)
      }
    })
  },

  // 格式化时间：时间(s)=>hh:mm:ss
  timeFormat(time) {
    let hour = Math.floor((time % 86400) / 3600),
        min = Math.floor((time % 3600) / 60),
        sec = Math.floor(time % 60);
    return (hour <= 9 ? '0' + hour : hour) + ':' + (min <= 9 ? '0' + min : min) + ':' + (sec <= 9 ? '0' + sec : sec);
  },
}