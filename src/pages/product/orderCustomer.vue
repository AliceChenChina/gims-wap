<template>
  <view-box ref="viewBox" class="order noFooter">
    <Header title="客户信息" />
    <div class="scrollerMain">
        <group class="noBorder">
          <cell title="投资者身份" is-link link="">
            <span class="red">去认证</span>
          </cell>
          <cell title="风险特征匹配" is-link link="">
            <span class="red">去风测</span>
          </cell>
          <cell title="资产证明" is-link link="">
            <span class="red">去提交</span>
          </cell>
          <Select title="证件类型" :value="formData.certificate" :options="certificateList" @change="certificateChange" />
          <x-input title="证件号码" value="410622198007181032" text-align="right" required placeholder="客户证件号码"></x-input>
          <datetime title="证件有效期开始时间" v-model="formData.certificateDate" @on-change="e => { formData.certificateDate = e }"></datetime>
          <datetime title="证件有效期截止时间" v-model="formData.certificateDate" @on-change="e => { formData.certificateDate = e }"></datetime>
        </group>
        <div class="identification">
          <router-link to="">
            <img src="@/assets/images/identification.png" />
          </router-link>
          <router-link to="">
            <img src="@/assets/images/identification_back.png" />
          </router-link>
        </div>
        <group class="noBorder">
          <div class="btn orderCustomer">
            <x-button type="warn" link="/product/orderRisk">下一步</x-button>
          </div>
        </group>
      </div>
  </view-box>
</template>

<script>
import Header from '@/pages/common/header'
import Footer from '@/pages/common/footer'
import Select from '@/pages/common/select'
export default {
  name: 'orderCustomer',
  components: {
    Header,
    Footer,
    Select
  },
  data () {
    return {
      type: this.$route.query.type,
      subTitle: '二级市场',
      certificateList: [{key: '1', value: '身份证'}, {key: '2', value: '军官证'}],
      formData: {
        birthday: '',
        certificate: '',
        certificateDate: ''
      }
    }
  },
  mounted(){},
  methods: {
    //选择证件类型
    certificateChange(value, label){
      this.formData.certificate = label
    }
  }
}
</script>
