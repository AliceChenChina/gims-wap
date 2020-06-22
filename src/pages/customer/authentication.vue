<template>
  <view-box ref="viewBox" class="order">
    <Header title="实名认证申请" />
      <div class="scrollerMain">
        <group class="noBorder">
          <x-input title="客户姓名"  required placeholder="" :value="info.customerName"></x-input>
          <x-input title="手机号码" :value="13532322939" required placeholder=""></x-input>
          <Select title="证件类型" :value="info.identification" :options="certificateList" @change="certificateChange" />
          <x-input title="证件号码" v-model="info.identificationNo" required placeholder=""></x-input>
          <x-input title="年龄" value="35岁" required placeholder=""></x-input>
          <datetime title="证件有效期开始时间" v-model="info.validdateBegin" @on-change="e => { info.validdateBegin = e }"></datetime>
          <datetime title="证件有效期截止时间" v-model="info.validdateEnd" @on-change="e => { info.validdateEnd = e }"></datetime>
          <Select title="银行卡号" :value="formData.certificate" :options="certificateList" @change="certificateChange" />
        </group>

        <group class="noBorder">
          <div class="up-date">
            <div class="risk">
              <img src="@/assets/images/card.png" class="risk-bg" />
              <router-link to="" class="upload">
                <img src="@/assets/images/upload.png" class="add" />
                <p class="add-title">上传证件正面</p>
              </router-link>
            </div>
            <div class="risk">
              <img src="@/assets/images/card_back.png" class="risk-bg" />
              <router-link to="" class="upload">
                <img src="@/assets/images/upload.png" class="add" />
                <p class="add-title">上传证件背面</p>
              </router-link>
            </div>
          </div>
        </group>
      </div>
      <div class="footer-btn">
        <x-button type="warn" class="red" @click.native="save">提交</x-button>
      </div>
  </view-box>
</template>

<script>
import Header from '@/pages/common/header'
import Footer from '@/pages/common/footer'
import Select from '@/pages/common/select'
export default {
  name: 'authentication',
  components: {
    Header,
    Footer,
    Select
  },
  data () {
    return {
      type: this.$route.query.type,
      subTitle: '二级市场',
      certificateList: [{key: '0', value: '身份证'}, {key: '1', value: '军官证'}],
      formData: {
        birthday: '',
        certificate: '',
        certificateDate: ''
      },
      info:{}
    }
  },
  created(){
    //获取实名认证申请信息
    let userId=this.$route.query.customerId;
    this.func.ajaxPost(this.api.customer.GetRealName,{customerId:userId},res=>{
        if (res.data.code === 200) {
          this.info=res.data.data;
        } else {
          this.$message.error(res.data.msg)
        }
    });
  },
  mounted(){},
  methods: {
    //选择证件类型
    certificateChange(value, label){
      this.formData.certificate = label
    },
    //提交
    save(){
      //提交实名认证数据
      this.func.ajaxPost(this.api.SubmitRealName,this.info,res=>{
        if (res.data.code === 200) {
           this.utils.alert('实名认证提交成功，请等待后台审核！', () => this.utils.goBack())
        } else {
          this.$message.error(res.data.msg)
        }
      })
    }
  }
}
</script>
