<template>
  <view-box ref="viewBox" class="redeemAdd noFooter">
    <Header title="录入信息" rightText="保存" :rightAction="save" />
    <div class="scrollerMain">
      <group class="noBorder">
        <cell title="报单信息" class="title"></cell>  
        <cell title="客户名称" value="杨义强"></cell> 
        <cell title="产品名称" value="XXX产品"></cell> 
        <cell title="报单金额" value="120，000元"></cell> 
        <cell title="报单日期" value="2017-08-24"></cell>
      </group>  
      <group class="noBorder">      
        <cell title="合同信息" class="title"></cell> 
        <cell title="业务类型" value="认购/申购"></cell> 
        <x-input title="合同编号" required placeholder="（必填）"></x-input>
        <x-input title="合同金额（元）" required placeholder="（必填）"></x-input>
        <datetime title="签署日期" v-model="formData.birthday" @on-change="e => { formData.birthday = e }"></datetime>
        <x-input title="信息披露"></x-input>
        <x-input title="认购费（元）"></x-input>
        <x-input title="折扣金额（元）"></x-input>
        <x-input title="折扣费率（%）"></x-input>
        <cell title="备注"></cell>
        <x-textarea class="noBorder" placeholder="请填写备注信息" :show-counter="false" :rows="1" autosize></x-textarea>
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
      <group>      
        <cell title="合同附件"></cell> 
        <div class="attachment">
          <p class="img"></p>
          <p class="tit">
            <span>合同.jpg</span>
            <i>32kb</i>
          </p>
          <p class="file">
            <img src="@/assets/images/file.png">
            <i>1</i>
          </p>
        </div>    
        <cell title="到账附件"></cell> 
        <div class="attachment">
          <p class="img"></p>
          <p class="tit">
            <span>到账.jpg</span>
            <i>32kb</i>
          </p>
          <p class="file">
            <img src="@/assets/images/file.png">
            <i>1</i>
          </p>
        </div>
      </group> 
      <group class="noBorder">      
        <cell title="打款信息" class="title"></cell> 
        <cell title="打款信息">
          <p>
            <b class="red">100,000,000.00</b>
            <span>元</span>
          </p>
        </cell> 
      </group>
    </div>
  </view-box>
</template>

<script>
import Header from '@/pages/common/header'
import Footer from '@/pages/common/footer'
export default {
  name: 'contractAdd',
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
      //保存
      save(){
        let VM = this
        this.$vux.alert.show({
          title: '提示',
          content: '添加成功！',
          onHide(){
            VM.$router.push({path: '/personal/contractAddSuccess'})
          }
        })
      }
    }
  }
  </script>
