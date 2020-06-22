<template>
    <view-box ref="viewBox" body-padding-top="44px" body-padding-bottom="0px">
      <Header title="财富规划" :rightText="showText?'创建报告':''" :rightAction="creatAssetsReport" slot="header" :preventGoBack="true" :leftAction="leftAction"/>
        <div>
          <group class="noBorder">
            <ul>
              <li v-for="(item,index) in assetAllocationList" @click="goToReportDetail(item)" :key="index" class="rel pl15 pr15 pt20 pb20 bLine">
                <div class="flex jcsb">
                  <div>
                    <p class="C333 PFSC-Medium lh22 fz16">财富规划报告({{item.reportVerionShow}})</p>
                    <p class="C999 fz12 lh16 mt12">申请时间：{{item.rep_Created_Date}}</p>
                  </div>
                  <div class="mr15">
                    <p class="fz14" :class = 'colorName[item.rep_Status]'>{{statusName[item.rep_Status]}}</p>
                  </div>
                </div>
                <div class='rightRow'></div>
              </li>
            </ul>
          </group>
        </div>
      <NoData v-if="assetAllocationList.length === 0"></NoData>
    </view-box>
</template>
<script>
  import Header from '@/pages/common/header'
  import NoData from '@/pages/common/noDataNew'
  export default {
    name: 'assetAllocationList',
    components: {
      Header,
      NoData
    },
    data () {
      return {
        assetAllocationList:[], // 报告列表
        userPin:'', // 京东用户名
        colorName:['priceRed', 'C999', 'C999'],
        statusName:['待处理', '处理中', '已发送'], // 0 、 1 、2
        showText:true // 头部创建报告的显示与隐藏--开关
      }
    },
    created(){
      this.fetchList();
    },
    methods: {
      fetchList(){
        let param = {customerId:this.$route.query.customerId};
        this.request.post(this.api.assetAllocate.queryReportList, param, (data) => {
            this.assetAllocationList = data || [];
            // 判断头部发送按钮是否发送
            for( let i =0; i<this.assetAllocationList.length; i++ ) {
              this.userPin = this.assetAllocationList[0].pin;
              if (this.assetAllocationList[i].rep_Status === 0 || this.assetAllocationList[i].rep_Status === 1) {
                this.showText = false;
                break;
              }
            }
        })
      },
      creatAssetsReport() {
        console.log('this.$route.query.ifRealName', this.$route.query.ifRealName);
        if (this.$route.query.ifRealName === 0) {
          this.utils.msg('客户未实名，不能创建报告！')
          return false;
        }
        let param = {query: {userPin:this.$route.query.userPin, from: 'add', id: this.$route.query.id,customerfrom:this.$route.query.customerfrom, customerId:this.$route.query.customerId,ifRealName: this.$route.query.ifRealName,userId: this.$route.query.userId}};
        this.$router.push({ path: '/customer/assetAllocate/modifyBasicInfo', ...param
          });
      },
      goToReportDetail(item) {
        let param = { query: { userPin:this.userPin,
            reportVersion:item.report_Version,
            id: this.$route.query.id,
            customerfrom:this.$route.query.customerfrom,
            userId: this.$route.query.userId,
            customerId:this.$route.query.customerId,
            showButton:item.rep_Status === 0 ? '' : 1,
            ifRealName: this.$route.query.ifRealName,
            seriesId: item.series_Id, // 报告交易序列号，如报告已发送会生成固定收益曲线
            comment: item.comment, // 报告comment字段
            portfolioId: item.portfolio_Id, // 报告中的资产组合id
            reportInfo: item.rep_Info, // 报告追加信息 对应报告列表中的rep_info
            marketId: item.market_Id, // 市场快评id,不传则返回最新市场快评
        }};
        console.log(param)
        this.$router.push({ name: 'assetAllocationReportDetail', ...param });
      },
      leftAction(){
        let query = {customerId:this.$route.query.customerId,
          id:this.$route.query.id, userId: this.$route.query.userId,
          pinCode:this.$router.userPin,
          from:this.$route.query.customerfrom
        }
        this.$router.push({ name: 'customerDetails', query:query});
      }
    }

  }
</script>
<style scoped>
  .list-title{
    padding-right: 36px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
</style>
