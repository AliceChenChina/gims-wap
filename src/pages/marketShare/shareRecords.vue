<template>
  <view-box ref="viewBox" body-padding-top="0px" class="shareRecords x-fixed-bottom-bar">
    <div>
      <div class="h40 pl12 lh40 fz16 C333">
        分享数据总计
      </div>
      <!--    头部-->
      <div class="shareHead">
        <ul class="flex fwrap shareHeadWap whiteBg">
          <li class="w125o" v-for="(item,index) in headData2">
            <div class="headParent pt14 pb14">
              <div>
                <div class="rel pol20 C606266">
                  <div class="rel">
                    <div>
                      <span class="CEB5954 foz24 lh34 PFSC-Medium">{{utils.setDefault(item.shareNum)}}</span>
                    </div>
                    <div class="lh16 mt3">
                      {{utils.setDefault(item.shareTitle)}}
                    </div>
                  </div>
                  <div class="halfBdreeeeee" v-if="index !== 2"></div>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <!--    分享活动记录-->
      <div class="recordsBody whiteBg mt12">
        <ul v-if="recordsData.length > 0">
          <li class="pl12 pt18 pb20 rel bLine" v-for="recordItem in recordsData" @click="goToActivityInfo(recordItem)">
            <div class="recordsHead flex jcsb rel">
              <div class="pr20 rel">
               <span class="makeFz10 PFSC-Medium mr8 Cfff abs left-3 top2" :class="recordItem.shareTypeColor" >
              {{utils.setDefault(recordItem.shareTypeName)}}
              </span>
                <span class="C333 lh22 fz16 pl60">
               {{utils.setDefault(recordItem.shareTitle)}}
              </span>
              </div>
              <div class='rightRow' style="top:10px"></div>
            </div>
            <div class="dataRecord mt20 flex">
              <div v-for="dataItem in recordItem.recordsData " class="flex1">
              <span class="C606266">
                {{utils.setDefault(dataItem.dataLabel)}}:
              </span>
                <span class="CEB5954 PFSC-Medium">
                 {{utils.setDefault(dataItem.dataValue)}}
              </span>
              </div>
            </div>
          </li>
        </ul>
        <div v-if="recordsData.length === 0" class="pt20 pb20 text-center C999">
          暂无分享记录
        </div>
      </div>
    </div>
    <div slot="bottom" style="width:100%;position:absolute;left:0;bottom:0;z-index:100;" class="x-fixed-bottom-bar-inner">
      <div class="pl15 pr15  w100P whiteBg">
        <div class="btn lh50 h50 text-center Cfff btnBg fz16 PFSC-Medium" @click="goToActivityList()">分享内容</div>
      </div>
    </div>
  </view-box>
</template>

<script>
  export default {
    name: 'shareRecords',
    components: {
    },
    data () {
      return {
        headData: {
          shareNum: 3,
          visitNum: 300,
          appointNum: 44,
          dealNum: 99,
          certificateNum: 100
        },
        colorsData:['articleColor', 'posterColor', 'activityColor', 'productColor', 'creditColor'],
        headData2:[
        ], // 头部数据
        recordsData: [], // 记录数据
      }
    },
    created(){
      this.getRecordsData();
      this.getHeadData();
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
      getHeadData(){
        this.request.post(this.api.marketShare.getQueryStatistics, {}, (data) => {
          this.headData = data || {};
          this.headData2 = [{shareNum:this.headData.shareNum,shareTitle:'累计分享(次)'},
            {shareNum:this.headData.pv, unit: '人', shareTitle:'累计访问(次)'},
            {shareNum:this.headData.appointment, unit: '人', shareTitle:'累计预约(次)'},
            {shareNum:this.headData.trade, unit: '人', shareTitle:'累计成交(次)'},
            {shareNum:this.headData.asset, unit: '人', shareTitle:'累计资产证明(次)'},
          ];
        })
      },
      getRecordsData(){
        // "5" 名片分享
        // "4" 产品分享
        // "3" 活动分享
        // "2" 海报分享
        // "1" 文章分享
        this.request.post(this.api.marketShare.getRecordsData, {}, (data) => {
          data = data && data.length > 0 ? data : [];
          data.forEach( item => {
            item.shareTypeColor = this.colorsData[item.shareCode-1];
            item.shareTypeName = this.utils.arg.getText('share_type',item.shareCode)+'分享'
            item.recordsData = [
              {dataLabel: '访问', dataValue: item.pv},
              {dataLabel: '预约', dataValue: item.appointment},
              {dataLabel: '成交', dataValue: item.trade},
              {dataLabel: '资产证明', dataValue: item.asset},
            ]
          })
          this.recordsData = data;

        })
      },
      fun(){
        this.$router.push({name: 'personal'})
      },
      goToActivityInfo(item){
        this.$router.push({name:'sharedRecordInfo',query:{shareId: item.shareId, shareTitle: item.shareTitle, shareUrl: item.shareUrl,shareCode: item.shareCode}});
      },
      goToActivityList(item) {
        this.$router.push({name:'activityList',query:{itemIndex:'0'}});
      }
    }
  }
</script>
<style>
  .shareHeadWap  li:first-child{
    padding-left: 12px;
    border-bottom: 1px solid rgb(246, 246, 246);
  }
  .shareHeadWap  li:nth-child(2){
    border-bottom: 1px solid rgb(246, 246, 246);
  }
  .shareHeadWap  li:nth-child(3){
    border-bottom: 1px solid rgb(246, 246, 246);
  }
  .shareHeadWap  li:nth-child(3){
    padding-right: 12px;
  }
  .shareHeadWap  li:nth-child(4){
    padding-left: 12px;
  }
  .shareHeadWap  li:first-child .headParent,
  .shareHeadWap  li:nth-child(2) .headParent,
  .shareHeadWap  li:nth-child(3) .headParent{
    position: relative;
  }
  .makeFz11{
    display: inline-block;
    font-size: 12px;
    transform: scale(0.9);
    -webkit-transform: scale(0.9);     /* for Chrome || Safari */
    -moz-transform: scale(0.9);        /* for Firefox */
    -ms-transform: scale(0.9);         /* for IE */
    -o-transform: scale(0.9);
  }
  .makeFz10{
    display: inline-block;
    font-size: 12px;
    transform: scale(0.833);
    -webkit-transform: scale(0.833);     /* for Chrome || Safari */
    -moz-transform: scale(0.833);        /* for Firefox */
    -ms-transform: scale(0.833);         /* for IE */
    -o-transform: scale(0.833);
    line-height: 19px;
    padding-left: 7px;
    padding-right: 7px;
  }
  .activityColor {
    background-color: #E7AD75;
  }
  .productColor {
    background-color: #9D8D78;
  }
  .articleColor {
    background-color: #4D7BFE;
  }
  .posterColor {
    background-color:  #92789D;
  }
  .creditColor {
    background-color:  #9D7878;
  }

</style>
