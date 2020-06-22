<template>
  <view-box ref="viewBox" class="investment">
    <Header title="在投资产" />
    <scroller lock-x height="-96" @on-scroll-bottom="loadMore" :bounce='false'>
      <div>
        <ul class="investment-list">
          <li v-for="(item,index) in productList" :key="index">
            <div class="title">
              <b>{{item.productName}}</b>
              <span>{{item.createTime}}</span>
            </div>
            <p class="price">{{utils.formatNum(item.confirmShare)}}</p>
            <p class="price-type">{{item.type}}份额</p>
            <p class="desc">
              <span>{{item.openStart}} - {{item.openEnd}}</span>
            </p>
          </li>
        </ul> 
        <!-- <p class="showMore">上拉显示更多</p>        -->
      </div>
      <NoData></NoData>
    </scroller>  
    <div class="footer-btn">        
      <x-button type="warn" class="red" link="/customer/redeemAdd">新建赎回</x-button>
    </div>
  </view-box>
</template>

<script>
  import Header from '@/pages/common/header'
  import Footer from '@/pages/common/footer'
  import NoData from '@/pages/common/noData'
  export default {
    name: 'customerInvestment',
    components: {
      Header,
      Footer,
      NoData
    },
    data () {
      return {
        defaultIndex: 0,
        productList: [],
        loadMoreState: false,
        customerId:this.$route.query.customerId,
      }
    },
    created(){
      //获取在投资产
      this.func.ajaxPost(this.api.customer.investmentProductList,{"userId":this.customerId},res=>{
        if (res.data.code === 200) {
          let productList=res.data.data.records;
          for(var i=0;i<productList.length;i++){
            let elment=productList[i];
            if(elment.showBooking){
              elment.type='申购'
            }
            if(elment.showBuy){
              elment.type='认购'
            }
            if(elment.showBack){
              elment.type='赎回'
            }
          }
          this.productList=productList;
          if(this.productList.length==0){
            $(".noData").show();
          }else{
             $(".footer-btn").show();
          }
        }
      })
    },
    methods: {
      loadMore(){
        // if(!this.loadMoreState){
        //   this.productList.push(this.productList[0])
        //   this.productList.push(this.productList[1])
        //   console.log(111)
        // }
        // this.loadMoreState = true
      }
    }
  }
</script>
<style scoped>
.footer-btn{
  display: none;
}
</style>
