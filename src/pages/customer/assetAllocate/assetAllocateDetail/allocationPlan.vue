<template>
  <div class="radius10 p12 whiteBg mt12" >
    <p class="PFSC-Medium C666 fz14 lh20">规划方案</p>
    <div class="flex jcsb">
      <div class="flex fz12 mt12 lh17">
        <span class="spot nowSpot mr25">当前</span>
        <span class="spot suggestSpot">建议</span>
      </div>
      <p class="fz12 textBlue" @click="checkAssetClassifyDetail">
        查看资产分类说明
      </p>
    </div>
    <div>
      <high-charts-column :radioData = "radioData"/>
    </div>
    <p class="fz12 C333 lh18 mt12" >根据您的个人背景资料，结合您的持仓比例，建议您按以上比例优化持仓组合</p>
  </div>

</template>

<script>
  import highChartsColumn from '@/pages/components/high-charts/high-charts-column'
  export default {
    name: "allocationPlan",
    data(){
      return {
        radioData:[],
      }
    },
    components: {
      highChartsColumn
    },
    created(){
      this.queryHoldingAndCfgAssetAllocation();
    },
    methods: {
      checkAssetClassifyDetail(){
        this.$router.push({ name : 'checkAssetClassifyDetail'});
      },
      // 配置方案比例
      queryHoldingAndCfgAssetAllocation(){
        let param =  {"userPin":this.$route.query.userPin,comment: this.$route.query.comment || '',customerId: this.$route.query.customerId,
          portfolioId: this.$route.query.portfolioId || ''};
        this.request.post(this.api.assetAllocate.queryHoldingAndCfgAssetAllocation, param, (data) => {
          let holdingName = [],upper = [],lower = [],holding = [];
          console.log('data',data);
          data.forEach( item => {
            holdingName.push(item.portfolioName);
            holding.push(item.holdingPercent-0);
            upper.push(item.cfgUpperPercent-0);
            lower.push(item.cfgLowerPercent-0);
          })
          this.radioData= [{holding}, {lower}, {upper},{holdingName}];
          console.log(' this.radioData',  this.radioData);
        })
      }
    },
  }
</script>

<style scoped>
  .nowSpot:before {
    background: #767D97;
  }
  .suggestSpot:before {
    background-color: #E7AD75;
  }

</style>
