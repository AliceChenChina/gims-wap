<template>
  <div class="weui-tabbar">
    <a v-if="item.ifShow" :class="{'weui-bar__item_on':item.path== $route.path}" :key="item.name" @click="tabClick(item.path)" class="weui-tabbar__item" v-for="item in tabData">
      <div class="weui-tabbar__icon">
        <img :src="item.path== $route.path?item.activeImg:item.img">
      </div>
      <p class="weui-tabbar__label"><span>{{item.name}}</span></p>
    </a>
  </div>
</template>
<script>
  export default {
    name: 'TabBar',
    props: {
      active: Number
    },
    data() {
      return {
        activeIndex: 0,
        tabData: [
          {
            path: '/home',
            img: require("../../assets/images/message01.png"),
            activeImg: require("../../assets/images/message01_hover.png"),
            name: '消息',
            ifShow: false
          },
          {
            path: '/customer',
            img: require("../../assets/images/footer02.png"),
            activeImg: require("../../assets/images/footer02_hover.png"),
            name: '客户',
            ifShow: false
          },
          {
            path: '/product',
            img: require("../../assets/images/footer03.png"),
            activeImg: require("../../assets/images/footer03_hover.png"),
            name: '产品',
            ifShow: false
          },
          {
            path: '/personal',
            img: require("../../assets/images/footer04.png"),
            activeImg: require("../../assets/images/footer04_hover.png"),
            name: '我的',
            ifShow: true
          }
        ]
      }
    },
    mounted() {
      this.browserRedirect()
    },
    created(){
      // 消息中心
      if (this.utils.userInfo.checkUserPowerKey(this.powerKey.messageListKey)) {
        this.tabData[0].ifShow = true;
      }
      // 客户列表
      if (this.utils.userInfo.checkUserPowerKey(this.powerKey.customerListKey)) {
        this.tabData[1].ifShow = true;
      }
      // 产品列表
      if (this.utils.userInfo.checkUserPowerKey(this.powerKey.productListKey)) {
        this.tabData[2].ifShow = true;
      }
    },
    methods: {
      tabClick: function (path) {
        this.$router.push({path: path})
      },
      browserRedirect() {
        var sUserAgent = navigator.userAgent.toLowerCase();
        var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
        if (bIsIphoneOs) {
          if (screen.height == 812 && screen.width == 375) {
            $(".weui-tabbar__item").addClass("tabPaddingForX");
          }
        }
      }
    }
  }
</script>
<style>
  .tabPaddingForX {
    padding: 5px 0px 8px 0px !important;
  }
</style>

