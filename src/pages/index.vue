<template>
  <view-box ref="viewBox" class="index" body-padding-top='0px'>
    <!-- <scroller lock-x height="-54" :bounce='false'> -->
    <div>
      <swiper :list="banners" height="110px" v-model="defaultIndex" :show-dots="false"></swiper>
      <group class="noBorder">
        <cell title="本月统计" is-link link="/achievement?type=1" class="title"></cell>
        <div class="countTotal">
          <p @click="goTo('/achievement?type=1')">
            <span>{{salesMonthList.newCustomer}}</span>
            <em>新增客户（人）</em>
          </p>
          <p @click="goTo('/achievement?type=3')">
            <span>{{salesMonthList.redeemCustomer}}</span>
            <em>赎回客户（人）</em>
          </p>
          <p @click="goTo('/achievement?type=2')">
            <span>{{utils.toTenThousand(this.salesMonthList.sale)}}</span>
            <em>新增投资（万元）</em>
          </p>
          <p @click="goTo('/achievement?type=3')">
            <span>{{utils.toTenThousand(this.salesMonthList.redeemBlance)}}</span>
            <em>赎回金额（万元）</em>
          </p>
        </div>
      </group>
      <group class="noBorder">
        <cell title="热销产品" is-link link="/product" class="title"></cell>
        <ul class="product-list">
          <li v-for="(item,index) in productList"
              @click="goTo('/product/productDetail?type='+ item.productType+'&productId='+item.productId+'&startId='+item.id)"
              :key="index">
            <div class="listHeader">
              <b>{{item.typeName}}</b>
              <b>|</b>
              <b>{{item.shortName}}</b>
            </div>
            <div class='listContent'>
              <div class="list-left">
                <b :class="item.productType=='equity'&&item.price!='-'?'smallFont':''">{{item.price}}</b>
                <p>{{item.prictType}}</p>
              </div>
              <div class="list-right">
                <p class='state'>{{item.productStatus}}</p>
                <p class='list-desc'>
                  <span>{{item.proTime}}</span>
                  <span v-if='item.proTime&&item.strategyType'>|</span>
                  <span>{{item.strategyType}}</span>
                </p>
              </div>
            </div>
            <div class='rightRow'></div>
          </li>
        </ul>
      </group>
    </div>
    <!-- </scroller> -->
    <Footer :active="0"/>
  </view-box>
</template>
<script>
  import Header from '@/pages/common/header'
  import Footer from '@/pages/common/footer'
  import {debug} from 'util';
  export default {
    name: 'index',
    components: {
      Header,
      Footer
    },
    mounted() {
      // 进入页面获取睡会的提醒信息数据
      // 有个人中心的权限才弹提醒
      if (this.utils.userInfo.checkUserPowerKey(this.powerKey.personalKey)){
        this.func.ajaxPost(this.api.home.queryTradeApply,{}, res=>{
          if(res.data.code == 200){
            let data = res.data.data.records;
            if(data && data.length > 0){
              this.confirm(data,0,data.length);
            }else{
              this.querySalesCard();
            }
          }
        })
      }

      //获取当月新增客户数，获取热销产品
      this.func.ajaxAll(this.api.home.Query, {}, this.api.product.Query, {'pageSize': 5}, (res1, res2) => {
        if (res1.data.code === 200 && res2.data.code === 200) {
          //处理第一个请求数据
          let data1 = res1.data.data;
          for (let key in data1) {
            if (data1[key] == null) {
              data1[key] = 0;
            }
          }
          this.salesMonthList = data1;
          //处理第二请求数据
          let productListTemp = res2.data.data.records;
          //处理在什么时期
          productListTemp.forEach((product) => {
            //显示在页面上的每个product
            let productShow = {};
            //处理每个类型公共的参数，比如productStatus,shortName,percent,productType,productId
            productShow.productType = product.productType;
            productShow.shortName = product.productNameShort;
            productShow.productId = product.productId;
            switch (product.productStatus) {
              case '0':
                productShow.productStatus = '认购期';
                break;
              case '1':
                productShow.productStatus = '正常开放';
                break;
              case '3':
                productShow.productStatus = '暂停赎回';
                break;
              case '4':
                productShow.productStatus = '暂停申购';
                break;
              case '5':
                productShow.productStatus = '暂停交易';
                break;
              case '6':
                productShow.productStatus = '产品终止';
                break;
              case '9':
                productShow.productStatus = '发行失败';
                break;
            }
            //处理每个类型单个的参数,比如price,prictType,typeName,proTime,strategyType,
            if (product.productType == 'secondary_market') {
              //二级市场
              productShow.price = (product.netValue != null) ? this.utils.keepFourDecimal(product.netValue) : '-';
              productShow.prictType = '单位净值';
              productShow.typeName = '阳光私募';
              productShow.proTime = '持续募集';
              productShow.strategyType = this.utils.arg.getText("strategy_type", product.strategyType, true);
            } else if (product.productType == 'fixed_income') {
              //固收
              productShow.price = product.incomeValue ? product.incomeValue : '-';
              productShow.prictType = product.incomeType ? this.utils.arg.getText("income_type", product.incomeType, true) : '-';
              productShow.typeName = '类固收';
              productShow.proTime = (product.timeLimit != null) ? product.timeLimit + '个月' : '';
              productShow.strategyType = this.utils.arg.getText("invest_scope_type", product.investScopeType, true);
            } else if (product.productType == 'equity') {
              //股权
              productShow.price = this.utils.arg.getText("investment_trends", product.investmentTrends);
              productShow.prictType = '投资方向';
              productShow.typeName = '私募股权';
              if ((product.timeLimitExtend != null) && (product.timeLimitInvest != null) && (product.timeLimitQuit != null)) {
                productShow.proTime = product.timeLimitInvest + '+' + product.timeLimitQuit + '+' + product.timeLimitExtend + "年";
              } else {
                productShow.proTime = '';
              }
              productShow.strategyType = this.utils.arg.getText("investment_industry", product.investmentIndustry, true);
            }
            this.productList.push(productShow);
          })
        }
      })
    },
    data() {
      return {
        defaultIndex: 0,
        banners: [{
          url: 'javascript:',
          img: require('@/assets/images/tmp/banner.jpg')
        }],
        loadMoreState: false,
        salesMonthList: {},
        productList: [],
      }
    },
    methods: {
      //跳转路由
      goTo(path) {
        this.$router.push({path})
      },
      //新建客户
      customerAdd() {
        this.$router.push({path: '/customer/add'})
      },
      //消息中心
      message() {
        this.$router.push({path: '/message'})
      },
      confirm(data, i, len) {
        this.$vux.confirm.show({
          title: '赎回申请',
          confirmText: '立即完成',
          cancelText: '稍后',
          content: '<div class="confirm-body"><div class="confirmBody2"><p>产品名称：' + data[i].productName + '</p><p>客户名称：' + data[i].customerName + '</p><div class="text-center lightGrey mt10 fw400">请及时补全赎回材料提交审核。</div></div>',
          // 组件除show外的属性
          onCancel: () => {
            i++
            if (i < len) {
              this.$vux.confirm.hide()
              let that = this;
              setTimeout(function () {
                that.confirm(data, i, len)
              }, 200)

            } else {
              this.$vux.confirm.hide();
              this.querySalesCard();
            }
          },
          onConfirm: () => {
            this.$vux.confirm.hide();
            this.$router.push({name: 'redeem', params: {tradeId: data[i].tradeId, status: data[i].status}})
          }
        })
      },
      // 查询理财师名片信息
      querySalesCard() {
        this.func.ajaxPost(this.api.personal.queryCard,{}, res=>{
          // cardStatus:1已设置,非1未设置
          if(res.data.code === 200 && res.data.data.cardStatus !== 1){
            this.remindSalesEditInfo();
          }
        })
      },
      remindSalesEditInfo() {
        this.$vux.confirm.show({
          title: '设置您的个人名片',
          confirmText: '立即设置',
          cancelText: '稍后',
          content: '<div class="confirm-body"><div class="confirmBody2">为了帮助客户更加了解您，提高信任感，建议您立即设置个人名片<div class="text-left lightGrey mt10 fw400 fz12">您也可以稍后在【我的】个人信息中设置</div></div></div>',
          // 组件除show外的属性
          onCancel: () => {
            this.$vux.confirm.hide();
          },
          onConfirm: () => {
            this.$vux.confirm.hide()
            // this.$router.push({name: 'editSalesManBusinessCard'})
            this.$router.push({ path: '/personal/editSalesManBusinessCard'});
          }
        })
      }

    }
  }
</script>
<style scoped>


</style>

