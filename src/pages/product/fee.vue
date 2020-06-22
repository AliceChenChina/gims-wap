<template>
    <view-box ref="viewBox" class="fee">
        <Header title="费用信息" />
        <div v-if="dataList.length>0">
            <group v-for="(item,index) in dataList" :key="index" :class="index==0?'noBorder':''">
                <!-- 费用分组 -->
                <cell :title="item.feeGroupName" class="groupCell"></cell>
                <div class="feeLine"></div>
                <div v-for="(item1,index1) in item.datas" :key="index1" :class="item.feeGroupName=='运作费率'?'feerateOperate':''">
                    <cell :title="item1.feeTypeName">
                        <template v-if="item.feeGroupName!='运作费率'">
                            <template v-if="item1.datas.length==1">
                                <span :class="item1.datas [0].feeDiscountRateName?'normalFee':''">{{item1.datas [0].feeRateName}}</span>
                                <span class='discountFee'>{{item1.datas [0].feeDiscountRateName}}</span>
                            </template>
                            <template v-else>
                                <div slot="inline-desc">
                                   <div class="descDiv">
                                        <div class="clearFloat">
                                            <div class="floatLeft">{{item1.feeAreaTypeName}}</div>
                                            <div class="floatRight">费率</div>
                                        </div>
                                        <div class="descLine"></div>
                                        <div class="clearFloat" v-for='(item2,index2) in item1.datas ' :key='index2'>
                                            <div class="floatLeft">{{item2.minBalanceName}}≤{{item2.feeAreaTypeCode}}＜{{item2.maxBalanceName}}</div>
                                            <div class="floatRight">
                                                <span :class="item2.feeDiscountRateName?'normalFee':''">{{item2.feeRateName}}</span>
                                                <span class='discountFee'>{{item2.feeDiscountRateName}}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </template>
                        <template v-else>
                            <span class="remark">{{item1.datas [0].remark}}</span>
                        </template>
                    </cell>
                </div>
            </group>
        </div>
        <NoData ref='noData'></NoData>
    </view-box>
</template>

<script>
import Header from '@/pages/common/header'
import NoData from '@/pages/common/noData'
export default {
    name:'fee',
    components:{
        Header,
        NoData
    },
    data(){
        return{
            productId:this.$route.query.productId,
            dataList:[],
        }
    },
    created(){
        this.fetchList();
    },
    methods:{
      fetchList(){
        this.func.ajaxPost(this.api.product.queryFeeRateList,{productId:this.productId},res => {
            this.dataList=res.data.data;
            if(this.dataList==null||this.dataList.length==0){
                $(".noData").show();
            }
        })
      }
    }
}
</script>

<style lang="less" scoped>
@import '../../assets/css/color.less';
.discountFee{
  color: @red;
}

.normalFee{
  text-decoration: line-through;
  margin-right: 5px;
  color: #999;
}

.floatLeft{
    float: left;
}

.floatRight{
    float: right;
}

.clearFloat{
    overflow: hidden;
    height: 38px;
    line-height: 38px;
    padding-right: 10px;
    padding-left: 10px;
    color: #666;
}
.feeLine{
    position: absolute;
    height: 1px;
    border-top: 1px solid #E6E6E6;
    left: 15px;
    right: 15px;
    transform: scaleY(0.5);
}

.descLine{
    position: relative;
    height: 1px;
    border-top: 1px solid #E6E6E6;
    transform: scaleY(0.5);
}

.descDiv{
    background: @fafa;
    margin-top: 10px;
}

.remark{
  font-size: 14px;
  font-weight: 500;
  color: #333;
}
</style>

<style scoped>
.fee>>>.vux-label{
    color: #666;
    font-size: 14px;
}

.groupCell>>>.vux-label{
    color: #333333;
    font-size: 16px;
}
  .feerateOperate>>>.vux-cell-primary{
    width: 30%;
  }
.feerateOperate>>>.vux-cell-primary{
  width: 30%;
}
.feerateOperate>>>.weui-cell__ft{
  width:70%;
}
  .weui-cell>>>.remark{
    padding: 0;
  }
</style>
