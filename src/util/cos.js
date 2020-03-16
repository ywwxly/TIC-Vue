import Constant from '../config/Constant'
import COS from 'cos-js-sdk-v5'
import axios from "axios"
import api from "../request/Api";
import md5 from 'js-md5'
export default {

  cos: {
    instance: null,
    region: "ap-shanghai",
    bucket: null,
    params: null
  },
  formValues: {
    doc_name:null,
    doc_url: null,
    doc_ext: null,
    doc_size: null,
    doc_md5: null,
    owner: null,
    permission: 'public',
    is_transcode: true,
  },
  init(config = {}){
    this.sdkAppId = config.sdkAppId
    this.userId = config.userId
    this.token = config.token
    this.classId = config.classId
    this.getAuthorization()
    this.initCOS()
  },

  initCOS() {
    this.cos.instance = new COS({
      getAuthorization: (options, callback) => {
        this.getAuthorization(options, callback)
      }
    })
  },

  // 获取COS鉴权接口
  getAuthorization(options, callback){
    var sdkAppId = this.sdkAppId
    var userId = this.userId
    var userSig = this.userSig
    var data = {
      cmd: "open_cos_svc",
      sub_cmd: "get_cos_token",
      duration: 300,
      version: 1
    };
    axios.request({
      headers: {
        "Content-Type": "application/json"
      },
      transformRequest: [function(data) {
        data = JSON.stringify(data)
        return data
      }],
      method: "post",
      url: "https://yun.tim.qq.com/v4/ilvb_edu/cos?SdkAppId="+sdkAppId+"&AccountType=35615&Identifier="+userId+"&UserSig="+userSig,
      data: data
    }).then( (res) => {
      // var json = JSON.parse(data);
      var json = res.data
      if (callback) {
        callback({
          TmpSecretId: json && json.tmp_secret_id,
          TmpSecretKey: json && json.tmp_secret_key,
          XCosSecurityToken: json && json.session_token,
          ExpiredTime: json.expired_time,
        })
      }else{
        this.cos.bucket = json.bucket_name + '-'+ Constant.COS_APPID
      }
    }).catch((err)=> {
      if (callback) {
        callback(false, "", err);
      }
      console.error("[TAG-UPLOAD] getMemberList->error: ", err);
    });
  },

  // 上传课件到业务服务器
  uploadBussinessDoc(callback){
    var data = this.formValues;
    console.debug("[TAG-UPLOAD] this.->enter");
    api.addDocument(data).then((res)=>{
      callback(true, res.data)
    }).catch( (e) => {
      callback(false, JSON.stringify(e));
    })
  },

  resetFormValues(){
    this.formValues = {
      doc_name:null,
      doc_url: null,
      doc_ext: null,
      doc_size: null,
      doc_md5: null,
      owner: null,
      permission: 'public',
      is_transcode: null,
    }
  },


  // 获取上传文件信息
  getFileInfoAndUpload(type, is_transcode, file, callback) {
    var fr = new FileReader();
    this.resetFormValues()
    fr.onload = (e) => {
      this.formValues.doc_md5 = md5(e.target.result);
    }
    fr.readAsArrayBuffer(file)
    // if( !this.formValues.doc_name ){
      this.formValues.doc_name = file.name
      this.formValues.is_transcode = is_transcode
    // }
    this.formValues.permission = type
    this.updateFile(file, callback)
  },

  // 上传课件
  updateFile(file, callback) {
    if( !this.cos.instance ){
      return
    }
    var bucket = this.cos.bucket;
    var region = this.cos.region;
    if(file.size === 0 ){
      callback(false, {
        message: '上传失败：文件大小为0'
      })
      return
    }
    
    this.cos.instance.sliceUploadFile({
      Bucket: bucket,
      Region: region,
      Key: `/console/${this.userId}/${parseInt(new Date().getTime()/1000)}_${file.name}`,
      Body: file,
      onHashProgress: function (progressData) {
        console.debug('校验中', JSON.stringify(progressData));
      },
      onProgress: function (progressData) {
        console.debug('上传中', JSON.stringify(progressData));
      },
    }, (err, data) => {
      if (data && data.statusCode === 200) {
        // 上传成功

        console.debug('上传成功', JSON.stringify(data));
        var decodeLocation = decodeURIComponent(data.Location)
        console.debug('decodeLocation', decodeLocation)
        this.formValues = Object.assign(this.formValues, {
          doc_url: `https://${decodeLocation}`,
          doc_ext: file.name.split('.').pop(),
          doc_size: file.size
        })

        this.uploadBussinessDoc( (result, data) => {
          console.debug('result=>', result,  'data=>', data)
          if( callback ){
            callback(result, data)
          }
        })
      } else {
        // 上传失败
        console.error('upload fail', err, data)
        if( callback ){
          callback(false, data)
        }
      }
    });
  }

}