<template>
  <view-box ref="viewBox" class="assets noFooter">
    <Header title="管理资产"  />
    <scroller lock-x height="-88" >
      <div>
        <ul class="assets-list">
          <li v-for="item in assetsList" class="assets-li">
            <div class="listHeader">
              <b>{{item.productType}}</b>
              <b class="space-mark">|</b>
              <b>{{item.productName}}</b>
            </div>
            <div class="list-remark" v-if="item.productType === '阳光私募'">
              <span>最近申购开放日:{{item.subscribeOpenDays}}</span><span>最近赎回开放日:{{item.redemptionOpenDays}}</span>
            </div>
            <div class="list-remark" v-if="item.productType === '类固收'">
              <span>预计到期日：{{item.expectedDueDate}}</span>
            </div>
            <div class="list-remark" v-if="item.productType === '私募股权'">
              <span>成立日：{{item.confirmDate}}</span><span>产品期限：{{item.productPeriod}}</span>
            </div>
            <assetList :customerCapitalList = 'item.customerCapitalList' ></assetList>
            <div class="border-bottom"></div>
          </li>
        </ul>
        <NoData></NoData>
      </div>
    </scroller>
  </view-box>
</template>
<script>
  import Header from '@/pages/common/header'
  import assetList from '@/pages/common/assetList'
  import NoData from '@/pages/common/noData'
  export default {
    name: 'contract',
    components: {
      Header,
      assetList,
      NoData
    },
    data () {
      return {
        assetsList: [
        ],
      }
    },
    created(){
      this.load()
    },
    methods: {
      //跳转路由
      goTo(path){
        this.$router.push({path})
      },
      load(){
        var that = this;
        that.func.ajaxPost(this.api.personal.manageAssetsList,'', res => {
          if(res.data.code === 200){
            that.assetsList = res.data.data;
            if(that.assetsList && that.assetsList.length === 0){
              $(".noData").show();
              return false;
            }
            $(".noData").hide();
            that.assetsList.forEach(item =>{
              for(var key in item){
                if(item.hasOwnProperty(key)){
                  if(key === 'customerCapitalList'){
                    if(!item[key]){
                      item[key] = [];
                      return;
                    }
                  }
                  if(key === 'subscribeOpenDays'|| key === 'redemptionOpenDays' || key === 'expectedDueDate' || key === 'confirmDate'){
                    if(item[key]){
                      item[key] = item[key].replace(/-/g,'.');
                    }
                  }
                  item[key] = this.utils.setDefault(item[key]);
                }
              }
            })
          }

        })
      },
    }
  }
</script>
<style scoped>

</style>
