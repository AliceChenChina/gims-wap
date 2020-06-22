<template>
  <view-box ref="viewBox" class="index customerTalk" body-padding-top='0px' body-padding-bottom="50px">
<!--    <iframe src="m-jtalk.jd.com/gindex.htm?mode=DJ_EX_B&clientType=DJ_EX_B&source=h5" frameborder="0" width="100%" height="100%"></iframe>-->
    <div style="height: 100%">
      <iframe :src="talkSrc" frameborder="0" width="100%" height="100%" id="iframe"></iframe>
    </div>
    <Footer :active="1" />
  </view-box>

</template>
<script>
  import Footer from '@/pages/common/footer'
  import axios from 'axios'
  export default {
    name: 'index',
    components: {
      Footer
    },
    data() {
      return {
        talkSrc:'',
        customerPin: this.$route.query.pinCode,
        from: this.$route.query.from || ''
      }
    },
    created() {
      const location = this.utils.changeJtalkUrl();
      const fixedPath = location + '/gindex.htm?mode=DJ_EX_B&clientType=DJ_EX_B&source=h5&chatPage=1';
      let token = localStorage.getItem('pinCode') ? localStorage.getItem('pinCode') : '';
      let customerPin = this.customerPin ? this.customerPin : '';
      this.talkSrc = fixedPath +'&customerPin='+customerPin +'&token='+token;
      console.log('talkSrc', this.talkSrc);
    },
    mounted(){
    },
    methods: {
      confirm(data, i, len) {
        this.$vux.confirm.show({
          title: '赎回申请',
          confirmText: '立即完成',
          cancelText: '稍后',
          content: '<div class="confirm-body"><div class="confirmBody2"><p>产品名称：' + data[i].productName + '</p><p>客户名称：' + data[i].customerName + '</p><div class="text-center lightGrey mt10 fw400">请及时补全赎回材料提交审核。</div></div>',
          // 组件除show外的属性
          onCancel: () => {
            i++
            if (i < len) {
              this.$vux.confirm.hide()
              let that = this;
              setTimeout(function () {
                that.confirm(data, i, len)
              }, 200)

            } else {
              this.$vux.confirm.hide();
              this.querySalesCard();
            }
          },
          onConfirm: () => {
            this.$vux.confirm.hide();
            this.$router.push({name: 'redeem', params: {tradeId: data[i].tradeId, status: data[i].status}})
          }
        })
      },
      // 查询理财师名片信息
      querySalesCard() {
        this.func.ajaxPost(this.api.personal.queryCard,{}, res=>{
          // cardStatus:1已设置,非1未设置
          if(res.data.code === 200 && res.data.data.cardStatus !== 1){
            this.remindSalesEditInfo();
          }
        })
      },
      remindSalesEditInfo() {
        this.$vux.confirm.show({
          title: '设置您的个人名片',
          confirmText: '立即设置',
          cancelText: '稍后',
          content: '<div class="confirm-body"><div class="confirmBody2">为了帮助客户更加了解您，提高信任感，建议您立即设置个人名片<div class="text-left lightGrey mt10 fw400 fz12">您也可以稍后在【我的】个人信息中设置</div></div></div>',
          // 组件除show外的属性
          onCancel: () => {
            this.$vux.confirm.hide();
          },
          onConfirm: () => {
            this.$vux.confirm.hide()
            // this.$router.push({name: 'editSalesManBusinessCard'})
            this.$router.push({ path: '/personal/editSalesManBusinessCard'});
          }
        })
      }

    }
  }
</script>
<style scoped>

</style>

