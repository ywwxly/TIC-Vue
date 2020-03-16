<template>
  <div class="tedu-component-controlall-wrap">
    <div class="tedu-component-controlall-content">
      <DialogWidget ref="controlall-dialog-ref" @hide="onDialogHide">
        <template v-slot:header>全体控制</template>

        <template v-slot:main>
          <!-- 全体控制 start -->
          <div class="tic-media course-tool">
            <div class="tic-media__list"  @click="ctlAllStatus('off_all', 'mic')">
              <div class="tic-media__list-inner">
                <div class="tic-media__list-img">
                  <i class="tic-icon--max tic-toolbox-voice"></i>
                </div>
                <div class="tic-media__list-info">
                  <div class="tic-media__list-title">全体静音</div>
                </div>
              </div>
            </div>
            <div class="tic-media__list" v-if="classInfo.class_video_type !== Constant.CLASS_VIDEO_TYPE.LIVE">
              <div class="tic-media__list-inner" @click="ctlAllStatus('off_all', 'platform')">
                <div class="tic-media__list-img">
                  <i class="tic-icon--max tic-toolbox-camera"></i>
                </div>
                <div class="tic-media__list-info">
                  <div class="tic-media__list-title">全体下台</div>
                </div>
              </div>
            </div>
          </div>
          <!-- 全体控制 end -->
        </template>
        <template v-slot:footer></template>
      </DialogWidget>
    </div>
  </div>
</template>

<script>
import Component from "../core/Component";
import DialogWidget from "../widget/DialogWidget";
import Control from '../../request/Control'
import api from "../../request/Api"
import Constant from "../../config/Constant";

export default {
  extends: Component,

  components: {
    DialogWidget
  },

  props: {
    classInfo: {
      type: Object,
      default: () => {
        return {}
      }
    },
    
  },

  // computed: {
  //   // 计算属性的 getter
  //   membersIdArray: function () {
  //     // `this` 指向 vm 实例
  //     let membersId = []
  //     console.error(this.members)
  //     for(let key in this.members){
  //       if(this.members[key].role === Constant.CLASS_ROLE.STUDENT){
  //         membersId.push(this.members[key].user_id)
  //       }
  //     }
  //     console.error(membersId)
  //     return membersId
  //   }
  // },

  data() {
    return {};
  },

  mounted() {
    this.classId = this.$route.params.classId * 1;
  },

  methods: {
    show() {
      this.$refs["controlall-dialog-ref"].show(
        {
          width: 420
        },
        () => {}
      );
    },
    hide() {
      this.$refs["controlall-dialog-ref"].hide();
    },

    onDialogHide() {
    },

    ctlAllStatus(action, rights){
      api.getRumtimeMembers({
        class_id: this.classId,
        index: 0,
        size: 100
      }).then(
        res => {
          let members = []
          let membersId = []
          if (res.data && res.data.error_code === 0) {
            res.data.total = res.data.list.length;
            members = res.data.list
            for(let key in members){
              if(members[key].role !== Constant.CLASS_ROLE.TEACHER){
                membersId.push(members[key].user_id)
              }
            }
            switch (rights) {
              case "mic":
              case "camera":
              case "platform":
                Control.ctlSetRights(
                  action === 'on_all' ? 1 : 0,
                  rights,
                  membersId
                )
                break
              default:
                Control.ctlAllStatus(action, rights, membersId)
                break
            }
          }
        },
        error => {}
      );
      
    }
  }
};
</script>