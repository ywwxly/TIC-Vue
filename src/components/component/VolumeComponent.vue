<template>
  <div class="tic-voice--intensity">
      <span :class="volume > 0 ?'tic-voice__line ' : 'tic-voice__line actived'"> </span>
      <template v-for="i in [1,2,3,4,5]">
        <span :class="`tic-voice__line ${i == Math.ceil(volume / 100 * 6) ? 'actived' : ''}`"></span>
      </template>
  </div>
</template>

<script>
  import util from '../../util/util'
  import Component from '../core/Component'


  export default {

    extends: Component,

    props: {
      volume: {
        type: Number,
        default: 0
      }
    },

    data() {
      return {

      }
    },

    mounted() {},

    methods: {

    }
  }
</script>
