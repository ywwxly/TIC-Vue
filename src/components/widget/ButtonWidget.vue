<template>
  <button class="tedu-widget-button" v-bind:class="[size, theme]" @click="tap" :disabled="disabled">
    <slot></slot>
  </button>
</template>

<script>
export default {
  props: {
    theme: {
      type: String,
      default: ""
    },

    size: {
      type: String,
      default: "normal"
    },

    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {};
  },

  methods: {
    tap() {
      this.$emit("tap");
    }
  }
};
</script>

<style scoped lang="less">
.tedu-widget-button {
  font-size: 12px;
  color: #fff;
  background: rgba(0, 110, 255, 1);
  border-radius: 2px;
  cursor: pointer;

  &:hover {
    background: rgba(46, 136, 255, 1);
    box-shadow: 0px 3px 0px 0px rgba(0, 64, 148, 0.3);
  }

  &:disabled {
    background: rgba(215, 217, 228, 1);
    color: rgba(102, 102, 102, 1);
    cursor: default;
    &:hover {
      box-shadow: none;
    }
  }

  &:active {
    background: rgba(0, 110, 255, 1);
  }


  &.large {
    height: 40px;
    line-height: 40px;
    padding: 0 80px;
  }

  &.normal {
    height: 30px;
    line-height: 30px;
    padding: 0 30px;
  }

  &.mini {
    height: 24px;
    padding: 0 10px;
  }

  &.error {
    background: rgba(255, 76, 76, 1);

    &:active {
      background: rgba(255, 76, 76, 1);
    }

    &:hover {
      background: rgba(255, 108, 108, 1);
      box-shadow: 0px 2px 0px 0px rgba(206, 41, 41, 0.5);
    }
  }

  &.grey {
    background: rgba(221, 221, 221, 1);
    color: rgba(153, 153, 153, 1);
    &:active {
      background: rgba(221, 221, 221, 1);
    }

    &:hover {
      background: rgba(234, 234, 234, 1);
      box-shadow: 0px 2px 0px 0px rgba(180, 180, 180, 0.7);
    }
  }
}
</style>