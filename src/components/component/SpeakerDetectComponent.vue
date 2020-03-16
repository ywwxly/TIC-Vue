<template>
 <div class="tedu-component-speaker-detect-wrap">
  <!-- <div>
   <canvas
    ref="tedu-canvas-ref"
    style="width:400px;height: 100px;"
   ></canvas>
  </div> -->

  <div class="tedu-component-speaker-detect-box flex-wrap flex-column">
   <div class="detect-title-tip">请选择上课使用的扬声器设备，并点击下方按钮播放一段音乐，您是否可以听到声音？</div>
   <div class="flex-item ">
    <div class="btn-box">
     <Button
      class="play-btn"
      @tap="play"
     >播放音乐</Button>
     <audio
      class="testing-speaker-asset"
      ref="tedu-audio-ref"
      src="../../assets/detect.mp3"
      loop
     ></audio>
    </div>
    <div class="tip-sub-title">如果您无法正常听到声音，请进行简单的故障排查：</div>
    <div class="tip-sub-title">1，若有多个设备，切换其他的扬声器设备；</div>
    <div class="tip-sub-title">2，确认扬声器未被禁音；</div>
    <div class="tip-sub-title">3，放大扬声器音量；</div>
    <div class="tip-sub-title">4，换一个扬声器接口重新测试；</div>
    <div class="tip-sub-title">5，重启电脑；</div>
    <div class="tip-sub-title">6，更换耳机或者扬声器设备</div>
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
import DetectUtil from "../../util/DetectUtil";
import Component from "../core/Component";
import Button from "../widget/ButtonWidget";

export default {
  extends: Component,

  components: {
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
      devices: []
    };
  },

  mounted() {
    // 没有必要把扬声器列出来
    // this.enmuSpeaker();
    // this.startDetect();
  },

  methods: {
    play() {
      this.$refs["tedu-audio-ref"].play();
    },

    // 检测结果
    detectResult(res) {
      this.$emit("detect-result-event", {
        item: this.Constant.DETECT_TYPE.SPEAKER,
        data: res
      });
    },

    enmuSpeaker() {
      DetectUtil.getSpeakerDevices(devices => {
        this.devices = devices;
      });
    },

    switchDevice() {
      // this.$refs['tedu-audio-ref'].setSinkId(this.devices[2].deviceId).then(() => {}, (error) => {});
    }
  }
};
</script>

<style scoped lang="less">
.tedu-component-speaker-detect-wrap {
  height: 100%;
  .tedu-component-speaker-detect-box {
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
}
</style>