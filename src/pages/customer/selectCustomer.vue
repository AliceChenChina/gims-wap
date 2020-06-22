<template>
  <view-box ref="viewBox" class="customer noFooter">
    <Header  leftText="plus" :leftAction="customerAdd" rightText="message" :rightAction="message" :searchSubmit="searchSubmit" :searchChange="searchChange" :searchFocus="searchFocus" search main />
    <tab custom-bar-width="28px">
      <tab-item disabled></tab-item>
      <tab-item :selected="!type ? true : false" @on-item-click="tabClick(0)">个人</tab-item>
      <tab-item :selected="type ? true : false" @on-item-click="tabClick(1)">机构</tab-item>
      <tab-item disabled></tab-item>
    </tab>
    <ScrollList :dataList="customerList" :type="type" selectCustomer />
    <customerSearch ref="search" :key-word="keyWord" />
  </view-box>
</template>

<script>
import Header from '@/pages/common/header'
import Footer from '@/pages/common/footer'
import ScrollList from '@/pages/customer/common/scrollList'
import customerSearch from '@/pages/customer/customerSearch'
export default {
  name: 'selectCustomer',
  components: {
    Header,
    Footer,
    customerSearch,
    ScrollList
  },
  data () {
    return {
      type: 0,
      customerList: [
      {
        type: 'A',
        data: [
        {name: '沈   进', company: '上海亮起投资有限公司', state: 0, sex: '男', age: '36岁', price: '500万元', time: '2019-07-25'},
        {name: '岳崇玉', company: '上海亮起投资有限公司', state: 1, sex: '女', age: '36岁', price: '500万元', time: '2019-07-26'}
        ]
      },
      {
        type: 'B',
        data: [
        {name: '沈   进', company: '上海亮起投资有限公司', state: 0, sex: '男', age: '36岁', price: '500万元', time: '2019-07-25'},
        {name: '岳崇玉', company: '上海亮起投资有限公司', state: 1, sex: '女', age: '36岁', price: '700万元', time: '2019-07-26'},
        {name: '张鹏飞', company: '上海亮起投资有限公司', state: 0, sex: '男', age: '32岁', price: '1000万元', time: '2019-07-27'}
        ]
      },
      {
        type: 'C',
        data: [
        {name: '沈   进', company: '上海亮起投资有限公司', state: 0, sex: '男', age: '36岁', price: '500万元', time: '2019-07-25'},
        {name: '岳崇玉', company: '上海亮起投资有限公司', state: 1, sex: '女', age: '36岁', price: '700万元', time: '2019-07-26'},
        {name: '张鹏飞', company: '上海亮起投资有限公司', state: 0, sex: '男', age: '32岁', price: '1000万元', time: '2019-07-27'},
        {name: '岳崇玉', company: '上海亮起投资有限公司', state: 1, sex: '女', age: '36岁', price: '700万元', time: '2019-07-26'},
        {name: '张鹏飞', company: '上海亮起投资有限公司', state: 0, sex: '男', age: '32岁', price: '1000万元', time: '2019-07-27'}
        ]
      },
      {
        type: 'D',
        data: [
        {name: '沈   进', company: '上海亮起投资有限公司', state: 0, sex: '男', age: '36岁', price: '500万元', time: '2019-07-25'},
        {name: '岳崇玉', company: '上海亮起投资有限公司', state: 1, sex: '女', age: '36岁', price: '700万元', time: '2019-07-26'},
        {name: '张鹏飞', company: '上海亮起投资有限公司', state: 0, sex: '男', age: '32岁', price: '1000万元', time: '2019-07-27'},
        {name: '岳崇玉', company: '上海亮起投资有限公司', state: 1, sex: '女', age: '36岁', price: '700万元', time: '2019-07-26'},
        {name: '张鹏飞', company: '上海亮起投资有限公司', state: 0, sex: '男', age: '32岁', price: '1000万元', time: '2019-07-27'}
        ]
      },
      {
        type: 'E',
        data: [
        {name: '沈   进', company: '上海亮起投资有限公司', state: 0, sex: '男', age: '36岁', price: '500万元', time: '2019-07-25'},
        {name: '岳崇玉', company: '上海亮起投资有限公司', state: 1, sex: '女', age: '36岁', price: '700万元', time: '2019-07-26'},
        {name: '张鹏飞', company: '上海亮起投资有限公司', state: 0, sex: '男', age: '32岁', price: '1000万元', time: '2019-07-27'},
        {name: '岳崇玉', company: '上海亮起投资有限公司', state: 1, sex: '女', age: '36岁', price: '700万元', time: '2019-07-26'},
        {name: '张鹏飞', company: '上海亮起投资有限公司', state: 0, sex: '男', age: '32岁', price: '1000万元', time: '2019-07-27'}
        ]
      }
      ],
      navList: [],
      keyWord: ''
    }
  },
  mounted(){},
  methods: {
      //跳转路由
      goTo(path){
        this.$router.push({path})
      },
      tabClick(type){
        this.type = type
        $('.xs-container').css({'transform-origin': '0px 0px 0px','transform': 'translateX(0px) translateY(0px) translateZ(0px) scale(1, 1)'})
      },
      //新建客户
      customerAdd(){
        this.$router.push({path: '/customer/add'})
      },
      //消息中心
      message(){
        this.$router.push({path: '/message'})
      },
      //搜索回调事件
      searchSubmit(e){
      },
      //检索历史逻辑
      searchChange(e){
        this.keyWord = e
      },
      //检索历史逻辑-显示
      searchFocus(){
        this.$refs.search.show = true
      }
    }
  }
  </script>
