<template>
  <div class="tedu-component-toolbox-wrap">
    <div class="tedu-component-toolbox-content">
      <DialogWidget ref="toolbox-dialog-ref" @hide="onDialogHide">
        <template v-slot:header>工具箱</template>

        <template v-slot:main>
          <!-- 工具箱 start -->
            <div class="tic-media course-tool">
              <div class="tic-media__list" @click="$emit('showToolboxDialog', 'checkin', 'show')">
                <div class="tic-media__list-inner">
                  <div class="tic-media__list-img">
                    <i class="tic-icon--max tic-toolbox-attendance"></i>
                  </div>
                  <div class="tic-media__list-info">
                    <div class="tic-media__list-title">签到本</div>
                  </div>
                </div>
              </div>
              <div class="tic-media__list"  @click="$emit('showToolboxDialog', 'answerer', 'show')">
                <div class="tic-media__list-inner">
                  <div class="tic-media__list-img">
                    <i class="tic-icon--max tic-toolbox-answer"></i>
                  </div>
                  <div class="tic-media__list-info">
                    <div class="tic-media__list-title">答题器</div>
                  </div>
                </div>
              </div>
            </div>
          <!-- 工具箱 end -->
        </template>
        <template v-slot:footer></template>
      </DialogWidget>
    </div>
  </div>
</template>

<script>
import Component from "../core/Component";
import DialogWidget from "../widget/DialogWidget";
import Global from "../../config/Global";
import elkLog from "../../request/ELKlog";
import AnswererComponent from "./AnswererComponent";

export default {
  extends: Component,

  components: {
    DialogWidget,
  },

  props: {},

  data() {
    return {
    };
  },

  mounted() {
    this.classId = this.$route.params.classId * 1;
  },

  methods: {
    show() {
      this.$refs["toolbox-dialog-ref"].show(
        {
          width: 420
        },
        () => {}
      );
    },
    hide() {
      this.$refs["toolbox-dialog-ref"].hide();
    },

    onDialogHide() {
    },


  }
};
</script>