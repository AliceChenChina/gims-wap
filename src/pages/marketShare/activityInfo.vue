<template>
  <view-box ref="viewBox" body-padding-top="44px" body-padding-bottom="50px" class="x-fixed-bottom-bar">
    <div class="activityHead h44 lh44 text-center whiteBg C333 PFSC-Medium fz17 fixed left0 top0 w100P" >
      {{activityTitle}}
    </div>
    <div class="infoBody whiteBg">
      <ul v-if="pictureInfo.length > 0">
        <li v-for="picItem in pictureInfo">
          <img class="maxW100P" :src="picItem.pictureLink" alt="活动图片">
        </li>
      </ul>
      <div v-else class="text-center">
        暂无活动图片
      </div>
    </div>
    <div slot="bottom" v-if="pictureInfo.length > 0" class="x-fixed-bottom-bar-inner">
      <div class="btnGroup x-fixed-bottom-bar-inner">
        <ul class="btnGroupWrap">
          <!--          <li><img src="/static/img/download.png"/>保存图片</li>-->
          <li @click="share1"><img src="/static/img/send.png"/>发给好友</li>
          <li @click="share2"><img src="/static/img/wx.png"/>转发微信好友</li>
        </ul>
        <div class="btnLine"></div>
      </div>
    </div>
  </view-box>
</template>

<script>
  import Share from  './share';
  export default {
    name: 'activityInfo',
    components: {
    },
    data () {
      return {
        activityTitle: '',
        pictureInfo: [],
        shareInfo:{},
      }
    },
    created(){
      this.activityTitle = decodeURIComponent(this.$route.query.activityTitle);
      this.getActivityInfo();
      this.request.post(this.api.marketShare.activityShareInfo, {id: parseFloat(this.$route.query.id)}, (data) => {
        const shareData = {
          title:data.activityTitle,
          desc:data.shareContent,
          link: data.activityLink,
          imgUrl:data.sharePicture || 'https://storage.360buyimg.com/jr-assets/mobile/images/logo.jpg',
          shareCode: '3',
          businessId: this.$route.query.id
        };
        this.share = new Share(shareData);
        this.share.shareInit();
      })
    },
    methods: {
      getActivityInfo(){
        let param = {activityId: this.$route.query.id};
        this.request.post(this.api.marketShare.activityInfo, param, (data) => {
          this.pictureInfo = data.pictureInfo
        })
      },
      share1(){
        this.share.shareComWeChart();
      },
      share2(){
        this.share.shareWeChart();
      }
    }
  }
</script>
<style>
  img{
    vertical-align: middle;
  }
  .btnGroup {
    position: fixed;
    left:0;
    bottom:0;
    width: 100%;
    background:white;
  }
  .btnGroup .btnGroupWrap {
    display: flex;
  }
  .btnGroup .btnLine {
    width: 1px;
    height: 22px;
    background-color: rgb(246, 246, 246);
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translateY(-50%);

  }
  .btnGroupWrap li {
    height: 68px;
    line-height: 68px;
    color: #333333;
    font-size: 12px;
    /*border-right: 1px solid rgb(246, 246, 246);*/
    flex-grow: 1;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .btnGroupWrap li img{
    width: 25px;
    height: 25px;
  }
  img{
    max-width: 100%;
  }
</style>
