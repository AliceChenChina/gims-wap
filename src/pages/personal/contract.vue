<template>
  <view-box ref="viewBox" class="contract noFooter">
    <Header title="合同" preventGoBack :leftAction="() => { goTo('/personal') }" />
    <tab custom-bar-width="28px">
      <tab-item selected>全部</tab-item>
      <tab-item>待提交</tab-item>
      <tab-item>待审核</tab-item>
      <tab-item>已审核</tab-item>
      <tab-item>退单</tab-item>
    </tab>
    <scroller lock-x height="-88" @on-scroll-bottom="loadMore">
      <div>
        <ul class="contract-list">
          <li v-for="item in contractList" @click="goTo('/personal/contractAdd')">
            <group>
              <cell :title="item.orderId" class="title">
                <p class="state">
                  <span class="red" v-if="item.state == 1">退单</span>
                  <span class="black" v-if="item.state == 2">待提交</span>
                  <span class="black" v-if="item.state == 3">待审核</span>
                  <span class="gray" v-if="item.state == 4">已审核</span>
                </p>
              </cell>
              <cell title="客户名称" :value="item.name"></cell>
              <cell title="产品名称" :value="item.title"></cell>
              <cell title="合同金额" class="price">
                <p>
                  <b class="red" v-text="item.price"></b>
                  <span>元</span>
                </p>
              </cell>
              <cell title="打款日期" :value="item.time"></cell>
            </group>
          </li>
        </ul>
        <p class="showMore">上拉显示更多</p>
      </div>
    </scroller>
  </view-box>
</template>

<script>
  import Header from '@/pages/common/header'
  import Footer from '@/pages/common/footer'
  export default {
    name: 'contract',
    components: {
      Header,
      Footer
    },
    data () {
      return {
        defaultIndex: 0,
        contractList: [
          {title: '慧投溢添8号66期', orderId: '2017105211100', price: '120,000.00', name: '沈进', time: '2017-03-03 13：23', state: 1, stateName: '待提交'},
          {title: '慧投溢添8号66期', orderId: '2017105211100', price: '120,000.00', name: '沈进', time: '2017-03-03 13：23', state: 2, stateName: '待提交'},
          {title: '慧投溢添8号66期', orderId: '2017105211100', price: '120,000.00', name: '沈进', time: '2017-03-03 13：23', state: 3, stateName: '待提交'},
          {title: '慧投溢添8号66期', orderId: '2017105211100', price: '120,000.00', name: '沈进', time: '2017-03-03 13：23', state: 4, stateName: '待提交'},
        ],
        loadMoreState: false
      }
    },
    methods: {
      //跳转路由
      goTo(path){
        this.$router.push({path})
      },
      loadMore(){
        if(!this.loadMoreState){
          this.contractList.push(this.contractList[0])
          this.contractList.push(this.contractList[1])
        }
        this.loadMoreState = true
      }
    }
  }
</script>
