<template>
  <view-box body-padding-top='0' body-padding-bottom='0'>
    <div>
    </div>
  </view-box>
</template>
<script>
  export default {
  name:'autoLogin',
  mounted(){
   this.getWechatAccessUrl(this.getReturnUrlParam())
  },
  methods: {
    getWechatAccessUrl(param) {
      this.func.ajaxPost(this.api.login.getWechatAccessUrl, param, res => {
        if (res.data.code === 200) {
          window.location.href = res.data.data;
        } else {
          this.$router.push({ path: "/login" });
        }
      },false,true);
    },
    getReturnUrlParam(){
      const href =  window.location.href;
      const index = href.indexOf('returnUrl=');
      const len = 'returnUrl='.length;
      let param = {};
      if(index === -1) {
        param = {};
      } else {
        const returnUrl = window.location.href.substring(index+len)
        param = {returnUrl:decodeURIComponent(returnUrl)};
      }
      return param;
    }
  }
};
</script>
