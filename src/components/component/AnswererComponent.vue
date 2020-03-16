<template>
  <div class="tedu-component-answerer-wrap">

    <!-- 设置题目 start -->
    <div class="tedu-component-answerer-content" v-if="Global.role === Constant.CLASS_ROLE.TEACHER && dialogType === 'setting'">
      <DialogWidget ref="answerer-dialog-ref" @hide="onDialogHide" :showDialogFooter="showDialogFooter"> 
        <template v-slot:header>
          查看答题器 <span class="time">{{remain_time_hms}}</span>
        </template>

        <template v-slot:main>
          <div class="tic-dialog__answer">
            <div class="tic-table-layout">
              <div class="col">
                <span class="text">点击下列按钮设置正确答案（目前正确答案是： {{correct_answer.join(',')}}）</span>
              </div>
            </div>
            <div class="tic-dialog__answer-tag">
              <a href="javascript:;" v-for="(value, key) in options" :key="key" :class="`tic-tag ${correct_answer.includes(value) ? 'actived' : ''}`" @click="changeArray('correct_answer', value)">{{value}}</a>
              <a href="javascript:;" class="tic-tag" @click="changeOptions('push')">+</a>
              <a href="javascript:;" class="tic-tag" @click="changeOptions('pop')">-</a>
            </div>
          </div>
        </template>
        <template v-slot:footer>
          <button class="tic-btn" @click="setProcess('begain')">开始答题</button>
        </template>
      </DialogWidget>
    </div>
    <!-- 设置题目 end -->

    <!-- 查看回答情况 start -->
    <div class="tedu-component-answerer-content" v-if="Global.role === Constant.CLASS_ROLE.TEACHER && dialogType === 'resultList'">
      <DialogWidget ref="answerer-dialog-ref" @hide="onDialogHide" :showDialogFooter="showDialogFooter">
        <template v-slot:header>
          查看答题器
          <!-- <span class="time">{{now_time_hms}}</span> -->
        </template>

        <template v-slot:main>
                  <div class="tic-dialog__answer">
          <ul class="form-list tea-form--horiz">
            <li>
              <div class="form-list__name">正确答案是：</div>
              <div class="form-list__text">
                <span class="form-list__text-dsc">{{correct_answer.join(',')}}</span>
              </div>
            </li>
            <li>
              <div class="form-list__name">已答题人数：</div>
              <div class="form-list__text">
                <span class="form-list__text-dsc">{{resultCt.answerCt}}</span>
              </div>
            </li>
            <li>
              <div class="form-list__name">正确率：</div>
              <div class="form-list__text">
                <span class="form-list__text-dsc">{{resultCt.correctRate}}</span>
              </div>
            </li>
            <li v-if="limit_time">
              <div class="form-list__name">计时：</div>
              <div class="form-list__text">
                <span class="form-list__text-dsc is-error">{{remain_time_hms}}</span>
              </div>
            </li>
          </ul>
          <div class="tic-table">
            <div class="tic-table__head">
              <table>
                <colgroup>
                  <col v-for="(value, key) in options" :key="key">
                  <col style="width: 80px;">
                </colgroup>
                <thead>
                  <tr>
                    <th v-for="(value, key) in options" :key="key">
                      <div class="" >
                        <span class="text">{{value}}</span>
                      </div>
                    </th>
                    <th>
                      <div class="">
                        <span class="text">未选</span>
                      </div>
                    </th>
                  </tr>
                </thead>
              </table>
            </div>
            <div class="tic-table__body roll-scroll">
              <table>
                <colgroup>
                  <col v-for="(value, key) in options" :key="key">
                  <col style="width: 80px;">
                </colgroup>
                <tbody>
                  <tr>
                    <td v-for="(value, key) in resultCt.selectCt" :key="key">
                      <div class="">
                        <span class="text">{{value}}人</span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="tic-table">
            <div class="tic-table__head">
              <table>
                <colgroup>
                  <col>
                  <col>
                  <col style="width: 88px;">
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
                        <span class="text">答题用时</span>
                      </div>
                    </th>
                    <th>
                      <div class="">
                        <span class="text">所选答案</span>
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
                  <col>
                  <col style="width: 80px;">
                </colgroup>
                <tbody>
                  <tr v-for="(value, key) in reply_detail" :key="key">
                    <td>
                      <div class="">
                        <span class="text">{{members[value.reply_id].nickname}}</span>
                      </div>
                    </td>
                    <td>
                      <div class="">
                        <span class="text">{{value.reply_cost_time}}s</span>
                      </div>
                    </td>
                    <td>
                      <div class="text-center">
                        <span :class="`text ${isCorrect(value.reply_answer, correct_answer) ? '' : 'is-error'}`" >{{value.reply_answer !== null ? value.reply_answer.join(',') : ''}}</span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        </template>
        <template v-slot:footer>
          <!-- <button class="tic-btn" @click="setProcess('end')">结束答题</button> -->
          <!-- 未启用计时 -->
          <button class="tic-btn" @click="setProcess('confirmEnd')">结束答题</button>
        </template>
      </DialogWidget>
    </div>
    <!-- 查看回答情况 end -->

    <!-- 老师结束答题确认 start -->
    <!-- <div class="tedu-component-answerer-content" v-if="Global.role === Constant.CLASS_ROLE.TEACHER && dialogType === 'endConfirm'">
      <DialogWidget ref="answerer-dialog-ref" @hide="onDialogHide" :showDialogFooter="showDialogFooter">
        <template v-slot:header>
        </template>

        <template v-slot:main>
          <p class="text-center text">还未结束答题，确认要关闭吗？</p>
        </template>
        <template v-slot:footer>
          <button class="tic-btn" @click="setProcess('confirmEnd')">确认</button>
        <button class="tic-btn weak"  @click="setProcess('cancelEnd')">取消</button>
        </template>
      </DialogWidget>
    </div> -->
    <!-- 老师结束答题确认 end -->

    <!-- 学生答题 start -->
    <div class="tedu-component-answerer-content" v-if="Global.role === Constant.CLASS_ROLE.STUDENT && !answerFlag">
      <DialogWidget ref="answerer-dialog-ref" @hide="setProcess('answer'),onDialogHide" :showDialogFooter="showDialogFooter" :showCloseIcon="false">
        <template v-slot:header>
          查看答题器
          <!-- <span class="time">{{now_time_hms}}</span> -->
        </template>

        <template v-slot:main>
          <div class="tic-dialog__answer">
            <div class="tic-table-layout">
              <div class="col">
                <span class="text">点击下列按钮设置正确答案（目前选择的答案是： {{choice.join(',')}}）</span>
              </div>
              <div class="col" v-if="limit_time">
                <span class="text">计时：</span>
                <span class="text is-error">{{remain_time_hms}}</span>
              </div>
            </div>
            <div class="tic-dialog__answer-tag">
              <a href="javascript:;" v-for="(value, key) in options" :key="key" :class="`tic-tag ${choice.includes(value) ? 'actived' : ''}`" @click="changeArray('choice', value)">{{value}}</a>
            </div>
          </div>
        </template>
        <template v-slot:footer>
          <button class="tic-btn" @click="setProcess('answer')">提交答题</button>
        </template>
      </DialogWidget>
    </div>
    <!-- 学生答题 end -->

    <!-- 学生答题结果 start -->
    <div class="tedu-component-answerer-content" v-if="Global.role === Constant.CLASS_ROLE.STUDENT && answerFlag">
      <DialogWidget ref="answerer-dialog-ref" @hide="onDialogHide" :showDialogFooter="showDialogFooter">
        <template v-slot:header>
          查看答题器
          <!-- <span class="time">{{now_time_hms}}</span> -->
        </template>

        <template v-slot:main>
          <div class="tic-dialog__answer">
          <div class="tic-table-layout">
            <div class="col">
              <span class="text">选择的答案是&#32;{{choice.join(',')}}&#32;</span>
              <span class="text">正确的答案是&#32;{{correct_answer.join(',')}}</span>
              <span class="tic-dialog__answer-result" v-if="isCorrect(choice, correct_answer)">
                <span class="text is-success">正确</span>
                <i class="tic-icon tic-icon-answer-success"></i>
              </span>
              <span class="tic-dialog__answer-result" v-else>
                <span class="text is-error">错误</span>
                <i class="tic-icon tic-icon-answer-error"></i>
              </span>
            </div>
            <!-- <div class="col">
              <span class="text">用时：</span>
              <span class="text is-error">00:10:00</span>
            </div> -->
          </div>
          <div class="tic-dialog__answer-tag">
              <a href="javascript:;" v-for="(value, key) in options" :key="key" :class="`tic-tag ${choice.includes(value) ? 'actived' : ''}`">{{value}}</a>
            </div>
        </div>
        </template>
        <template v-slot:footer>
          <button class="tic-btn disabled">已提交</button>
        </template>
      </DialogWidget>
    </div>
    <!-- 学生答题结果 end -->

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
      showDialogFooter: true,

      dialogType: 'setting', // 1.老师设置题目：setting 2.老师查询结果：resultList 3.老师确认结束答题： endConfirm，决定老师端dialog类型 
      answerFlag: false, // 学生是否已提交答案， 决定学生端dialog类型

      question_id: null,
      options: ['A','B','C','D'], // 老师设定的选项
      correct_answer: [], // 老师设定的答案
      choice: [], // 学生的选择
      reply_detail: null,

      // 时间相关
      now_time_hms: null,
      limit_time: null,
      start_time: null,
      remain_time: null,
      remain_time_hms: null,
      timer: null,
      resultTimer: null
    };
  },

  computed:{
    // 学生答题结果统计
    resultCt: function () {
      let ct = {
        selectCt: [...Array(this.options.length+1)].map(()=>0), // 各个选项、未选择的人数数组 顺序为： A、B、C...、未选择的
        answerCt: 0, // 回答人数
        correctCt: 0, // 回答正确人数
        correctRate: null, // 正确率 = 回答正确人数/总回答人数 格式：'xx%'
      }

      if(this.reply_detail !== null){
          for (var i = 0; i < this.reply_detail.length; i++) {
          let item = this.reply_detail[i]

          // 统计回答正确人数
          if(item.reply_answer !== null && this.isCorrect(item.reply_answer, this.correct_answer)){
            ct.correctCt++
          }

          // 统计各个选项、未选择的人数
          if(item.reply_answer !== null && item.reply_answer.length !== 0) {
            // 统计各选项的选择人数
            for (var j = 0; j < item.reply_answer.length; j++){
              if(this.options.includes(item.reply_answer[j])){
                
                ct.selectCt[this.options.indexOf(item.reply_answer[j])]++
              }
            }
          } else {
            // 统计未选择的人数
            ct.selectCt[ct.selectCt.length-1]++
          }
        }

        ct.correctRate = ((ct.correctCt / this.reply_detail.length) * 100).toFixed(2) + '%'
        // ct.answerCt = this.reply_detail.length - ct.selectCt[ct.selectCt.length-1]
        ct.answerCt = this.reply_detail.length
      }

      return ct;
    },
  },

  mounted() {
    this.classId = this.$route.params.classId * 1;
  },

  // watch: {
  //   question_id: function(val) {
  //     console.error('question_id:' + val)
  //   },
  //   dialogType: function(val) {
  //     console.error('dialogType:' + val)
  //   }
  // },

  methods: {
    show(msg=null) {
      this.$refs["answerer-dialog-ref"].show(
        {
          width: 560
        },
        () => {this.startTimer();}
      );

      if(msg !== null && msg.action && msg.action === "show_question"){
        this.question_id = msg.question_id || this.question_id
        this.options = msg.options || this.options
        this.limit_time = msg.limit_time || this.limit_time
        this.start_time = msg.start_time || this.start_time
      }

      
    },

    hide(msg=null) {
      if(this.$refs["answerer-dialog-ref"]){
        this.$refs["answerer-dialog-ref"].hide();
      }
      if(msg !== null && msg.action && (msg.action === "cancel_question" || msg.action === "timeout_question")){
        this.hide()
        this.resetData()
      }
    },

    onDialogHide() {
    },

    startTimer() {
      if(this.timer !== null){
        clearInterval(this.timer)
        this.timer = null
      }
      this.timer = setInterval(() => {
        this.now_time_hms = util.timeFormat(Math.floor(Date.now()/1000) + 28800)

        if(this.limit_time !== null && this.start_time !==null && this.remain_time === null || this.remain_time > 0) {
          this.remain_time = this.start_time*1 + this.limit_time*1 - Math.floor(Date.now()/1000);
          if(this.remain_time <= 0) { // 签到时间到
            // 发送结束答题卡
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

    // 增减选项：增上限为Z 减下限为A
    changeOptions(action) {
      let lastOption = this.options[this.options.length-1]
      switch(action) {
        case 'push':
          if( lastOption < 'Z') {
            this.options.push(String.fromCharCode(lastOption.charCodeAt(0) + 1))
          }
          break;
        case 'pop':
          if (lastOption > 'A') {
            this.options.pop()
          }
          break;
        default:
          break;
      }
      this.correct_answer = this.correct_answer.filter(value => this.options.includes(value))
    },

    setProcess(type) {
      // console.error("setProcess " + type)
      switch (type) {
        case 'begain':
          this.question_id = Global.classId + '_' + (Date.now() + '')
          // 向后台发起答题请求
          let req = {
            class_id: Global.classId,
            question_id: this.question_id,
            options: this.options,
            correct_answer: this.correct_answer.sort(),
            limit_time: this.limit_time
          }

          Api.questionLaunch(req).then( res => {
            var data = res.data
            if(data.error_code === 0){
              this.startResultTimer()
              this.dialogType = 'resultList';
            } else {
              console.error(data.error_msg)
            }
          })
          break;
        case 'end':
          if(this.remain_time === 0){
            this.endQuestion('timeout_question')
            // this.dialogType = 'resultList';
          } else {
            this.dialogType = 'endConfirm';
          }
          break;
        case 'cancelEnd':
          this.dialogType = 'resultList';
          break;
        case 'confirmEnd':
          this.hide()
          this.dialogType = 'setting';
          this.endQuestion('cancel_question')
          clearInterval(this.resultTimer)
          this.resultTimer = null
          break;
        case 'answer':
          req = {
            class_id: Global.classId,
            question_id: this.question_id,
            reply_id: Global.userId,
            reply_select: this.choice.sort()
          }

          Api.questionReply(req).then( res => {
            var data = res.data
            if(data.error_code === 0){
              this.question_id = data.question_id
              this.correct_answer = data.correct_answer
              this.answerFlag = "true"
            } else {
              console.error(data.error_msg)
            }
          })
          break;
        default:
          break;
      }
    },

    // 取消答题
    // action: 老师主动取消：cancel_question 超时取消：timeout_question
    endQuestion(action) {
      let req = {
        class_id: Global.classId,
        question_id: this.question_id,
        action: action // 老师主动取消：cancel_question 超时取消：timeout_question
      }

      Api.questionCancel(req).then( res => {
        var data = res.data
        if(data.error_code === 0){
          this.resetData()
          // this.dialogType = 'resultList';
        } else {
          console.error(data.error_msg)
        }
  
      })
    },

    // 获取答题结果
    questionResult(){
      let req = {
        class_id: Global.classId,
        question_id: this.question_id
      }

      Api.questionResult(req).then( res => {
        var data = res.data
        if(data.error_code === 0){
          this.reply_detail = data.reply_detail;
          this.total_number = data.total_number;
          this.correct_answer = data.correct_answer;
          this.question_id = data.question_id
          this.answerFlag = "true"
        } else {
          console.error(data.error_msg)
        }
      })
    },

    // 重置数据
    resetData(){
      this.dialogType ='setting' // 1.老师设置题目：setting 2.老师查询结果：resultList 3.老师确认结束答题： endConfirm，决定老师端dialog类型  (当前无计时，取值不为endConfirm)
      this.answerFlag = false // 学生是否已提交答案， 决定学生端dialog类型

      this.question_id = null
      this.options = ['A','B','C','D'] // 老师设定的选项
      this.correct_answer = [] // 老师设定的答案
      this.choice = [] // 学生的选择
      this.reply_detail = null

      // 时间相关
      this.now_time_hms = null
      this.limit_time = null
      this.start_time = null
      this.remain_time = null
      this.remain_time_hms = null
    },

    // 老师改answer，学生改choice
    changeArray(type, value) {
      this[type].includes(value) ? this[type].splice(this[type].indexOf(value), 1) : this[type].push(value)
    },

    // 判断答案是否正确（choice 与 answer是否一致）
    isCorrect(choice, answer) {
      return choice.concat().sort().toString() === answer.concat().sort().toString()
    }
  }
};
</script>