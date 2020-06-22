<template>
  <view-box ref="viewBox" class="productList noFooter">
     <Header :title="productDetail.productNameShort" preventGoBack :leftAction='goBack'/>
      <div class="productListWrapper">
        <div>
            <!-- 二级市场头部效果 start -->
            <div class="productList-header" v-if="type == 'secondary_market'">
              <div class="productList-content">
                <p>
                  <span>单位净值({{productDetail.netDate}})</span>

                  <b>{{productDetail.netValue}}</b>
                </p>
                <p>
                  <span>{{productDetail.productStatusName}}</span>
                </p>
              </div>
              <div class="productList-footer">
                <p>
                  <span>起购金额（元）</span>
                  <b>{{productDetail.minBanlanceName}}</b>
                </p>
                <p>
                  <span>投资策略</span>
                  <b>{{productDetail.strategyTypeName}}</b>
                </p>
                <p>
                  <span>风险等级</span>
                  <b>{{productDetail.riskLevel}}</b>
                </p>
              </div>
            </div>
            <!-- 二级市场头部效果 end -->
            <!-- 固收头部效果 start -->
            <div class="productList-header" v-if="type == 'fixed_income'">
              <div class="productList-content">
                <p>
                  <span>{{productDetail.incomeTypeName}}</span>
                  <b>{{productDetail.incomeValue}}</b>
                </p>
                <p>
                  <span>{{productDetail.productStatusName}}</span>
                </p>
              </div>
              <div class="productList-footer">
                <p>
                  <span>起购金额（元）</span>
                  <b>{{productDetail.minBanlanceName}}</b>
                </p>
                <p>
                  <span>投资期限</span>
                  <b>{{productDetail.timeLimitName}}</b>
                </p>
                <p>
                  <span>风险等级</span>
                  <b>{{productDetail.riskLevel}}</b>
                </p>
              </div>
            </div>

            <!-- 固收头部效果 end -->
            <!-- 股权头部效果 start -->
            <div class="productList-header" v-if="type == 'equity'">
              <div class="productList-content">
                <p>
                  <span>投资方向</span>
                  <b>{{productDetail.investmentTrends}}</b>
                </p>
                <p>
                  <span>{{productDetail.productStatusName}}</span>
                </p>
              </div>
              <div class="productList-footer">
                <p>
                  <span>起购金额（元）</span>
                  <b>{{productDetail.minBanlanceName}}</b>
                </p>
                <p>
                  <span>投资期限</span>
                  <b>{{productDetail.timeLimitName}}</b>
                </p>
                <p>
                  <span>风险等级</span>
                  <b>{{productDetail.riskLevel}}</b>
                </p>
              </div>
            </div>

            <!--收益走势图  开始-->
            <div class="yieldCurve" v-if="type == 'secondary_market'" v-show="controlShow">
              <div class="yieldCurve-content">
                <h4>收益走势</h4>
                <div class="echartTab">
                  <div v-for="(item,index) in chartTab" :key="index" class="bd-x bd-a" :class="{'current':index == currentTab}"
                      @click="changeChart(index)">{{item}}
                  </div>
                </div>
                <div class="chart-data">
                  <div v-for="(item,index) in chartOption" :key="index"><span :class="index == 0 ? 'brown':'grey'"></span>
                    <span>{{item.name}}：</span><span
                      :class="item.value>0 ? 'curveRed':'curveGreen'">{{item.value}}%</span>
                  </div>
                </div>
                <!--<div class="chart-data df aic">-->
                <!--<div v-for="(item,index) in chartOption" :key=" index" class="fb ">-->
                <!--<span :class="index == 0 ? 'dot-yellow':'dot-blue'"></span>{{item.name}}：<span-->
                <!--:class="item.value>0 ? 'cF15A5B':'c75B4AD'">{{item.value}}%</span>-->
                <!--</div>-->
                <!--</div>-->

                <x-chart :id="id" :yData="yData" :xAxis="xAxis"></x-chart>
                <div class="chart-time">
                  <span v-for="(item,index) in chartTime" :key="index">{{item}}</span>
                </div>
              </div>
            </div>
            <!--收益走势图  over-->
            <!--业绩表现、产品净值start-->

            <div class="benifitPerformance" v-if="type == 'secondary_market'">
              <tab custom-bar-width="55px" class="mt10">
                <tab-item :selected="tabIndex == 0 ? true : false" @on-item-click="tabClick(0)">业绩表现</tab-item>
                <tab-item :selected="tabIndex == 1 ? true : false" @on-item-click="tabClick(1)">历史净值</tab-item>
                <tab-item></tab-item>
              </tab>

              <template v-if="!tabIndex">
                <div class="benifitContent">
                  <div class="benifitTitle">
                    <span>范围</span>
                    <span>本基金</span>
                    <span>沪深300</span>
                  </div>

                  <div class="benifitData" v-for="(item,index) in netValueUpDown.datasVo" :key="index">

                    <span>{{item.date}}</span>
                    <span :class="item.benifit=='--'? 'curveGrey':parseFloat(item.benifit)>0?'curveRed':'curveGreen'">{{item.benifit}}</span>
                    <span :class="item.baseBenifit=='--'? 'curveGrey':parseFloat(item.baseBenifit)>0?'curveRed':'curveGreen'">{{item.baseBenifit}}</span>
                  </div>
                    <div  v-if="controlNetValue"  class="noMoreData" >暂无数据</div>
                </div>
              </template>
              <template v-else>
                <div class="benifitContent newValueData">
                  <div class="benifitTitle">
                    <span>日期</span>
                    <span>单位净值</span>
                    <span>累计净值</span>
                  </div>
                  <div class="benifitData" v-for="(item,index) in historyNetValueList" :key="index">
                    <span>{{utils.dateFtt("yyyy-MM-dd",item.netDate)}}</span>
                    <span>{{utils.keepFourDecimal(item.netValue)}}</span>
                    <span>{{utils.keepFourDecimal(item.netValueAccu)}}</span>
                  </div>
                  <template>
                    <div v-if="controlShowMore" class="checkMore"
                        @click="goTo('/product/netValueList?productId='+productId)">查看更多
                    </div>
                    <div v-else class="noMoreData">暂无数据</div>
                  </template>
                </div>
              </template>
            </div>
            <!--业绩表现、产品净值over-->

            <!--固收主体部分代码start-->
            <div class="productIntroduct" v-if="type == 'fixed_income'">
              <h4>产品介绍</h4>

              <div class="productIntroductCnt" id="bodyFont" ref="bodyFont" :class="{bodyHeight:contentStatus}">
                <p v-html="productDetail.productDesc"></p>
              </div>

              <div class="contentToggle introduce-more" v-if="contentStatus" @click="contentStatus=!contentStatus">查看全文
              </div>
            </div>
            <!--固收主体部分代码end-->

            <!--股权的主体部分代码start-->
            <div class="productIntroduct" v-if="type == 'equity'">
              <h4>产品介绍</h4>
              <div class="productIntroductCnt" id="bodyFont" ref="bodyFont" :class="{bodyHeight:contentStatus}">
                <p v-html="productDetail.productDesc"></p>
              </div>
              <div class="contentToggle introduce-more" v-if="contentStatus" @click="contentStatus=!contentStatus">查看全文
              </div>
            </div>
            <div class="equityIntroduct" v-if="type == 'equity'">
              <h4>投资标的</h4>
              <p>{{productDetail.investTarget}}</p>
            </div>
            <div class="equityIntroduct" v-if="type == 'equity'">
              <h4>退出方式</h4>
              <p>{{productDetail.exitMode}}</p>
            </div>

            <!--股权的主体部分代码over-->

            <!--产品档案start-->
            <div>
              <group>
                <cell title="产品档案" class="title"></cell>
                <cell title="基金概况" is-link :link="'/product/moreDetail?type='+ type+'&productId='+productId">
                    <span slot="value" v-if="type=='fixed_income'">概况、合同、公告</span>
                    <span slot="value" v-else>概况、分红、合同、公告</span>
                </cell>
                <cell title="基金经理" primary="content" v-if="type == 'secondary_market'">{{productDetail.managerNames}}</cell>
                <cell title="管理人" primary="content" v-if="type == 'fixed_income'||type == 'equity'">
                  {{productDetail.mandatorName}}
                </cell>
              </group>
              <group>
                <cell title="交易规则" class="title"></cell>
                <cell title="费用信息" is-link :link="'/product/fee?type='+ type+'&productId='+productId"><span slot="value">买入/卖出费率</span>
                </cell>
                <cell title="折标系数" primary="content">{{productDetail.commisionConvert}}</cell>
                <cell title="提成比例" primary="content">{{productDetail.commisionRate}}</cell>
              </group>
            </div>
        </div>
        <div class="footer-btn" v-if="declarationEntryKey">
          <x-button @click.native='toOrder' class='nextBtn' :class="productDetail.canBuy?'':'grayBtn'">立即报单</x-button>
        </div>
      </div>
  </view-box>
</template>

<script>
  import Header from '@/pages/common/header'
  import Footer from '@/pages/common/footer'
  //highcharts插件
  import XChart from '../components/high-charts/high-charts'
  import BScroll from 'better-scroll'
import { setTimeout } from 'timers';
  export default {
    name: 'productList',
    components: {
      Header,
      Footer,
      XChart
    },
    data() {
      return {
        type: this.$route.query.type,
        tabIndex: 0,
        productId: this.$route.query.productId,
        productDetail: {},
        chartTab: [],
        currentTab: 0,//图表当前显示
        gdDMProductNetValueList: [],//收益走势
        xAxis: [],
        yData: [],//本基金
        btnType: 1,//按钮初始状态
        chartOption: [{}, {}],//图标标示
        chartTime: [],//图标时间
        id: this.$route.query.productId,
        netValueUpDown: {},//业绩表现
        historyNetValueList: [],//历史净值列表
        controlShow: false,//二级市场，无数据时，无线图不显示
        contentStatus: false,
        curHeight: 0,
        bodyHeight: 600,
        controlShowMore: false,//控制历史净值，无数据时显示“暂无数据”，有数据时查看更多
        controlNetValue:true,//控制业绩表现，无数据时显示“暂无数据”
        declarationEntryKey: this.utils.userInfo.checkUserPowerKey(this.powerKey.declarationEntryKey), // 报单权限控制
      }
    },
    mounted() {
      setTimeout(() => {
        this.contentToggle();//11
      }, 500)
      let apiUrl = undefined;
      let that = this;
      switch (this.type) {
        case 'secondary_market':
          apiUrl = 'SecondaryMarketDetail';
          break;
        case 'fixed_income':
          apiUrl = 'FixedIncomeDetail';
          break;
        case 'equity':
          apiUrl = 'EquityDetail';
          break;
      }
      this.func.ajaxPost(this.api.product[apiUrl], {'productId': this.productId}, res => {
        var that = this;
        if (res.data.code == 200) {
          let temp = res.data.data;
          let productDetail = {};
          //产品简称
          productDetail.productNameShort = temp.productNameShort ? temp.productNameShort : ' ';
          //产品状态名称
          productDetail.productStatusName = temp.productStatusName ? temp.productStatusName : '--';
          //基金经理
          productDetail.managerNames = temp.managerNames ? temp.managerNames : '--';
          //管理人
          productDetail.mandatorName = temp.mandatorName ? temp.mandatorName : '--';
          //产品介绍
          productDetail.productDesc = temp.productDesc ? temp.productDesc : '暂无内容';
          //起购金额
          productDetail.minBanlanceName = temp.minBanlanceName ? temp.minBanlanceName : '--';
          //投资期限
          productDetail.timeLimitName = temp.timeLimitName ? temp.timeLimitName : '--';
          //二级市场单位净值
          productDetail.netValue = temp.netValue ? this.utils.keepFourDecimal(temp.netValue) : '--';
          //固收收益信息类型
          productDetail.incomeTypeName = temp.incomeTypeName ? temp.incomeTypeName : '--';
          //固收收益信息值
          productDetail.incomeValue = temp.incomeValue ? temp.incomeValue : '--';
          //股权投资方向
          productDetail.investmentTrends = temp.investmentTrends ? temp.investmentTrends : '-';
          //单位净值时间
          productDetail.netDate = this.utils.dateFtt("yyyy-MM-dd", temp.netDate);
          //折标系数
          productDetail.commisionConvert = temp.commisionConvert ? temp.commisionConvert : '--';
          //风险偏好
          productDetail.riskLevel = (this.handelRiskLevel(temp.riskLevel)).risk;
          //产品id
          productDetail.productId = temp.productId;
          //提成比例
          productDetail.commisionRate = (temp.commisionRate==null || temp.commisionRate==undefined) ? '--' : temp.commisionRate + '%';
          //策略分类
          productDetail.strategyTypeName = temp.strategyTypeName ? temp.strategyTypeName : '--';
          //投资标的
          productDetail.investTarget = temp.investTarget ? temp.investTarget : '--';
          //退出方式
          productDetail.exitMode = temp.exitMode ? temp.exitMode : '--';
          //剩余募集规模
          productDetail.maxUpperBalanceName = temp.maxUpperBalanceName ? temp.maxUpperBalanceName : '--';
          //startID
          productDetail.startId=temp.bookingStartId;
          productDetail.canBuy=temp.canBuy;
          //是否代销
          productDetail.isProxy=temp.isProxy;
          productDetail.assetCertificateLevel = temp.assetCertificateLevel;
          this.productDetail = productDetail;
          //收益走势数据
          that.gdDMProductNetValueList = temp.yieldRateList;
          if (that.gdDMProductNetValueList) {
            if (that.gdDMProductNetValueList.toString() != '') {
              that.controlShow = true;
              that.gdDMProductNetValueList = that.formatChart(that.gdDMProductNetValueList);
              that.gdDMProductNetValueList.forEach(function (item, index) {
                if (item.defaultData) {
                  that.changeChart(index);
                  return;
                }
              })
            }
          }
          //获取业绩表现数据，temp.netValueUpDown有数据时，给that.netValueUpDown赋值，无数据时that.netValueUpDown为{}
          if(temp.netValueUpDown){
            that.netValueUpDown = temp.netValueUpDown;
            that.controlNetValue = false;
          }

          //获取历史净值列表数据
          if (temp.historyNetValueList) {    //判断返回的数据是否有historyNetValueList这个字段
            that.historyNetValueList = temp.historyNetValueList;
            if (that.historyNetValueList.toString() != '') {    //判断historyNetValueList是否为空数组
              that.controlShowMore = true;
            }
          }

          that.$nextTick(function () {
            setTimeout(function(){
              let wrapper = document.querySelector('.productListWrapper')
              let scroll = new BScroll(wrapper,{
                bounce: false,
                click: true,
              })
            },500)
          })
        }
      })
    },
    methods: {
      contentToggle() {
        if (this.$refs.bodyFont) {
          this.curHeight = this.$refs.bodyFont.offsetHeight;
          if (this.curHeight > this.bodyHeight) {
            this.contentStatus = true;
          } else {
            this.contentStatus = false;
          }
        }
      },
      //跳转路由
      goTo(path) {
        this.$router.push({path});
      },
      //选项卡切换
      tabClick(index) {
        this.tabIndex = index
      },
      handelRiskLevel(str) {
        //将返回的1,2,3,4,5对应的风险
        let newStr = {};
        switch (str) {
          case '1':
            newStr.risk = '低风险';
            newStr.class = 'green';
            break;
          case '2':
            newStr.risk = '较低风险';
            newStr.class = 'green';
            break;
          case '3':
            newStr.risk = '中等风险';
            newStr.class = 'org';
            break;
          case '4':
            newStr.risk = '较高风险';
            newStr.class = 'red';
            break;
          case '5':
            newStr.risk = '高风险';
            newStr.class = 'red';
            break;
          default:
            newStr.risk = '-';
            newStr.class = '-';
        }
        return newStr;
      },
      toOrder() {
        if (!$('.nextBtn').hasClass('grayBtn')) {
          this.$store.commit("changeOrderDetail", {
            type: this.type,
            productDetail: this.productDetail,
            customerDetail: {}
          });
          this.$store.commit("changeOrderRss", {});
          this.$store.commit("changeOrderRss", {"startId": this.productDetail.startId});
          this.$router.push({name: 'order',params:{productStatus:this.productDetail.productStatus}});
        } else {
          this.utils.msg("当前产品不可报单");
        }
      },
      goBack() {
        //返回产品页面
        this.$router.push({path: '/product'})
      },
      //收益走势相关方法
      formatChart(product) {
        var that = this;
        product.forEach(function (item, index) {
          that.chartTab[index] = item.name
        })
        return product
      },
      formatData(data, i) {
        let product = [];
        data.forEach(function (item, index) {
          product[index] = item.value[i];
        })
        return product
      },
      changeChart(index) {
        var that = this;
        that.currentTab = index;
        that.xAxis = this.formatData(that.gdDMProductNetValueList[index]['productData'][0].data, 0);
        console.log('this.xAxis', that.xAxis);
        that.yData = that.gdDMProductNetValueList[index]['productData'];
        console.log('this.yData', that.yData);
        that.gdDMProductNetValueList[index]['productData'].forEach(function (item, index) {
          that.chartOption[index]['name'] = item.productName;
          that.chartOption[index]['value'] = (item.data[item.data.length - 1]['value'][1]);
        });
        let product = that.gdDMProductNetValueList[index]['productData'][0];
        that.chartTime[0] = product.data[0]['value'][0];
        that.chartTime[1] = product.data[product.data.length - 1]['value'][0];
      },

    }
  }
</script>

<style scoped>
  .font {
    text-align: center;
    font-size: 14px;
    margin-top: 25px;
  }

  .nextBtn {
    background: #505269;
    color: white !important;
  }

  .productList >>> .detailsHeader .vux-header::after {
    height: 0px !important;
  }

  .curveRed {
    color: #f47e7c;
  }

  .curveGreen {
    color: #8cc1bc;
  }
  .curveGrey{
    color: #cccccc;
  }

  #app .vux-tab .vux-tab-item {
    font-size: 16px;
    color: #AAA;
    font-weight: bold;
  }

  #app .vux-tab .vux-tab-item.vux-tab-selected {
    color: #333;
  }

  .productList >>> .vux-tab .vux-tab-item {
    background-size: 100% 0px !important;
  }

  .vux-tab-wrap >>> .vux-tab-container {
    height: 90px;
  }

  .vux-tab-wrap >>> .vux-tab {
    margin-top: 10px;
    margin-bottom: 20px;
  }

  #app .weui-cells .weui-cell.title {
    background-color: #ffffff;
    font-size: 14px;
  }

  #app .weui-cells .weui-cell {
    font-size: 14px;
    color: #666666;
  }

  weui-cell >>> .weui-cell__ft {
    font-size: 12px;
  }
  #app .weui-cells .weui-cell.title>>> .vux-cell-bd .vux-label{
    font-size: 16px;
    color: #333333;

  }
  #app .weui-cells .vux-tap-active>>> .vux-cell-bd .vux-label{
    font-size: 16px;
    color: #666666;

  }
  .weui-cell >>> .weui-cell__ft{
    color:#777777;
  }
  .weui-cell >>>  .vux-cell-primary{
    color:#333333;
  }
  #app .productList .benifitPerformance .benifitContent .benifitTitle>>>span:nth-child(2){
    text-align: right;
    padding-right:48px ;
  }
  #app .productList .benifitPerformance .benifitContent .benifitTitle>>>span:nth-child(3){
    text-align: right;
    padding-right:48px ;
  }
  #app .productList .benifitPerformance .benifitContent .benifitData>>> span:nth-child(2){
       text-align: right;
    padding-right:48px ;
     }
  #app .productList .benifitPerformance .benifitContent .benifitData>>> span:nth-child(3){
    text-align: right;
    padding-right:48px ;
  }

  #app .productList .benifitPerformance .benifitContent.newValueData .benifitTitle>>>span:nth-child(2){
    text-align: right;
    padding-right:32px ;
  }
  #app .productList .benifitPerformance .benifitContent.newValueData .benifitTitle>>>span:nth-child(3){
    text-align: right;
    padding-right:50px ;
  }
  #app .productList .benifitPerformance .benifitContent.newValueData .benifitData>>> span:nth-child(2){
    text-align: right;
    padding-right:32px ;
  }
  #app .productList .benifitPerformance .benifitContent.newValueData .benifitData>>> span:nth-child(3){
    text-align: right;
    padding-right:50px ;}
  .vux-tab-wrap>>>.vux-tab-container{
    z-index: 499;
  }

  #app .productList>>>.weui-tab__panel {
    padding-bottom: 50px;
  }

  .productListWrapper{
    height: 100%;
  }
  .footer-btn>>>.grayBtn{
    background-color: #d8d8d8;
  }

  /* #app .productList>>>.vux-tab {
    z-index: 100;
  } */
</style>


