<template>
  <div class="tedu-component-setting-wrap">
    <div class="tedu-component-setting-content">
      <DialogWidget ref="setting-dialog-ref" @hide="onDialogHide">
        <template v-slot:header>
          检测设备
        </template>

        <template v-slot:main>
          <!-- setting -->
          <div class="tic-table-layout">
            <div class="col">
                <div class="tic-table__play">
                    <video ref="detect_video" autoplay muted style="width: 100%; max-height: 100%; margin: auto; position: absolute; left: 0; right: 0; top: 0; bottom: 0;"></video>
                </div>
            </div>
            <div class="col">
                <div class="tic-table__form">
                    <ul class="form-list">
                        <li>
                            <div class="form-list__name">摄像头</div>
                            <div class="form-list__text">
                                <SelectWidget
                                  :items="cameraDevices"
                                  :valueField="'deviceId'"
                                  :keyField="'label'"
                                  :classname="'tic-select xl'"
                                  :defaultTitle="null"
                                  @change="cameraChange"
                                ></SelectWidget>
                                <!-- <div class="mt-10">
                                    <label class="tic-label">
                                        <input type="checkbox" class="tic-checkbox">美颜开关
                                    </label>
                                    <label class="tic-label">
                                        <input type="checkbox" class="tic-checkbox">镜像模式
                                    </label>
                                </div> -->
                            </div>
                        </li>
                        <li>
                            <div class="form-list__name">麦克风</div>
                            <div class="form-list__text">
                                <SelectWidget
                                  :items="micDevices"
                                  :valueField="'deviceId'"
                                  :keyField="'label'"
                                  :classname="'tic-select xl'"
                                  :defaultTitle="null"
                                  @change="microChange"
                                ></SelectWidget>
                                <div class="tic-form__voice">
                                    <span :class="volume > 0 ?'actived' : ''">
                                        <i class="tic-icon tic-icon-voice"></i>
                                    </span>
                                    <div class="tic-voice--intensity">
                                      <span v-if="volume === 0" class="tic-voice__line actived" style="display:none"></span>
                                      <span v-else class="tic-voice__line" style="display:none"></span>
                                      <template v-for="i in [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]">
                                        <span :key="i" :class="`tic-voice__line ${i == Math.ceil(volume / 100 * 20) ? 'actived' : ''}`"></span>
                                      </template>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div class="form-list__name">扬声器</div>
                            <div class="form-list__text">
                                <SelectWidget
                                  :items="speakerDevices"
                                  :valueField="'deviceId'"
                                  :keyField="'label'"
                                  :classname="'tic-select'"
                                  :defaultTitle="null"
                                  @change="speakerChange"
                                ></SelectWidget>
                                <audio ref="detect_speaker_source" src="../../assets/detect.mp3" loop></audio>
                                <button class="tic-btn weak ml15" @click="toggleAudioPlay">
                                  <i class="tic-icon tic-icon-horn"></i><span class="text">扬声器测试</span>
                                </button>
                            </div>
                        </li>
                    </ul>
                    <div class="form-list__btn">
                        <button class="tic-btn" @click="hide">完成</button>
                    </div>
                </div>
            </div>
        </div>
          <!-- setting -->
        </template>
        <template v-slot:footer></template>
      </DialogWidget>
    </div>
  </div>
</template>

<script>
import Component from "../core/Component";
import SelectWidget from "../widget/SelectWidget";
import DetectUtil from "../../util/DetectUtil";
import SoundMeter from "../../util/SoundMeter";
import util from "../../util/util";
import DialogWidget from "../widget/DialogWidget";
import Global from '../../config/Global';
import elkLog from '../../request/ELKlog';
import TRTC from 'trtc-js-sdk';


export default {
  extends: Component,

  components: {
    SelectWidget,
    DialogWidget
  },

  props: {},

  data() {
    return {
      audioPlayStatus: false,
      volume:0,
      curretnTab: "",
      micStream: null,
      soundmeter: null,
      speakerDevices: [],
      cameraDevices: [],
      micDevices: []
    };
  },

  mounted() {
    this.curretnTab = this.Constant.SETTING_TABS["DEVICE-DETECT"];
    this.classId = this.$route.params.classId * 1;
    this.enumMic();
    this.enumCamera();
    this.enumSpeaker();

    
    this.EventBus.$on("rtc_localstream_add" , (stream) => {
      console.debug('rtc_localstream_add', stream)
      elkLog.report(elkLog.events.setting_rtc_localstream_add, {
        extra_info: JSON.stringify(stream)
      })
      if( this.$refs.detect_video ){
        this.$refs.detect_video.srcObject = stream.getMediaStream()
      }
    })
  },

  methods: {
    switchTab(tab) {
      this.curretnTab = tab;
    },
    show() {
      this.$refs["setting-dialog-ref"].show(
        {
          width: 840
        },
        () => {
        }
      );
      if( this.micDevices && this.micDevices.length > 0 ){
        this.startMicDetect(this.micDevices[0]);
      }
      if( this.cameraDevices && this.cameraDevices.length > 0 ){
        
        if( Global.localStream ){
          this.$nextTick( () => {
            this.$refs.detect_video.srcObject = Global.localStream.getMediaStream()
          })
        }
      }
    },
    hide() {
      this.$refs["setting-dialog-ref"].hide()
    },

    onDialogHide() {
      this.stopDetectVolume()
    },

    enumMic() {
      DetectUtil.getMicroDevices().then(devices => {
        console.debug('[trtc]- getMicrophones', devices)
        if (util.isArray(devices) && devices.length) {
          this.micDevices = devices;
        } else {
          // TODO 异常
        }
      });
    },

    enumCamera() {
      DetectUtil.getCameraDevices().then(devices => {
        console.debug('[trtc]- getCameras', devices)
        if (util.isArray(devices) && devices.length) {
          this.cameraDevices = devices;
        } else {
          // TODO 异常
        }
      });
    },
    
    enumSpeaker() {
      DetectUtil.getSpeakerDevices(devices => {
        if (util.isArray(devices) && devices.length) {
          this.speakerDevices = devices;
        } else {
          // TODO 异常
        }
      });
    },

    startMicDetect(device) {
      var audioStream =  TRTC.createStream({
        audio: true,
        video: false,
        microphoneId: device.deviceId
      });

      audioStream.initialize().then( () => {
        this.micStream = audioStream.getMediaStream()
        this.detectVolume(audioStream);
        if( Global.localStream ){
          Global.localStream.switchDevice('audio', device.deviceId).then(() => {
            console.debug(`[trtc] - switchDevice succ => [audio] [${device.deviceId}]`)
          })
        }
      });
    },
    stopDetectVolume() {
      if( this.soundmeter ){
        this.soundmeter.stop()
        this.soundmeter = null
      }
    },
    detectVolume(stream) {
      if( this.soundmeter ){
        this.soundmeter.stop()
      }
      if( !stream ) return
      this.soundmeter = new SoundMeter({
        stream: stream.getMediaStream(),
        onprocess: (res) => {
          this.volume = parseInt(res.volume * 100)
        }
      })
    },

    toggleAudioPlay() {
      if( !this.audioPlayStatus ){
        this.$refs.detect_speaker_source.play()
      }else{
        this.$refs.detect_speaker_source.pause()
      }
    },

    cameraChange(val) {
      if( Global.localStream ){
        Global.localStream.switchDevice('video', this.cameraDevices[val.index].deviceId ).then(() => {
          console.debug(`[trtc] - switchDevice succ => [video] [${device.deviceId}]`)
        })
      }
    },

    microChange(val) {
      if( Global.localStream ){
        Global.localStream.switchDevice('audio', this.micDevices[val.index].deviceId ).then(() => {
          console.debug(`[trtc] - switchDevice succ => [audio] [${device.deviceId}]`)
        })
      }
    },

    speakerChange(val) {
      var speaker = this.speakerDevices[val.index]
      if (typeof this.$refs.detect_speaker_source.sinkId !== 'undefined') {
        this.$refs.detect_speaker_source.setSinkId( speaker.deviceId )
        .then(() => {
          if( this.audioPlayStatus ){
            this.$refs.detect_speaker_source.play()
          }
        })
        .catch((error) => {
            var errorMessage = 'You need to use HTTPS for selecting audio output device: ' +JSON.stringify(error);
            console.error(errorMessage)
        });
      } else {
          var errorMessage = 'media element has no sinkId ';
          console.error(errorMessage)
      }
    }
  }
};
</script>