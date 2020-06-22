<template>
  <view-box ref="viewBox" class="bagFafafa">
    <Header title="资产分类说明"/>
    <div class="assetAllocationReportDetail" style="height: 100%">
      <div>
        <ul>
          <li v-for="(item,index) in assetClassifyList" :key="index" class="p15 mb10 whiteBg">
            <div class="flex">
              <div class="icon"></div>
              <p class="lh20 fz14 PFSC-Medium">{{item.title}}</p>
            </div>
            <p class="mt10 fz12 C999 lh18">{{item.detail}}</p>
          </li>
        </ul>
      </div>
    </div>
  </view-box>
</template>
<script>
  import Header from '@/pages/common/header'
  import Footer from '@/pages/common/footer'
  import NoData from '@/pages/common/noData'
  import BScroll from 'better-scroll'
  export default {
    name: 'checkAssetClassifyDetail',
    components: {
      Header,
      Footer,
      NoData
    },
    data () {
      return {
        assetClassifyList:[],
        scrollHeight:''
      }
    },
    created(){
      this.fetchList();
      let height=document.documentElement.clientHeight-44;
      this.scrollHeight=height+'px';
    },
    mounted(){
      this.$nextTick(function () {
        setTimeout(function(){
          let wrapper = document.querySelector('.assetAllocationReportDetail')
          let scroll = new BScroll(wrapper,{
            bounce: false,
            click: true,
          })
        },500)
      })
    },
    methods: {
      fetchList(){
        this.assetClassifyList = [
          {
            title: '活期理财',
            detail: '为满足投资者零钱增值需求而设计的短期理财产品，具有存取便利、门槛较低、操作简单、收益高于活期存款的特点。为应对工作、生活、投资所预留的资金都可购买活期理财产品享受日日生息。产品一般为京东小金库或银行精选。'
          },
          {
            title: '稳健收益',
            detail: '为投资者稳步创造中长期投资价值的理财产品，这类产品通过在不同的市场行情下寻找风险可控、收益较高、流动性较好的标的，来持续满足投资者资产保值增值的目的。产品一般为银行精选、投连险以及主要配置债券的公募基金、私募基金与券商集合。'
          },
          {
            title: '进取投资',
            detail: '在稳健收益基础上，为投资者赚取更高回报的理财产品，进取类产品具有高弹性、高增长的特点，但其对应的风险同样较高，需要结合市场行情不断进行优化调整。产品一般为偏股类公募私募基金、券商集合、黄金理财或私募股权基金。'
          }
        ]
      },
      sendReport() {
      },
      modifyBasicInfo() {
        this.$router.push({ path: '/customer/assetAllocate/modifyBasicInfo', query: {from: 'edit'}});
      },
      checkAssetClassifyDetail(){
        this.$router.push({ path: '/customer/assetAllocate/checkAssetClassifyDetail'});
      }
    }

  }
</script>
<style scoped>
  .icon {
    width: 4px;
    height: 20px;
    border-radius: 4px;
    background: #CDA76E;
    margin-right: 8px;
  }
</style>
