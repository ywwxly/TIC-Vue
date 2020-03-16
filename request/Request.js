// const Config = require('../config/Config');
// const elkLog = require('./ELKLog');

import RequestConfig from '../config/RequestConfig'
import Global from '../config/Global'
import elkLog from "../request/ELKlog"
import axios from 'axios'
// import util from '../util/util';
// import Config from '../config/Config';
// import elkLog from './ELKLog';
// import localAxios from './localAxios';


var BOMQuery = function (n) {
  var m = window.location.search.match(new RegExp('(\\?|&)' + n + '=([^&]*)(&|$)'))
  return !m ? '' : decodeURIComponent(m[2])
}
function Request() {
  var axiosInstance = this.axios = axios.create({
  });

  axiosInstance.defaults.headers.post['Content-Type'] = RequestConfig.contentType;

  // 添加请求拦截器
  axiosInstance.interceptors.request.use(function (config) {
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
    return response;
  }, function (error) {
    // 对响应错误做点什么
    elkLog.report(elkLog.events.apiResponse_ERROR,{
      extra_info: JSON.stringify(error),
    })
    return Promise.reject(error);
  });
}

Request.prototype.heartbeat = function (data) {
  var url = (BOMQuery('env') === 'dev' ? RequestConfig.testHeartbeatUrl: RequestConfig.heartbeatUrl) + Global.sdkAppId + '&usersig=' + Global.userSig + '&identifier=' + Global.userId + '&contenttype=json&random=' + parseInt(Math.random(0,1) * 100000000);
  return this.axios.post(
    url,
    Object.assign({
      LastReportTime: parseInt(+new Date() / 1000),
      HeartbeatVersion: "1.0"
    }, data)
  )
}

export default Request;