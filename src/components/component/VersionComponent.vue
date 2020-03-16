<template>
  <div class="tedu-component-version-wrap">
    <!-- 问题反馈 start -->
    <div class="tedu-component-version-content">
      <DialogWidget ref="version-dialog-ref" @hide="onDialogHide" :showDialogFooter="showDialogFooter">
        <template v-slot:header>问题反馈</template>

        <template v-slot:main>
          <ul class="form-list tea-form--horiz">
            <li>
              <div class="form-list__name">当前版本信息</div>
              <div class="form-list__text">
                互动课堂v{{Constant.VERSION}}
              </div>
            </li>
          </ul>
          <ul class="form-list mt-20 form-list--full">
            <li>
              <div class="form-list__name">问题反馈</div>
              <div class="form-list__text">
                <textarea v-model="feedback" class="tic-input-textarea" placeholder="请输入文字" style="width: 100%;height:242px;"></textarea>
              </div>
            </li>
          </ul>
        </template>

        <template v-slot:footer>
          <button class="tic-btn" @click="sendFeedback">确认</button>
        </template>
      </DialogWidget>
    </div>
    <!-- 问题反馈  end -->
  </div>
</template>

<script>
import Component from "../core/Component";
import DialogWidget from "../widget/DialogWidget";
import elkLog from "../../request/ELKlog";
import Constant from '../../config/Constant'

export default {
  extends: Component,
  components: {
    DialogWidget
  },

  data() {
    return {
      showDialogFooter: true,
      feedback: ''
    };
  },

  mounted() {
    this.classId = this.$route.params.classId * 1;
  },

  methods: {
    show(msg=null) {
      this.$refs["version-dialog-ref"].show(
        {
          width: 700
        },
        () => {}
      );
    },
    hide() {
      if(this.$refs["version-dialog-ref"]){
        this.$refs["version-dialog-ref"].hide();
      }
    },

    onDialogHide() {},
    
    sendFeedback(){
      elkLog.report(elkLog.events.feedback, {
        extra_info: `${this.feedback}`
      })
      this.hide()
    }
   
  }
};
</script>