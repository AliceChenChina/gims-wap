<template>
  <div class="radius10 p12 whiteBg mt12">
    <div class="flex jcsb">
      <p class="PFSC-Medium C666 fz14">规划建议</p>
      <p class="fz12 textBlue" @click="modifyInvestSuggest">{{!showButton ? '修改信息' : ''}}</p>
    </div>
    <div class="flex mt12">
      <p class="fz12 C666">根据您的个人情况和需求，为您提供以下配置建议</p>
    </div>
    <div>
      <ul>
        <li v-for="(item, index) in suggestProductList" :key = "index" class="mt15" v-if="item.children && item.children.length > 0">
          <div class="flex h20">
            <div class="icon"></div>
            <p class="mr15 fz16 C666">{{utils.setDefault(item.title)}}</p>
            <p class="fz12 C999">规划比例: {{utils.setDefault(item.radio)}}</p>
          </div>
          <ul>
            <li v-for="(productItem,productIndex) in item.children" :key="productIndex" class="mt12 bagPink pl12 pt12 pr12 pb15 radius4" >
              <p class="C333 fz16">{{productItem.productName}}</p>
              <div class="flex mt12">
                <div class="w180">
                  <p class="UDC-Bold fz16" :class="isNaN(Number(productItem.rate)) ? 'priceRed' : Number(productItem.rate) >= 0 ?  'priceRed' : 'Cgreen' ">{{productItem.rate === '0' || productItem.rate ? isNaN(Number(productItem.rate)) ? productItem.rate : productItem.rate + '%' : '--'}}</p>
                  <p class="mt5 C999 fz12">{{utils.setDefault(productItem.rateName)}}</p>
                </div>
                <div class="w200">
                  <p class="PFSC-Medium-Bold fz14 C333">{{utils.setDefault(productItem.productFeature)}}</p>
                  <p class="mt5 C999 fz12">{{utils.setDefault(productItem.productFeatureName)}}</p>
                </div>
              </div>
              <div class="mt12 lh18 C999" v-if="productItem.recommendReason">
                推荐理由：{{productItem.recommendReason}}
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  export default {
    name: "suggestList",
    data(){
      return {
        suggestProductList:[],
        showButton: this.$route.query.showButton
      }
    },
    components:{
    },
    created(){
      this.queryStrategyOrder();
    },
    methods: {
      queryStrategyOrder(){
        let param = {
          opr_type:'sales',
          pin: this.$route.query.userPin,
          customerId: this.$route.query.customerId,
          searchItemVo: {
            rep_version:this.$route.query.reportVersion
          }
        };
        this.request.post(this.api.assetAllocate.queryStrategyOrder, param, (data) => {
          for (let attr in data['portfolio_cfg']) {
            let obj = {};
            obj.title = data.portfolio_cfg[attr].mainTypeName;
            let lowerRate = data.portfolio_cfg[attr].lowerRate;
            let upperRate = data.portfolio_cfg[attr].upperRate;
            if (lowerRate === upperRate) {
              obj.radio = `${lowerRate}%`
            }else{
              obj.radio = `${lowerRate}%~${upperRate}%`
            }
            obj.children = data[attr];
            this.suggestProductList.push(obj);
          }
          console.log('this.suggestProductList', this.suggestProductList);
        })
      },
      modifyInvestSuggest(){
        if (this.showButton) return false;
        this.$router.push({ path: '/customer/assetAllocate/modifyInvestSuggest', query: {userPin: this.$route.query.userPin,
            reportVersion:this.$route.query.reportVersion,
            id: this.$route.query.id,
            customerId:this.$route.query.customerId,
            customerfrom:this.$route.query.customerfrom,
            from: 'detail',ifRealName: this.$route.query.ifRealName,
            seriesId: this.$route.query.seriesId || '',
            comment: this.$route.query.comment || '',
            portfolioId: this.$route.query.portfolioId || '',
            reportInfo: this.$route.query.reportInfo || '',
            userId: this.$route.query.userId,
            marketId: this.$route.query.marketId || '', ifRequestComment: this.$route.query.ifRequestComment || ''}});
      }
    },
  }
</script>

<style scoped>
  .bagPink {
    background-color: rgba(237, 239, 247, 0.6);
  }
  .icon {
    width: 4px;
    height: 20px;
    border-radius: 4px;
    background: #CDA76E;
    margin-right: 8px;
  }

</style>
