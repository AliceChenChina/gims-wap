<template>
  <view-box ref="viewBox" class="noFooter">
    <Header title="新建客户" rightText="保存" :rightAction="save"/>
    <div class="scrollerMain">
      <!-- <tab custom-bar-width="28px">
          <tab-item disabled></tab-item>
          <tab-item :selected="!type ? true : false" @on-item-click="tabClick(0)">个人</tab-item>
          <tab-item :selected="type ? true : false" @on-item-click="tabClick(1)">机构</tab-item>
          <tab-item disabled></tab-item>
      </tab> -->
      <!-- <scroller height='-44' ref='scroller' lock-x :bounce='false'> -->
      <!-- 个人 start -->
      <!-- <div v-if="!type"> -->
      <group class="noBorder">
        <cell title="基础信息" class="title"></cell>
        <x-input title="联系人" text-align="right" placeholder="联系人" v-model="personData.contact" ref='name'
                 :max="20"></x-input>
        <x-input title="联系方式" text-align="right" placeholder="联系方式" v-model="personData.mobilePhone"
                  mask="999 9999 9999" :max="13" ref='phone'></x-input>
        <x-input title="京东用户名" text-align="right" required placeholder="客户用户名，需客户提供(必填)" v-model="personData.pinCode"
                 :max="20" ref="pinCode"></x-input>
        <div class='remark'>注:请客户进入京东金融APP中“我的”页面，点击头像进入个人信息页提供京东用户名。</div>
        <Select title="客户来源" :options="sourceList" required :change="sourceChange" class='lineCell'  value="必填" ref="source"/>
        <x-input title="推荐人京东用户名" text-align="right" required placeholder="需推荐人提供(必填)" v-model="personData.referPin"
                 :max="20" v-if="personData.source === '2'" ref="referPin"></x-input>
        <Select title="性别" :options="sexList" :change="sexChange" class='lineCell' />
        <datetime title="生日" start-date="1910-01-01 "  format="YYYY-MM-DD" :v-model="personData.birthday"
                  @on-change="e => { personData.birthday = e }"></datetime>
        <x-input title="固定电话" text-align="right" placeholder="客户固定电话" v-model='personData.telphone' :max="50"></x-input>
        <x-input title="电子邮箱" text-align="right" placeholder="客户电子邮箱地址" v-model='personData.email' is-type="email"
                 ref='email' :max="100"></x-input>
      </group>
      <group class="noBorder">
        <cell title="证件信息" class="title"></cell>
        <Select title="证件类型" :options="presonCertificateList" :change="identificationChange"/>
        <x-input title="证件号码" text-align="right" placeholder="客户证件号码" v-model="personData.identificationNo"
                 :max="50"></x-input>
        <datetime title="证件有效期开始时间" start-date="1910-01-01" v-model="personData.validateStart"
                  @on-change="e => { personData.validateStart = e }" end-date="2100-01-01"></datetime>
        <datetime title="证件有效期截止时间" start-date="1910-01-01" v-model="personData.validateEnd"
                  @on-change="e => { personData.validateEnd = e }" end-date="2100-01-01"></datetime>
      </group>
      <group class="noBorder">
        <cell title="教育收入" class="title"></cell>
        <Select title="教育程度" :options="eduLevel" :change="eduLevelChange"/>
        <Select title="职业" :options="workIndustry" :change="workIndustryChange" class='lineCell'/>
      </group>
      <group class="noBorder">
        <cell title="地址信息" class="title"></cell>
        <Select title="国籍" :options="country" :change="countryChange"/>
        <x-address title="地区" :list="addressList" :raw-value='true'></x-address>
        <cell title="联系地址"></cell>
        <x-textarea class="noBorder" placeholder="输入客户常用地址" :show-counter="false" :rows="1" autosize
                    v-model="personData.address" :max="100"></x-textarea>
      </group>
      <!-- </div> -->
      <!-- 个人 end -->
      <!-- </scroller> -->
    </div>
  </view-box>
</template>

<script>
  import Header from '@/pages/common/header'
  import Footer from '@/pages/common/footer'
  import Select from '@/pages/common/select'
  // import { ChinaAddressV4Data, Value2nameFilter as value2name } from 'vux'
  import {Value2nameFilter as value2name} from 'vux'
  import address from '@/utils/address.json'
  var lastClick;

  export default {
    name: 'customerAdd',
    components: {
      Header,
      Footer,
      Select
    },
    created() {
      //性别
      this.sexList = this.utils.arg.getSelect("sex");
      //个人证件类型
      this.presonCertificateList = this.utils.arg.getSelect("identity_type_person");
      //教育程度
      this.eduLevel = this.utils.arg.getSelect("edu_level");
      //职业
      this.workIndustry = this.utils.arg.getSelect("work_industry");
      //国籍
      this.country = this.utils.arg.getSelect("country");
      //企业证件类型
      this.orgCertificateList = this.utils.arg.getSelect("identity_type_org");
      //客户来源
      this.sourceList = [{key: '1', value: '自行拓客'}, {key: '2', value: '老客推荐'},{key: '3', value: '公司分配'}];
    },
    data() {
      return {
        //   type: 0,
        preventManySubmit:true,
        sexList: [],
        presonCertificateList: [],
        eduLevel: [],
        workIndustry: [],
        country: [],
        orgCertificateList: [],
        sourceList:[],
        addressList: address,
        personData: {
          userType: 1,//个人客户
          contact: '', //客户姓名
          mobilePhone: '',//手机号
          sex: '',  //性别
          pinCode: '',//京东pin
          birthday: '',  //生日
          telphone: '',  //固定电话
          email: '',  //邮箱
          identification: '', //证件类型
          identificationNo: '',  //证件号
          validateStart: '',//证件有效期开始时间
          validateEnd: '',//证件有效期截止时间
          address: '',//详细地址
          province: '',//省
          city: '',//城市
          area: '',//县
          nationality: '',//国家
          eduLevel: '',//教育程度
          referPin:'',//推荐人京东用户名
          source:'',//客户来源
        },
        formData: {
          sex: '',
          birthday: '',
          certificate: '',
          certificateDate: '',
          city: []
        },
        message:'',
      }
    },
    mounted() {
    },
    methods: {
      // tabClick(type){
      //     this.type = type
      //     this.$refs.scroller.reset({top: 0})
      // },
      //选择性别
      sexChange(code, text) {
        this.personData.sex = code;
      },
      //选择证件类型
      identificationChange(code, text) {
        this.personData.identification = code;
      },
      //教育程度
      eduLevelChange(code, text) {
        this.personData.eduLevel = code;
      },
      //职业
      workIndustryChange(code, text) {
        this.personData.vocation = code;
      },
      //国籍选择
      countryChange(code, text) {
        this.personData.nationality = code;
      },
      //客户来源
      sourceChange(code, text){
        this.personData.source = code;
      },
      //处理地区
      handelAddress(array) {
        let address = $(".vux-popup-picker-value.vux-cell-value").text();
        let addressList = address.split(" ");
        array.province = addressList[0];
        array.city = addressList[1];
        array.area = addressList[2];
      },
      //添加客户
      save() {
        var that = this;
        let noFastClick = this.nofastClick();
        if(noFastClick) {
          let check = this.check();
          if (check) {
              if (this.$refs.email.valid) {
                this.handelAddress(this.personData);
                var param = {
                  pinCode:that.personData.pinCode,
                  contact:that.personData.contact,
                  mobilePhone:that.personData.mobilePhone
                }
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
                    if(!that.preventManySubmit){
                      return false;
                    }
                    that.preventManySubmit = false;
                    that.addCustomer(this.personData);
                  }else if(res.data.data && res.data.data.code === 1103){
                    that.message = res.data.data.message
                    that.$vux.confirm.show({
                      title:'友情提示',
                      confirmText:'确定',
                      cancelText:'取消',
                      content:'<div class="confirm-body"><div class="confirmBody2"><p>'+this.message+'</p></div></div>',
                      onConfirm : () => {
                        that.$vux.confirm.hide();
                        that.addCustomer(this.personData);
                      },
                      onCancel : () => {
                        that.$vux.confirm.hide();
                      },
                    })
                  }else if(res.data.data && res.data.data.code === 1104){
                    that.addCustomer(this.personData);
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
      },
      addCustomer(param){
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
        this.func.ajaxPost(this.api.customer.addCus, param, res => {
          if (res.data.code == '200') {
            that.message = res.data.message
            that.$vux.alert.show({
              title:'友情提示',
              buttonText:'我知道了',
              content:this.message,
              onHide : () => {
                this.$router.go(-1);
              },
            })
          } else {
            this.utils.msg(res.data.message);
          }

          that.preventManySubmit = true;
        }, 'hideLodding')
      },
      check() {
        let checkTrue = false;
        let reg = /^1\d{10}$/;
        // if (!this..name.valid) {
        //   this.utils.msg('姓名不能为空');
        //   return checkTrue;
        // }
        // if (!this.$refs.phone.valid) {
        //   if (this.personData.mobilePhone == '') {
        //     this.utils.msg('手机号码不能为空');
        //   }
        //   return checkTrue;
        // }
        //手机号码去空格
        this.personData.mobilePhone = this.personData.mobilePhone.replace(/\s/g, '');
        if( this.personData.mobilePhone && !reg.test(this.personData.mobilePhone) ){
          this.utils.msg('请输入有效11位手机号码');
          return checkTrue;
        }

        if (!this.$refs.pinCode.valid ) {
          this.utils.msg('京东用户名不能为空！');
          return checkTrue;
        }

        if (this.$refs.source.label === '必填') {
          this.utils.msg('请选择客户来源');
          return checkTrue;
        }else if(this.$refs.source.label === '老客推荐'){
          if (!this.$refs.referPin.valid) {
            this.utils.msg('推荐人京东用户名不能为空！');
            return checkTrue;
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
