<template>
  <div>    
    <div class="weui-cell vux-tap-active weui-cell_access" @click="open">
      <div class="weui-cell__hd"></div> 
      <div class="vux-cell-bd vux-cell-primary">
        <p><label class="vux-label" v-text="title"></label></p> 
        <span class="vux-label-desc"></span>
      </div> 
      <div  v-text="(pleaseChooseShow&&!label)?'请选择':label" :class="(pleaseChooseShow&&!label)?'darkBlue weui-cell__ft':'weui-cell__ft'"></div> 
    </div>

    <div v-transfer-dom>
      <popup v-model="show" max-height="60%" should-scroll-top-on-show>
        <group :title="title">
          <radio  :options="options" @on-change="onChange"></radio>
        </group>
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
    pleaseChooseShow:{
      type:Boolean,
      default:false,
    }
  },
  watch: {
    value(val){
      this.label = val
    }
  },
  created(){
    this.label=this.value;
  },
  data () {
    return {
      newValue: this.value,
      label: '',
      show: false
    }
  },
  methods: {
    open(){
      this.show = true
    },
    onChange(value, label){
      this.label = label;
      this.change(value, label);
      this.show = false;
    }
  }
}
</script>
<style scoped>
.darkBlue{
  color: #507FD6;
}
</style>


