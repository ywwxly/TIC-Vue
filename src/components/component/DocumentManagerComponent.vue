<template>
  <div class="tedu-component-document-manager-wrap">
    <div class="tedu-component-document-manager-content">
      <DialogWidget ref="dm-dialog-ref">
        <template v-slot:header>{{title}}</template>
        <template v-slot:main>
          <div class="tic-tab">
            <!-- tab navi -->
            <div class="tic-tab__list">
              <ul>
                <li
                v-bind:class="{actived: currentDocType === DOCUMENT_TYPE.PRIVATE}"
                @click="switchDocType(DOCUMENT_TYPE.PRIVATE)"
                >私人课件</li>
                <li
                v-bind:class="{actived: currentDocType === DOCUMENT_TYPE.PUBLIC}"
                @click="switchDocType(DOCUMENT_TYPE.PUBLIC)"
                >公共课件</li>
              </ul>
            </div>
            <!-- tab navi -->

            <!-- tab content -->
            <div class="tic-tab__content">
              <template
              v-for="(list, doctype) in documentData"
              >
                <!-- search -->
                <div  v-show="currentDocType === doctype" class="tic-justify align-middle">
                  <div class="col">
                    <div class="tic-input-search">
                      <button class="tic-btn weak" @click="search(doctype)"><i class="tic-icon tic-icon-search" ></i></button>
                      <input type="search" class="tic-input" @keyup.enter="search(doctype)" v-model="prefix[currentDocType]" placeholder="请输入想要搜索的课件">
                      {{ doctype }}
                      {{ currentDocType }}
                    </div>
                  </div>
                  <div class="col tic-justify-btn">
                    <input id="file" type="file" :ref="`fileinput.${doctype}`" @change="selectFile" style="display:none"  accept=".doc, .docx, .ppt, .pptx, .pdf, .jpg, .png">                    
                    <a @click="refresh" href="javascript:;" class="tic-btn"><i class="tic-icon tic-icon-refresh" ></i></a>
                    <a @click="addFile" v-if="!([1400162216,1400127140].indexOf(sdkAppId)!==-1 && doctype === 'public')" href="javascript:;" class="tic-btn" title="支持ppt，pptx，pdf，doc，docx，jpg，png文件上传"><i class="tic-icon tic-icon-upload"></i></a>

                  </div>
                </div>
                <!-- search -->
                <!-- content -->
                <div v-show="currentDocType === doctype" class="tic-table">
                    <div class="tic-table__head">
                      <table>
                        <colgroup>
                          <col> 
                          <col> 
                          <col> 
                          <col style="width: 80px;">
                          <col v-if="doctype === 'private'" style="width: 80px;">
                        </colgroup>
                        <thead>
                          <tr>
                            <th>
                              <div class="">
                                <span class="text">文件名称</span>
                              </div>
                            </th>
                            <th>
                              <div class="">
                                <span class="text">大小</span>
                              </div>
                            </th>
                            <th>
                              <div class="">
                                <span class="text">修改日期</span>
                              </div>
                            </th>
                            <th>
                              <div class="">
                                <span class="text">状态</span>
                              </div>
                            </th>
                            <th v-if="doctype === 'private'">
                              <div class="">
                                <span class="text">操作</span>
                              </div>
                            </th>
                          </tr>
                        </thead>
                      </table>
                    </div>
                    <div class="tic-table__body roll-scroll">
                      <table>
                        <colgroup>
                          <col> 
                          <col> 
                          <col> 
                          <col style="width: 80px;">
                          <col v-if="doctype === 'private'" style="width: 80px;">
                        </colgroup>
                        <tbody>
                          <template v-if="list.length == 0">
                            <tr class="table-empty">
                              <td colspan="4">
                                <div>
                                  当前列表为空
                                </div>
                              </td>
                            </tr>
                          </template>
                          <template v-else>
                            <tr v-for="(item, key) in list" :key="key" class="doclist" @click="relevant(item)">
                              <td>
                                <div class="">
                                  <i :class="`tic-icon tic-icon-${getFileType(item.doc_ext)}`"></i>
                                  <span class="text">{{ item.doc_name }}</span>
                                </div>
                              </td>
                              <td>
                                <div class="">
                                  <span class="text">{{ item.doc_size | formatSize }}</span>
                                </div>
                              </td>
                              <td>
                                <div class="">
                                  <span class="text">{{ item.upload_time | formatTime }}</span>
                                </div>
                              </td>
                              <td>
                                <div class="" v-if = "item.is_transcode === true">
                                  <span class="text">{{ [item.transcode_status, item.transcode_code] | formatTranscodeStatus }}</span>
                                </div>
                                <div v-else>
                                  <span class="text">完成</span>
                                </div>
                              </td>
                              <td v-if="doctype === 'private'">
                                <a class="delete" @click="deleteDocument($event, item)">删除</a>
                              </td>
                            </tr>
                          </template>
                          
                        </tbody>
                      </table>
                    </div>
                  </div>
                
                <!-- content -->
                <PaginationWidget v-show="currentDocType === doctype"  :current="page[doctype].current" :total="page[doctype].total" @pageChange="pageChange"></PaginationWidget>
                <Spin v-show="spin[doctype] && currentDocType === doctype" ></Spin>
              </template>
              <template v-show="currentDocType === DOCUMENT_TYPE.PUBLIC">
              </template>
            </div>
            <!-- tab content -->
          </div>
        </template>
      </DialogWidget>
    </div>
  </div>
</template>

<script>
import util from "../../util/util";
import DialogWidget from "../widget/DialogWidget";
import PaginationWidget from "../widget/PaginationWidget";
import Component from "../core/Component";
import api from "../../request/Api";
import Constant from "../../config/Constant";
import Button from "../widget/ButtonWidget";
import Spin from "../widget/Spin";
import Cosapi from "../../util/cos"
import prettyBytes from 'pretty-bytes'
import MessageBridge from '../../util/MessageBridge.js';
import Global from '../../config/Global';

const pageSize = 10

export default {
  extends: Component,

  components: {
    Button,
    Spin,
    DialogWidget,
    PaginationWidget
  },

  props: {},

  data() {
    return {
      title: "课件库",
      DOCUMENT_TYPE: Constant.DOCUMENT_TYPE,
      currentDocType: Constant.DOCUMENT_TYPE.PRIVATE,
      prefix: {
        private: null,
        public: null
      },
      documentData: {
        private: [],
        public: []
      },
      spin: {
        private: true,
        public: true
      },
      page:{
        public: {
          size: pageSize,
          current: 1,
          total: 1
        },
        private: {
          size: pageSize,
          current: 1,
          total: 1
        }
      },
      index: 0,
      refreshInterval: null
    };
  },

  filters: {
    formatTime: (time) => {
      return util.formatTime(time, "YYYY-MM-DD HH:mm:ss");
    },
    formatTranscodeStatus: (param) => {
      if( Constant.TRANSCODE_VALID_STATUS.indexOf(param[0]) !== -1){
        if( param[1] === 0 ){
          return Constant.TRANSCODE_STATUS[param[0]]
        }else{
          return '转码失败'
        }
      }else{
          return Constant.TRANSCODE_STATUS[param[0]]
      }
    },
    formatSize: (key) => {
      return prettyBytes(key)
    }
  },

  mounted() {
    this.userId = Global.userId || this.$route.params.userId
    this.sdkAppId = (Global.sdkAppId || this.$route.params.sdkAppId) * 1
    this.userSig = Global.userSig || this.$route.params.userSig
    this.token = Global.token || this.$route.params.token

    Cosapi.init({
      userId: this.userId,
      sdkAppId: this.sdkAppId,
      userSig: this.userSig,
      token: this.token
    })
  },

  watch: {
    currentDocType(val){
      if (this.documentData[this.currentDocType].length == 0 ){
          this.getDocumentList();
      }
    }
  },

  methods: {
    show() {
      this.$refs["dm-dialog-ref"].show(
        {
          width: 800
        },
        () => {
          this.getDocumentList();
        }
      );
    },
    getFileType: (key) => {
      key = key.toLowerCase()
      var map = {
        'doc': 'file',
        'docx': 'file',
        'pdf': 'pdf',
        'ppt': 'ppt',
        'ppts': 'ppt',
        'pptx': 'ppt',
        'bmp': 'photo',
        'jpeg': 'photo',
        'png': 'photo',
        'jpg': 'photo',
        'gif': 'photo',
        'mp4': 'vid',
        'avi': 'vid',
        'mpeg': 'vid',
        'mpg': 'vid'
      };
      return map[key] || key
    },

    hide() {
      this.$refs["dm-dialog-ref"].hide();
    },

    
    pageChange(val) {
      this.getDocumentList({
        index: (val - 1) * this.page[this.currentDocType].size
      }).then((data)=>{
        this.page[this.currentDocType].current = val
      })
    },


    getDocumentList(opts , spin = true) {
      spin && (this.spin[this.currentDocType] = true)
      var param = {
        permissions: [this.currentDocType],
        index: this.index,
        size: this.page[this.currentDocType].size,
        prefix: this.prefix[this.currentDocType]
        // size: Constant.PAGINATION_SIZE
      }
      if( opts ){
        Object.assign(param, opts)
      }
      
      if( this.currentDocType === Constant.DOCUMENT_TYPE.PRIVATE ){
        Object.assign(param,{
          owner: this.userId
        })
      }

      clearTimeout(this.refreshInterval)
      return api
        .getDocumentList(param)
        .then(
          res => {
            // console.debug(`getDocumentList => ${JSON.stringify(res.data)}`)
            if (res.data && res.data.error_code === 0) {
              var list = res.data.list
              var total = res.data.total
              if (this.currentDocType === Constant.DOCUMENT_TYPE.PUBLIC && util.getQuery('video') === 'enable') {
                total ++
                total ++
                list.unshift({
                  doc_ext: 'mp4',
                  doc_name: '特斯拉',
                  doc_size: 2929363,
                  upload_time: 1574044372,
                  is_transcode: false,
                  transcode_status: 'finished',
                  permission: "public",
                  doc_url: 'https://tic-res-1259648581.file.myqcloud.com/特斯拉_2.mp4'
                })
                list.unshift({
                  doc_ext: 'mp4',
                  doc_name: '腾讯教育',
                  doc_size: 2591363,
                  upload_time: 1574044444,
                  is_transcode: false,
                  transcode_status: 'finished',
                  permission: "public",
                  doc_url: 'https://tic-res-1259648581.file.myqcloud.com/TXJY_FINAL_16_9_x264_20191119194915.mp4'
                })
              }
              this.documentData[this.currentDocType] = list;
              this.$set(this.documentData, this.currentDocType, list)
              this.page[this.currentDocType].total = Math.max( Math.ceil(total / this.page[this.currentDocType].size), 1)
            }
            spin && (this.spin[this.currentDocType] = false)
            this.index = param.index
            this.refreshInterval = setTimeout( () => {
              this.refresh(false)
            }, 5000)
            return res.data;
          },
          error => {
            spin && (this.spin[this.currentDocType] = false)
          }
        );
    },

    deleteDocument(event, row){
      event.stopPropagation();
      event.preventDefault();
      MessageBridge.showMessageBox({
        title: '确定要删除课件么？',
        options: ['确认删除','取消'],
        callback: (index) => {
          if(index === 0){
            this.deleteDocumentHandler(row)
          }
        }
      })
    },

    
    deleteDocumentHandler(row , spin = true) {
      spin && (this.spin[this.currentDocType] = true)
      var param = {
        doc_ids: [row.doc_id]
      }
      return api
        .deleteDocument(param)
        .then(
          res => {
            console.debug(`deleteDocument => ${JSON.stringify(res.data)}`)
            spin && (this.spin[this.currentDocType] = false)
            if (res.data && res.data.error_code === 0) {
              this.getDocumentList();
            }
            return res.data;
          },
          error => {
            spin && (this.spin[this.currentDocType] = false)
          }
        );
    },

    switchDocType(type) {
      this.currentDocType = type;
    },

    refresh(spin = true) {
      this.getDocumentList({}, spin);
    },

    search(type) {
      this.getDocumentList();
    },

    upload(type) {
      this.currentDocType = type;
    },

    uploadSuccess(type) {
      this.currentDocType = type;
    },

    relevant(item) {
      if( item.is_transcode === true && Constant.TRANSCODE_VALID_STATUS.indexOf(item.transcode_status) !== -1){
        if(item.transcode_code === 0){
          this.EventBus.$emit("relevant_doc", item);
          this.hide();
        }else{
          this.$toasted.error('文档转码失败，请重新上传');
        }
      }else if(item.is_transcode === false){
        this.EventBus.$emit("relevant_doc", item);
        this.hide();
      }else{
        this.$toasted.error('文档尚未就绪，请稍后再试');
      }
    },

    addFile() {
      var fileinput = this.$refs['fileinput.'+this.currentDocType][0]
      fileinput.click()
      // this.$refs.upload.$el.click()
    },

    getFileExt: function(filename) {
      if (!filename || filename.indexOf('.') == -1) {
          return '';
      }
      var index = filename.lastIndexOf('.');
      var ext = filename.substr(index + 1).toLowerCase();
      return ext;
    },

    selectFile(event) {
      console.debug('selectFile', event)
      if(event.target.files.length === 0 ) return
      this.spin[this.currentDocType] = true

      if (event.target.files.length === 1 && event.target.files[0].name) {
        var ext = this.getFileExt(event.target.files[0].name )
        var validext = ['doc', 'docx', 'pdf', 'ppt', 'pptx', 'jpg', 'png'];
        var no_transcode_ext = ['jpg', 'png']
        if(no_transcode_ext.indexOf(ext) !== -1) {
          var is_transcode = false
        }else {
          var is_transcode = true
        }
        if(validext.indexOf(ext) === -1) {
          MessageBridge.showMessageBox({
            title: `仅支持ppt，pptx，pdf，doc，docx，jpg，png文件上传`,
            options: ['确定'],
            callback: null
          })
          this.spin[this.currentDocType] = false
          return 
        }
      } else {
        this.spin[this.currentDocType] = false
        return 
      }
      clearTimeout(this.refreshInterval)

      Cosapi.getFileInfoAndUpload( this.currentDocType, is_transcode, event.target.files[0] , (result , data) => {
        console.debug(`upload result => ${result} , data => ${JSON.stringify(data)}`)
        this.spin[this.currentDocType] = false
        if( result ){
          this.refresh()
        }else{
          this.$toasted.error(data.message || '上传失败');
        }
      })
    }
  }
};
</script>
<style>
tr.doclist:hover {
    background-color: #DDDDDD;
}
.ivu-upload{
  display: inline-block;
}
.ivu-upload-input{
  display: none
}

a.delete{font-size:12px}
</style>