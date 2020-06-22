<template>
  <div class="radioChoose">
    <div class="p15 flex jcsb lh20 rel bLine" @click="open">
<!--      <div class="weui-cell__hd"></div> -->
<!--      <div class="vux-cell-bd vux-cell-primary">-->
<!--        <p><label class="vux-label" v-text="title"></label></p> -->
<!--        <span class="vux-label-desc"></span>-->
<!--      </div> -->
<!--      <div  v-text="(pleaseChooseShow&&!label)?'请选择':label" :class="(pleaseChooseShow&&!label)?'darkBlue weui-cell__ft':'weui-cell__ft'"></div> -->
      <p class="fz14 C666">{{title}}</p>
      <p class="C999 fz12 PFSC-Medium mr15">{{label || value || placeholder}}</p>
      <div class='rightRow'></div>
    </div>

    <div v-transfer-dom class="pop">
      <popup v-model="show" max-height="60%" should-scroll-top-on-show v-if="type === 'checkList'">
        <popup-header right-text="确定" :title="title" @on-click-right="clickRight"></popup-header>
          <check-list :options="options"  @on-change="onChange" v-model="newValue"></check-list>
      </popup>
      <popup v-model="show" max-height="60%" should-scroll-top-on-show v-if="type === 'radio'">
        <popup-header :title="title"></popup-header>
        <radio :selected-label-style="{color: '#4D7BFE', fontSize: '14px'}" :options="options" @on-change="radioOnChange" v-model="newValue1"></radio>
      </popup>

    </div>
  </div>
</template>
<script>
import { TransferDom } from 'vux'
export default {
  directives: {
    TransferDom
  },
  props: {
    title: String,
    options: Array,
    change: {
      type: Function,
      default: () => {}
    },
    value: {
      type:String,
      default:''
    },
    haha: {
      type:String,
      default:''
    },
    type: {
      type:String,
      default:'radio'
    },
    placeholder: {
      type:String,
      default:''
    },
    pleaseChooseShow:{
      type:Boolean,
      default:false,
    },
    deepValue: {
    },
    deepValue1: {
    },
  },
  watch: {
    newValue(val){
      console.log('val', val)
      // this.label = val
    },
    newValue1(val){
      console.log('val1', val)
      // this.label = val
    },
    // placeholder(val){
    //   if(!this.value) {
    //     this.label = val
    //   }
    // }
  },
  created(){
   // this.label=this.value;
  },
  data () {
    return {
      newValue: this.deepValue || [],
      newValue1: this.deepValue1,
      show: false,
      label:'',
      selectedColor: '#4D7BFE'
    }
  },
  methods: {
    open(){
      this.show = true
    },
    radioOnChange(value, label) {
      if (label instanceof Array) {
        label = label.join(' 、');
      }
      this.label = label;
      // this.change(value, label);
      this.$emit('change',value,this.label)
      this.show = false;
    },
    onChange(value, label){
      if (label instanceof Array) {
        label = label.join(' 、');
      }
      this.label = label;
      // this.change(value, label);
      this.$emit('change',value,this.label)
    },
    clickRight(){
      this.show = false;
    }

  }
}
</script>
<style  scoped>
.darkBlue{
  color: #507FD6;
}
.pop >>> .weui-cells_radio .weui-cell__ft .weui-icon-checked:before {
  color: #4D7BFE !important;
}
.pop >>> .weui-cells_radio .weui-check__label .weui-cell__bd {
  font-size: 14px;
}
.pop >>> .weui-cells_checkbox .weui-cell__bd {
  font-size: 14px;
}
.pop >>> .weui-cells_checkbox .weui-icon-checked:before {
  font-size: 17px;
}
.pop >>> .weui-cells_checkbox .weui-check:checked + .vux-checklist-icon-checked:before {
  color: #4D7BFE !important;
}
.pop >>> .vux-popup-header-right {
  color: #4D7BFE !important;
  position: absolute;
  font-size: 14px;
  right: 0px;
}
  .pop >>> .vux-popup-header-title {
    font-weight: 550;
  }
  .pop >>> .weui-check__label {
    background-color: white;
  }


</style>


