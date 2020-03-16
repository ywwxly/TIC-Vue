<template>
 <div class="tedu-component-detect-wrap">
  <div class="tedu-component-detect-content flex-wrap flex-column">
   <template v-if="!isTesting">
    <div class="detect-before-header-wrap">
     <p class="welcome-tip-text">欢迎使用腾讯云互动课堂</p>
     <p class="detect-before-tip-text">为保证您良好的上课体验，在您进入教室之前，我们将进行一个简单的设备检测</p>
    </div>
    <div class="detect-before-body-wrap flex-wrap">
     <div class="detect-before-item-box speaker">扬声器</div>
     <div class="detect-before-item-box mic">麦克风</div>
     <div class="detect-before-item-box camera">摄像头</div>
    </div>
    <div class="detect-before-footer-wrap"><Button
      :size="'large'"
      @tap="startTest"
     >开始测试</Button></div>
   </template>

   <template v-else>
    <div class="testing-header-wrap">
     <p class="testing-title">设备检测</p>
    </div>
    <div
     class="testing-body-wrap flex-wrap"
     v-bind:class="['active-' + testingItem]"
    >
     <div class="testing-item-box speaker">扬声器</div>
     <div class="testing-item-box split"></div>
     <div class="testing-item-box mic">麦克风</div>
     <div class="testing-item-box split"></div>
     <div class="testing-item-box camera">摄像头</div>
     <div class="testing-item-box split"></div>
     <div class="testing-item-box result">结果</div>
    </div>
    <div class="testing-footer-wrap">
     <div class="testing-footer-content text-left">
      <SpeakerDetectComponent
       v-if="testingItem === Constant.DETECT_TYPE.SPEAKER"
       @detect-result-event="detectResult"
      ></SpeakerDetectComponent>
      <MicrophoneDetectComponent
       v-if="testingItem === Constant.DETECT_TYPE.MICROPHONE"
       @detect-result-event="detectResult"
      ></MicrophoneDetectComponent>
      <CameraDetectComponent
       v-if="testingItem === Constant.DETECT_TYPE.CAMERA"
       @detect-result-event="detectResult"
      ></CameraDetectComponent>
      <DetectResultComponent
       :result="detectResultData"
       v-if="testingItem === Constant.DETECT_TYPE.RESULT"
       @detect-result-event="detectResult"
      ></DetectResultComponent>
     </div>
    </div>
   </template>
  </div>
 </div>
</template>


<script>
import Component from "../core/Component";
import Button from "../widget/ButtonWidget";
import SpeakerDetectComponent from "./SpeakerDetectComponent";
import MicrophoneDetectComponent from "./MicrophoneDetectComponent";
import CameraDetectComponent from "./CameraDetectComponent";
import DetectResultComponent from "./DetectResultComponent";
import ELKlog from '../../request/ELKlog';

export default {
  components: {
    SpeakerDetectComponent,
    MicrophoneDetectComponent,
    CameraDetectComponent,
    DetectResultComponent,
    Button
  },
  extends: Component,
  name: "detect",
  props: {},

  data() {
    return {
      isTesting: true, // 是否在检测中，
      testingItem: null, // 正在检测的项
      detectResultData: {}
    };
  },

  mounted() {
    this.testingItem = this.Constant.DETECT_TYPE.SPEAKER;
  },

  methods: {
    // 开始测试
    startTest() {
      this.isTesting = true;
    },

    // 检测结果通知
    detectResult(res) {
      ELKlog.report(ELKlog.events.detect_result, {
        extra_info: `${JSON.stringify(res)}`
      })
      if (res.item === this.Constant.DETECT_TYPE.SPEAKER) {
        // 扬声器检测完成
        this.testingItem = this.Constant.DETECT_TYPE.MICROPHONE; // 接下来检测麦克风
      } else if (res.item === this.Constant.DETECT_TYPE.MICROPHONE) {
        this.testingItem = this.Constant.DETECT_TYPE.CAMERA; // 接下来检测麦克风
      } else if (res.item === this.Constant.DETECT_TYPE.CAMERA) {
        this.testingItem = this.Constant.DETECT_TYPE.RESULT; // 接下来检测麦克风
      } else {
        // 检测结果
        if (res.data) {
          // 开始上课
          localStorage.setItem(this.Constant.STORAGE_KEY.DEVICE_DETECT, true); // 设备检测工序已经完成
          this.$router.push("/classlist");
          // this.$router.push( Global.loginUrl() );
        } else {
          // 重新检测
          this.isTesting = true;
          this.testingItem = this.Constant.DETECT_TYPE.SPEAKER;
        }
        return;
      }
      Object.assign(this.detectResultData, {
        [`${res.item}`]: res.data
      });
    }
  }
};
</script>


<style lang="less" scoped>
.tedu-component-detect-wrap {
  height: 100%;
  .tedu-component-detect-content {
    height: 100%;
    justify-content: center;

    .detect-before-header-wrap {
      .welcome-tip-text {
        padding: 28px 0;
        font-size: 26px;
        color: rgba(255, 255, 255, 1);
      }
      .detect-before-tip-text {
        padding: 28px 0;
        font-size: 14px;
        color: rgba(255, 255, 255, 1);
      }
    }

    .detect-before-body-wrap {
      justify-content: center;
      padding: 48px 0;
      .detect-before-item-box {
        padding-top: 64px;
        margin: 0 48px;
        width: 64px;
        height: 34px;
        line-height: 34px;
        font-size: 14px;
        color: #fff;
        background-repeat: no-repeat;
        background-position: center top;
        background-size: contain;

        &.mic {
          // background-image: url("../../assets/icon-detect-mic.png");
        }

        &.speaker {
          // background-image: url("../../assets/icon-detect-speaker.png");
        }

        &.camera {
          // background-image: url("../../assets/icon-detect-camera.png");
        }
      }
    }

    .detect-before-footer-wrap {
      padding-top: 56px;
    }

    .testing-header-wrap {
      .testing-title {
        font-size: 20px;
        color: rgba(255, 255, 255, 1);
      }
    }
    .testing-body-wrap {
      justify-content: center;
      padding: 30px 0 38px;
      .testing-item-box {
        padding-top: 64px;
        width: 64px;
        height: 34px;
        line-height: 34px;
        font-size: 14px;
        color: #fff;
        background-repeat: no-repeat;
        background-position: center top;
        background-size: contain;

        &.split {
          margin: 30px 4px 0;
          width: 96px;
          padding: 0;
          height: 4px;
          background: rgba(0, 110, 255, 0.5);
          border-radius: 2px;
        }
      }

      &.active-speaker {
        // .speaker {
        //   background-image: url("../../assets/testing/icon-testing-speaker-active.png");
        // }
        // .mic {
        //   background-image: url("../../assets/testing/icon-testing-mic.png");
        // }

        // .camera {
        //   background-image: url("../../assets/testing/icon-testing-camera.png");
        // }

        // .result {
        //   background-image: url("../../assets/testing/icon-testing-result.png");
        // }
      }

      &.active-microphone {
        // .speaker {
        //   background-image: url("../../assets/testing/icon-testing-speaker-finished.png");
        // }
        // .mic {
        //   background-image: url("../../assets/testing/icon-testing-mic-active.png");
        // }

        // .camera {
        //   background-image: url("../../assets/testing/icon-testing-camera.png");
        // }

        // .result {
        //   background-image: url("../../assets/testing/icon-testing-result.png");
        // }

        .split:nth-of-type(2) {
          background: rgba(102, 102, 102, 1);
        }
      }

      &.active-camera {
        // .speaker {
        //   background-image: url("../../assets/testing/icon-testing-speaker-finished.png");
        // }
        // .mic {
        //   background-image: url("../../assets/testing/icon-testing-mic-finished.png");
        // }

        // .camera {
        //   background-image: url("../../assets/testing/icon-testing-camera-active.png");
        // }

        // .result {
        //   background-image: url("../../assets/testing/icon-testing-result.png");
        // }

        .split:nth-of-type(2),
        .split:nth-of-type(4) {
          background: rgba(102, 102, 102, 1);
        }
      }

      &.active-result {
        // .speaker {
        //   background-image: url("../../assets/testing/icon-testing-speaker-finished.png");
        // }
        // .mic {
        //   background-image: url("../../assets/testing/icon-testing-mic-finished.png");
        // }

        // .camera {
        //   background-image: url("../../assets/testing/icon-testing-camera-finished.png");
        // }

        // .result {
        //   background-image: url("../../assets/testing/icon-testing-result-active.png");
        // }

        .split {
          background: rgba(102, 102, 102, 1);
        }
      }
    }

    .testing-footer-wrap {
      .testing-footer-content {
        width: 500px;
        height: 392px;
        display: inline-block;
        padding: 45px;
        background: rgba(250, 250, 251, 0.5);
        border-radius: 2px;
      }
    }
  }
}
</style>