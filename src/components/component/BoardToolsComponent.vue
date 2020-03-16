<template>
    <div :class="'tic-player__tool '+direction">
        <ul class="tic-toolbar-menu">
          <template v-for="tool in tools">
            <li
              :key="tool.key"
              v-bind:class="[tool.key == currentTool ? 'active':'', 'tic-item-'+tool.key]"
              @click="toolTap(tool.key)"
              class="tool-item" 
            >
            	<a href="javascript:;" class="tic-btn">
								<i class="tic-icon--max" :class="'tic-icon-'+tool.key">
                  <span v-if="tool.key === 'bgtool'" class="bg-color" :style="'background-color:' + formatColor + ';'"></span>
                </i>
							</a>
              <template v-if="tool.key ==='toolgraphical'">
                <div class="tool-box">
                <div class="tic-toolbar-dorp toolgraphical-drop">
                    <div class="tic-toolbar-dorp-list">
                      <ul>
                        <li v-for="(thin,index) in brushThin" :key=index 
                        @click="setBrushThin(tool.key,index,thin, $event)"
                        :class="{'actived': brushThinIndex === index}">
													<span :class="['paint-brush-size', thin]"></span>
												</li>
                      </ul>
                    </div>
                    <div class="tic-toolbar-dorp-list">
											<ul>
                        <li v-for="(type,index) in brushType" :key=index 
                        @click="setBrushType(tool.key,index,type, $event)"
                        :class="{'actived': brushTypeIndex === index}">
													<span :class="['toolgraphical', type]"></span>
												</li>
											</ul>
										</div>
                    <div class="tic-toolbar-dorp-list">
											<ul>
                        <li  v-for="(color,index) in colorList" :key="index" 
                        @click="brushColorChange(tool.key, index, color, $event)" 
                        :class="{'actived': brushColorIndex === index}">
													<div class="bg-color-border">
														<span class="bg-color" :style="'background-color:'+color"></span>
													</div>
												</li>
											</ul>
										</div>
                  </div>
                  </div>
              </template>
             
              <template v-if="tool.key ==='bgtool'">
                <div class="tool-box">
                  <div class="color-picker-panel">
                    <sketch-picker v-model="colorPicker" @input="colorPickerChange"/>
                  </div>
                </div>
              </template>

              <template v-if="tool.key ==='toolchoose'">
                <div class="tool-box select-box">
                  <div class="tic-toolbar-dorp toolchoose-drop">
                      <div class="tic-toolbar-dorp-list">
                        <ul>
                          <li v-for="(select,index) in selectType" :key=index 
                          @click.stop ="setSelectType(tool.key,index,select)"
                          :class="{'actived': selectTypeIndex === index}">
                            	<span :class="select === 'select-mouse'?'select-mouse':'toolgraphical select-rect'"></span>
                          </li>
                        </ul>
                      </div>
                  </div>
                </div>
              </template>

              <template v-if="tool.key ==='tooltext'">
                <div class="tool-box">
                 <div class="tic-toolbar-dorp tooltext-drop">
                    <div class="tic-toolbar-dorp-list">
                      <ul>
                        <li v-for="(size,index) in textSize" :key=index
                        @click="setTextSize(tool.key, index, size*20)"
                        :class="{'actived': textSizeIndex === index}">
													<span class="tool-text" :style="'font-size:'+size+'px'">{{size}}</span>
												</li>
                      </ul>
                    </div>
                    <div class="tic-toolbar-dorp-list">
											<ul>
                        <li  v-for="(color,index) in colorList" :key="index" 
                        @click="textColorChange(tool.key, index,color)" 
                        :class="{'actived': textColorIndex === index}">
													<div class="bg-color-border">
														<span class="bg-color" :style="'background-color:'+color"></span>
													</div>
												</li>
											</ul>
										</div>
                 </div>
                 </div>
              </template>
              <template>
                <span class="tool-tip">{{tool.value}}</span>
              </template> 
    
            </li>
          </template>
        </ul>
      </div>
</template>

<script>
import Constant from "../../config/Constant";
import Component from "../core/Component";
import { Sketch } from "vue-color";

export default {
  extends: Component,

  components: {
    "sketch-picker": Sketch
  },

  props: {
    width: {
      type: Number,
      default: 38
    },
    isMaster: {
      type: Boolean,
      default: false
    },
    direction: {
      type: String,
      default: 'ltr'
    }
  },

  data() {
    return {
      colorPicker: { rgba: { r: 255, g: 0, b: 0, a: 1 } },
      tools: [
        { key: "toolchoose", value: "选择" },
        { key: "toolgraphical", value: "形状" },
        { key: "tooltext", value: "文本" },
        { key: "toollaser", value: "激光笔"},
        { key: "toolrubber", value: "橡皮" },
        { key: "toolrevoke", value: "撤销" },
        { key: "toolrecovery", value: "恢复" },
        { key: "tooldel", value: "清空" }
      ],
      currentTool: "toolchoose", // 默认涂鸦
      TOOL_STATUS: Constant.TOOL_STATUS,
      status: Constant.TOOL_STATUS.EXPAND, // 默认展示状态,
      colorList: [
        '#ffffff','#9C9B9B','#2E3039','#000000',
        '#FF0000','#00FF01','#FFD300','#FF6300',
        '#006EFF','#00FFFA','#6A00FF','#FF959B',
      ],
      brushColorIndex: 0,
      textColorIndex: 0,
      textSize: [12,14,16,18],
      textSizeIndex: 2,
      brushType: ['graphical-wave','graphical-rect','graphical-line','graphical-round'],
      brushTypeIndex: 0,
      brushThin: ['size-4','size-8','size-12','size-16'],
      brushThinIndex: 3,
      selectType: ['select-mouse', 'select-rect'],
      selectTypeIndex: 0,
    };
  },

  watch: {
    isMaster: {
      immediate: true,
      handler(val) {
        if(val){
          this.tools.push({ key: "tooladd", value: "新建" })
        }
      }
    }
  },

  methods: {
    updateDirection(direction) {
      this.direction = direction
    },
    toggleToolsPanel() {
      if (this.status === Constant.TOOL_STATUS.EXPAND) {
        this.status = Constant.TOOL_STATUS.COLLAPSE;
      } else {
        this.status = Constant.TOOL_STATUS.EXPAND;
      }
    },

    toolTap(type) {
      var activeStatus = [
        "toolchoose",
        "toolrubber",
        "tooltext",
        "toollaser"
      ];
      if (activeStatus.indexOf(type) > -1) {
        this.currentTool = type;
      }
      var noEventType = ["bgtool"]; // 点击color不触发事件
      if (type === 'toolgraphical') {
        this.showToolgraphical()
        var brushTypeIndex = this.brushTypeIndex || 0
        this.setBrushType(type, brushTypeIndex, this.brushType[brushTypeIndex])
      } else if (type === 'toolchoose') {
        this.showToolchoose()
        var selectTypeIndex = this.selectTypeIndex || 0
        this.setSelectType(type, selectTypeIndex, this.selectType[selectTypeIndex])
      } else if (type === 'tooltext') {
        this.showTooltext()
        this.EventBus.$emit("setting_board_draw_type", type);
      } else if (noEventType.indexOf(type) === -1) {
        this.EventBus.$emit("setting_board_draw_type", type);
      }
    },


    // 设置笔刷粗细
    setBrushThin(type, index, thin, event) {
      if(event){
        event.stopPropagation();
      }
      this.brushThinIndex = index
      this.currentTool = type;
      this.setBrushType(type, this.brushTypeIndex, this.brushType[this.brushTypeIndex])
      switch(thin) {
        case 'size-4':
          this.EventBus.$emit("setting_board_brush_thin", 25)
          break;
        case 'size-8':
          this.EventBus.$emit("setting_board_brush_thin", 50)
          break;
        case 'size-12':
          this.EventBus.$emit("setting_board_brush_thin", 75)
          break;
        case 'size-16':
          this.EventBus.$emit("setting_board_brush_thin", 100)
          break;
      }
      //this.EventBus.$emit("setting_board_brush_thin", thin);
    },

    // 设置笔刷类型
    setBrushType(type, index, brush, event) {
      if(event){
        event.stopPropagation();
      }
      console.debug(`setBrushType type=>${type}, index  => ${index}, brush => ${brush}` )
      this.brushTypeIndex = index
      this.currentTool = type;
      switch(brush) {
        case 'graphical-wave':
          this.EventBus.$emit("setting_board_brush_type", TEduBoard.TOOL_TYPE.TEDU_BOARD_TOOL_TYPE_PEN)
          break;
        case 'graphical-line':
          this.EventBus.$emit("setting_board_brush_type", TEduBoard.TOOL_TYPE.TEDU_BOARD_TOOL_TYPE_LINE)
          break;
        case 'graphical-round':
          this.EventBus.$emit("setting_board_brush_type", TEduBoard.TOOL_TYPE.TEDU_BOARD_TOOL_TYPE_OVAL)
          break;
        case 'graphical-rect':
          this.EventBus.$emit("setting_board_brush_type", TEduBoard.TOOL_TYPE.TEDU_BOARD_TOOL_TYPE_RECT)
          break;
      }
    },

    // 设置笔刷颜色
    brushColorChange(type, key,color, event) {
      if(event){
        event.stopPropagation();
      }
      this.currentTool = type;
      this.brushColorIndex = key
      this.setBrushType(type, this.brushTypeIndex, this.brushType[this.brushTypeIndex])
      this.EventBus.$emit("setting_board_color_type", color);
    },

    // 设置文字输入的字号
    setTextSize(type, index, size) {
      this.currentTool = type;
      this.textSizeIndex = index
      this.EventBus.$emit("setting_board_text_size", size);
    },

    // 设置文字颜色
    textColorChange(type, key, color) {
      this.currentTool = type;
      this.textColorIndex = key
      this.EventBus.$emit("setting_board_text_color", color);
    },

    //设置选择工具
    setSelectType(type, index, select) {
      this.currentTool = type;
      this.selectTypeIndex = index
      switch(select) {
        case 'select-mouse': 
          this.EventBus.$emit("setting_board_draw_type", "toolchoose");
          break;
        case 'select-rect':
          this.EventBus.$emit("setting_board_select_type", TEduBoard.TOOL_TYPE.TEDU_BOARD_TOOL_TYPE_RECT_SELECT);
          break;

      }
    },

    // 颜色改变触发事件
    colorPickerChange() {
      this.EventBus.$emit("setting_board_color_type", this.colorPicker);
    },

    showToolgraphical() {
      var toolgraphical = document.querySelector('.tic-toolbar-dorp.toolgraphical-drop')
      toolgraphical.style.display = 'block'

    },

    showToolchoose() {
      var toolchoose = document.querySelector('.tic-toolbar-dorp.toolchoose-drop')
      toolchoose.style.display = 'block'
    },

    showTooltext() {
      var tooltext = document.querySelector('.tic-toolbar-dorp.tooltext-drop')
      tooltext.style.display = 'block'
    },

  },

  mounted() {
    var graphical = document.querySelector('.tic-item-toolgraphical')
    var toolgraphical = document.querySelector('.tic-toolbar-dorp.toolgraphical-drop')
    graphical.addEventListener('mouseleave',function(){
      toolgraphical.style.display = 'none'
    })
    var choose = document.querySelector('.tic-item-toolchoose')
    var toolchoose = document.querySelector('.tic-toolbar-dorp.toolchoose-drop')
    choose.addEventListener('mouseleave',function(){
      toolchoose.style.display = 'none'
    })
    var text = document.querySelector('.tic-item-tooltext')
    var tooltext = document.querySelector('.tic-toolbar-dorp.tooltext-drop')
    text.addEventListener('mouseleave',function(){
      tooltext.style.display = 'none'
    })

  },

  computed: {
    formatColor() {
      var rgba = this.colorPicker.rgba;
      return `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`;
    }
  }
};
</script>

<style scoped lang="less">

.tic-player__tool {
  z-index: 14999;
}

.tic-toolbar-dorp {
  transition:all 0.15s ease;
}


.tool-item {
  background-repeat: no-repeat;
  background-size: 20px;
  background-position: center center;
  cursor: pointer;
  position: relative;

  .tool-tip {
    visibility:hidden;
    transition:all 0.15s ease;
    position: absolute;
    top: 5px;
    right: 40px;
    white-space: nowrap;
    padding: 2px 6px;
    height: 20px;
    line-height: 20px;
    font-size: 12px;
    color: rgba(255, 255, 255, 1);
    background: rgba(0, 0, 0, 0.8);
    border-radius: 2px;
  }

  &:hover {
    .tool-tip {
      display: block;
      visibility:visible;
    }
    .tic-toolbar-dorp {
      display: none;
      visibility:visible;
    }
    .color-picker-panel {
      display: block;
      visibility:visible;
    }
  }

  .tool-box {
    position: absolute;
    z-index: 5;
    right: 30px;
    top: 0px;
    width: 10px;
    height: 50px;

  }
  .color-picker-panel {
    display: none;
    position: absolute;
    // z-index: 5;
    right: 10px;
    top: 0px;
  }

}

.tic-btn .toolgraphical {
  margin: 6px auto;
  width: 18px;
  height: 14px;
}

.tic-btn .toolgraphical.graphical-line{
  margin: 14px auto;

}

.tic-btn .tic-icon-toolgraphical:hover .toolgraphical.graphical-wave {
  background-image: url('../../assets/css/img/slice/svg/icon-toolwave-hover.svg');
}

.tic-toolbar-dorp-list .toolgraphical.graphical-rect {
  margin-top: 2px;
}


.tic-toolbar-dorp-list .select-mouse {
  background-image: url("../../assets/css/img/slice/svg/icon-toolchoose.svg");
  width: 30px;
  height: 30px;
  position: absolute;
  top: 6px;
  left: 10px;
  display: inline-block;
}
.tic-toolbar-dorp-list .actived .select-mouse {
	background-image: url("../../assets/css/img/slice/svg/arrow.png");
}
.tic-toolbar-dorp-list .select-mouse:hover {
	background-image: url("../../assets/css/img/slice/svg/arrow.png");
}



.tic-toolbar-dorp-list .toolgraphical.select-rect {
  margin-top: 2px;
}

.select-box .tic-toolbar-dorp {
  width:80px;
}

.tic-icon-toollaser {
  background-image: url("../../assets/css/img/slice/png/icon-toollaser.png");
  background-size: 100%;
}
.tic-btn:hover .tic-icon-toollaser {
	background-image: url("../../assets/css/img/slice/png/icon-toollaser-hover.png");
}
.active .tic-icon-toollaser {
	background-image: url("../../assets/css/img/slice/png/icon-toollaser-hover.png");
}

// .rtl {
//   li {
//     .tool-tip {
//       right: 40px;
//       left:unset;
//       direction: rtl
//     }

//     .tool-box {
//       left: unset;
//       right: 30px;
//       top: 0px;
//     }
//     .color-picker-panel {
//       left: unset;
//       right: 10px;
//       top: 0px;
//     }
    
//   }
// }
</style>