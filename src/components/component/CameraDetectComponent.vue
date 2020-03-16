<template>
 <div class="tedu-component-camera-detect-wrap">
  <div class="tedu-component-camera-detect-box flex-wrap flex-column">

   <div class="detect-title-tip">请选择上课使用的摄像头设备，自己对准摄像头范围内，您是否能看到自己的摄像头画面？</div>

   <div class="flex-item">
    <div class="detect-devices-list-box flex-wrap">
     <div class="detect-type-label text-left">摄像头</div>
     <SelectWidget
      :items="cameraDevices"
      :valueField="'deviceId'"
      :keyField="'label'"
      :defaultTitle="null"
      @change="cameraChange"
     ></SelectWidget>
    </div>

    <div class="detect-preview-wrap">
     <video
      class="detect-preview"
      ref="preview-ref"
      autoplay
     ></video>
    </div>

    <div class="tip-sub-title">如果您无法看见摄像头画面，请进行简单的故障排查：</div>
    <div class="tip-sub-title">1，若有多个设备，切换其他的摄像头设备；</div>
    <div class="tip-sub-title">2，确认摄像头未被禁用；</div>
    <div class="tip-sub-title">3，确认摄像头未被其他程序占用；</div>
    <div class="tip-sub-title">4，换一个摄像头接口重新测试；</div>
    <div class="tip-sub-title">5，重启电脑；</div>
    <div class="tip-sub-title">6，更换摄像头设备</div>
   </div>

   <div class="flex-wrap detect-result-box">
    <Button @tap="detectResult(true)">检测正常</Button>
    <Button
     :theme="'error'"
     @tap="detectResult(false)"
    >无法使用</Button>
   </div>
  </div>
 </div>
</template>

<script>
import TWebRTC from "../core/TWebRTC";
import Component from "../core/Component";
import SelectWidget from "../widget/SelectWidget";
import DetectUtil from "../../util/DetectUtil";
import util from "../../util/util";
import Button from "../widget/ButtonWidget";

export default {
  extends: Component,

  components: {
    Button,
    SelectWidget
  },

  data() {
    return {
      cameraDevices: [], // 摄像头设备
      stream: null
    };
  },

  mounted() {
    this.enumCamera();
  },

  methods: {
    // 检测结果
    detectResult(res) {
      this.$emit("detect-result-event", {
        item: this.Constant.DETECT_TYPE.CAMERA,
        data: res
      });
    },

    startDetect(device) {
      DetectUtil.getUserMedia({
        video: {
          deviceId: device.deviceId
        }
      }).then(stream => {
        // this.stream = stream;
        var videoEl = this.$refs["preview-ref"];
        if (videoEl) {
          videoEl.srcObject = stream;
        }
      });
    },

    enumCamera() {
      DetectUtil.getCameraDevices(devices => {
        console.log("devices: ", devices);
        if (util.isArray(devices) && devices.length) {
          this.cameraDevices = devices;
          this.startDetect(devices[0]);
        } else {
          // TODO 异常
        }
      });
    },

    // 摄像头change
    cameraChange({ value, index }) {
      this.stopDetect();
      this.startDetect(this.cameraDevices[index]);
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
.tedu-component-camera-detect-wrap {
  height: 100%;
  .tedu-component-camera-detect-box {
    height: 100%;
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

  .detect-preview-wrap {
    margin: 10px 0 10px 68px;
    height: 85px;
    border-radius: 2px;
    overflow: hidden;
    .detect-preview {
      height: 100%;
    }
  }

  .detect-result-box {
    margin: 0 78px;
    justify-content: space-between;
  }
}
</style>