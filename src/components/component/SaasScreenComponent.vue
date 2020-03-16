<template>
 <div
  class="tedu-component-sassscreen-wrap"
  ref="sassscreen-ref"
 >
  <slot></slot>
 </div>
</template>

<script>
import Component from "../core/Component";

export default {
  extends: Component,

  data() {
    return {
      full_status: 0 // 0 正常状态  1 全屏状态
    };
  },

  mounted() {
    this.componentStart();
    this.EventBus.$on("board_request_full", () => {
      if (this.full_status) {
        this.exitFull();
      } else {
        this.requestFull();
      }
    });
  },

  methods: {
    requestFull() {
      this.$refs["sassscreen-ref"].requestFullscreen();
      this.full_status = 1;
      this.EventBus.$emit("board_full_status", this.full_status);
    },

    exitFull() {
      document.exitFullscreen();
      this.full_status = 0;
      this.EventBus.$emit("board_full_status", this.full_status);
    }
  }
};
</script>

<style scoped>
.tedu-component-sassscreen-wrap {
  /* position: relative; */
  width: 100%;
  height: 100%;
}
</style>