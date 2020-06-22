<template>
  <view-box ref="viewBox" class="noFooter customerInfo">
    <Header v-if="!editCustomerPower" title="基础信息" />
    <Header v-if="editCustomerPower" title="基础信息" rightText="保存" :rightAction="save" />
    <scroller lock-x height="-44" :bounce="false">
      <div>
        <group class="noBorder">
          <cell title="基础信息"  class='title'></cell>
          <x-input title="客户姓名" text-align="right" v-model="formData.trueName" readonly v-if="formData.trueName"></x-input>
          <x-input title="联系人" text-align="right" placeholder="联系人" v-model="formData.contact" ref='name'
                   :max="20"></x-input>
          <x-input title="联系方式" text-align="right" placeholder="联系方式" v-model="formData.mobilePhone"  mask="999 9999 9999" :max="13" ref='phone'></x-input>
          <x-input title="京东用户名" text-align="right"  :placeholder="pinCodePlaceholder" v-model="formData.pinCode" :required='fromCustomerCertification' :readonly="!!pinCode" ref="pinCode"></x-input>
          <div class='remark'>注:请客户进入京东金融APP中“我的”页面，点击头像进入个人信息页提供京东用户名。</div>
          <Select title="客户来源" :options="sourceList" required :change="sourceChange" class='lineCell'  :value='sourceText' ref="source"  v-if="!pinCode"/>
          <x-input title="客户来源" text-align="right"  v-model="sourceText" :readonly="!!pinCode" v-if="!!pinCode" ref="source" ></x-input>
          <x-input title="推荐人京东用户名" text-align="right" required placeholder="需推荐人提供(必填)" v-model="formData.referPin"
                   :max="20" v-if="formData.source === '2'" ref="referPin" :readonly="!!pinCode"></x-input>
          <x-input title="关联关系" text-align="right"  v-model="relationship" readonly ></x-input>
          <Select title="性别"  :options="sexList"  :change="sexChange" class='lineCell' :value='sexText'/>
          <datetime title="客户生日" v-model="formData.birthday" @on-change="e => { formData.birthday = e }" start-date="1910-01-01" end-date='2100-01-01'></datetime>
          <x-input title="固定电话" v-model="formData.telphone"></x-input>
          <x-input title="电子邮箱" text-align="right"  placeholder="客户电子邮箱地址" v-model='formData.email' is-type="email" ref='email'></x-input>
        </group>
        <group class="noBorder">
          <cell title="证件信息" class="title"></cell>
          <Select title="证件类型"  :options="presonCertificateList" :change="identificationChange" :value='identificationText'/>
          <x-input title="证件号码" text-align="right" required placeholder="客户证件号码" v-model="formData.identificationNo"></x-input>
          <datetime title="证件有效期开始时间" v-model="formData.validateStart" @on-change="e => { formData.validateStart = e }" start-date="1910-01-01" end-date='2100-01-01'></datetime>
          <datetime title="证件有效期截止时间" v-model="formData.validateEnd" @on-change="e => { formData.validateEnd = e }" start-date="1910-01-01" end-date='2100-01-01'></datetime>
        </group>
        <group class="noBorder">
          <cell title="教育收入" class="title"></cell>
          <Select title="教育程度"  :options="eduLevel" :change="eduLevelChange" :value='eduLevelText'/>
          <Select title="职业"  :options="workIndustry" :change="workIndustryChange"  class='lineCell' :value='vocationText'/>
        </group>
        <group class="noBorder">
          <cell title="地址信息" class="title"></cell>
          <Select title="国籍"  :options="country" :change="countryChange" :value='nationalityText'/>
          <x-address title="地区" :list="addressData" :raw-value='true' v-model="address"></x-address>
          <cell title="联系地址"></cell>
          <x-textarea class="noBorder addressHeight" placeholder="输入客户常用地址" :show-counter="false" :max="200"  :rows="4"  v-model="formData.address" ></x-textarea>
        </group>
      </div>
    </scroller>
  </view-box>
</template>

<script>
import Header from '@/pages/common/header'
import Footer from '@/pages/common/footer'
import Select from '@/pages/common/select'
import address from '@/utils/address.json'
var lastClick;
import {Value2nameFilter as value2name } from 'vux'
export default {
  name: 'customerInfo',
  components: {
    Header,
    Footer,
    Select
  },
  data () {
    return {
      formData:{},
      id: this.$route.query.id,
      addressData: address,
      address:[],//地区
      sexText:'',  //姓名
      identificationText:'',//证件类型
      eduLevelText:'',//教育程度
      vocationText:'',//职业
      nationalityText:'',//国籍
      sourceText:'',//客户来源
      fromCustomerCertification:false,
      pinCodePlaceholder:'客户用户名，需客户提供(选填)',
      pinCode:'',
      checkPinCode:'',
      relationship:'--',
      editCustomerPower: this.utils.userInfo.checkUserPowerKey(this.powerKey.editCustomerKey) // 编辑客户的权限
    }
  },
  beforeRouteEnter(to,from,next){
    next(vm=>{
       if(from.name=="customerCertification"){
          vm.fromCustomerCertification=true;
          vm.pinCodePlaceholder='客户用户名，需客户提供(必填)'
       }
    })
  },

  created(){
    //性别
   this.sexList=this.utils.arg.getSelect("sex");
    //个人证件类型
   this.presonCertificateList=this.utils.arg.getSelect("identity_type_person");
   //教育程度
   this.eduLevel=this.utils.arg.getSelect("edu_level");
   console.log('this.eduLevel', this.eduLevel);
   //职业
   this.workIndustry=this.utils.arg.getSelect("work_industry");
   //国籍
   this.country=this.utils.arg.getSelect("country");
   //客户来源
    this.sourceList = [{key: '1', value: '自行拓客'}, {key: '2', value: '老客推荐'},{key: '3', value: '公司分配'}];
   //获取数据
   this.func.ajaxPost(this.api.customer.Info, {id:this.id}, res => {
        if (res.data.code === 200) {
          let data=res.data.data;
          this.pinCode = data.pinCode;
          this.checkPinCode = data.pinCode;
          this.sexText=this.utils.arg.getText('sex',data.sex,true); //性别名字
          this.identificationText=this.utils.arg.getText('identity_type_person',data.identification,true); //证件类型
          this.eduLevelText=this.utils.arg.getText('edu_level',data.eduLevel,true); //教育唱歌播放电影
          this.vocationText=this.utils.arg.getText('work_industry',data.vocation,true);//职业
          this.nationalityText=this.utils.arg.getText('country',data.nationality,true);//国籍
            if(!data.source){
              this.sourceText = '必填';
            }else{
              data.source = data.source + '';
              if(data.source === '1'){
                this.sourceText = '自行拓客';
              }else if(data.source === '2'){
                this.sourceText = '老客推荐';
              }else if(data.source === '3'){
                this.sourceText = '公司分配';
              }
            }

          if(data.province){
            this.address.push(data.province);
          }
          if(data.city){
            this.address.push(data.city);
          }
          if(data.area){
            this.address.push(data.area);
          }
          this.formData=data;
          this.formData.pinCode = data.pinCode ? data.pinCode : '';
          this.formData.contact = data.oriContact ? data.oriContact : '';
          this.formData.mobilePhone = data.mobilePhone ? data.mobilePhone : '';
          this.formData.referPin = data.referPin ? data.referPin : '';
          this.formData.address = data.address ? data.address : '';
          this.formData.telphone = data.telphone ? data.telphone : '';
          this.formData.email = data.email ? data.email : '';
          this.formData.identificationNo = data.identificationNo ? data.identificationNo : '';
          this.relationship = this.formData.relaAuth === 0 ? '相关' : this.formData.relaAuth === 1 ? '绑定' : this.formData.relaAuth === 2 ? '专属' : '--'
            if( this.formData.birthday && this.formData.birthday.indexOf(' 00:00:00')=== 10){
              this.formData.birthday =  this.formData.birthday.substring(0,10);
            }
          if( this.formData.validateStart && this.formData.validateStart.indexOf(' 00:00:00')=== 10){
            this.formData.validateStart =  this.formData.validateStart.substring(0,10);
          }
          if( this.formData.validateEnd && this.formData.validateEnd.indexOf(' 00:00:00')=== 10){
            this.formData.validateEnd =  this.formData.validateEnd.substring(0,10);
          }
        } else {
          this.utils.msg(res.data.message);
        }
      })
  },
  methods: {
      //选择性别
      sexChange(code, text){
        this.formData.sex = code;
      },
      //选择证件类型
      identificationChange(code, text){
          this.formData.identification = code;
      },
      //教育程度
      eduLevelChange(code, text){
          this.formData.eduLevel = code;
      },
      //职业
      workIndustryChange(code,text){
          this.formData.vocation= code;
      },
      //国籍选择
      countryChange(code,text){
          this.formData.nationality=code;
      },
    //客户来源
    sourceChange(code, text){

      this.formData.source = code;
    },
      //处理地区
      handelAddress(array){
          let address=$(".vux-popup-picker-value.vux-cell-value").text();
          let addressList=address.split(" ");
          array.province=addressList[0];
          array.city=addressList[1];
          array.area=addressList[2];
      },
    //编辑客户
    save() {
      var that = this;
      let noFastClick = this.nofastClick();
      if(noFastClick) {
        let check = this.check();
        if (check) {
          if (this.$refs.email.valid) {
            this.handelAddress(this.formData);
            var param = {
              pinCode:that.formData.pinCode,
              contact:that.formData.contact,
              mobilePhone:that.formData.mobilePhone,
              id: that.id
            }
              if(that.checkPinCode){
                this.func.ajaxPost(this.api.customer.preposeEdit, param, res => {
                  if(res.status !== 200){
                    this.utils.msg(res.statusText);
                    return false;
                  }
                  if(res.data.code !== 200){
                    this.utils.msg(res.data.message);
                    return false;
                  }
                  if(res.data.data && res.data.data.code === 0){
                    that.editCustomer(that.formData);
                  }else if(res.data.data && res.data.data.code === 1103){
                    that.message = res.data.data.message
                    that.$vux.confirm.show({
                      title:'友情提示',
                      confirmText:'确定',
                      cancelText:'取消',
                      content:'<div class="confirm-body"><div class="confirmBody2"><p>'+this.message+'</p></div></div>',
                      onConfirm : () => {
                        that.$vux.confirm.hide();
                        that.editCustomer(that.formData);
                      },
                      onCancel : () => {
                        that.$vux.confirm.hide();
                      },
                    })
                  }else{
                    that.message = res.data.data.message
                    that.$vux.alert.show({
                      title:'友情提示',
                      buttonText:'我知道了',
                      content:this.message,
                    })
                  }
                }, 'hideLodding')
              }else{
                this.func.ajaxPost(this.api.customer.verifyCustomer, param, res => {
                  if(res.status !== 200){
                    this.utils.msg(res.statusText);
                    return false;
                  }
                  if(res.data.code !== 200){
                    this.utils.msg(res.data.message);
                    return false;
                  }
                  if(res.data.data && res.data.data.code === 0){
                    that.editCustomer(this.formData);
                  }else if(res.data.data && res.data.data.code === 1103){
                    that.message = res.data.data.message
                    that.$vux.confirm.show({
                      title:'友情提示',
                      confirmText:'确定',
                      cancelText:'取消',
                      content:'<div class="confirm-body"><div class="confirmBody2"><p>'+this.message+'</p></div></div>',
                      onConfirm : () => {
                        that.$vux.confirm.hide();
                        that.editCustomer(that.formData);
                      },
                      onCancel : () => {
                        that.$vux.confirm.hide();
                      },
                    })
                  }else if(res.data.data && res.data.data.code === 1104){
                    that.message = res.data.data.message;
                    that.$vux.alert.show({
                      title:'友情提示',
                      buttonText:'确定',
                      content:this.message,
                      onHide: () => {
                        that.$vux.alert.hide();
                        that.editCustomer(that.formData);
                      },
                    })
                  }else{
                    that.message = res.data.data.message
                    that.$vux.alert.show({
                      title:'友情提示',
                      buttonText:'我知道了',
                      content:this.message,
                    })
                  }
                }, 'hideLodding')

              }
          }
        }
      }
    },
    editCustomer(param){
        var that = this;
      param.mobilePhone = param.mobilePhone.replace(/\s/g, '');
      if(param.birthday && param.birthday.indexOf(' 00:00:00')==-1){
        param.birthday = param.birthday + ' 00:00:00'
      }
      if(param.validateStart && param.validateStart.indexOf(' 00:00:00')==-1){
        param.validateStart = param.validateStart + ' 00:00:00'
      }
      if(param.validateEnd && param.validateEnd.indexOf(' 00:00:00')==-1){
        param.validateEnd = param.validateEnd + ' 00:00:00'
      }
      this.func.ajaxPost(that.api.customer.EditCus, param, res => {

        if (res.data.code == '200') {
          that.$vux.toast.text('编辑成功', 'middle')
          that.$router.go(-1);
        } else {
          that.utils.msg(res.data.message);
        }
      }, 'hideLodding')
    },
      check(){
        let checkTrue = false;
        let reg = /^1\d{10}$/;
        // if (!this.$refs.name.valid) {
        //   this.utils.msg('姓名不能为空');
        //   return checkTrue;
        // }
        // if (!this.$refs.phone.valid) {
        //   if (this.formData.mobilePhone == '') {
        //     this.utils.msg('手机号码不能为空');
        //   }
        //   return checkTrue;
        // }
        //手机号码去空格
        this.formData.mobilePhone = this.formData.mobilePhone.replace(/\s/g, '');
        if( this.formData.mobilePhone && !reg.test(this.formData.mobilePhone) ){
          this.utils.msg('请输入有效11位手机号码');
          return checkTrue;
        }
        if(!this.formData.pinCode){
            this.utils.msg('京东用户名不能为空！');
            return checkTrue;
        }
        if(this.$refs.source){
          if (this.$refs.source.label === '必填') {
            this.utils.msg('请选择客户来源');
            return checkTrue;
          }else if(this.$refs.source.label === '老客推荐'){
            if (!this.$refs.referPin.valid) {
              this.utils.msg('推荐人京东用户名不能为空！');
              return checkTrue;
            }
          }
        }

        if (!this.$refs.email.valid) {
          this.utils.msg('邮箱格式不正确');
          return checkTrue;
        }
        checkTrue = true;
        return checkTrue;
      },
    //判断是否是快速点击
    nofastClick(){
      var nowClick = new Date();
      if (lastClick === undefined) {
        lastClick = nowClick;
        return true;
      } else {
        if (Math.round((nowClick.getTime() - lastClick.getTime())) > 1000) {
          lastClick = nowClick;
          return true;
        }
        else {
          lastClick = nowClick;
          return false
        }
      }
    },
    }
  }
  </script>


