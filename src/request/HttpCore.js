import axios from 'axios'
import RequestConfig from '../config/RequestConfig'
import Constant from '../config/Constant'
import Vue from 'vue'
import Router from 'vue-router'
import Global from '../config/Global'
import elkLog from "../request/ELKlog"
Vue.use(Router)
const router = new Router()
const md5 = require('js-md5')

var BOMQuery = function (n) {
  var m = window.location.search.match(new RegExp('(\\?|&)' + n + '=([^&]*)(&|$)'))
  return !m ? '' : decodeURIComponent(m[2])
}
function HttpCore() {
  var axiosInstance = this.axios = axios.create({
    baseURL: BOMQuery('env') === 'dev' ? RequestConfig.baseUrlEnv: RequestConfig.baseUrl
  });

  // axios.defaults.baseURL = RequestConfig.baseUrl;
  axiosInstance.defaults.headers.post['Content-Type'] = RequestConfig.contentType;

  // 添加请求拦截器
  axiosInstance.interceptors.request.use(function (config) {
    config.data = {
      platform: RequestConfig.platform,
      ...config.data
    }
    config.params = {
      sdkappid: Global.sdkAppId * 1,
      user_id: config.data['userid'] || Global.userId,
      token: Global.token,
      random: Number.parseInt(Date.now() / 10000) + Number.parseInt(Math.random() * 10000),
      ...config.params
    }
    if(config.url === '/demo/v1/init') {
      // config.params['user_id'] = Global.userId
      delete config.params.user_id
      delete config.params.token
      delete config.params.user_id
    }

    if (config.url === '/saas/v1/user/login') {
      delete config.params.token
    } else if (config.url === '/saas/v1/member/visitor/join') {
      delete config.params.token
      config.params['user_id'] = '';
    } else if (config.url === '/saas/v1/user/visitor/get') {
      delete config.params.token
      delete config.params.user_id
      delete config.data.platform
      config.data['class_id'] = config.data['class_id']*1
    }

    if (!config.data.token) {
      var sign = md5(JSON.stringify(config.data));
      config.params['sign'] = sign;
    }

    // // 非心跳API请求 进行日志上报
    // if(config.url !== '/saas/v1/report/heartbeat'){
    //   console.debug(config.data);
    //   elkLog.report(elkLog.events.apiRequest_SUCC,{
    //     extra_info: "config.url:" + config.url,
    //     // data
    //   })
    // }
    // 在发送请求之前做些什么
    return config;
  }, function (error) {
    // 对请求错误做些什么
    console.log('error:', error.message);
    elkLog.report(elkLog.events.apiRequest_ERROR,{
      extra_info: JSON.stringify(error),
    })

    return Promise.reject(error);
  });

  // 添加响应拦截器
  axiosInstance.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    if (response.data && response.data.error_code) {
      if (
        response.data.error_code == 10000
        || response.data.error_code == 10004 
        || response.data.error_code == 10216
        || response.data.error_code == 10126
        || response.data.error_code == 10240
        ) {
        if (Vue.runtimeEnv == Constant.RUNTIME_ENV.BROWSER) {
          var url = '/login'
          if(Global.companyId){
            url += `/${Global.companyId}`
          }
          if(Global.classId){
            url += `/${Global.classId}`
          }
          // location.hash = url
          router.replace({
            path: url,
          });
        } 
        // Vue.toasted.show('你还没有登录，或者登录已过期');
      } else {
        // Vue.toasted.show(response.data.error_code + ':' + response.data.error_msg);
      }
      // elkLog.report(elkLog.events.apiResponse_SUCC,{
      //   extra_info: "config.url:" + config.url,
      //   action_result: response.data.error_code,
      // })
    }
    return response;
  }, function (error) {
    // 对响应错误做点什么
    elkLog.report(elkLog.events.apiResponse_ERROR,{
      extra_info: JSON.stringify(error),
    })
    return Promise.reject(error);
  });
}

HttpCore.prototype.get = function (url, data = {}) {
  return this.axios.get(url, data);
}

HttpCore.prototype.post = function (url, data = {}) {
  return this.axios.post(url, data);
}

export default new HttpCore();