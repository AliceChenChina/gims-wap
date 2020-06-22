<template>
  <div>
    <view-box ref="viewBox" class="index">
      <Header :showLeft="false" :showRight="false" search :searchSubmit="searchSubmit" :searchChange="searchChange" :searchFocus="searchFocus" main />
      <tab custom-bar-width="28px" >
        <tab-item selected @on-item-click="changeTabItem">全部</tab-item>
        <tab-item @on-item-click="changeTabItem">阳光私募</tab-item>
        <tab-item @on-item-click="changeTabItem">类固收</tab-item>
        <tab-item @on-item-click="changeTabItem">私募股权</tab-item>
      </tab>
      <scroller
        lock-x
        :height="scrollHeight"
        ref="scrollerEvent"
        :bounce='false'
        @on-scroll-bottom="loadMore"
        >
        <div>
          <group class="noBorder">
            <ul class="product-list">
              <li v-for="(item,index) in productList" :key="index" @click="goTo('/product/productDetail?type='+ item.productType+'&productId='+item.productId)">
                <div class="listHeader">
                  <div>
                    <b>{{item.typeName}}</b>
                    <b>|</b>
                    <b>{{item.shortName}}</b>
                  </div>
                  <div class="colorRightBule recommentBtn" v-if="ifShowBtn" @click="recommentProduct(item)">
                    推荐
                  </div>
                </div>
                <div class='listContent'  >
                   <div class="list-left">
                      <b class="smallFont">{{item.price}}</b>
                      <p>{{item.prictType}}</p>
                   </div>
                   <div class="list-right">
                      <p class='state'>{{item.productStatus}}</p>
                      <p class='list-desc'>
                        <span>{{item.proTime}}</span>
                        <span v-if='item.proTime&&item.strategyType'>|</span>
                        <span>{{item.strategyType}}</span>
                      </p>
                   </div>
                </div>
                <div class='rightRow' v-if="!ifShowBtn" ></div>
              </li>
            </ul>
          </group>
          <p class="showMore" v-if="loadMoreState">上拉显示更多</p>
          <NoData></NoData>
          <div v-if='noMoreData' class="noMoreData">暂无更多数据</div>
        </div>
      </scroller>
      <Footer :active="2"/>
    </view-box>
  </div>
</template>
<script>
  import Header from '@/pages/common/header'
  import Footer from '@/pages/common/footer'
  import NoData from '@/pages/common/noData'
  import { debug } from 'util';
  export default {
    name: 'product',
    components: {
      Header,
      Footer,
      NoData
    },
    data () {
      return {
        defaultIndex: 0,
        productList:[],
        loadMoreState: false, //判断是否加载下拉更多
        noMoreData:false, //没有更多数据
        loading:false,//loading图案
        pageNum:1,
        type:null,
        productType:'',
        scrollHeight:'',
        index:0,
        ifShowBtn: false,
        appId: '', // APPID
        dialogId: '', // 会话ID
        skuId: '' , // 产品SKUID
        pinCode:'',
        companyId:''
      }
    },
    created(){
      this.fetchList({productName:'',productType:'',pageSize:7,pageNumber: 1});
      this.appId = this.getQuery('entranceId');
      this.dialogId = this.getQuery('dialogId');
      this.pinCode = this.getQuery('pinCode');
      this.companyId = this.getQuery('companyId');
      console.log('window.location', window.location);
      console.log('this.companyId', this.companyId );
      if (this.dialogId && this.pinCode) {
        this.ifShowBtn = true;
      } else {
        this.ifShowBtn = false;
      }
      let height=document.documentElement.clientHeight-138;
      this.scrollHeight=height+'px';
    },
    methods: {
      getQuery(key) {
        const reg = new RegExp(key + '=([^&]*)(&|$)', 'i');
        const r = window.location.href.substr(1).match(reg);
        if (r != null) {
          return decodeURIComponent(r[1])
        }
        return ''
      },
      recommentProduct(item) {
        if(!this.appId){
          this.$vux.toast.text('appId不能为空！')
          return false;
        }
        if(!this.dialogId){
          this.$vux.toast.text('dialogId不能为空！')
          return false;
        }
        if(!this.pinCode){
          this.$vux.toast.text('用户Pin不能为空！')
          return false;
        }
        if(!this.companyId){
          this.$vux.toast.text('companyId不能为空！')
          return false;
        }
        let shortName = encodeURIComponent(item.shortName);
        let query = {query:{shortName: shortName,appId:this.appId,dialogId:this.dialogId,pinCode:this.pinCode,skuId: item.groupProductId, companyId:this.companyId}}
        this.$router.push({name: 'recommondProductInfo', ...query})
      },
      //跳转路由
      goTo(path){
        if(this.ifShowBtn) {
          return false;
        }
        this.$router.push({path})
      },
      loadMore(){
        if(this.loadMoreState&&!this.loading){
          this.pageNum=this.pageNum+1;
          this.fetchList();
        }
      },
      //搜索回调事件
      searchSubmit(e){
      },
      //检索历史逻辑
      searchChange(e){
        this.keyWord = e
      },
      //检索历史逻辑-显示
      searchFocus(){
        this.$router.push({path:'/product/productSearch'})
      },
      //切换Tab-item
      changeTabItem(index){
        if(this.index === index){
          return false;
        }
        this.$refs.scrollerEvent.reset({top:0});
        this.productList=[];
        this.pageNum=1;
        this.loadMoreState=true;
        this.noMoreData=false;
        switch (index){
          case 0:
             //全部
             this.productType='';
             break;
          case 1:
             //二级市场
             this.productType='secondary_market';
             break;
          case 2:
              //固收
             this.productType='fixed_income';
             break;
          case 3:
             //股权
              this.productType='equity';
              break;
        }
        this.index = index;
        this.fetchList();
      },
      fetchList(){
          let text={productName:'',productType:this.productType,pageSize:7,pageNumber: this.pageNum};
          //loading状态的开启
          this.loading=true;
          this.func.ajaxPost(this.api.product.Query,text,res => {
            if(res.data.code==200){
              //loading状态的关闭
              this.loading=false;
              let productListTemp=res.data.data.records;
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
              //处理在什么时期
              productListTemp.forEach((product)=>{
                //显示在页面上的每个product
                let productShow={};
                //处理每个类型公共的参数，比如productStatus,shortName,percent,productType,productId
                productShow.productType=product.productType;
                productShow.shortName=product.productNameShort;
                productShow.productId=product.productId;
                productShow.groupProductId = product.groupProductId;
                productShow.id=product.id;
                switch(product.productStatus){
                  case '0':
                    productShow.productStatus='认购期';
                    break;
                  case '1':
                    productShow.productStatus='正常开放';
                    break;
                  case '3':
                    productShow.productStatus='暂停赎回';
                    break;
                  case '4':
                    productShow.productStatus='暂停申购';
                    break;
                  case '5':
                    productShow.productStatus='暂停交易';
                    break;
                  case '6':
                    productShow.productStatus='产品终止';
                    break;
                  case '9':
                    productShow.productStatus='发行失败';
                    break;
                }
                //处理每个类型单个的参数,比如price,prictType,typeName,proTime,strategyType,
                if(product.productType=='secondary_market'){
                  //二级市场
                  productShow.price=(product.netValue!=null)?this.utils.keepFourDecimal(product.netValue):'-';
                  productShow.prictType='单位净值';
                  productShow.typeName='阳光私募';
                  productShow.proTime='持续募集';
                  productShow.strategyType=this.utils.arg.getText("strategy_type",product.strategyType,true);
                }else if(product.productType=='fixed_income'){
                  //固收
                  productShow.price=product.incomeValue?product.incomeValue:'-';
                  productShow.prictType=product.incomeType?this.utils.arg.getText("income_type",product.incomeType,true):'-';
                  productShow.typeName='类固收';
                  productShow.proTime=(product.timeLimit!=null)?product.timeLimit+'个月':'';
                  productShow.strategyType=this.utils.arg.getText("invest_scope_type",product.investScopeType,true);
                }else if(product.productType=='equity'){
                  //股权
                  productShow.price=product.investmentTrends ? product.investmentTrends : '-';;
                  productShow.prictType='投资方向';
                  productShow.typeName='私募股权';
                  if((product.timeLimitExtend!=null)&&(product.timeLimitInvest!=null)&&(product.timeLimitQuit!=null)&&(product.timeLimitInvestExtend!=null)){
                    productShow.proTime=product.timeLimitInvest+'+'+product.timeLimitInvestExtend+'+'+product.timeLimitQuit+'+'+product.timeLimitExtend;
                  }else{
                    productShow.proTime='';
                  }
                  productShow.strategyType=this.utils.arg.getText("investment_industry",product.investmentIndustry,true);
                }

                this.productList.push(productShow);
              })
            }else{
              this.$message.error(res.data.msg);
            }
          })
        },
      },
      //判断是否是快速点击

  }
</script>
<style scoped>
.list-title{
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
.listHeader {
  position: relative;
}
  .recommentBtn {
    border: 1px solid #507FD6;
    -webkit-transform:translateY(-50%) scale(0.5);
    transform:translateY(-50%) scale(0.5);
    font-size: 24px;
    padding: 4px 20px;
    line-height: 34px;
    border-radius: 4px;
    position: absolute;
    top: 50%;
    right: -22px;
    z-index:300
  }
</style>
