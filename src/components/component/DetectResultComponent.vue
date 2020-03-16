<template>
 <div class="tedu-component-result-detect-wrap">
  <div class="tedu-component-result-detect-box flex-wrap flex-column">

   <div class="flex-item">
    <div class="detect-devices-list-box flex-wrap">
     <div class="detect-type-label text-left">扬声器</div>
     <div class="detect-result-text text-center">扬声器{{result[Constant.DETECT_TYPE.SPEAKER] ? '正常': '检测异常'}}</div>
    </div>
    <div class="detect-devices-list-box flex-wrap">
     <div class="detect-type-label text-left">麦克风</div>
     <div class="detect-result-text text-center">麦克风{{result[Constant.DETECT_TYPE.MICROPHONE] ? '正常': '检测异常'}}</div>
    </div>

    <div class="detect-devices-list-box flex-wrap">
     <div class="detect-type-label text-left">摄像头</div>
     <div class="detect-result-text text-center">摄像头{{result[Constant.DETECT_TYPE.CAMERA] ? '正常': '检测异常'}}</div>
    </div>
   </div>

   <div class="flex-wrap detect-result-box">
    <Button @tap="detectFinished">开始上课</Button>
    <Button
     :theme="'error'"
     @tap="restartDetect"
    >重新检测</Button>
   </div>
  </div>
 </div>
</template>

<script>
import Component from "../core/Component";
import util from "../../util/util";
import Button from "../widget/ButtonWidget";

export default {
  extends: Component,
  props: {
    result: {
      type: Object,
      default() {
        return {
          [`${this.Constant.DETECT_TYPE.SPEAKER}`]: false,
          [`${this.Constant.DETECT_TYPE.MICROPHONE}`]: false,
          [`${this.Constant.DETECT_TYPE.CAMERA}`]: false
        };
      }
    }
  },
  components: {
    Button
  },

  data() {
    return {};
  },

  mounted() {},

  methods: {
    // 开始上课，检测完成
    detectFinished() {
      this.$emit("detect-result-event", {
        item: this.Constant.DETECT_TYPE.RESULT,
        data: true
      });
    },

    // 对结果不服，重新检测
    restartDetect() {
      this.$emit("detect-result-event", {
        result: false
      });
    }
  }
};
</script>

<style scoped lang="less">
.tedu-component-result-detect-wrap {
  height: 100%;
  .tedu-component-result-detect-box {
    height: 100%;
  }

  .detect-result-box {
    margin: 0 78px;
    justify-content: space-between;
  }

  .detect-devices-list-box {
    margin-top: 22px;
    height: 40px;
    line-height: 40px;
    .detect-type-label {
      width: 68px;
      font-size: 14px;
      color: rgba(50, 50, 50, 1);
    }
    .detect-result-text {
      width: 380px;
      font-size: 12px;
      color: rgba(0, 0, 0, 1);
      background: #fff;
      border-radius: 2px;
    }

    &:nth-of-type(even) {
      .detect-result-text {
        background: rgba(102, 102, 102, 1);
        color: #fff;
      }
    }
  }
}
</style>