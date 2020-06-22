<template>
  <view-box ref="viewBox" body-padding-top="0px" body-padding-bottom="0px">
    <div class="mt10 pl15 pr15 whiteBg pt17 pb15 flex">
      <div class="w46 h46 radius50P overflow-hidden mr15">
        <img :src="wxAvatar ? wxAvatar : '/static/img/user.png'" class="maxW100P"/>
      </div>
      <div class="mr25">
        <p class="fz16 PFSC-Medium lh22 C333"  >
          {{nickName || '匿名用户'}}
        </p>
        <p class="fz12 lh18 mt5 C666P70" v-if="pin">
          {{pin}}
        </p>
      </div>
    </div>
<!--    互动内容-->
    <div class="mt10 pl15 pr15 whiteBg pt15 pb48">
      <p class="C333 fz16 lh22">共有{{actionNum}}条互动记录</p>
      <ul class="mt12">
        <li class="pl6 rel pl15 pb33" v-for="(item, index) in userActionData" :key="index" style="border-left: 1px solid rgb(246, 246, 246)">
          <div class="w14 h14 whiteBg rel" style="line-height: 14px;text-align: center;position: absolute;left:-8px;top: 0px">
            <span class="w10 h10 radius50P " style="background-color: rgb(216,172,119);display: inline-block;width: 10px;height: 10px;position: absolute;left: 2px;top: 2px"></span>
          </div>
          <p class="C666P70 fz12 lh17">{{utils.transferTimeToDateTime(item.operDate)}}</p>
          <div class="mt8 C606266 lh17" v-html="item.actInfo"></div>
        </li>
      </ul>
    </div>

  </view-box>
</template>

<script>
  export default {
    name: 'userVisitRecords',
    components: {
    },
    data () {
      return {
        shareId:this.$route.query.shareId,
        userActionData: [],
        openId: this.$route.query.openId,
        pin: this.$route.query.pin,
        shareTitle: this.$route.query.shareTitle,
        actionNum:0,
        nickName: this.$route.query.nickName,
        wxAvatar: this.$route.query.wxAvatar,
        shareCode: this.$route.query.shareCode,
        actTypeArr:['预约','资产证明','交易单','浏览'],
        actionInfo:[]
      }
    },
    created(){
      this.getUserActionData();
    },
    methods: {
      getUserActionData(){
        const param = {
          shareId: this.shareId,
          openId: this.openId,
          sharePin:localStorage.getItem('oriPinCode') ,
          shareTitle: this.shareTitle,
          pin:this.pin
        }
        this.request.post(this.api.marketShare.queryInteractInfo, param, (data) => {
          this.userActionData = data || [];
          this.userActionData.forEach(item => {
            let actionInfo = '';
            // actType:1:预约,2:资产证明,3:交易单,4:浏览
            // ${this.getShareTypeName(actType)}
            let actType = item.actType;
            if(actType === 1) {
              actionInfo = `通过你分享的《${item.actInfo}》进行了<span class="CB08663">预约</span>`
            }else if(actType === 2){
              actionInfo = `通过你分享的《${item.actInfo}》完成了<span class="CB08663">资产证明认证</span>`
            }else if(actType === 3){
              actionInfo = `通过你分享的《${item.actInfo}》进行了<span class="CB08663">购买</span>`
            }else if(actType === 4){
              actionInfo = `浏览了你分享的《${item.actInfo}》`
            }
            item.actInfo = actionInfo;
          })
          this.actionNum = data.length
        })
      },
      getShareTypeName(shareCode){
        let shareTypeName;
        shareTypeName = this.utils.arg.getText('share_type',shareCode)|| '';
        // 处理数据字典产品的文案，在此改为‘产品详情页’
        shareTypeName = shareTypeName === '产品' ? '产品详情页' : shareTypeName;
        return shareTypeName;
      }
    }
  }
</script>
<style>
  .CB08663 {
    color:#B08663
  }
</style>
