<template>
  <view-box ref="viewBox" class="assetsTotal noFooter">
    <Header title="总资产"  />
    <scroller lock-x height="-88" >
    <div>
      <div>
        <div class="page-head">
            <p class="page-head-title">总资产(元)</p>
          <p class="page-head-content UDC-Mediun">{{tatolAssetsInfo.holdingAmount}}</p>
        </div>
        <div class="page-body">
          <div v-for="assetItem in assetsList" class="assetsContent">
              <div class="flex jcsb foz16 p15">
                <div class="lh22 C333 PFSC-Medium">
                  {{assetItem.holdingTypeName}}
                </div>
                <div class="lh19 CEB5954 fw600 UDC-Bold">
                  {{assetItem.typeAmount ? utils.formatNum(assetItem.typeAmount) : assetItem.message}}
                </div>
              </div>
            <template v-if="assetItem.holdingType === 'PRIVATE_HOLD'">
              <ul class="pol15 por15 assetsChildContent">
                <li class="page-body-li" v-for="item in holdingList" >
                  <div class="page-body-li-title">
                    <span>{{item.productTypeName}}</span><span class="line">|</span><span >{{item.skuShortName}}</span>
                  </div>
                  <div class="page-body-li-content">
                    <div class="page-body-li-content-left">
                      <div class="li-s-content C333 UDC-Bold" >{{item.tradeAmount ? utils.formatNum(item.tradeAmount) : '--'}}</div>
                      <div class="li-s-title">持有金额(元)</div>
                    </div>
                    <div class="page-body-li-content-right">
                      <div class="li-s-content CEB5954 PFSC-Medium" v-if="item.productType === '3'">{{item.nav?item.nav:'--'}}</div>
                      <div class="li-s-content PFSC-Medium" v-if="item.productType === '1'">{{item.confirmDate?item.confirmDate.substring(0,10).replace(/-/g,'.'):'--'}}</div>
                      <div class="li-s-content PFSC-Medium" v-if="item.productType === '2'">{{item.interestDate?item.interestDate.substring(0,10).replace(/-/g,'.'):'--'}}</div>
                      <div class="li-s-title">{{item.productType === '3'?"最新净值("+utils.transferTimeToMonthDate(item.navDate)+")":item.productType === '1'?"确认日期":item.productType === '2'?"起息日":''}}</div>
                    </div>
                  </div>
                  <div class="page-body-li-foot" v-if="item.productType === '3'">
                    <div style="display: inline-block" class="mwo170">
                      <span class="CDA76E">持有份额 </span><span class="C333 d-i-block PFSC-Light">{{item.holdShare}}</span>
                    </div>
                    <span class="CDA76E">买入均价 <span class="C333 PFSC-Light">{{item.buyAvgPrice}}</span></span>
                  </div>
                  <div class="page-body-li-foot" v-if="item.productType === '1'">
                    <div style="display: inline-block" class="mwo170">
                      <span class="CDA76E">最近收益分配日 </span><span class="C333 d-i-block PFSC-Light">{{item.latestInterestDate ? item.latestInterestDate.substring(0,10).replace(/-/g,'.') : '--'}}</span>
                    </div>
                    <span class="CDA76E">分配金额 <span class="C333 PFSC-Light">{{item.interestTotalAmount ?  utils.formatNum(item.interestTotalAmount) : '--'}}</span></span>
                  </div>
                  <div class="page-body-li-foot" v-if="item.productType === '2'">
                    <div style="display: inline-block" class="mwo170">
                      <span class="CDA76E">最新付息日 </span><span class="C333 d-i-block PFSC-Light">{{item.latestInterestDate ? item.latestInterestDate.substring(0,10).replace(/-/g,'.') : '--'}}</span>
                    </div>
                    <span class="CDA76E">付息金额 <span class="C333 PFSC-Light">{{item.interestTotalAmount ?  utils.formatNum(item.interestTotalAmount) : '--'}}</span></span>
                  </div>
                </li>
              </ul>
            </template>
            <template v-else>
              <ul class="pl15 pr15 assetsChildContent">
                <li class="page-body-li" v-for="item in assetItem.holdingList">
                  <div class="page-body-li-title">
                    <span>{{item.productName}}</span>
                  </div>
                  <div class="page-body-li-content-right">
                    <div class="li-s-content C333 UDC-Bold lh19 mt10 foz16 UDC-Bold" > {{item.tradeAmount ? utils.formatNum(item.tradeAmount) : '--'}}</div>
                    <div class="lh20 C999">持有金额(元)</div>
                  </div>
                </li>
              </ul>
            </template>
          </div>
        </div>
      </div>
      <NoData></NoData>
    </div>
    </scroller>
  </view-box>
</template>
<script>
  import Header from '@/pages/common/header'
  import assetList from '@/pages/common/assetList'
  import NoData from '@/pages/common/noData'
  export default {
    name: 'contract',
    components: {
      Header,
      assetList,
      NoData
    },
    data () {
      return {
        pinCode:this.$route.query.pinCode,
        assetsList: [

        ],
        holdingList: [],
        tatolAssetsInfo:{},
      }
    },
    created(){
      this.load()
    },
    methods: {
      //跳转路由
      goTo(path){
        this.$router.push({path})
      },
      load(){
        var that = this;
        this.func.ajaxPost(this.api.customer.queryCustomerHoldinfo, {pinCode:this.pinCode}, res => {
          if (res.data.code === 200) {
            that.tatolAssetsInfo = res.data.data;
            if(!that.tatolAssetsInfo.holdingAmount){
              that.tatolAssetsInfo.holdingAmount ='--'
            }else{
              that.tatolAssetsInfo.holdingAmount =  this.utils.formatData(that.tatolAssetsInfo.holdingAmount);
            }

          } else {
            this.utils.msg(res.data.message);
          }
        })
        this.func.ajaxPost(this.api.customer.queryCustomerHoldList, {pinCode:this.pinCode}, res => {
          if (res.data.code === 200) {
            that.assetsList =  res.data.data;
            if(that.assetsList && that.assetsList.length === 0){
              $(".noData").show();
              return false;
            }
            $(".noData").hide();
            for (let i=0; i<that.assetsList.length; i++) {
              if (that.assetsList[i].holdingType === 'PRIVATE_HOLD') {
                that.holdingList =  that.assetsList[i].holdingList ? that.assetsList[i].holdingList : [];
                if(that.holdingList && that.holdingList.length === 0){
                  return false;
                }
                that.holdingList.forEach(item =>{
                  for(var key in item){
                    if(item.hasOwnProperty(key)){
                      if(key === 'customerCapitalList'){
                        if(!item[key]){
                          item[key] = [];
                          return;
                        }
                      }
                      if(key === 'holdShare'|| key === 'interestTotalAmount' || key === 'interestAmount'){

                        if(!item[key]){
                          item[key] = '--'
                          return false;
                        }
                        item[key] =  this.utils.formatNum(item[key]);
                      }
                      if(key === 'buyAvgPrice'){
                        if(!item[key]){
                          item[key] = '--'
                          return false;
                        }
                        console.log('item[key]', item[key]);
                        item[key] =  this.utils.keepFourDecimal(item[key]);
                      }
                      //item[key] = this.utils.setDefault(item[key]);
                    }
                  }
                })
              }
            }

          } else {
            this.utils.msg(res.data.message);
          }
        })
      },
    }
  }
</script>
<style scoped>
  #app .weui-tab{
    background-color: #ffffff!important;
  }
  #app .assetsTotal >>> .detailsHeader .vux-header:after{
    background:#6689C4;
  }
  .assetsContent {
    border-bottom: 0.3125rem solid #FAFAFA;
  }
  .assetsTotal .assetsContent:last-child {
    border-bottom: none;
  }
  .assetsChildContent li:last-child {
    border-bottom: none;
  }
</style>
