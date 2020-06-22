<template>
    <view-box ref="viewBox" class="index modifyInvestSuggest" body-padding-top="44px" body-padding-bottom="0px">
      <Header title="修改规划建议" rightText="保存" :rightAction="save" slot="header" :leftAction="leftAction" :preventGoBack = "true"/>
          <div>
            <ul>
              <li v-for="(item,index) in modifyInvestSuggestList" :key="index">
                <div class="flex jcsb pl15 pr15 bagFafafa pt9 pb9">
                  <div class="flex">
                    <p class="C666 fz16 mr15">{{item.title}}</p>
                    <p class="C999 fz12">规划比例：{{item.radio}}</p>
                  </div>
                  <div @click="addSuggestProduct(item)" class="textBlue fz14">添加产品</div>
                </div>

                <draggable :list = "item.children" class="list-group" handle=".handle" >
                  <delete-slider v-for="(childrenItem,childrenIndex) in item.children" :key="childrenIndex" class="whiteBg" @deleteLine="onButtonClick(childrenItem,childrenIndex,index)">
                    <div slot="content" class="demo-content vux-1px-t p15">
                      <div class="C333 lh22 fz16">
                        <span>{{utils.setDefault(childrenItem.proLineName)}}</span>
                        <span>|</span>
                        <span>{{utils.setDefault(childrenItem.productName)}}</span>
                      </div>
                      <div class="flex jcsb mt13">
                        <div class="flexS">
                          <div class="w150o">
                            <p class="fz16 UDC-Bold lh20" :class="isNaN(Number(childrenItem.rate)) ? 'priceRed' : Number(childrenItem.rate) >= 0 ?  'priceRed' : 'Cgreen' ">{{childrenItem.rate === '0' || childrenItem.rate ? isNaN(Number(childrenItem.rate)) ? childrenItem.rate : childrenItem.rate + '%' : '--'}}</p>
                            <p class="lh17 mt5 fz12 C999 h17">{{utils.setDefault(childrenItem.rateName)}}</p>
                          </div>
                          <div class="">
                            <p class="PFSC-Medium fz14 C333 lh20">{{utils.setDefault(childrenItem.productFeature)}}</p>
                            <p class="lh17 mt5 fz12 C999">{{utils.setDefault(childrenItem.productFeatureName)}}</p>
                          </div>
                        </div>
                        <div class="dragIcon">
                          <span class="handle"><img class="w44 h44" src="../../../assets/images/dragIcon.png" /></span>
                        </div>
                      </div>
                    </div>
                  </delete-slider>
                </draggable>
                <div class="C999 text-center lh50 whiteBg pl15 pr15" v-if="item.children.length === 0 && item.radio !== '0%' ">无数据</div>
                <div class="C999 text-center lh50 whiteBg pl15 pr15" v-if="item.children.length === 0 && item.radio === '0%'">推荐配置不建议配置该类产品</div>
              </li>
            </ul>
          <NoData></NoData>
          </div>
    </view-box>
</template>
<script>
  import Header from '@/pages/common/header'
  import Footer from '@/pages/common/footer'
  import NoData from '@/pages/common/noData'
  import deleteSlider from './deleteTemplate.vue'
  import BScroll from 'better-scroll'
  import draggable from "vuedraggable";
  export default {
    name: 'modifyInvestSuggest',
    components: {
      Header,
      Footer,
      NoData,
      draggable,
      deleteSlider
    },
    data () {
      return {
        modifyInvestSuggestList:[],
        modifiedResult: [],
        oriModifyInvestSuggestList: [],
        storeChooseData:[],
        from: this.$route.query.from,
        portfolio_cfg: {}
      }
    },
    created(){
      if(this.from && this.from === 'search') {
        this.portfolio_cfg = this.$store.state.portfolio_cfg;
        this.modifyInvestSuggestList = this.storeToList(this.$store.state.chooseDataList);
      }else{
        this.queryStrategyOrder();
      }
    },
    methods: {
      queryStrategyOrder(){
        let param = {
          opr_type:'sales',
          pin: this.$route.query.userPin,
          customerId: this.$route.query.customerId,
          searchItemVo: {
            rep_version:this.$route.query.reportVersion
          }
        };
        this.request.post(this.api.assetAllocate.queryStrategyOrder, param, (data) => {
             this.oriModifyInvestSuggestList = data;
          this.portfolio_cfg = data.portfolio_cfg;
             let titleData = data.portfolio_cfg;
          for(let attr in titleData) {
            let obj = {};
            obj.title = titleData[attr].mainTypeName;
            obj.mainType = titleData[attr].mainType;
            if (titleData[attr].lowerRate === titleData[attr].upperRate) {
              obj.radio = `${titleData[attr].lowerRate}%` ;
            }else{
              obj.radio = `${titleData[attr].lowerRate}%~${titleData[attr].upperRate}%` ;
            }
            if (data[attr]) {
              obj.children = data[attr];
            }else{
              obj.children = [];
            }
            this.modifyInvestSuggestList.push(obj);
          }
             console.log('this.modifyInvestSuggestList', this.modifyInvestSuggestList);
             this.storeChooseData = this.listToStore(this.modifyInvestSuggestList);
             this.$store.commit('changeChooseDataList',this.storeChooseData);
             this.$store.commit('storePortFolioCfg',this.portfolio_cfg);
        })
      },
      // 把页面的数据格式转为store里面的数据格式
      listToStore(oriArr){
        let storeArr = [];
        oriArr.forEach(item => {
          item.children.forEach(child => {
            child.choosed = true;
            child.radio = item.radio;
          })
          storeArr = storeArr.concat(item.children);
        });
        return storeArr;
      },
      // 把store里面的数据格式转为页面的数据格式
      storeToList(arr){
        let map = {},
          dest = [];
        for(let i = 0; i < arr.length; i++){
          let ai = arr[i];
          if(!map[ai.mainType]){
            dest.push({
              title: ai.mainTypeName,
              mainType: ai.mainType,
              radio: this.portfolio_cfg[ai.mainType].lowerRate === this.portfolio_cfg[ai.mainType].upperRate ? `${this.portfolio_cfg[ai.mainType].lowerRate}%` : `${this.portfolio_cfg[ai.mainType].lowerRate}%~${this.portfolio_cfg[ai.mainType].upperRate}%`,
              children: [ai]
            });
            map[ai.mainType] = ai;
          }else{
            for(let j = 0; j < dest.length; j++){
              let dj = dest[j];
              if(dj.mainType == ai.mainType){
                dj.children.push(ai);
                break;
              }
            }
          }
        }
        let newArr = [];
        let titleData = this.portfolio_cfg;
        for(let attr in titleData) {
          let control = false;
          for (let i = 0; i < dest.length; i++) {
            if (dest[i].mainType === attr) {
              control = true;
              newArr.push(dest[i]);
              break;
            }
          }
          if (!control) {
            let obj = {};
            obj.title = titleData[attr].mainTypeName;
            obj.mainType = titleData[attr].mainType;
            if (titleData[attr].lowerRate === titleData[attr].upperRate) {
              obj.radio = `${titleData[attr].lowerRate}%`;
            } else {
              obj.radio = `${titleData[attr].lowerRate}%~${titleData[attr].upperRate}%`;
            }
            obj.children = [];
            newArr.push(obj);
          }
        }
        return newArr;
        },
      save(){
        let modifiedResult = {};
        let num = 0;
        this.modifyInvestSuggestList.forEach(item => {
          let arr = [];
          item.children.forEach(child => {
            arr.push(child.skuid);
            num+=1;
          })
          modifiedResult[item.mainType] = arr;
        })
        if(num < 2 || num > 20) {
          this.utils.msg("请推荐2~20个产品！");
          return false;
        }
          let param = {
            opr_type:'sales',
            pin: this.$route.query.userPin,
            customerId: this.$route.query.customerId,
            searchItemVo: {
              rep_version:this.$route.query.reportVersion
            },
            modifiedResult: modifiedResult
          };
        this.request.post(this.api.assetAllocate.modifyStrategyOrder, param, (data) => {
          this.goToDetail()
        })
      },
      addSuggestProduct(item){
        let param = {query:{reportVersion:this.$route.query.reportVersion,
            userPin: this.$route.query.userPin,id: this.$route.query.id,customerfrom:this.$route.query.customerfrom,
            customerId:this.$route.query.customerId,
            ifRealName: this.$route.query.ifRealName,
            seriesId: this.$route.query.seriesId || '',
            comment: this.$route.query.comment || '',
            portfolioId: this.$route.query.portfolioId || '',
            reportInfo: this.$route.query.reportInfo || '',
            marketId: this.$route.query.marketId || '',
            ifRequestComment: this.$route.query.ifRequestComment || '',
            userId: this.$route.query.userId,
            mainType:item.mainType
          }}
        this.$router.push({ path: '/customer/assetAllocate/addSuggestProduct', ...param});
      },
      onButtonClick(item,index,parentIndex) {
        this.modifyInvestSuggestList[parentIndex].children.splice(index, 1);
        this.storeChooseData = this.listToStore(this.modifyInvestSuggestList);
        this.$store.commit('changeChooseDataList',this.storeChooseData);
      },
      leftAction(){
        console.log('333')
       this.goToDetail()
      },
      goToDetail(){
        let query = {query:{reportVersion:this.$route.query.reportVersion,
            userPin: this.$route.query.userPin,id: this.$route.query.id,customerfrom:this.$route.query.customerfrom,
            customerId:this.$route.query.customerId,
            ifRealName: this.$route.query.ifRealName,
            seriesId: this.$route.query.seriesId || '',
            comment: this.$route.query.comment || '',
            portfolioId: this.$route.query.portfolioId || '',
            reportInfo: this.$route.query.reportInfo || '',
            marketId: this.$route.query.marketId || '',
            userId: this.$route.query.userId,
            ifRequestComment: this.$route.query.ifRequestComment || ''
          }}
        this.$router.push({ name: 'assetAllocationReportDetail', ...query});
      }
    }

  }
</script>
<style scoped>
  .dragIcon {
    position: absolute;
    top:50%;
    right: 15px;
    transform: translateY(-50%);
  }
  /deep/ .vux-swipeout-button-warn {
    font-size: 16px;
  }
  /deep/ .vux-1px-t:before {
    border-top: none;
  }
 .modifyInvestSuggest /deep/ .vux-swipeout-button-box {
    border: 1px solid transparent;
  }
</style>
