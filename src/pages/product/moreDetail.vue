<template>
    <view-box ref="viewBox" class="moreDetail">
        <Header title="产品档案" />
        <div>
            <tab custom-bar-width="20px">
                <tab-item :selected="tabIndex == 0 ? true : false" @on-item-click="tabClick(0)">概况</tab-item>
                <template v-if="type!='fixed_income'">
                    <tab-item :selected="tabIndex == 1 ? true : false" @on-item-click="tabClick(1)">分红</tab-item>
                </template>
                <tab-item :selected="tabIndex == 2 ? true : false" @on-item-click="tabClick(2)">合同协议</tab-item>
                <tab-item :selected="tabIndex == 3 ? true : false" @on-item-click="tabClick(3)">公告</tab-item>
            </tab>
            <!-- 概况 -->
            <template v-if="tabIndex == 0">
                <group label-width="7em">
                    <!-- 二级市场 -->
                    <template v-if="type=='secondary_market'">
                        <cell title="产品全称"  primary="content">{{dataList.productName?dataList.productName:'--'}}</cell>
                        <cell title="备案号"  primary="content">{{dataList.approvalFileno?dataList.approvalFileno:'--'}}</cell>
                        <cell title="成立日期"  primary="content">{{dataList.setupDate?utils.dateFtt("yyyy-MM-dd",dataList.setupDate):'--'}}</cell>
                        <cell title="基金公司"  primary="content">{{dataList.mandatorName?dataList.mandatorName:'--'}}</cell>
                        <cell title="基金经理"  primary="content">{{dataList.investManager?dataList.investManager:'--'}}</cell>
                        <cell title="托管机构"  primary="content">{{dataList.storageBank?dataList.storageBank:'--'}}</cell>
                    </template>
                    <!-- 股权,固收 -->
                    <template v-else>
                        <cell title="产品全称"  primary="content">{{dataList.productName?dataList.productName:'--'}}</cell>
                        <cell title="发行规模"  primary="content">{{dataList.maxBalanceDesc?dataList.maxBalanceDesc:'--'}}</cell>
                        <cell title="成立日期"  primary="content">{{dataList.setupDate?utils.dateFtt("yyyy-MM-dd",dataList.setupDate):'--'}}</cell>
                        <cell title="投资方向"  primary="content">{{dataList.investmentTrends?dataList.investmentTrends:'--'}}</cell>
                        <cell title="管理人"  primary="content">{{dataList.mandatorName?dataList.mandatorName:'--'}}</cell>
                        <cell title="托管机构"  primary="content">{{dataList.storageBank?dataList.storageBank:'--'}}</cell>
                    </template>
                </group>
            </template>
            <!-- 分红 -->
            <template v-else-if="tabIndex == 1">
                <scroller lock-x  height="-138" :bounce='false'  @on-scroll-bottom="loadMore">
                    <div>
                        <x-table :cell-bordered="false" style="background-color:#fff;" v-if='!(dividendList.length<1)' >
                            <thead>
                            <tr>
                                <th>权益登记日</th>
                                <th>分红方式</th>
                                <th>每份分红</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for='item in dividendList' :key="item.id">
                                <td>{{utils.dateFtt("yyyy-MM-dd",item.rightsRegistDate)}}</td>
                                <td>{{item.dividendType}}</td>
                                <td class="red">{{utils.keepFourDecimal(item.eachDividend)}}{{item.dividendType=='现金分红'?'元':'份'}}</td>
                            </tr>
                            </tbody>
                        </x-table>
                        <p class="showMore" v-if="loadMoreState">上拉显示更多</p>
                        <div class='loadingWrapper' v-if="loading">
                            <img src="@/assets/images/loading.gif"/>
                        </div>
                        <div v-if='noMoreData' class="noMoreData">暂无更多数据</div>
                    </div>
                </scroller>
            </template>
            <!-- 合同 -->
            <template v-else-if="tabIndex == 2">
                <group v-if='dataList.productContract.length>0' class="file">
                    <a :href="'/djjf-web/file/download?directory=' + item.filePath + '&downloadFile=' + item.fileId + item.fileNameExt + '&fileName=' + item.fileName"  v-for="(item,index) in dataList.productContract" :key="index">
                        <cell :title="item.fileName" is-link>
                        </cell>
                    </a>
                </group>
            </template>
            <!-- 公告 -->
            <template v-else-if="tabIndex == 3">
                <group v-if='dataList.productPublic.length>0' class="file">
                    <a :href="'/djjf-web/file/download?directory=' + item1.filePath + '&downloadFile=' + item1.fileId + item1.fileNameExt + '&fileName=' + item1.fileName" v-for="(item1,index1) in dataList.productPublic" :key="index1">
                        <cell :title="item1.fileName" is-link>
                        </cell>
                    </a>
                </group>
            </template>
            <NoData ref='noData'></NoData>
        </div>
    </view-box>
</template>

<script>
import Header from '@/pages/common/header'
import { XTable } from 'vux'
import NoData from '@/pages/common/noData'
export default {
    name:'moreDetail',
    components:{
        Header,
        XTable,
        NoData
    },
    data(){
       return{
          productId:this.$route.query.productId,  //产品id
          type:this.$route.query.type,  //产品分类
          tabIndex:0,  //第一个tab
          dataList:{}, //概况,合同,公告数据
          dividendList:[],//产品分红列表
          pageNum:1, //当前页数
          pageSize:15,//每页显示条数
          loadMoreState:false,  //下拉加载更多
          noMoreData:false,   //没有更多数据
          loading:false,   //loading显示
       }
    },
    created(){
        this.queryProductDetail();
    },
    methods:{
        //点击事件
        tabClick(number){
             $(".noData").hide();
            this.tabIndex=number;
            if(number==1){
                this.dividendList=[];
                this.pageNum=1;//当前页数
                this.pageSize=15;
                this.loadMoreState=false;
                this.noMoreData=false;
                this.loading=false;
                this.queryProductDividend();
            }else if(number==2){
                if(this.dataList.productContract.length==0){
                    $(".noData").show();
                }
            }else if(number==3){
                if(this.dataList.productPublic.length==0){
                    $(".noData").show();
                }
            }
        },
        //获取产品概况
        queryProductDetail(){
            this.func.ajaxPost(this.api.product.queryProductSurvey,{productId:this.productId},res=>{
                this.dataList=res.data.data.data;
            })
        },
        loadMore(){
            if(this.loadMoreState&&!this.loading){
                this.pageNum=this.pageNum+1;
                this.queryProductDividend();
            }
        },
        //获取分红方式
        queryProductDividend(){
            this.loadMoreState=false;
            let vm=this;
            this.loading=true;
            let parames={'productId':this.productId,pageSize:this.pageSize,pageNumber:this.pageNum}
             this.func.ajaxPost(this.api.product.queryProductDividend,parames,res=>{
                this.loading=false;
                let data=res.data.data.records;
                let oldData=vm.dividendList;
                vm.dividendList=oldData.concat(data);
                //没有数据
                if(res.data.data.isFirstPage && res.data.data.records.length==0){
                    $(".xs-container").parent().height('');
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
            },true)
        }
    }
}
</script>

<style scoped>
.vux-table td:before, .vux-table th:before{
    border-bottom: 0px;
}

.moreDetail>>>.weui-cell__ft{
  color: #333;
  font-weight: 500;
}

.moreDetail>>>.vux-label{
  color: #666666;
  font-weight: 700;
}

.vux-tab-item{
    color: #aaaaaa;
}

.weui-cell:before{
  height: 0px;
  border-top: 0px;
}

.file>>>.vux-label{
    color: #333333;
    font-size: 16px;
}

.moreDetail>>>.weui-cell_access .weui-cell__ft:after{
    height: 10px;
    width: 10px;
}

table{
    margin-top:10px;
}

.vux-table:after{
    height: 0px;
    border-top:0px;
}

table thead th{
    color: #999999;
    font-size: 12px;
}

table tbody th{
    color: #333333;
    font-size: 14px;
    font-weight: 500;
}

.red{
    color: #F15A5B;
}
table thead tr{
    position: relative;
}

table thead tr:after{
    content: " ";
    position: absolute;
    left: 0;
    top: 40px;
    right: 0;
    height: 1px;
    border-top: 1px solid #eeeeee;
    transform: scaleY(0.5);
    left: 15px;
    right: 15px;
}

.moreDetail>>>.vux-tab .vux-tab-item{
   background-size: 100% 0px;
}
</style>
