<template>
  <view-box ref="viewBox" class="order noFooter">
    <Header title="资产证明" />
      <div class="scrollerMain">
        <group class="noBorder">
          <x-input title="客户姓名" value="沈进" required placeholder=""></x-input>
          <x-input title="手机号码" value="13532322939" required placeholder=""></x-input>
          <x-input title="认证资产" required placeholder="">
            <p slot="right" class="fz18">
              <b>3,202,000.00</b>
              <span>元</span>
            </p>
          </x-input>
          <datetime title="资产有效期开始时间" v-model="formData.certificateDate" @on-change="e => { formData.certificateDate = e }"></datetime>
          <datetime title="资产有效期截止时间" v-model="formData.certificateDate" @on-change="e => { formData.certificateDate = e }"></datetime>
          <x-switch title="长期有效" :value="true"></x-switch>
        </group>

        <group class="noBorder">
          <div class="up-date">
            <div class="risk">
              <p class="risk-bg">
                <img src="@/assets/images/bank.png" class="risk-bg" />
                <span class="close">X</span>
              </p>
            </div>
            <div class="risk">
              <img src="@/assets/images/k_zm copy.png" class="risk-bg" />
              <router-link to="" class="upload">
                <img src="@/assets/images/upload.png" class="add" />
                <p class="add-title">上传资产证明文件</p>
              </router-link>
            </div>
          </div>
          <div class="bank-demo">
            <div class="nav-btn">
                <x-button type="warn" link="/customer">确认并上传</x-button>
            </div>
            <p class="desc">
              可上传银行存款、股票、债券、基金份额、资产管理计划、银行理财产品、信托计划、保险产品、期货权益等证明，
              资产证明综合>=300万元。或者上传近三年均收入不低于30万收入证明。
            </p>
            <p class="img">
              <img src="@/assets/images/bank_demo.png">
            </p>
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
  name: 'asset',
  components: {
    Header,
    Footer,
    Select
  },
  created(){
    let userId=this.$route.query.customerId;
    this.func.ajaxPost(this.api.customer.GetAssetCertificate, {customerId:userId}, res => {
        if (res.data.code === 200) {
           this.info=res.data.data;
        } else {
          this.$message.error(res.data.msg)
        }
    })
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
      },
      info:{}, //资产证明数据
    }
  },
  mounted(){},
  methods: {
    //选择证件类型
    certificateChange(value, label){
      this.formData.certificate = label
    },
    //提交
    save(){
      this.utils.alert('实名认证提交成功，请等待后台审核！', () => this.utils.goBack())
    }
  }
}
</script>
<style>
.weui-cell__bd{
  display: flex;
  align-items: center;
}
</style>

