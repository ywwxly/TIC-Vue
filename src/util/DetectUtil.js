import elkLog from '../request/ELKlog';
import TRTC from 'trtc-js-sdk'

export default {

  getCameraDevices() {
    return TRTC.getCameras()
  },

  getMicroDevices() {
    return TRTC.getMicrophones()
  },

  getSpeakerDevices(callback) {
    navigator.mediaDevices.enumerateDevices()
      .then(function (devices) {
        var audioList = {};
        devices.forEach(function (device) {
          if (device && device.kind === "audiooutput") {
            audioList[device.deviceId] = device;
          }
        });
        elkLog.report(elkLog.events.get_speaker_devices, {
          extra_info: `list: ${JSON.stringify(audioList)}`
        })
        if (callback) {
          callback(Object.values(audioList));
        }
      })
      .catch(function (err) {
        elkLog.report(elkLog.events.get_speaker_devices, {
          extra_info: `error: ${JSON.stringify(err)}`
        })
        callback(err)
      });
  }
}