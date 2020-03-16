<template>
  <div class="tedu-component-checkin-wrap">
    <!-- 老师设置签到 start -->
    <div class="tedu-component-checkin-content" v-if="Global.role === Constant.CLASS_ROLE.TEACHER && dialogType === 'begain'">
      <DialogWidget ref="checkin-dialog-ref" @hide="onDialogHide" :showDialogFooter="showDialogFooter">
        <template v-slot:header>签到本</template>

        <!-- <template v-slot:main>
          <div class="text-center">
            <ul class="form-list tea-form--horiz">
              <li>
                <div class="form-list__name">设置签到限时</div>
                <div class="form-list__text">
                  <select class="tic-select" v-model="time_limit">
                    <option value=null>不限时</option>
                    <option value=30>30s</option>
                    <option value=60>1min</option>
                    <option value=300>5min</option>
                    <option value=600>10min</option>
                  </select>
                </div>
              </li>
            </ul>
          </div>
        </template> -->

        <template v-slot:footer>
          <button class="tic-btn" @click.prevent="setProcess('begain')">开始签到</button>
        </template>
      </DialogWidget>
    </div>
    <!-- 老师设置签到 end -->

    <!-- 老师签到中 start -->
    <!-- <div class="tedu-component-checkin-content"  v-if="Global.role === Constant.CLASS_ROLE.TEACHER && dialogType === 'ing'">
      <DialogWidget ref="checkin-dialog-ref" @hide="onDialogHide" :showDialogFooter="showDialogFooter">
        <template v-slot:header>签到本</template>

        <template v-slot:main>
          <div class="text">
            <p v-if="time_limit">签到中，剩余：<span class="is-error">{{remain_time_hms}}</span></p>
            <p v-else>签到中，本次签到不限时</p>
            <p class="mt-5">您可点击下方“隐藏”按钮，隐藏窗口，稍后查看签到结果</p>
          </div>
        </template>

        <template v-slot:footer>
          <button class="tic-btn" @click="hide">隐藏</button>
          <button class="tic-btn" @click="setProcess('end')">结束签到</button>
        </template>
      </DialogWidget>
    </div> -->
    <!-- 老师签到中 end -->

    <!-- 老师结果 start -->
    <div class="tedu-component-checkin-content" v-if="Global.role === Constant.CLASS_ROLE.TEACHER && (dialogType === 'ing' ||  dialogType === 'end')">
      <DialogWidget ref="checkin-dialog-ref" @hide="onDialogHide" :showDialogFooter="showDialogFooter">
        <template v-slot:header>签到本</template>

        <template v-slot:main>
          <div class="">
            <ul class="form-list form-list--full">
              <li>
                 <ul class="form-list tea-form--horiz">
                    <li>
                      <div class="form-list__name">总人数：</div>
                      <div class="form-list__text">
                        <span class="form-list__text-dsc">{{check_result.all_number}}</span>
                      </div>
                    </li>
                    <li>
                      <div class="form-list__name">已签到：</div>
                      <div class="form-list__text">
                        <span class="form-list__text-dsc">{{check_result.check_in_number}}</span>
                      </div>
                    </li>
                    <li>
                      <div class="form-list__name">未签到：</div>
                      <div class="form-list__text">
                        <span class="form-list__text-dsc">{{check_result.all_number - check_result.check_in_number}}</span>
                      </div>
                    </li>
                  </ul>
                </li>
              <li>
                <div class="form-list__name">详情</div>
                <div class="form-list__text">
                  <div class="tic-table">
                    <div class="tic-table__head">
                      <table>
                        <colgroup>
                          <col>
                          <col style="width: 80px;">
                        </colgroup>
                        <thead>
                          <tr>
                            <th>
                              <div class="">
                                <span class="text">学生名称</span>
                              </div>
                            </th>
                            <th>
                              <div class="">
                                <span class="text">状态</span>
                              </div>
                            </th>
                          </tr>
                        </thead>
                      </table>
                    </div>
                    <div class="tic-table__body roll-scroll" style="max-height: 200px;">
                      <table>
                        <colgroup>
                          <col>
                          <col style="width: 80px;">
                        </colgroup>
                        <tbody>
                          <tr v-for="(value, key) in check_result.member_detail" :key="key">
                            <td>
                              <div class="">
                                <span class="text">{{members[value.user_id].nickname}}</span>
                              </div>
                            </td>
                            <td>
                              <div class="">
                                <a href="javascript:;" :class="`text ${value.check_state ? '' : 'is-error'}`">{{value.check_state ? '已签到' : '未签到'}}</a>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </template>

        <template v-slot:footer>
          <button v-if="dialogType === 'ing'" class="tic-btn" @click="setProcess('end')">结束签到</button>
          <button v-if="dialogType === 'end'" class="tic-btn" @click="setProcess('reset')">关闭</button>
        </template>
      </DialogWidget>
    </div>
    <!-- 老师结果 end -->

    <!-- 学生签到 start -->
    <div class="tedu-component-checkin-content" v-if="Global.role === Constant.CLASS_ROLE.STUDENT && dialogType !== 'end'">
      <DialogWidget ref="checkin-dialog-ref" @hide="onDialogHide" :showDialogFooter="showDialogFooter" :showCloseIcon="false">
        <template v-slot:header>签到本</template>

        <template v-slot:main>
          <p class="text-center text">教室发起了课堂签到，请点击下方按钮确认签到</p>
        </template>

        <template v-slot:footer>
          <button class="tic-btn" @click="setProcess('checkin')">点击签到</button>
        </template>
      </DialogWidget>
    </div>
    <!-- 学生签到 end -->
  </div>
</template>

<script>
import Component from "../core/Component";
import DialogWidget from "../widget/DialogWidget";
import Global from "../../config/Global";
import elkLog from "../../request/ELKlog";
import Control from '../../request/Control';
import util from "../../util/util";
import Api from '../../request/Api';
import Constant from '../../config/Constant'

export default {
  extends: Component,

  components: {
    DialogWidget
  },

  props: {
    members: {
      type: Object,
      default() {
        return {};
      }
    },
  },

  data() {
    return {
      dialogType: 'begain', // 1.老师设置签到：begain 2.老师签到中：ing 3. 老师签到结果：end
      showDialogFooter: true, 
      
      check_id: null,

      // 时间相关
      now_time_hms: null,
      time_limit: null,
      start_time: null,
      // start_time: 1572335074
      remain_time: null,
      remain_time_hms: null,
      timer: null,
      resultTimer: null,

      // 签到结果
      check_result: {
        start_time: null,
        end_time: null,
        time_limit: null,
        member_detail: null,
        all_number: null,
        check_in_number: null
      }
      
    };
  },

  mounted() {
    this.classId = this.$route.params.classId * 1;
  },

  methods: {
    show(msg=null) {
      this.$refs["checkin-dialog-ref"].show(
        {
          width: 420
        },
        () => {this.startTimer();}
      );

      if(msg !== null && msg.action === 'show_check_in'){
        if(msg.time_limit !== undefined){
          this.time_limit = msg.time_limit ||  this.time_limit

        }
        if(msg.check_id !== undefined ){
          this.check_id = msg.check_id || this.check_id
        }
        if(Global.role === Constant.CLASS_ROLE.TEACHER) {
          this.dialogType = 'ing';
          this.startResultTimer()
        }
      }
    },
    hide() {
      if(this.$refs["checkin-dialog-ref"]){
        this.$refs["checkin-dialog-ref"].hide();
      }
    },

    onDialogHide() {},

    startTimer() {
      if(this.timer !== null){
        clearInterval(this.timer)
        this.timer = null
      }
      this.timer = setInterval(() => {
        this.now_time_hms = util.timeFormat(Math.floor(Date.now()/1000) + 28800)

        if(this.time_limit !== null && this.start_time !==null && this.remain_time === null || this.remain_time > 0) {
          this.remain_time = this.start_time*1 + this.time_limit*1 - Math.floor(Date.now()/1000);
          if(this.remain_time <= 0) { // 签到时间到
            // 发送隐藏答题卡
            if(Global.role === Constant.CLASS_ROLE.TEACHER){
              this.setProcess('end')
            }
            this.remain_time = 0
            this.remain_time_hms = '00:00:00'
          }

          this.remain_time_hms = util.timeFormat(this.remain_time)
        }
      }, 1000);
    },

    startResultTimer() {
      this.questionResult()
      if(this.resultTimer !== null){
        clearInterval(this.resultTimer)
        this.resultTimer = null
      }
      this.resultTimer = setInterval(() => {
        this.questionResult()
      }, 5000);
    },

    setProcess(type) {
      switch (type) {
        case 'begain':
          this.check_id = Global.classId + '_' + (Date.now() + '')
          this.start_time = Math.floor(Date.now()/1000)

          // 向后台 发起签到请求
          let req = {
            class_id: Global.classId,
            event: 'apply_check_in',
            data: {
              // time_limit: this.time_limit*1, // 采用客户端计时，暂未使用该字段
              check_id: this.check_id,
            }
          }

          Api.reportEvent(req).then( res => {
            var data = res.data
            if(data.error_code === 0){
              this.dialogType = 'ing';
              this.startResultTimer()
            } else {
              console.error(data.error_msg)
            }
          })
          break;
        case 'end':
          // 停止计时
          clearInterval(this.timer)
          this.timer = null

          // 向后台 发起取消签到请求
          req = {
            class_id: Global.classId,
            event: 'cancel_check_in',
            data: {
              check_id: this.check_id,
            }
          }

          Api.reportEvent(req).then( res => {
            var data = res.data
            if(data.error_code === 0){
              this.dialogType = 'end';

              clearInterval(this.resultTimer)
              this.resultTimer = null
            } else {
              console.error(data.error_msg)
            }
          })
          break;
        case 'reset': 
          clearInterval(this.resultTimer)
          this.resultTimer = null
          this.hide()
          this.resetData()
          break;
        case 'checkin':
          // 向后台 发起学生签到
          req = {
            class_id: Global.classId,
            event: 'check_in',
            data: {
              check_id:this.check_id,
              user_id: Global.userId
            }
          }

          Api.reportEvent(req).then( res => {
            var data = res.data
            if(data.error_code === 0){
              this.hide()
              this.resetData()
            } else {
              console.error(data.error_msg)
            }
          })
          break;
        default:
          break;
      }
    },

    questionResult(){
      // 向后台发起查询请求
      Api.getCheckinResult({
        class_id:Global.classId,
        check_id: this.check_id
      }).then( res => {
        var data = res.data
        if(data.error_code === 0){
          let {start_time, end_time, time_limit, member_detail, all_number, check_in_number} = res.data
          this.check_result = {
            start_time,
            end_time,
            time_limit,
            member_detail,
            all_number,
            check_in_number
          }
          // this.dialogType = 'end';
        } else {
          console.error(data.error_msg)
        }
      })
    },

    // 重置数据
    resetData() {
      this.dialogType = 'begain', 

      // 时间相关
      this.now_time_hms = null,
      this.time_limit = null,
      this.start_time = null,
      this.remain_time = null,
      this.remain_time_hms = null,
      this.timer = null,

      // 签到结果
      this.check_result = {
        member_detail:null,
        all_number: null,
        end_time: null,
        start_time: null,
      }
    }
  }
};
</script>