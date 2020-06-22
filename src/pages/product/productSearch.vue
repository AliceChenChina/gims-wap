<template>
  <view-box class="productSearch">
    <Header :showLeft="true" :showRight="false" search :searchChange='searchChange'  main ref='header'/>
     <scroller lock-x :bounce="false" height="-44">
      <div v-show="show">
        <div class="productSearch">
          <p class="title" v-if="isNoData">暂无数据匹配</p>
          <ul>
            <li v-for="item in dataList" @click="clickItem(item)" :key="item.productId">
              <b class="name" v-html="getKeyWord(item.productNameShort)"></b>
              <p class="type" v-text="item.typeName"></p>
            </li>
          </ul>
        </div>
      </div>
     </scroller>
  </view-box>
</template>

<script>
import Header from '@/pages/common/header'
import ScrollList from '@/pages/customer/common/scrollList'
  export default {
    name: 'productSearch',
    components:{
      Header,
      ScrollList
    },
    data () {
      return {
        show: false,
        isNoData:true,
        keyWord:'',
        dataList: []
      }
    },
    mounted(){
      this.$nextTick(function(){
        //自动搜索框聚焦
        this.$refs.header.$refs.search.setFocus();
      })
    },
    methods: {
      getKeyWord(str){
        let newStr = str
        if(str && this.keyWord && str.indexOf(this.keyWord) >= 0){
          newStr = str.replace(this.keyWord, '<span class="red">' + this.keyWord + '</span>')
        }
        return newStr
      },
      //点击进入详情页面
      clickItem(item){
        let type=item.productType;
        let productId=item.productId;
        let startId=item.id;
        this.$router.push({name:'productDetail',query:{type,productId,startId:startId}})
      },
      searchChange(text){
        //搜索值得改变
        if(text){
          //向后台发送搜索
          this.fetchList(text);
        }else{
          this.show=false;
        }
      },
      fetchList(text){
        this.dataList=[];
        let parames={'productNameShort':text}
        this.func.ajaxPost(this.api.product.Query,parames,res=>{
          if (res.data.code === 200) {
              let productListTemp=res.data.data.records;
              productListTemp.forEach(product => {
                switch(product.productType){
                  case 'secondary_market':
                      product.typeName='二级市场';
                      break;
                  case 'fixed_income':
                      product.typeName='固收';
                      break;
                  case 'equity':
                      product.typeName='股权';
                      break;
                }
              });
              this.dataList=productListTemp;
              if(this.dataList.length==0){
                this.isNoData=true;
              }else{
                this.isNoData=false;
              }
              this.keyWord=text;
              this.show=true;
          }
        })
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

.productSearch>>>.weui-tab__panel{
  padding-bottom: 0px;
}
</style>
