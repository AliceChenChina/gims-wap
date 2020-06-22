<template>
  <view-box ref="viewBox" body-padding-top="0px" body-padding-bottom="0px">
    <div class="mt10 pl15 pr15 whiteBg pt15 pb26 rel" @click="goToCheckActivityInfo">
        <p class="fz14 C666 lh20">分享内容</p>
        <div class="fz16 lh24 C333 mt14">{{shareTitle}}</div>
        <div class="rightRow r15 top35"></div>
    </div>
    <div class="whiteBg mt10 pl15 pr15">
      <p class="C666 h50 lh50 fz14" style="border-bottom:1px solid rgb(246, 246, 246)">浏览记录</p>
      <ul v-if="recordsData.length > 0">
        <li v-for="(recordItem,recordIndex) in recordsData" :key="recordIndex" class="pt15 pb15 rel bLine flexS" style="align-items: center">
          <div class="w46 h46 radius50P overflow-hidden" style="margin-right: 0.26rem">
            <img :src="recordItem.wxAvatar ? recordItem.wxAvatar : '/static/img/user.png'" class="maxW100P"/>
          </div>
          <div>
            <div class="flexS jcsb">
              <p class="fz16 PFSC-Medium lh22 C4D7BFE" @click="goToCheckAction(recordItem)">
                {{recordItem.nickName || '匿名用户'}}
              </p>
              <p class="CEB5954 fz24 lh24 w70 ml20" >
                {{recordItem.pv}}
              </p>
            </div>
            <div class="flexS jcsb">
              <div><p class="fz12 lh18 mt5 C666" v-if="recordItem.pin" @click="goToConsumerDetail(recordItem)">
                京东pin: <span class="C4D7BFE">{{recordItem.pin}}</span>
              </p>
                <p class="fz12 lh18 mt5 C666P70" >
                  最新浏览时间：{{utils.transferTimeToDateTime(recordItem.latestAccessTime)}}
                </p>
              </div>
              <div>
                <p class="fz12 C606266 lh17 mt5 w70" style="margin-left:10px">
                  浏览次数(次)
                </p>
              </div>
            </div>
          </div>
        </li>
      </ul>
      <div v-else class="text-center pt20 pb20 C999">
        暂无浏览记录
      </div>
    </div>
  </view-box>
</template>

<script>
  export default {
    name: 'sharedRecordInfo',
    components: {
    },
    data () {
      return {
        shareTitle:this.$route.query.shareTitle,
        shareUrl:this.$route.query.shareUrl,
        recordsData: [],
        jumpUrl: this.$route.query.jumpUrl || 'https://www.jd.com/?cu=true&utm_source=baidu-pinzhuan&utm_medium=cpc&utm_campaign=t_288551095_baidupinzhuan&utm_term=0f3d30c8dba7459bb52f2eb5eba8ac7d_0_fe6b30f509b84c788ea6573430ccf361'
      }
    },
    created(){
      this.getWxInfo();

    },
    mounted(){
      if (window.history && window.history.pushState) {
        history.pushState(null, null, document.URL);
        window.addEventListener('popstate', this.fun, false);//false阻止默认事件
      }
    },
    destroyed(){
      window.removeEventListener('popstate', this.fun, false);//false阻止默认事件
    },
    methods: {
      fun(){
        this.$router.push({name: 'shareRecords'})
      },
      goToCheckActivityInfo(){
        if(!this.shareUrl){
          this.$vux.toast.text('链接地址为空！')
          return false;
        }
       window.location.href = this.shareUrl;
      },
      getWxInfo(){
        this.request.post(this.api.marketShare.queryAccessInfo, {shareId: this.$route.query.shareId}, (data) => {
          this.recordsData = data || [];
        })
      },
      goToCheckAction(item){
        this.$router.push({name:'userVisitRecords',query:{shareId: this.$route.query.shareId, openId: item.openId,wxAvatar: item.wxAvatar, nickName:item.nickName,
            pin: item.pin,shareTitle:this.shareTitle,shareCode: this.$route.query.shareCode}});
      },
      goToConsumerDetail(item){
        let shareRecordInfo = {
          shareId:this.$route.query.shareId,
          shareTitle:this.$route.query.shareTitle,
          shareCode:this.$route.query.shareCode,
          shareUrl:this.$route.query.shareUrl,
        }
        shareRecordInfo = JSON.stringify(shareRecordInfo);
        window.localStorage.setItem('shareRecordInfo', shareRecordInfo);
        this.$router.push({
          name:'customerDetails',
          query:{
            id: item.id,
            userId: item.customerId,
            from: 'shareRecordInfo',
          }
        })
      }
    }
  }
</script>
<style>
</style>
