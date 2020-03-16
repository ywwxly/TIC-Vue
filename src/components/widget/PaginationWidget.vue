<template>
<div class="tic-page">
    <!-- <div class="tic-page-state">
        <span class="tic-page-text">已选
            <strong>6</strong>项，共
            <strong>270</strong>项</span>
    </div> -->
    <div class="tic-page-operate">
        <!-- <span class="tic-page-text">每页显示行</span>
        <div class="tic-page-select">
            <a href="#" class="indent">15
                <span class="ico-arrow"></span></a>
            <ul class="tic-simulate-option tic-def-scroll" style="visibility: visible;">
                <li tabindex="0">3334</li>
                <li tabindex="0">200</li>
                <li tabindex="0">20</li>
                <li tabindex="0">25</li>
                <li tabindex="0">30</li>
                <li tabindex="0">30</li>
                <li tabindex="0">30</li></ul>
        </div> -->
        <a href="javscript:;" title="第一页" :class="`tic-page-first ${show.first ? '' : 'disabled'}`" @click="pageTap('first')"></a>
        <a href="javscript:;" title="上一页" :class="`tic-page-pre ${show.prev ? '' : 'disabled'}`" @click="pageTap('prev')"></a>
        <div class="tic-page-select ">
            <a href="javscript:;" class="tic-page-num">
              {{current}}/{{total}}
              <!-- <span class="ico-arrow"></span> -->
            </a>
        </div>
        <a href="javscript:;" title="下一页" :class="`tic-page-next  ${show.next ? '' : 'disabled'}`" @click="pageTap('next')"></a>
        <a href="javscript:;" title="最后一页" :class="`tic-page-last  ${show.last ? '' : 'disabled'}`" @click="pageTap('last')"></a>
    </div>
</div>
</template>
  
<script>
import Component from "../core/Component";

export default {
  extends: Component,

  props: {
    total: {
      type: Number,
      default: 0
    },

    current: {
      type: Number,
      default: 0
    }
  },

  data() {
    return {
      page: {
        current : this.current,
        total : this.total
      },
      show: {
        first: true,
        prev: true,
        next: true,
        last: true
      }
    };
  },
  mounted() {
    this.updateShow()
  },

  watch: {
    "current"(val){
      this.page.current = val
      this.updateShow()
    },
    "total"(val){
      this.page.total = val
      this.updateShow()
    }
  },

  methods: {
    updateShow() {
      var show = {
        first: true,
        prev: true,
        next: true,
        last: true
      }
      if (this.page.current === 1){
        show.first = false
        show.prev = false
      }
      if (this.page.current === this.page.total){
        show.next = false
        show.last = false
      }
      this.show = show
    },
    pageTap(type) {
      if(!this.show[type]) return
      switch(type){
        case 'first':
          this.page.current = 1;
          break;
        case 'prev':
          this.page.current = Math.max(1 , --this.page.current)
          break;
        case 'next':
          this.page.current = Math.min(this.page.total, ++this.page.current)
          break;
        case 'last':
          this.page.current = this.page.total
          break;
      }
      this.$emit("pageChange", this.page.current)
      this.updateShow()  
    }
  }
};
</script>
  
  <style scoped lang="less">
.tedu-widget-pagination-wrap {
  .tedu-widget-pagination-content {
    .pagination-arrow-left {
      width: 24px;
      height: 24px;
      background: url("../../assets/icon-prevpage.png") center center no-repeat;
      background-size: contain;
      cursor: pointer;
      &:hover {
        background-image: url("../../assets/icon-prevpage-hover.png");
      }
      // &:active {
      //   background-image: url("../../assets/icon-prevpage-active.png");
      // }
    }

    .pagination-arrow-right {
      width: 24px;
      height: 24px;
      background: url("../../assets/icon-nextpage.png") center center no-repeat;
      background-size: contain;
      cursor: pointer;
      &:hover {
        background-image: url("../../assets/icon-nextpage-hover.png");
      }
      // &:active {
      //   background-image: url("../../assets/icon-nextpage-active.png");
      // }
    }

    .pagination-info-box {
      padding: 0 25px;
      height: 24px;
      line-height: 24px;

      .pagination-info-current,
      .pagination-info-split {
        font-size: 14px;
        color: rgba(102, 102, 102, 1);
      }

      .pagination-info-total {
        font-size: 14px;
        color: rgba(153, 153, 153, 1);
      }
    }
  }
}
</style>