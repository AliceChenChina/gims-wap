<template>
  <view-box ref="viewBox" body-padding-top="0" body-padding-bottom="50px">
    <div class="infoBody pl15 pr15 pb20 x-fixed-bottom-bar">
      <div class="imageWrapper">
          <img :src="posterUrl" alt="" class="maxW100P">
      </div>
      <div class="C333 fz16 lh22 mt20 PFSC-Medium text-center bottomBtn x-fixed-bottom-bar-inner">
        长按图片可直接转发海报或下载到本地
      </div>
      <div class="shadow" @click="hideShadow" v-if="directionWrapShow">
        <div class="shadowImg" >
          <img src="/static/img/shareDirection.png" >
        </div>
      </div>
    </div>
  </view-box>
</template>

<script>
 // import html2canvas from 'html2canvas';
 import Share from  './share';
  export default {
    name: 'articleInfo',
    components: {
    },
    data () {
      return {
        activityTitle: '',
        pictureInfo: [],
        shareInfo:{},
        articleInfo: {},
        posterUrl: '',
        directionWrapShow: true,
        ele:''
      }
    },
    created(){
      this.getPosterInfo();
      this.share = new Share({shareCode:'2',businessId:this.$route.query.id});
      this.share.shareInit();
    },
    methods: {
      getPosterInfo(){
        let param = {id: this.$route.query.id};
        this.request.post(this.api.marketShare.getPosterBillUrl, param, (data) => {
          this.posterUrl = data;
        })
      },
      hideShadow(){
        this.directionWrapShow = false;
      }
    }
  }
</script>
<style lang="stylus" scoped>
  r($px)
    ($px / 750) * 10rem
  .infoBody
    padding-top r(88)
    padding-left r(35)
    padding-right r(35)
    .imageWrapper
      padding-bottom 0
      box-shadow: 0 2px 10px rgba(155, 155, 155, 0.2)
      background-color white
      margin-bottom r(20)
  .bottomBtn
    width r(680)
    height r(100)
    line-height r(100)
    text-align center
    position fixed
    left r(35)
    bottom 0
    background-color rgba(77, 123, 254, 1)
    color #ffffff
    font-size r(32)
    font-family PingFangSC-Medium
  .shadow
    position fixed
    left 0
    right 0
    bottom 0
    top 0
    background-color rgba(0, 0, 0, 0.6)
  .shadowImg{
    width r(530)
    height r(300)
    margin-top r(475)
    margin-left auto
    margin-right auto
    img {
      max-width 100%
    }
  }
</style>
