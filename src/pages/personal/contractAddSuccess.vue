<template>
  <view-box ref="viewBox" class="redeemAdd">
    <Header title="录入成功" preventGoBack :leftAction="goBack" />
    <scroller lock-x height="-96">
      <group class="noBorder">
        <cell title="客户名称" value="杨义强"></cell>
        <cell title="证件号码">
          <p>
            <b class="fz18">410303123456789874</b>
          </p>
        </cell>
        <cell title="手机号" value="13923923942"></cell>
        <cell title="产品名称" value="慧投添益8号66期"></cell>
        <cell title="合同金额">
          <p class="fz18">
            <b class="red">1,675,324,674.00</b>
            <span>元</span>
          </p>
        </cell>
      </group>
    </scroller>
    <div class="footer-btn">
      <x-button type="warn" class="red" link="/personal/contract">提交复核</x-button>
    </div>
  </view-box>
</template>

<script>
import Header from '@/pages/common/header'
import Footer from '@/pages/common/footer'
export default {
  name: 'contractAddSuccess',
  components: {
    Header,
    Footer
  },
  data () {
    return {
      id: this.$route.query.id,
      formData: {
        sex: '',
        birthday: '',
        certificate: '',
        certificateDate: ''
      }
    }
  },
  methods: {
      //跳转路由
      goBack(){
        this.$router.push({path: '/personal/contract'})
      },
      //保存
      save(){
        let VM = this
        this.$vux.alert.show({
          title: '提示',
          content: '添加成功！',
          onHide(){
            VM.$router.go(-1)
          }
        })
      }
    }
  }
  </script>
