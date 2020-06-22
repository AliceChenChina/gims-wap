<template>
  <view-box ref="viewBox" class="customer" body-padding-top="44px" body-padding-bottom="50px">
    <!-- 报单页面进入 -->
    <div>
      <template v-if="isOnlyList">
        <Header
          leftText="back"
          :leftAction="back"
          rightText="plus"
          :rightAction="customerAdd"
          :searchSubmit="searchSubmit"
          :searchChange="searchChange"
          :searchFocus="searchFocus"
          :showRight='addCustomerPower'
          :showLeft='true'
          slot="header"
          search main />
      </template>
      <!-- 客户页面进入 -->
      <template v-else>
        <Header
          rightText="plus"
          :rightAction="customerAdd"
          :searchSubmit="searchSubmit"
          :searchChange="searchChange"
          :searchFocus="searchFocus"
          :showRight='addCustomerPower'
          :showLeft='false'
          slot="header"
          getPlaceHolder='搜索名称/京东用户名/联系人'
          search main />
      </template>
      <!-- <tab custom-bar-width="28px">
        <tab-item disabled></tab-item>
        <tab-item :selected="!type ? true : false">个人</tab-item>
        <tab-item :selected="type ? true : false" @on-item-click="tabClick(1)">机构</tab-item>
        <tab-item disabled></tab-item>
      </tab>  -->
      <div slot="header">
        <tab custom-bar-width="28px" class="tabBar" >
          <tab-item selected @on-item-click="changeTabItem">全部</tab-item>
          <tab-item @on-item-click="changeTabItem">专属</tab-item>
          <tab-item @on-item-click="changeTabItem">绑定</tab-item>
          <tab-item @on-item-click="changeTabItem">相关</tab-item>
        </tab>
      </div>
    </div>
    <ScrollList
      :dataList="CustomerList"
      :type="type"
      :isOnlyList='isOnlyList'
      ref="scroll_list"
      @onListLoadMore="fetchMore"/>
    <!--<div>-->
      <!--<div v-for="item,index in CustomerList">-->
        <!--{{index}}&#45;&#45;{{item.userId}}-->
      <!--</div>-->
    <!--</div>-->
      <template v-if='!isOnlyList' >
        <Footer :active="1" slot="bottom" />
      </template>

  </view-box>
</template>

<script>
import Header from '@/pages/common/header'
import Footer from '@/pages/common/footer'
import ScrollList from '@/pages/customer/common/scrollList'
export default {
  name: 'customer',
  components: {
    Header,
    Footer,
    ScrollList
  },
  data() {
    return {
      type: 0,
      pageSize: 15,
      pageNumber: 1,
      isLoadPending: false,
      isDataEnd: false,
      CustomerList: [],
      navList: [],
      keyWord: '',
      tableData: [],
      customerName: '',
      isOnlyList:this.$route.query.isOnlyList,
      addCustomerPower: this.utils.userInfo.checkUserPowerKey(this.powerKey.addCustomerKey) // 新增客户权限控制
    }
  },
  created() {
    let param = {relationships:''};
    this.fetchList(param);
  },
  mounted() {
    this.CustomerList = [];
  },
  activated(){

   this.isOnlyList = this.$route.query.isOnlyList;

  },
  beforeRouteLeave(to,from,next){
      if(to.name=="order"){
        this.$vux.confirm.hide();
      }
      next();
  },
  methods: {
    toCustomer(){
      this.$router.push({path:'/customer',query:{isOnlyList:true}})

    },
    //跳转路由
    goTo(path) {
      this.$router.push({ path })
    },
    fetchMore() {
      var param = {relationships:''};
      if(this.type === 1){
        param = {relationships:2}
      }
      if(this.type === 2){
        param = {relationships:1}
      }
      if(this.type === 3){
        param = {relationships:0}
      }
      this.fetchList(param);
    },
    //新建客户
    customerAdd() {
      this.$router.push({ path: '/customer/add' })
    },
    //消息中心
    message() {
      this.$router.push({ path: '/message' })
    },
    //搜索回调事件
    searchSubmit(e) {
      this.customerName = e
      this.fetchList();
    },
    //检索历史逻辑
    searchChange(e) {
      this.keyWord = e
    },
    //检索历史逻辑-显示
    searchFocus() {
      this.$router.push({path:'/customer/customerSearch',query:{isOnlyList:this.isOnlyList}})
    },
    setPageParam(param) {
      param.pageNumber = this.pageNumber;
      param.pageSize = this.pageSize;
    },
    changeTabItem(index){
      if(this.type === index){
        return false;
      }
      this.CustomerList = [];
      this.pageNumber = 1;
      this.isDataEnd = false;
      var param = {relationships:''};
      if(index === 1){
        param = {relationships:2};
      }
      if(index === 2){
        param = {relationships:1};
      }
      if(index === 3){
        param = {relationships:0}
      }
      this.type = index;
      this.fetchList(param);
      this.$refs.scroll_list.resetScroll();
    },
    fetchList(parames) {
      if (this.isLoadPending || this.isDataEnd) return;
      this.setPageParam(parames);
      this.isLoadPending = true;
      this.func.ajaxPost(this.api.customer.Query, parames, res => {
        this.isLoadPending = false;
        if (res.data.code === 200) {
          if (!res.data.data || !res.data.data.length) {
            this.isDataEnd = true;
            return;
          }
          for (let i = 0; i < res.data.data.length; i++) {
            const element = res.data.data[i];
            let isExist = false
            this.CustomerList.forEach(function (c) {
              if (c['type'] == element.sortLetters) {
                c['data'].push(element);
                isExist = true;
                return
              }
            })
            if (!isExist) {//不存在
              this.CustomerList.push({
                type: element.sortLetters,
                data: [element]
              });
            }
          }
          this.pageNumber += 1;
        }
      },false)
    },
    back(){
      this.$router.go(-1);
    }
  }

}
</script>
<style scoped>
  .customer .tabBar >>> .vux-tab-container{
    z-index: 999;
  }
  #app .customer >>> .mainHeader  .vux-header .vux-header-title-area .header-search .weui-search-bar__cancel-btn {
    display: none;
  }
</style>
