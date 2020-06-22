<template>
  <div class="radius10 p12 whiteBg mt12" >
    <p class="PFSC-Medium C666 fz14 lh20">历史收益模拟</p>
    <p class="mt12 C999 fz12 lh20">根据以上规划方案，对规划方案进行历史收益回测，可以得到以下收益走势</p>
    <div>
      <div>
        <p class="mt12 C666 fz12 lh17">指数对比(数据更新至{{chartTime[1]}})</p>
        <div class="mt5">
          <curve :yData="yData" :xAxis="xAxis"/>
        </div>
        <div class="flex C999 jcsb">
          <span v-for="(item,index) in chartTime" :key="index">{{item}}</span>
        </div>
        <div class="flex jcc C999 fz12 lh16 mt10">
          <span class="w69 lh30 bd1ddd text-center bdr-none tabItem" v-for="(tabItem,tabIndex) in charTab" :key="tabIndex" :class="{'CDA76E PFSC-Medium': currentTab===tabIndex}" @click="changeTab(tabIndex)">{{tabItem}}</span>
        </div>
        <div class="flex" :class="incomeDataList.length === 1 ? '' : 'jcsb'">
          <div class="w90 lh17">
            <p class="mt18" style="color: #ffffff">11</p>
            <p class="mt18">累计收益率</p>
            <p class="mt18">年化收益率</p>
            <p class="mt18 flex"><span class="mr2">年化波动率</span><img src="../../../../assets/images/tipIcon.png" class="w15 h15 vab" @click="showTip(tipData.annualizedVolatility)"/></p>
            <p class="mt18 flex"><span class="mr2">风险收益率</span><img src="../../../../assets/images/tipIcon.png" class="w15 h15 vab" @click="showTip(tipData.riskIncomeRate)"/></p>
          </div>
          <div class="C999 fz12 lh17 text-right" v-for="(dataItem,dataIndex) in incomeDataList" :key="dataIndex" :class="incomeDataList.length === 1 ? 'w100P text-center' : 'jcsb'">
            <div class="spot mt18" :class="colorArr[dataIndex]">{{utils.setDefault(dataItem.portfolioType)}}</div>
            <div class="PFSC-Medium mt18" :class="{ 'cRecond' : dataIndex === 0 }">{{utils.setDefault(dataItem.totalIncomeRate) === '--' ? '--' : `${dataItem.totalIncomeRate}%`}}</div>
            <div class="PFSC-Medium mt18" :class="{ 'cRecond' : dataIndex === 0 }">{{utils.setDefault(dataItem.annualizedReturn) === '--' ? '--' : `${dataItem.annualizedReturn}%`}}</div>
            <div class="PFSC-Medium mt18" :class="{ 'cRecond' : dataIndex === 0 }">{{utils.setDefault(dataItem.annualizedVolatility) === '--' ? '--' : `${dataItem.annualizedVolatility}%`}}</div>
            <div class="PFSC-Medium mt18" :class="{ 'cRecond' : dataIndex === 0 }">{{utils.setDefault(dataItem.riskIncomeRate)}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="mark mt12">
      <div class="text-center Cccc fz10 lh16">产品过往业绩不预示其未来表现，市场有风险，投资需谨慎</div>
      <div class="text-center Cccc fz10 lh16">推荐配置的历史回测表现取比例中位数计算得到</div>
    </div>
  </div>
</template>
<script>
  import curve from '@/pages/components/high-charts/curve';
  import highChartsColumn from '@/pages/components/high-charts/high-charts-column'
  export default {
    name: 'yieldLineChart',
    components: {
      curve,
      highChartsColumn
    },
    data () {
      return {
        radioData: {},
        charTab:['近1月','近3月','近6月','近1年'],
        charTabKey:['M1','M3','M6','Y1'],
        colorArr:['recond', 'huShen', 'zhongZheng'],
        totalData:[], // 接口返回的全部数据
        incomeDataList:[], // 面板中收益数据
        chartTime:[], // 底部时间
        currentTab:3, // 记录点击tab时的index
        xAxis: [], // x坐标数据
        yData: [],// y坐标数据
        tipData:{
          annualizedVolatility: {
            title:'年化波动率',
            content: '年化波动率是度量风险的指标，数值越大，代表风险越高'
          },
          riskIncomeRate: {
            title:'风险收益率',
            content: '衡量风险收益率的指标采用夏普比率，该比率是度量推荐配置利用风险获取收益的能力指标，数值越大，代表能力越大'
          }

        }
      }
    },
    created(){
      this.queryPortfolioIncomeRate();
    },
    mounted(){
    },
    methods:{
      // 点击tab
      changeTab(index){
        this.incomeDataList = [];
        this.xAxis = [];
        this.yData = [];
        this.chartTime= [];
        this.currentTab = index;
        let tabKey = this.charTabKey[index];
        this.getTabContentData(tabKey);
      },
      getTabContentData(tabKey){
       let incomeDataList =  this.totalData.filter(item=>{
          if (item.period === tabKey) {
            return item
          }
        })
       if (incomeDataList.length > 3) {
         // 保证最多有3条线
         incomeDataList = incomeDataList.splice(0,3);
       }
        incomeDataList.forEach(item=>{
            let data = {};
            data = {
              portfolioType:item.portfolioType,
              totalIncomeRate: item.totalIncomeRate,
              annualizedReturn: item.annualizedReturn,
              annualizedVolatility: item.annualizedVolatility,
              riskIncomeRate:item.riskIncomeRate
            };
            // 收益率数据
            this.incomeDataList.push(data);
            // 曲线图x坐标
            if (this.xAxis.length === 0) {
              item.totalIncomeRates.forEach((xItem,index)=>{
                this.xAxis.push(xItem.tdDate);
                if(index === 0 || index === item.totalIncomeRates.length -1){
                  this.chartTime.push(xItem.tdDate);
                }
              })
            }
            // 曲线y坐标
           this.yData.push(this.formatCurveData(item.totalIncomeRates ? item.totalIncomeRates : []))
        })
      },
      // 曲线数据
      formatCurveData(oriCurveData){
        let arr = [];
        oriCurveData.forEach((item,index) => {
          arr.push(Number(item.totalIncomeRate));
        })
        return arr;
      },
      // 收益曲线
      queryPortfolioIncomeRate(){
        let param =  {"userPin":this.$route.query.userPin, series_id: this.$route.query.seriesId || '', customerId: this.$route.query.customerId,};
        this.request.post(this.api.assetAllocate.queryPortfolioIncomeRate, param, (data) => {
          this.totalData = data;
          this.getTabContentData('Y1')
        })
      },
      showTip(obj){
        this.$vux.alert.show({
          title:obj.title,
          buttonText:'我知道了',
          content:obj.content
        })
      }
    }
  }
</script>
<style scoped>
  .tabItem:last-child {
    border-right: 1px solid #dddddd;
  }
  .recond:before{
    background-color:#507FD6;
   }
  .huShen:before{
    background-color:#F298A0;
  }
  .zhongZheng:before{
    background-color:#E8C7A7;
  }
  .cRecond {
    color: #333333;
  }
  .mark {
    width: 100%;
    font-size: 12px;
    -webkit-text-size-adjust: none;
  }
  .mark div{
    font-size: 12px;
    width: 125%;
    -webkit-text-size-adjust: none;
    transform: scale(0.9);
    -webkit-transform: scale(0.8);     /* for Chrome || Safari */
    -moz-transform: scale(0.8);        /* for Firefox */
    -ms-transform: scale(0.8);         /* for IE */
    -o-transform: scale(0.8);
    transform-origin: top left;
  }


</style>
