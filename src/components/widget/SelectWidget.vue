<template>

  <select
   v-model="selectValue"
   :class="classname"
   @change="itemChange"
  >
    <option v-if="defaultTitle" value="">{{defaultTitle}}</option>
    <option v-for="(item,key) in items" :key="key" :value="item[valueField]">{{item[keyField]}}</option>
  </select>
</template>
<script>
import util from "../../util/util";

export default {
  props: {
    defaultTitle: {
      type: [String],
      default: "==== 请选择 ==="
    },

    items: {
      type: [Object, Array],
      default() {
        return [];
      }
    },

    keyField: {
      type: String,
      default: "title"
    },

    valueField: {
      type: String,
      default: "value"
    },
    
    classname: {
      type: String,
      default: "value"
    }
  },

  mounted() {
    this.selectValue = this.items[0][this.valueField];
  },

  watch: {
    items() {
      if (util.isArray(this.items)) {
        if (this.items.length) {
          this.selectValue = this.items[0][this.valueField];
        }
      } else if (util.isObject(this.items)) {
        for (var key in this.items) {
          this.selectValue = this.items[key][this.valueField];
          break;
        }
      }
    }
  },

  data() {
    return {
      selectValue: null,
      selectIndex: null // 选中的索引值或者key
    };
  },

  methods: {
    itemChange() {
      if (util.isArray(this.items)) {
        for (var i = 0, len = this.items.length; i < len; i++) {
          if (this.items[i][this.valueField] == this.selectValue) {
            this.selectIndex = i;
            break;
          }
        }
      } else if (util.isObject(this.items)) {
        for (var key in this.items) {
          if (this.items[key][this.valueField] == this.selectValue) {
            this.selectIndex = key;
            break;
          }
        }
      }

      this.$emit("change", {
        value: this.selectValue,
        index: this.selectIndex
      });
    }
  }
};
</script>