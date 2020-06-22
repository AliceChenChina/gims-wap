<template>
  <view-box ref="viewBox" class="achievement noFooter">
    <Header title="业绩详情" />
    <tab custom-bar-width="55px">
      <tab-item :selected="type == 1 ? true : false" @on-item-click="goTo(1)">新增客户</tab-item>
      <tab-item :selected="type == 2 ? true : false" @on-item-click="goTo(2)">新增资产</tab-item>
      <tab-item :selected="type == 3 ? true : false" @on-item-click="goTo(3)">赎回客户</tab-item>
    </tab>
    <scroller lock-x height="-88" :bounce='false'  ref="scrollerEvent">
      <div>
        <!-- 新增客户 start -->
        <group class="noBorder" v-if="type == 1">
            <div v-for="(item,index) in customerData" :key='index'>
                <cell :title="item.ym" class="title"></cell>
                <cell class="achievement-list" v-for="(item1,index1) in item.data" :key='index1'>
                  <p slot="title" class="title">
                    <b>{{item1.trueName}}</b>
                    <span>{{item1.sex}}</span>
                    <span>{{item1.age}}</span>
                    <span>{{item1.address}}</span>
                  </p>
                  <span class="time">{{item1.createTime}}</span>
                </cell>
            </div>
        </group>
        <!-- 新增客户 end -->
        <!-- 新增资产 start -->
        <group class="noBorder" v-if="type == 2">
          <div v-for="(item,index) in assetsData" :key='index'>
            <cell :title="item.ym" class="title"></cell>
            <cell v-for="(item1,index1) in item.data" :key='index1' class="achievement-list">
                <p slot="title" class="title">
                  <b>{{item1.trueName}}</b>
                  <span class="price">{{item1.tradeBalance}}</span>
                </p>
                <span class="time">{{item1.createTime}}</span>
            </cell>
          </div>
        </group>
        <!-- 新增资产 end -->
        <!-- 赎回客户 start -->
        <group class="noBorder" v-if="type == 3">
            <div v-for="(item,index) in redeemData" :key='index'>
              <cell :title="item.ym" class="title"></cell>
              <cell class="achievement-list" v-for="(item1,index1) in item.data" :key='index1'>
                <p slot="title" class="title">
                  <b>{{item1.trueName}}</b>
                  <span>{{item1.sex}}</span>
                  <span>{{item1.age}}</span>
                  <span>{{item1.address}}</span>
                </p>
                <span class="time">{{item1.createTime}}</span>
              </cell>
            </div>
        </group>
        <!-- 赎回客户 end -->
        <NoData></NoData>
      </div>
    </scroller>
  </view-box>
</template>

<script>
  import Header from '@/pages/common/header'
  import Footer from '@/pages/common/footer'
  import NoData from '@/pages/common/noData'
  export default {
    name: 'achievement',
    components: {
      Header,
      Footer,
      NoData
    },
    created(){
      //本月新增客户
      let type=this.type
      this.fetchList(type);
    },
    data () {
      return {
        type: this.$route.query.type,
        customerData:[],//新增客户
        redeemData:[],//赎回客户
        assetsData: [],//新增资产
      }
    },
    methods: {
      goTo(type){
        this.type = type;
        this.$refs.scrollerEvent.reset({top:0});
        this.fetchList(type);
      },
      fetchList(type){
       $(".noData").hide();
       let typeUrl=undefined;
       if(type==1){
         typeUrl='newCustomerGroupByMonthly';
       }else if(type==3){
         typeUrl='redeemCustomerGroupByMonthly';
       }
       if(type==2){
         typeUrl='buyCustomerGroupByMonthly';
       }
       this.func.ajaxPost(this.api.home[typeUrl],{},res=>{
         if(res.data.code===200){
            if(res.data.data.length==0){
              $(".noData").show();
            }
           //新增客户
           if(type==1){
             let customerData=res.data.data;
             customerData.forEach(element => {
              element.ym=element.ym.replace('-','年')+'月';
              element.trueName=element.trueName;
              element.sex=this.utils.arg.getText("sex", element.sex,true)
              element.age=element.age?element.age+'岁':'';
              element.address=element.province+element.city;
              element.createTime=this.utils.dateFtt("yyyy-MM-dd",element.createdTime);
            });
            this.customerData=this.utils.formatKeyPacketData(customerData,"ym");
           }
          //新增资产
          if(type==2){
            let assetsData=res.data.data;
            assetsData.forEach(element=>{
              element.ym=element.ym.replace('-','年')+'月';
              element.createTime=this.utils.dateFtt("yyyy-MM-dd",element.createdTime);
            })
            this.assetsData=this.utils.formatKeyPacketData(assetsData,"ym");
          }
           //赎回客户
          if(type==3){
            let redeemData=res.data.data;
            redeemData.forEach(element => {
              element.ym=element.ym.replace('-','年')+'月';
              element.sex=this.utils.arg.getText("sex", element.sex,true);
              element.age=element.age?element.age+'岁':'-';
              element.address=element.province+element.city;
              element.createTime=this.utils.dateFtt("yyyy-MM-dd",element.createdTime);
            })
            this.redeemData=this.utils.formatKeyPacketData(redeemData,"ym");
         }
        }
       })
      },
      findArrayIndex(array,time){
        if(array.length==0){
          return null;
        }else{
          for(var i=0;i<array.length;i++){
             if(array[i].time==time){
              return i;
          }else{
              if(i==array.length-1){
                return null;
              }
            }
          }
      }
      }
    }
  }
</script>
