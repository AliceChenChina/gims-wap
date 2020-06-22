<template>
  <view-box body-padding-top='96px'>
    <div slot="header">
      <Header title="修改规划建议" :leftAction="leftAction" :preventGoBack = "true"/>
      <div class="pl15 pr15 pt10 pb8 bagFafafa abs top44 left0 w100P z-index2" >
        <searcher placeholder="查询产品" @on-submit="searchSubmit" @on-change="searchChange" @on-cancel="cancel" @on-clear="cancel"></searcher>
      </div>
    </div>
      <div >
      <div v-if="show">
        <ul>
          <li v-for="(item,index) in dataList" :key='index' class="flex jcsb rel p15 bLine">
            <div class="lh22 fz16 C333">
              <span>{{utils.setDefault(item.proLineName)}}</span>
              <span> | </span>
              <span>{{utils.setDefault(item.productName)}}</span>
            </div>
            <div>
              <span v-if="item.choosed" class="fz14 C999" >已添加</span>
              <span v-else @click="addSuggestProduct(item)" class="fz14 textBlue" >添加</span>
            </div>
          </li>
        </ul>
      </div>
      </div>
  </view-box>
</template>

<script>
import Header from '@/pages/common/header';
import ScrollList from '@/pages/customer/common/scrollList';
import Searcher from '@/pages/common/searcher';
export default {
    name: 'addSuggestProduct',
    data () {
      return {
        show: false,
        dataList: [
        ],
        chooseDataList:[],
        keyWord:'',
        isNoData:true,
        controlLine:true
      }
    },
  mounted(){
      this.chooseDataList = this.$store.state.chooseDataList;
  },
    components:{
      Header,
      ScrollList,
      Searcher
    },
    methods: {
      addSuggestProduct(item) {
        item.choosed = true;
        this.chooseDataList.push(item);
        this.$store.commit('changeChooseDataList',this.chooseDataList);

        this.utils.msg("添加成功");
      },
      searchSubmit(){},

      searchChange(text){
        console.log('text', text);
        //搜索值得改变
        if(text){
          //向后台发送搜索
          this.show=true;
          this.fetchList(text);
        }else{
          this.show=false;
        }
      },
      fetchList(text){
        if(!this.controlLine){
          return false;
        }
        this.controlLine = false;
        this.dataList = [];
        let param = {
            opr_type:'sales',
          customerId: this.$route.query.customerId,
            pin: this.$route.query.userPin,
            searchItemVo: {
              mainType:this.$route.query.mainType,
              name: text
            }
          };
        this.request.post(this.api.assetAllocate.searchStrategyOrder, param, (data) => {
            for(let attr in data) {
              data[attr].forEach(item=>{
                item.mainType = attr;
                item.choosed = false;
              })
              this.dataList = this.dataList.concat(data[attr])
            }
            this.chooseDataList.forEach(chooseItem => {
              this.dataList.forEach(dataItem => {
                if (dataItem.mainType === chooseItem.mainType && dataItem.skuid === chooseItem.skuid) {
                  dataItem.choosed = true;
                }
              })
            })
            this.controlLine = true;
        })
      },
      cancel(){
        this.dataList = [];
        this.leftAction();
      },
      leftAction(){
        let param = {query:{reportVersion:this.$route.query.reportVersion,
            userPin: this.$route.query.userPin,id: this.$route.query.id,customerfrom:this.$route.query.customerfrom,
            customerId:this.$route.query.customerId,
            ifRealName: this.$route.query.ifRealName,
            seriesId: this.$route.query.seriesId || '',
            comment: this.$route.query.comment || '',
            portfolioId: this.$route.query.portfolioId || '',
            reportInfo: this.$route.query.reportInfo || '',
            marketId: this.$route.query.marketId || '',
            userId: this.$route.query.userId,
            ifRequestComment: this.$route.query.ifRequestComment || '',
            from:'search'
          }}
        this.$router.push({ name: 'modifyInvestSuggest', ...param});
      }
    }
  }
</script>
<style scoped>
.mainHeader>>>.vux-header{
   position: fixed!important;
}

.mainHeader>>>.vux-header-title-area .header-search-left{
    padding-left: 34px!important;
}

.mainHeader>>>.vux-header-left .left-arrow:before{
  border: 1px solid #999;
  border-width: 1px 0 0 1px;
}

</style>
