<template>
  <view-box ref="viewBox" class="productDetails">
    <Header :mainTitle="productDetail.productNameShort" :subTitle="subTitle" />
    <scroller lock-x height="-44" :bounce='false'>
      <div>               
        <group class="noBorder"> 
          <cell title="详细信息" class="title"></cell>
          <cell title="收益分配方式" primary="content">{{productDetail.incomeDistributionWay}}</cell>
          <cell title="收益分配说明类别" primary="content">{{productDetail.incomeDistributionWayDesc}}</cell>
          <template v-if="type=='secondary_market'||type=='fixed_income'||type=='equity'">
            <cell title="分红方式" primary="content">{{productDetail.dividendMethod}}</cell>
          </template>
          <cell title="币种类别" primary="content">{{productDetail.moneyType}}</cell>
        </group>
        <group class="noBorder">
          <cell title="相关机构信息" class="title"></cell> 
          <template v-if="type=='fixed_income'">
            <cell title="担保机构" primary="content">{{productDetail.guaranteeCom}}</cell>
          </template>
          <cell title="托管机构" primary="content">{{productDetail.storageBank}}</cell> 
          <template v-if="type=='secondary_market'">
            <cell title="发行机构" primary="content">{{productDetail.issueChannel}}</cell> 
          </template>
          <template v-if="type=='secondary_market'||type=='fixed_income'||type=='equity'">
            <cell title="注册登记机构" primary="content">{{productDetail.regOrg}}</cell> 
          </template>
        </group>
      </div>
    </scroller>
  </view-box>
</template>

<script>
import Header from '@/pages/common/header'
import Footer from '@/pages/common/footer'
export default {
  name: 'productDetails',
  components: {
    Header,
    Footer
  },
  data () {
    return {
      type: this.$route.query.type,
      subTitle: '二级市场',
      productId:this.$route.query.productId,
      productDetail:{},
    }
  },
  created(){
    let apiUrl=undefined;
    switch(this.type){
      case 'secondary_market':
          apiUrl='SecondaryMarketDetail';
          break;
      case 'fixed_income':
          apiUrl='FixedIncomeDetail';
          break;
      case 'equity':
          apiUrl='EquityDetail';
          break;
    }
    this.func.ajaxPost(this.api.product[apiUrl],{'productId':this.productId},res=>{
      if(res.data.code==200){
        let temp=res.data.data;
        let productDetail={};
        //产品名称简写
        productDetail.productNameShort=temp.productNameShort;
        //收益分配方式
        productDetail.incomeDistributionWay=this.utils.arg.getText("income_distribution_way",temp.incomeDistributionWay);
        //收益分配说明类别
        productDetail.incomeDistributionWayDesc=this.utils.arg.getText("feeratio_memo_type",temp.incomeDistributionWayDesc);
        //分红方式
        productDetail.dividendMethod=this.utils.arg.getText("dividend_method",temp.dividendMethod);
        //币种类别
        productDetail.moneyType=this.utils.arg.getText("money_type",temp.moneyType);
        //托管机构
        productDetail.storageBank=temp.storageBank?temp.storageBank:'-';
        //发行机构
        productDetail.issueChannel=temp.issueChannel?temp.issueChannel:'-';
        //注册登记机构
        productDetail.regOrg=temp.regOrg?temp.regOrg:'-';
        //担保机构名称
        if(temp.productProjectDtoList){
          let guaranteeCom='';
          if(temp.productProjectDtoList.length!=0){
            temp.productProjectDtoList.forEach(element => {
              if(element.type=='dbf'){
                //担保方
                if(guaranteeCom){
                  guaranteeCom+=','+element.companyName;
                }else{
                  guaranteeCom+=element.companyName;
                }
              }
            });
          }
          if(!guaranteeCom){
            guaranteeCom='-';
          }
          productDetail.guaranteeCom=guaranteeCom;
        }
        this.productDetail=productDetail;
      }
    })
  },
  mounted(){
    this.getSubTitle()
  },
  methods: {
    //获取副标题
    getSubTitle(){
      switch(this.type){
        case 'secondary_market':
            this.subTitle ='二级市场';
            break;
        case 'fixed_income':
            this.subTitle='固收';
            break;
        case 'equity':
            this.subTitle='股权';
            break;
      }
    }
  }
}
</script>

