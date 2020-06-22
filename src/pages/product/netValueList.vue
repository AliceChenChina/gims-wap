<template>
    <view-box ref="viewBox" class="netValueList">
        <Header title="历史净值" />
        <scroller lock-x height="-44" :bounce='false'  @on-scroll-bottom="loadMore">
            <div>
                <x-table :cell-bordered="false" style="background-color:#fff;" v-if='!(dataList.length<1)'>
                    <thead>
                    <tr>
                        <th>日期</th>
                        <th>单位净值</th>
                        <th>累计净值</th>
                    </tr>
                    </thead>
                    <tbody>
                        <tr v-for='item in dataList' :key="item.id" >
                            <td>{{utils.dateFtt("yyyy-MM-dd",item.netDate)}}</td>
                            <td>{{utils.keepFourDecimal(item.netValue)}}</td>
                            <td>{{utils.keepFourDecimal(item.netValueAccu)}}</td>
                        </tr>
                    </tbody>
                </x-table>
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
import { XTable } from 'vux'
import NoData from '@/pages/common/noData'
export default {
    name: 'netValueList',
    components:{
        Header,
        XTable,
        NoData
    },
    data(){
        return{
            productId:this.$route.query.productId,
            dataList:[],//产品净值数组
            pageNum:1, //当前页数
            pageSize:15,//每页显示条数
            loadMoreState:false,  //下拉加载更多
            noMoreData:false,   //没有更多数据
            loading:false,   //loading显示
        }
    },
    created(){
        this.fetchList();
    },
    methods:{
        loadMore(){
            if(this.loadMoreState&&!this.loading){
                this.pageNum=this.pageNum+1;
                this.fetchList();
            }
        },
        fetchList(){
            this.loadMoreState=false;
            let vm=this;
            this.loading=true;
            let parames={'productId':this.productId,pageSize:this.pageSize,pageNumber:this.pageNum}
            this.func.ajaxPost(this.api.product.queryNetValueList,parames,res=>{
                this.loading=false;
                let data=res.data.data.data.records;
                let oldData=vm.dataList;
                vm.dataList=oldData.concat(data);
                //没有数据
                if(res.data.data.data.isFirstPage && res.data.data.data.records.length==0){
                    $(".noData").show();
                    }else{
                    $(".noData").hide();
                }
                //上拉加载更多
                this.loadMoreState=res.data.data.data.hasNextPage;
                //没有更多数据
                if(!res.data.data.data.hasNextPage&& $('.noData').is(':hidden')){
                    this.noMoreData=true;
                }
            },true)
        }
    }
}
</script>

<style scoped lang='less'>
@import '../../assets/css/color.less';
.vux-table td:before, .vux-table th:before{
    border-bottom: 0px;
}
table{
  font-size: 14px;
  color: #666666;
}
.vux-table:after{
    height: 0px;
    border-top:0px;
}

thead th{
 color: @999;
}
table thead th{
    color: #999999;
    font-size: 12px;
    width: 33.3%;
  box-sizing: border-box;
  padding-left: 10px;
  text-align: left;
}


table tbody th{
    color: #666666;
    font-size: 14px;
    font-weight: 500;
}
.red{
    color: #F15A5B;
}
table thead tr{
    position: relative;
}
table tbody tr td{
  text-align: left;
  box-sizing: border-box;
  padding-left: 10px;
}
//表格第二、三列右对齐
table thead th:nth-child(2){
  text-align: right;
  padding-right: 50px;
}
table thead th:nth-child(3){
  text-align: right;
  padding-right: 50px;
}
table tbody tr td:nth-child(2){
  text-align: right;
  padding-right: 50px;
}
table tbody tr td:nth-child(3){
  text-align: right;
  padding-right: 50px;
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
</style>
