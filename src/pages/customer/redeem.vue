<template>
  <view-box ref="viewBox" class="declaration noFooter">
    <Header title="赎回记录" />
    <tab custom-bar-width="28px">
      <tab-item selected @on-item-click="changeTabItem">全部</tab-item>
      <tab-item @on-item-click="changeTabItem">处理中</tab-item>
      <tab-item @on-item-click="changeTabItem">确认成功</tab-item>
      <tab-item @on-item-click="changeTabItem">退单</tab-item>
    </tab>
    <scroller lock-x height="-88" @on-scroll-bottom="loadMore"  ref='scrollerEvent'>
      <div>
        <group class="noBorder">
          <ul class="declaration-list">
            <li v-for="(item,index) in redeemList" :key="index" @click="goRedeemInfo(item)">
              <div class="title">
                <b v-text="item.productName"></b>

              </div>
              <div class="desc">
                <span class="name" v-text="item.customerName"></span>
                <div> <span class="price">{{item.redeemShare.toLocaleString()}}</span>
                  <span class="price">份</span></div>


                <!-- <x-button mini type="default" class="edit" link="/product/order">编辑</x-button> -->
              </div>
              <div class="desc"  style="margin-top: 6px">
                <span class="time" v-text="item.createdTime"></span>
                <span class="state-desc" v-text="item.stateDesc" :class="handelClass(item.stateDesc)"></span>
              </div>
            </li>
          </ul>
        </group>
      </div>
      <p class="showMore" v-if="loadMoreState">上拉显示更多</p>
      <div class='loadingWrapper' v-if="loading">
          <img src="@/assets/images/loading.gif"/>
      </div>
      <NoData></NoData>
      <div v-if='noMoreData' class="noMoreData">暂无更多数据</div>
    </scroller>
  </view-box>
</template>

<script>
  import Header from '@/pages/common/header'
  import Footer from '@/pages/common/footer'
  import NoData from '@/pages/common/noData'
  export default {
    name: 'customerRedeem',
    components: {
      Header,
      Footer,
      NoData
    },
    data () {
      return {
        loadMoreState: false, //判断是否加载下拉更多
        noMoreData:false, //没有更多数据
        loading:false,//loading图案
        redeemList:[],
        pageNum:1,
        customerId:this.$route.query.customerId,
        type:null,
        tapIndex:0
      }
    },
    created(){
      this.fetchList();
    },
    methods: {
      loadMore(){
        if(this.loadMoreState&&!this.loading){
          this.pageNum=this.pageNum+1;
          this.fetchList();
        }
      },
      fetchList(){
        let vm=this;
        this.loading=true;
        this.func.ajaxPost(this.api.trade.redeemTrade,{pageNumber:this.pageNum,pageSize:10,type:this.type,customerId:this.customerId},res=>{
          if(res.data.code=='200'){
            this.loading=false;
            let data=res.data.data.records;
            let oldData=vm.redeemList;
            vm.redeemList=oldData.concat(data);
            //没有数据
            if(res.data.data.isFirstPage && res.data.data.records.length==0){
              $(".noData").show();
            }else{
               $(".noData").hide();
            }
            //上拉加载更多
            vm.loadMoreState=res.data.data.hasNextPage;
            //没有更多数据
            if(!res.data.data.hasNextPage && $('.noData').is(':hidden')){
              vm.noMoreData=true;
            }
          }else{
            this.utils.msg(res.data.message)
          }
        },true)
      },
      changeTabItem(index){
        if(this.tapIndex === index){
          return false;
        }
        this.pageNum=1;
        this.redeemList=[];
        switch (index){
           case 0:
            //全部
            this.type=null;
            break
          case 1:
            //处理中
            this.type=11;
            break
          case 2:
            //确认成功,
            this.type=12;
            break
          case 3:
             //退单
            this.type=13;
            break
        }
        this.loadMoreState=false; //判断是否加载下拉更多
        this.noMoreData=false; //没有更多数据
        this.loading=false;//loading图案
        this.tapIndex = index;
        this.fetchList();
        this.$refs.scrollerEvent.reset({top:0});
      },
      handelClass(status){
        //根据报单状态给class的值
        let className='';
        switch(status){
          case '待审核':
            className='gray';
            break;
          case '退单':
            className='red';
            break;
        }
        return className
      },
      goRedeemInfo(item){
        this.$router.push({name:'redeem',params:{tradeId:item.tradeId,status:item.status}})
      }
    }
  }
</script>
<style scoped>
  #app .vux-tab   .vux-tab-item.vux-tab-selected{
    color:#EB5954;
  }
  #app  .declaration >>> .vux-tab .vux-tab-bar-inner{
    background: #EB5954;
  }
  #app .vux-tab .vux-tab-item{
    color: #666666;
    font-size: 14px;
  }
  #app .declaration .declaration-list li .desc .name{
    font-size: 16px;
    color: #4A4A4A;
    margin: 0;
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
  }
  #app .declaration .declaration-list li .desc .price{
   font-size: 19px;
    color: #F15A5B;
    font-weight: bold;
  }
  #app .declaration .declaration-list li .desc .time{
    font-size: 14px;
  }
  .state-desc{
    font-size: 14px;
  }
</style>
