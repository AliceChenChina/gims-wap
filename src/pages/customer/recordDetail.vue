<template>
  <view-box ref="viewBox" class='noFooter'>
    <template v-if='type=="add"'>
      <Header title="新建拜访" rightText="保存" :rightAction="save" />
    </template>
    <template v-else-if='type=="edit"'>
      <Header title="编辑拜访" rightText="保存" :rightAction="save" />
    </template>
    <div class="scrollerMain">
      <group class="noBorder">
        <cell title="拜访客户主题"></cell>
        <x-textarea class="noBorder" placeholder="填写主题(必填)" v-model="formData.title" :show-counter="false" :rows="2"  :max="50" autosize ></x-textarea>
        <cell title="客户姓名"  :value='this.$route.query.name'></cell>
        <Select title="拜访方式" :options="visit_way" :change='changeVisitWay' :value="utils.arg.getText('visit_way',formData.visitWay,true)"  class='lineCell'/>
        <datetime title="拜访开始时间" v-model="formData.startTime" @on-change="e => { formData.startTime = e }" format="YYYY-MM-DD HH:mm"></datetime>
        <datetime title="拜访结束时间" v-model="formData.endTime" @on-change="e => { formData.endTime = e }" format="YYYY-MM-DD HH:mm" ></datetime>
        <cell title='附件上传' :link="{path:'/customer/uploadAttachment',query:{customerId:customerId,visitId:visitId}}"></cell>
        <cell title="备注"></cell>
        <x-textarea class="noBorder" placeholder="请填写备注信息" :show-counter="false"  v-model="formData.remark" :rows="5"  :max="200" autosize></x-textarea>
      </group>
    </div>
  </view-box>
</template>

<script>
import Header from "@/pages/common/header";
import Footer from "@/pages/common/footer";
import Select from "@/pages/common/select";
var lastClick;
export default {
  name: "recordDetail",
  components: {
    Header,
    Footer,
    Select
  },
  beforeRouteLeave(to, from, next) {
    if (to.name == "uploadAttachment") {
      this.$store.commit("changeRecordDetail", this.formData);
    } else if (to.name == "recordList") {
      this.$store.commit("changeRecordDetail", {});
    }
    next();
  },
  data() {
    return {
      visitId: this.$route.query.visitId,
      customerId: this.$route.query.customerId,
      type: this.$route.query.type,
      visit_way: [], //拜访方式
      leaveLoad: false, //离开组件到达另外一个组件,另一个组件是否刷新
      controlButton: true,//控制保存按钮不生成多个客户信息
      formData: {
        customerId: this.$route.query.customerId,
        startTime: "",
        endTime: "",
        remark: "",
        visitWay: "", //拜访方式
        title: "", //主题
        attachList:[],
      }
    };
  },
  created() {
    //获取拜访方式
    this.visit_way = this.utils.arg.getSelect("visit_way");
    let data = this.$store.state.recordDetail;
    if (Object.keys(data).length != 0) {

      this.formData = this.$store.state.recordDetail;
    } else {
      //获取拜访记录详情
      if (this.type == "edit") {
        this.func.ajaxPost(
          this.api.customer.GetCustomerVisit,
          { id: this.visitId },
          res => {
            if (res.data.code == 200) {

              let data = res.data.data;
              if (data.startTime) {
                data.startTime = this.utils.dateFtt(
                  "yyyy-MM-dd hh:mm",
                  data.startTime
                );
              }
              if (data.endTime) {
                data.endTime = this.utils.dateFtt(
                  "yyyy-MM-dd hh:mm",
                  data.endTime
                );
              }
              if (res.data.data.attachList == null) {
                res.data.data.attachList = [];
              }
              this.formData = data;
            } else {
              this.utils.msg(res.data.message);
            }
          }
        );
      } else if (this.type == "add") {
        this.formData = {
          customerId: this.$route.query.customerId,
          startTime: "",
          endTime: "",
          remark: "",
          visitWay: "", //拜访方式
          title: "", //主题
          attachList:[],
        };
          this.$store.commit("changeRecordDetail", {});
      }
    }
  },
  methods: {
    //选择拜访方式
    changeVisitWay(key, value) {
      this.formData.visitWay = key;
    },
    //保存
    save() {
      let noFastClick = this.nofastClick();
      if(noFastClick) {
        let checked = this.check();
        if (checked) {
          let VM = this;
          //发送保存的ajax
          let url = "";
          if (this.type == "add") {
            url = this.api.customer.AddCustomerVisit;
          } else if (this.type == "edit") {
            url = this.api.customer.EditCustomerVisit;
          }
          let params = this.formData;
          if (params.startTime) {
            params.startTime = params.startTime + ":00";
          }
          if (params.endTime) {
            params.endTime = params.endTime + ":00";
          }
          //判断结束时间是否大于开始时间
          let startSecond = new Date(params.startTime.replace(/-/g, '/')).getTime();
          let endSecond = new Date(params.endTime.replace(/-/g, '/')).getTime();
          if (endSecond < startSecond) {
            this.utils.msg("结束时间不能小于开始时间")
            return;
          }
          if (this.controlButton) {
            this.controlButton = false;
            this.func.ajaxPost(url, params, res => {
              if (res.data.code === 200) {
                let content = '';
                if (this.type == 'add') {
                  content = '添加成功'
                } else if (this.type == 'edit') {
                  content = '编辑成功'
                }
                this.$vux.alert.show({
                  title: "提示",
                  content,
                  onHide() {
                    VM.$router.go(-1);
                  }
                });
              } else {
                this.controlButton = true;
              }
            });
          }
        }
      }
    },
    check() {
      let checkBoolean = false;
      if(this.formData.title==''){
          this.utils.msg("请填写主题");
          return checkBoolean
      }else{
         checkBoolean=true;
         return checkBoolean
      }
    },
    //判断是否是快速点击
    nofastClick(){
      var nowClick = new Date();
      if (lastClick === undefined) {
        lastClick = nowClick;
        return true;
      } else {
        if (Math.round((nowClick.getTime() - lastClick.getTime())) > 1000) {
          lastClick = nowClick;
          return true;
        }
        else {
          lastClick = nowClick;
          return false
        }
      }
    },
  }
};
</script>
<style scoped>
  .vux-x-textarea.weui-cell>>>  .weui-label{
    height: 30px;
    line-height: 30px;
  }

</style>
