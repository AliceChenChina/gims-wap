<template>
  <view-box ref="viewBox" class="declaration noFooter">
    <Header :title="title"/>
    <tab custom-bar-width="28px">
      <tab-item selected @on-item-click="changeTabItem">全部</tab-item>
      <tab-item @on-item-click="changeTabItem">处理中</tab-item>
      <tab-item @on-item-click="changeTabItem">确认成功</tab-item>
      <tab-item @on-item-click="changeTabItem">退单</tab-item>
    </tab>
    <scroller lock-x height="-90" @on-scroll-bottom="loadMore" ref='scrollerEvent'>
      <div>
        <group class="noBorder">
          <ul class="declaration-list">
            <li v-for="(item,index) in declarationList" :key="index">
              <div class="title">
                <b v-text="item.productName"></b>
                <span class="price" v-text="item.bookingBalanceDesc"></span>
                <span class="price">万元</span>
              </div>
              <div class="desc">
                <img src="@/assets/images/user02.png" class="user">
                <span class="name" v-text="item.customerName"></span>
                <span class="time" v-text="item.bookingTime"></span>
                <span v-text="item.stateDesc" :class="handelClass(item.stateDesc)"></span>
                <!-- <x-button mini type="default" class="edit" link="/product/order">编辑</x-button> -->
              </div>
            </li>
          </ul>
        </group>
        <p class="showMore" v-if="loadMoreState">上拉显示更多</p>
        <div class='loadingWrapper' v-if="loading">
          <img src="@/assets/images/loading.gif"/>
        </div>
        <NoData></NoData>
        <div v-if='noMoreData' class="noMoreData">暂无更多数据</div>
      </div>
    </scroller>
  </view-box>
</template>

<script>
  import Header from '@/pages/common/header'
  import Footer from '@/pages/common/footer'
  import NoData from '@/pages/common/noData'
  //为noFastClick函数定一个接收上一个点击的时间的变量
  export default {
    name: 'declarationForm',
    components: {
      Header,
      Footer,
      NoData
    },
    data () {
      return {
        declarationList:[], //数据
        pageNum:1,
        type:null,
        loadMoreState: false, //判断是否加载下拉更多
        noMoreData:false, //没有更多数据
        loading:false,//loading图案
        customerId:this.$route.query.customerId,
        title:this.$route.query.customerId?'客户报单记录':'报单记录',
        index:0,
      }
    },
    created(){
      this.fetchList();
    },
    mounted(){
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
        this.func.ajaxPost(this.api.trade.queryBookingTradeList,{pageNumber:this.pageNum,pageSize:10,type:this.type,customerId:this.customerId},res=>{
          if(res.data.code=='200'){
            this.loading=false;
            let data=res.data.data.records;
            let oldData=vm.declarationList;
            vm.declarationList=oldData.concat(data);
            //没有数据
            if(res.data.data.isFirstPage && res.data.data.records.length==0){
              $(".noData").show();
            }else{
               $(".noData").hide();
            }
            //上拉加载更多
            this.loadMoreState=res.data.data.hasNextPage;
            //没有更多数据
            if(!res.data.data.hasNextPage && $('.noData').is(':hidden')){
              this.noMoreData=true;
            }
          }
        },true)
      },
      changeTabItem(index){
         if(this.index === index){
           return false;
         }
          switch (index) {
            case 0:
              //全部
              this.type = null;
              break
            case 1:
              //处理中
              this.type = 11;
              break
            case 2:
              //确认成功,
              this.type = 12;
              break
            case 3:
              //退单
              this.type = 13;
              break
          }
        this.pageNum = 1;
        this.declarationList = [];
          this.loadMoreState = false; //判断是否加载下拉更多
          this.noMoreData = false; //没有更多数据
          this.loading = false;//loading图案
          this.index = index;
          this.fetchList();
          this.$refs.scrollerEvent.reset({top: 0});

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
    }
  }
</script>
