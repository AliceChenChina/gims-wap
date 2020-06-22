<template>
  <div :class="main ? 'mainHeader' : 'detailsHeader'">
    <x-header :left-options="{showBack: false}" :title="title">
      <div slot="left" v-if="showLeft">
        <span class="left-icon" v-if="leftText">
          <img src="@/assets/images/icon1.png" @click="leftAction" v-if="leftText == 'plus'">
          <img src="@/assets/images/back.png" @click="leftAction" v-else-if="leftText == 'back'">
        </span>
        <div class="left-arrow" v-if="!leftText" @click="preventGoBack ? leftAction() : goBack()"></div>
      </div>
      <div slot="right" v-if="showRight">
        <p class="left-icon" v-if="rightText" @click="rightAction">
          <img src="@/assets/images/icon2.png" v-if="rightText == 'message'">
          <img src="@/assets/images/icon1.png" v-else-if="rightText == 'plus'">
          <span v-else v-text="rightText"></span>
        </p>
      </div>
      <p v-if="!search">
        <span  class="title" v-show="title">{{title}}</span>
        <span  class="mainTitle" v-show="mainTitle">{{mainTitle}}</span>
        <span  class="subTitle" v-show="subTitle">{{subTitle}}</span>
      </p>
      <div class="header-search" :class="{'header-search-left': showLeft,'header-search-right': showRight}" slot="overwrite-title" v-if="search">
        <search
         v-model="searchText"
         ref="search"
         @on-submit="searchSubmit(searchText)"
         @on-change="searchChange(searchText)"
         @on-focus="searchFocus"
         @on-cancel="cancel"
         :placeholder="getPlaceHolder"
         ></search>
      </div>
    </x-header>
  </div>
</template>
<script>
    //32237384@qq.com
    export default {
        props: {
            title: String,
            main: Boolean,
            preventGoBack: {
              type: Boolean,
              default: false
            },
            showLeft: {
              type: Boolean,
              default: true
            },
            showRight: {
              type: Boolean,
              default: true
            },
          getPlaceHolder: String,
            leftText: String,
            leftAction: Function,
            rightText: String,
            rightAction: Function,
            mainTitle: String,
            subTitle: String,
            search: {
              type: Boolean,
              default: false
            },
            searchSubmit: Function,
            searchFocus:{
              type:Function,
              default:()=>{},
            },
            searchChange: Function
        },
        data () {
          return {
            searchText: ''
          }
        },
        methods: {
          //返回
          goBack(){
            this.$router.go(-1);
          },
          cancel(){
            this.$router.go(-1);
          }
        }
    }
</script>
