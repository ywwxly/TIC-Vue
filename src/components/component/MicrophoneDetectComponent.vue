<template>
  <div class="tedu-component-microphone-detect-wrap">
    <div class="tedu-component-microphone-detect-box flex-wrap flex-column">
      <div class="detect-title-tip">请选择上课使用的麦克风设备，对准麦克风讲话，您是否能听到自己的声音并看到波纹波动？</div>

      <div class="flex-item">
        <div class="detect-devices-list-box flex-wrap">
          <div class="detect-type-label text-left">麦克风</div>
          <SelectWidget
            :items="devices"
            :valueField="'deviceId'"
            :keyField="'label'"
            :defaultTitle="null"
            @change="microChange"
          ></SelectWidget>
        </div>

        <div class="detect-micphone-canvas-box flex-wrap align-items-center">
          <!-- <img src="../../assets/testing/icon-detect-micphone-result2.png" width="24" height="28"> -->
          <img src width="24" height="28" />
          <template v-for="index in barLength">
            <div :key="index" class="decibel-item" v-bind:class="{active: index<maxDecibelLength}"></div>
          </template>
        </div>

        <div class="tip-sub-title">如果您无法正常使用麦克风，请进行简单的故障排查：</div>
        <div class="tip-sub-title">1，若有多个设备，切换其他的麦克风设备；</div>
        <div class="tip-sub-title">2，确认麦克风未被禁音；</div>
        <div class="tip-sub-title">3，放大麦克风音量；</div>
        <div class="tip-sub-title">4，换一个麦克风接口重新测试；</div>
        <div class="tip-sub-title">5，重启电脑；</div>
        <div class="tip-sub-title">6，更换麦克风设备</div>
      </div>

      <div class="flex-wrap detect-result-box">
        <Button @tap="detectResult(true)">检测正常</Button>
        <Button :theme="'error'" @tap="detectResult(false)">无法使用</Button>
      </div>
    </div>
  </div>
</template>

<script>
import Component from "../core/Component";
import SelectWidget from "../widget/SelectWidget";
import DetectUtil from "../../util/DetectUtil";
import util from "../../util/util";
import Button from "../widget/ButtonWidget";

export default {
  extends: Component,
  components: {
    SelectWidget,
    Button
  },

  data() {
    return {
      audioCtx: null,
      canvasCtx: null,
      analyser: null,
      biquadFilter: null,
      distortion: null,
      gainNode: null,
      stream: null,
      devices: [],
      barLength: 13,
      maxDecibelLength: 0 // 最大分贝
    };
  },

  mounted() {
    this.enumMic();
  },

  methods: {
    enumMic() {
      DetectUtil.getMicroDevices(devices => {
        console.log(devices);
        if (util.isArray(devices) && devices.length) {
          this.devices = devices;
          this.startDetect(devices[0]);
        } else {
          // TODO 异常
        }
      });
    },

    microChange({ value, index }) {
      console.log(value);

      this.stopDetect();
      this.startDetect(this.devices[index]);
    },

    startDetect(device) {
      DetectUtil.getUserMedia({
        audio: {
          deviceId: device.deviceId
        }
      }).then(
        stream => {
          this.stream = stream;
          // DetectUtil.detectMicphone(stream, data => {
          //   var max = Math.max(...data);
          //   var dis = 10;
          //   // 有效分贝柱
          //   this.maxDecibelLength = Math.ceil((13 * max) / 255);
          // });
        },
        () => {
          // TODO 错误提示
        }
      );
    },

    // 检测结果
    detectResult(res) {
      this.$emit("detect-result-event", {
        item: this.Constant.DETECT_TYPE.MICROPHONE,
        data: res
      });
    },

    stopDetect() {
      if (this.stream) {
        var tracks = this.stream.getTracks();
        tracks.forEach(track => {
          track.stop();
        });
      }
    }
  },

  destroyed() {
    this.stopDetect();
  }
};
</script>

<style scoped lang="less">
.tedu-component-microphone-detect-wrap {
  height: 100%;
  .tedu-component-microphone-detect-box {
    height: 100%;
  }
  .btn-box {
    position: relative;

    .testing-speaker-asset {
      position: absolute;
      width: 0;
      height: 0;
    }

    .play-btn {
      margin: 30px 0 30px 68px;
    }
  }

  .detect-title-tip {
    font-size: 12px;
    color: #313131;
    line-height: 20px;
  }

  .tip-sub-title {
    margin-left: 68px;
    font-size: 12px;
    color: #313131;
    line-height: 20px;
  }

  .detect-result-box {
    margin: 0 78px;
    justify-content: space-between;
  }

  .detect-devices-list-box {
    margin-top: 22px;
    .detect-type-label {
      width: 68px;
      height: 28px;
      line-height: 28px;
      font-size: 14px;
      color: #313131;
    }
  }
  .detect-micphone-canvas-box {
    margin: 22px 0 22px 68px;
    height: 28px;

    .decibel-item {
      margin: 0 5px;
      width: 5px;
      height: 20px;
      border-radius: 3px;
      background: rgba(0, 0, 0, 0.2);
      &.active {
        background: rgba(0, 110, 255, 1);
      }
    }
  }
}
</style>