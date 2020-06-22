<template>
  <view-box ref="viewBox" class="redeemAdd noFooter">
    <Header title="新建赎回" rightText="保存" :rightAction="save" />
    <div class="scrollerMain">
      <group class="noBorder">
        <cell title="客户信息" class="title"></cell>
        <cell title="客户名称" value="杨义强"></cell>
        <cell title="证件类型" value="身份证"></cell>
        <cell title="证件号码" value="4103031234567897894253"></cell>
        <cell title="证件有效期" value="2017-08-24 - 2027-10-24"></cell>
      </group>
      <group class="noBorder">
        <cell title="申请信息" class="title"></cell>
        <cell title="产品名称" value="慧投添益88号6期"></cell>
        <cell title="合同编号" is-link link=""></cell>
        <datetime title="签署日期" v-model="formData.birthday" @on-change="e => { formData.birthday = e }"></datetime>
        <x-switch title="是否全部赎回" :value="true"></x-switch>
        <x-input title="赎回份额（份）" text-align="right" required placeholder="（必填）"></x-input>
        <cell title="赎回份额大写"></cell>
        <Select title="巨额赎回处理方式" :value="formData.sex" :options="sexList" @change="sexChange" />
      </group>
      <group class="noBorder">
        <cell title="利益收付账户" class="title"></cell>
        <x-input title="开户行" text-align="right" required placeholder="（必填）"></x-input>
        <x-input title="开户支行" text-align="right" value="凯旋路支行"></x-input>
        <x-input title="开户名称" text-align="right" value="张三"></x-input>
        <x-input title="开户账号" text-align="right" value="62 1154 5431 2345 6453 1313"></x-input>
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
      <group class="noBorder">
        <cell title="附件" class="title"></cell>
        <div class="attachment">
          <p class="img"></p>
          <p class="tit">
            <span>身份证.jpg</span>
            <i>32kb</i>
          </p>
          <p class="img"></p>
          <p class="tit">
            <span>身份证.jpg</span>
            <i>32kb</i>
          </p>
          <p class="file">
            <img src="@/assets/images/file.png">
            <i>2</i>
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
  name: 'redeemAdd',
  components: {
    Header,
    Footer,
    Select
  },
  data () {
    return {
      id: this.$route.query.id,
      sexList: [{key: '1', value: '男'}, {key: '2', value: '女'}],
      formData: {
        sex: '',
        birthday: '',
        certificate: '',
        certificateDate: '',
        city: []
      }
    }
  },
  methods: {
      //选择性别
      sexChange(value, label){
        this.formData.sex = label
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
