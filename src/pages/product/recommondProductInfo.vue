<template>
    <view-box ref="viewBox" class="bagFafafa recommondProductInfo" body-padding-top="44px" body-padding-bottom="0px">
      <Header title="产品推荐" slot="header"/>
      <div>
        <div class="whiteBg pl15 pb15 pr15" style="border: 1px solid transparent">
          <p class="mt12 lh22 C333 fz16 PFSC-Medium-Bold">{{encodeShortName}}</p>
          <div class="mt12 vam" @click="changeSyncFlag">
<!--            <check-icon :value.sync="syncFlag">同步推荐到列表</check-icon>-->
            <span v-if="syncFlag === '1'" class="h14 vab d-i-block vam"><img src="../../assets/images/iconChooseSuc.png" class="w14 h14"></span>
            <span v-if="syncFlag === '0'" class="h14 vab d-i-block vam"><img src="../../assets/images/iconCheck.png" class="w14 h14"></span>
            <span>同步推荐到列表</span>
          </div>
        </div>
        <ul class="mt10" :class="syncFlag==='1' ? 'whiteBg' : 'bagFafafa' ">
          <li
            class="flex jcsb pl15 pr15 lh50 bLine rel fz14" :class="syncFlag==='1' ? 'C333' : 'Cccc' "
            v-for="(basicItem, basicIndex) in basicInfoHead"
            :key="basicIndex">
            <p>{{basicItem.labelName}}</p>
            <p>{{basicItem.value}}</p>
          </li>
        </ul>
        <div class=" pl15 pr15 pb15 pt16 mH110" :class="syncFlag==='1' ? 'whiteBg' : 'bagFafafa' ">
          <p class="fz14" :class="syncFlag==='1' ? 'C333' : 'Cccc'">
            推荐理由
          </p>
          <div class="mt12" v-if="syncFlag === '1'">
            <x-textarea :max="50" placeholder="请输入推荐理由，50字以内。" autosize v-model="recommendReason"></x-textarea>
            </group>
          </div>
        </div>
        <div class="btnBg w90P text-center h50 lh50 fz16 PFSC-Medium Cfff btn" @click="recommend">推荐</div>
      </div>
    </view-box>
</template>
<script>
  import Header from '@/pages/common/header'
  import Footer from '@/pages/common/footer'
  export default {
    name: 'recommondProductInfo',
    components: {
      Header,
      Footer
    },
    data () {
      return {
        shortName: this.$route.query.shortName,
        encodeShortName:'',
        syncFlag: '0',
        recommendReason: '',
        basicInfoHead: [
          {labelName:'推荐时间', value: '7天'},
          {labelName:'产品排序', value: '1'},
          ]
      }
    },
    created(){
      this.encodeShortName = decodeURIComponent(this.shortName);
    },
    methods: {
      changeSyncFlag(){
        this.syncFlag = this.syncFlag === '0' ? '1' : '0';
      },
      recommend() {
        if(!this.recommendReason && this.syncFlag === '1'){
          this.$vux.toast.text("请填写推荐理由！");
          return false;
        }
        let param = {
          appId: this.$route.query.appId, // APPID
          dialogId: this.$route.query.dialogId, // 会话ID
          skuId: this.$route.query.skuId , // 产品SKUID
          syncFlag: this.syncFlag, // 是否同步到推荐列表
          recommendReason: this.syncFlag === '1' ? this.recommendReason : '', // 推荐原因
          recommendDays: '7', // 推荐天数
          productOrder: '1', // 产品排序
          userPin:this.$route.query.pinCode,
          companyId:this.$route.query.companyId
        };
        console.log('param', param);
        this.$vux.confirm.show({
          title:'友情提示',
          confirmText:'确定',
          cancelText:'取消',
          content:'<div class="confirm-body"><div class="confirmBody2"><p>是否确认推荐“'+this.encodeShortName+'”</p></div></div>',
          onConfirm : () => {
            this.func.ajaxPost(this.api.product.recommendProduct, param, res => {
              if (res.data.code === 200) {
                this.$vux.toast.text('推荐成功！')
                let encodePinCode = res.data.data;
                this.$router.push({ path: '/customer/customerTalk',query:{pinCode:encodePinCode, from: 'product'}});
              } else {
                this.$vux.toast.text(res.data.msg);
              }
            })
          }
        })
      }
    }
  }
</script>
<style scoped>
  .recommondProductInfo /deep/ .weui-icon-circle,  .recommondProductInfo /deep/ .weui-icon-success{
    font-size: 14px;
  }
   .recommondProductInfo /deep/ .weui-icon-success, .recommondProductInfo /deep/  .vux-check-icon > .weui-icon-success:before{
    color: #4580d3;
  }
  .recommondProductInfo /deep/  .vux-x-textarea.weui-cell {
    padding: 0;
  }
  .recommondProductInfo /deep/   .weui-textarea[placeholder] {

  }
  .recommondProductInfo /deep/  ::-webkit-input-placeholder { /* WebKit browsers */
    color: #cccccc !important;
  }
  .btn {
    margin: 60px auto 0;
  }
</style>
