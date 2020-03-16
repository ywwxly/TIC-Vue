<template>
<div
    v-if="showDialog"
    class="tic-dialog">
  <div
    class="tic-dialog__inner"
    v-bind:style="{width: width + 'px'}"
  >
    <div class="tic-dialog__hd">
      <h3 class="title">
      <slot name="header"></slot>
      </h3>
      <a v-if="showCloseIcon" @click="close" href="javascript:;" class="tic-btn-close">
        <i class="tic-icon tic-icon-dialog-close"></i>
      </a>
    </div>
    <div class="tic-dialog__bd">
      <slot name="main"></slot>
    </div>
    <div class="tic-dialog__ft" v-if="showDialogFooter">
      <slot name="footer"></slot>
    </div>
  </div>
</div>
</template>

<script>
import util from "../../util/util";
export default {
  data() {
    return {
      showDialog: false,
      width: 800
    };
  },
  props: {
    showCloseIcon: {
      type: Boolean,
      default: true
    },
    showDialogFooter: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    show({ width = 0, height = 0 }, callback) {
      if (width) {
        this.width = width;
      }
      if (height) {
        this.height = height;
      }

      this.showDialog = true;
      this.$nextTick(() => {
        if (util.isFunction(callback)) {
          callback();
        }
      });
    },

    hide() {
      this.showDialog = false;
      this.$emit('hide')
    },

    close() {
      this.hide();
    }
  }
};
</script>