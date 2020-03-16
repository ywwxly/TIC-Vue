<template>
 <div class="tedu-layout-container flex-wrap flex-column">
  <div
   class="tic-container__menu"
   v-bind:style="{ height: topHeight}"
  >
   <slot name="top"></slot>
  </div>
  <div class="tic-container__main">
   <!-- <div
    class="tedu-layout-left"
    v-bind:style="{ width:  leftWidth}"
   >
    <slot name="left"></slot>
   </div> -->
   <div class="tic-container__main-inner">
    <slot name="center"></slot>
   </div>
   <!-- <div
    class="tedu-layout-right"
    v-bind:style="{ width: rightWidth}"
   >
    <slot name="right"></slot>
   </div> -->
  </div>
  <div
   class="tedu-layout-bottom"
   v-bind:style="{ height: bottomHeight}"
  >
   <slot name="bottom"></slot>
  </div>
 </div>
</template>

<script>
export default {
  name: "NormalLayout",
  props: {
    topHeight: {
      type: [String, Number],
      default: "100px"
    },

    leftWidth: {
      type: [String, Number],
      default: "60px"
    },

    bottomHeight: {
      type: [String, Number],
      default: "100px"
    },

    rightWidth: {
      type: [String, Number],
      default: "300px"
    }
  },

  mounted() {}
};
</script>

<style scoped>
.rel {
  position: relative;
}
.tedu-layout-container {
  width: 100%;
  height: 100%;
}

.tedu-layout-top {
  /* border: 1px solid red; */
  z-index:100001;

}

.tedu-layout-left {
  /* border-right: 1px solid red; */
}

.tedu-layout-right {
  /* border-left: 1px solid red; */
  /* position: absolute;
  top:0;
  right:0;
  bottom:0; */
  z-index:100001;
  transition: all 0.5s;
}
.tedu-layout-center{
  width: 100%;
  height: 100%;
}
.tedu-layout-bottom {
  /* border-top: 1px solid red; */
}
</style>