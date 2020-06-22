<template>
  <view-box ref="viewBox" class="message">
    <Header title="拜访记录" rightText="新建" :rightAction="add" />
    <scroller ref="scroller" lock-x height="-44"  @on-scroll-bottom="loadMore" :bounce='false'>
      <div>
      <group class="noBorder">
        <ul class="message-list">
          <li v-for="item in dataList" :key="item.id">
            <router-link :to="{path:'/customer/recordDetail',query: {visitId:item.id,name:name,type:'edit',customerId:customerId}}" class="active">
              <div class="imgWrapper">
                <img src="@/assets/images/visit_record.png" class="user" />
              </div>
              <div class="message-content">
                <p class="time">{{item.createdTime?item.createdTime:'-'}}</p>
                <p class="title">{{item.title?item.title:'-'}}</p>
                <p class="desc">{{item.remark?item.remark:'-'}}</p>
              </div>
            </router-link>
          </li>
        </ul>
      </group>
      <p class="showMore" v-if="loadMoreState">上拉显示更多</p>
      <div class='loadingWrapper' v-if="loading">
          <img src="@/assets/images/loading.gif"/>
      </div>
      <div v-if='noMoreData' class="noMoreData">暂无更多数据</div>
      <NoData ref='noData'></NoData>
      </div>
    </scroller>
  </view-box>
</template>

<script>
  import Header from '@/pages/common/header'
  import Footer from '@/pages/common/footer'
  import NoData from '@/pages/common/noData'
  export default {
    name: 'recordList',
    components: {
      Header,
      Footer,
      NoData
    },
    data () {
      return {
        customerId: this.$route.query.customerId,
        name:this.$route.query.name,
        dataList: [],
        pageNum:1,
        loadMoreState:false,
        noMoreData:false,
        loading:false,
      }
    },
    created(){
      this.fetchList();
    },
    mounted(){},
    methods: {
      add(){
        this.$store.commit("changeRecordDetail",{});
        this.$router.push({path: '/customer/recordDetail?customerId='+this.customerId+"&name="+this.name+"&type=add"})
      },
      fetchList(text){
        this.loadMoreState=false;
        let vm=this;
        this.loading=true;
        let customerId=this.$route.query.customerId;
        let parames={'customerId':customerId,pageSize:7,pageNumber:this.pageNum}
        this.func.ajaxPost(this.api.customer.GetCustomerVisitList,parames,res=>{
          if(res.data.code==200){
            this.loading=false;
            let data=res.data.data.records;
            let oldData=vm.dataList;
            vm.dataList=oldData.concat(data);
            //没有数据
            if(res.data.data.isFirstPage && res.data.data.records.length==0){
              $(".noData").show();
            }else{
               $(".noData").hide();
            }
            //上拉加载更多
            this.loadMoreState=res.data.data.hasNextPage;
            //没有更多数据
            if(!res.data.data.hasNextPage&& $('.noData').is(':hidden')){
              this.noMoreData=true;
            }
          }
        },true)
      },
      loadMore(){
        if(this.loadMoreState&&!this.loading){
          this.pageNum=this.pageNum+1;
          this.fetchList();
        }
      }
    },
  }
</script>
