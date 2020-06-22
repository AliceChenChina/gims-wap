<template>
    <view-box ref="viewBox" body-padding-top="44px" body-padding-bottom="0px">
      <Header title="财富规划报告" :rightText="!showButton ? '发送' : ''" :rightAction="sendReport" slot="header" :preventGoBack="true" :leftAction="leftAction"/>
      <div class="assetAllocationReportDetail" style="height: 100%">
        <div class="bagF1f2f3 pl10 pr10 pt12 pb12">
          <user-baic-info/>
          <comment-mark />
          <allocation-plan/>
          <yield-line-chart/>
          <suggest-list/>
        </div>
      </div>
    </view-box>
</template>
<script>
  import Header from '@/pages/common/header'
  import Footer from '@/pages/common/footer'
  import NoData from '@/pages/common/noDataNew'
  import highChartsColumn from '@/pages/components/high-charts/high-charts-column'
  import userBaicInfo from './userBaicInfo'
  import commentMark from './commentMark'
  import allocationPlan from './allocationPlan'
  import yieldLineChart from './yieldLineChart'
  import suggestList from './suggestList'
  export default {
    name: 'assetAllocationReportDetail',
    components: {
      Header,
      Footer,
      NoData,
      highChartsColumn,
      yieldLineChart,
      userBaicInfo,
      commentMark,
      allocationPlan,
      suggestList
    },
    data () {
      return {
        showButton: this.$route.query.showButton
      }
    },
    created(){

    },
    methods: {
      fetchList(){
      },
      sendReport() {
        if (this.showButton) return false;
        let param = {
          userPin: this.$route.query.userPin,
          reportVersion: this.$route.query.reportVersion,
          customerId: this.$route.query.customerId
        };
        this.$vux.confirm.show({
          title: '是否确认发送',
          confirmText: '确定',
          cancelText: '取消',
          content: `<div class="confirm-body"><div class="confirmBody2">确认发送后，客户将收到最新版本财富规划报告</div></div>`,
          onConfirm: () => {
            this.request.post(this.api.assetAllocate.sendReport, param, (data) => {
              this.$router.push({ name: 'assetAllocationList', query: {customerId:this.$route.query.customerId, id:this.$route.query.id, customerfrom:this.$route.query.customerfrom,ifRealName: this.$route.query.ifRealName,userId: this.$route.query.userId}});
            })
          }
        })


      },
      leftAction(){
        this.$router.push({ name: 'assetAllocationList', query: {customerId:this.$route.query.customerId, id:this.$route.query.id, userId: this.$router.userId, customerfrom:this.$route.query.customerfrom,userId: this.$route.query.userId, userPin:this.$route.userPin, ifRealName: this.$route.query.ifRealName}});
      }
      },
  }
</script>
<style scoped>


</style>
