// var ee = require('event-emitter');

// var Event = {
//   data() {
//     return {
//       event: null
//     }
//   },
//   mounted() {
//     this.event = ee();
//   },

//   methods: {
//     emit(event, ...args) {
//       setTimeout(() => {
//         this.event.emit.apply(this.event, arguments);
//       }, 10)
//     },

//     on(event, listener) {
//       this.event.on.apply(this.event, arguments)
//     },

//     off() {
//       console.log('>>>>>>>>>>>>>>>>>>>>  off >>>>>>>>> ');
//     }
//   }
// }

// export default Event;

import Vue from 'vue';
export default new Vue();