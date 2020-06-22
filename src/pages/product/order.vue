<template>
  <view-box ref="viewBox" class="order noFooter">
    <Header mainTitle="产品报单" :subTitle='productDetail.productNameShort'/>
    <div class="infoHeader" v-if="isProxy == 1">
      <div>· 请在客户线上下单的3个自然日内（含下单日当天）完成报单，否则无法计入业绩。</div>
    </div>
    <div class='orderDiv'>
      <group class="noBorder selectUser">
        <cell :title="customerDetail.customerName?customerDetail.customerName:'选择客户'" is-link :link="{path: '/customer',query:{isOnlyList:true}}" :inline-desc="customerDetail.pinCode?'京东用户名:'+customerDetail.pinCode:''">
          <img slot='icon' src='@/assets/images/user.png'/>
        </cell>
      </group>
      <div class="tenHeight"></div>
      <group class="noBorder">
        <Select title="客户来源" :options="customerFromList" :value="customerFromText" class="customerFromLt" :pleaseChooseShow='true' :change="customerFromChange" v-if="!controlShow">
        </Select>
        <x-input title="客户来源" text-align="right"  v-model="customerFromText" :readonly="!!controlShow" v-if="!!controlShow"></x-input>
        <x-input title="推荐人京东用户名" text-align="right" placeholder="需推荐人提供(必填)" v-model="referPin"
                 :max="20"   v-if="customerFrom === '2'" :readonly="!!controlShowPin"></x-input>
      </group>
      <div class="tenHeight"></div>
      <group class="noBorder realNameCertify">
        <cell title="实名认证" :class='data.realNameInfo.class'>{{data.realNameInfo.status}}</cell>
        <cell title="风险等级" :class='data.riskSurveyInfo.class'>{{data.riskSurveyInfo.status}}</cell>
      </group>
      <div class="certification">
        <div class="certification_title">
          资产证明
        </div>
        <div class="clear" >
          <span class="fl">私募资产证明</span><span class="fr" :class='data.privateInfo.class'>{{data.privateInfo.status}}</span>
        </div>
        <div class="clear">
          <span class="fl">资管资产证明</span><span class="fr" :class='data.assetInfo.class'>{{data.assetInfo.status}}</span>
        </div>
        <div class="orangeColor">
          {{attention}}
        </div>
        <div class="line" v-if="remark1 || remark2"></div>
        <!--        <div class="remark colorRed" id="remark1">-->
        <!--          {{remark1}}-->
        <!--        </div>-->
        <!--        <div class="remark" id="remark2">myDeclarationList-->
        <!--          {{remark2}}-->
        <!--        </div>-->
        <!--        <div class='imgWrapper'>-->
        <!--          <img src="../../../static/img/eqcode.png" alt="">-->
        <!--        </div>-->
      </div>
      <div class="showImg">
        <div>{{remark1}}</div>
        <div>{{remark2}}</div>
        <div class='imgWrapper'>
          <img src="../../../static/img/eqcode.png" alt="">
        </div>
      </div>
    </div>
    <div class="btnWrapper">
      <x-button  class="grizzle next" @click.native="nextStep">下一步</x-button>
    </div>
  </view-box>
</template>

<script>
  import Header from '@/pages/common/header'
  import Footer from '@/pages/common/footer'
  import Select from '@/pages/common/select'
  export default {
    name: 'order',
    components: {
      Header,
      Footer,
      Select
    },
    data () {
      return {
        isRss:this.$route.params.isRss,
        productStatus:this.$route.params.productStatus,
        type:this.$store.state.orderDetail.type, //产品的类型
        isProxy:this.$store.state.orderDetail.productDetail.isProxy, //是否代销
        productDetail:this.$store.state.orderDetail.productDetail,//产品明细
        customerDetail:this.$store.state.orderDetail.customerDetail,//客户明细
        customerFromText:this.utils.arg.getText('source_type',this.$store.state.orderRss.customerFrom,true),//客户来源
        customerFrom:this.$store.state.orderRss.customerFrom,
        customerFromList:this.utils.arg.getSelect("source_type"),//客户来源选项框
        referPin:this.$store.state.orderRss.referPin,
        controlShow:true,
        controlShowPin:true,
        attention:'',
        checkUserDeclaration: true,
        //后台返回的信息
        data:{
          realNameInfo:{   //实名信息
            status:'未实名',
            class:'noSubmitColor',
          },
          riskSurveyInfo:{  //风险测评
            status:'未测评',
            class:'noSubmitColor',
          },
          assetInfo: {
            status:'未认证',
            class:'noSubmitColor',
          },
          privateInfo: {
            status:'未认证',
            class:'noSubmitColor',
          }
        },
        remark1:'',
        remark2:'',
        isNextFormAjax:false, //是否进入下一步
      }
    },
    beforeRouteLeave(to,from,next){
      if(to.name=='customer'){
        this.$store.commit('changeOrderDetail',{productDetail:this.productDetail,customerDetail:this.customerDetail,type:this.type});
      }else if(to.name=='productList'){
        this.$store.commit('changeOrderDetail',{});
        this.$store.commit('orderRss',{});
      }
      next();
    },
    created(){
      console.log('this.isProxy', this.isProxy);
      //根据pincode查询实名,风测, 资产证明
      if(this.customerDetail.pinCode){
        this.func.ajaxPost(this.api.customer.getCustomerComplianceInfo, {customerId:this.customerDetail.customerId}, res => {
          if (res.data.code == 200) {
            if (!res.data.data) {
              this.utils.msg(res.data.message);
              return false;
            }
            let data=res.data.data.complianceInfo;
            this.cusLevel=data.riskSurveyInfo.riskLevel;
            this.cusLevelName=data.riskSurveyInfo.riskLevelName;
            //处理数据,将后台返回的数据变成渲染到页面的数据和class
            this.handelData(data);
            //处理dom，处理页面dom的显示和隐藏问题
            this.handelDom(data);
          }
        })
        this.func.ajaxPost(this.api.customer.checkUserDeclaration, {customerId:this.customerDetail.customerId}, res => {
          if (res.data.code == 200) {
            const data = res.data.data;
            if (data.code === 0) {
              this.checkUserDeclaration = true;
            }else {
              this.checkUserDeclaration = false;
              this.utils.msg(data.message);
            }
          }
        })
      }
      if(!this.isRss){
        if(this.customerFrom === '1' || this.customerFrom === '2' || this.customerFrom === '3'){
          this.controlShow = true;
          if(this.referPin){
            this.controlShowPin = true;
          }else{
            this.controlShowPin = false;
          }
        }else{
          this.referPin = '';
          this.controlShow = false;
          this.controlShowPin = false;
        }
      }else{
        this.controlShow = false;
        this.controlShowPin = false;
      }
    },
    methods: {
      //客户来源选择
      customerFromChange(code,text){
        this.customerFrom=code;
        this.customerFromText = this.utils.arg.getText('source_type',code,true)
        this.$store.commit("changeOrderRss",{customerFrom:code});
        //判断下一步是否可以亮起
        if(this.isNextFormAjax&&this.customerFrom && this.checkUserDeclaration){
          $('.next').removeClass("grizzle");
          $('.next').addClass("correctBtn");
        }
      },
      //报单时检查用户是不是已经有绑定理财师了
      checkPlannerCustomer(param){
        let vm=this;
        vm.func.ajaxPost(vm.api.customer.checkPlannerCustomer,param,res=>{
          if(res.data.code==200){
            this.$router.push({name:'orderRss',params:{productStatus:this.productStatus}})
          }else{
            vm.$vux.toast.show({
              text:res.data.message,
              type:'warn'
            })
          }
        })
      },
      nextStep(){
        if(!this.checkUserDeclaration){
          return false;
        }
        //下一步的操作
        if(!this.customerFrom){
          this.utils.msg("请选择客户来源！");
          return false;
        }
        if(this.isNextFormAjax&&this.customerFrom){
          if(this.customerFrom === '2'){
            if(!this.referPin){
              this.utils.msg("请填写推荐人京东用户名！");
              return false;
            }
          }else{
            this.referPin = ''
          }
          this.$store.commit("changeOrderRss",{referPin:this.referPin});
          let proLevel=this.proRiskLevelCode;
          let cusLevel=this.cusLevel;
          if(proLevel>cusLevel){
            //上传资产证明页面
            this.$store.commit('changeOrderRss',{"cusLevelName":this.cusLevelName})
            this.$router.push({name:'orderRisk'})
          }else{
            let  param = {
              customerId:this.customerDetail.customerId,
              contact:this.customerDetail.customerName
            }
            this.checkPlannerCustomer(param)
          }
        }
      },
      //处理数据,将后台返回的数据变成渲染到页面的数据和class
      handelData(data){
        this.cusLevel=data.riskSurveyInfo.riskLevel;
        this.cusLevelName=data.riskSurveyInfo.riskLevelName;
        let status_realNameInfo=data.realNameInfo.status;
        if(status_realNameInfo==0){
          this.data.realNameInfo.status='未认证';
          this.data.realNameInfo.class='noSubmitColor';
        }else if(status_realNameInfo==1){
          this.data.realNameInfo.status='已认证';
          this.data.realNameInfo.class='submitColor';
        }else if(status_realNameInfo==2){
          this.data.realNameInfo.status='认证错误';
          this.data.realNameInfo.class='noSubmitColor';
        }
        //风险等级
        let status_riskSurveyInfo=data.riskSurveyInfo.status;
        if(status_riskSurveyInfo==0){
          this.data.riskSurveyInfo.status= '未测评';
          this.data.riskSurveyInfo.class= 'noSubmitColor';
        }else{
          this.data.riskSurveyInfo.status=data.riskSurveyInfo.riskLevelName;
          this.data.riskSurveyInfo.class= 'submitColor';
        }
        //资产证明
        this.data.assetInfo.status = data.assetProofInfo.assetStatusStr ? data.assetProofInfo.assetStatusStr : '未认证';
        if (this.data.assetInfo.status === '未认证') {
          this.data.assetInfo.class= 'noSubmitColor';
        }
        if (this.data.assetInfo.status === '已认证' || this.data.assetInfo.status === '已过期') {
          this.data.assetInfo.class= 'submitColor';
        }
        if ( this.isProxy != 1 && this.productDetail.assetCertificateLevel === 2 && this.data.assetInfo.status === '未认证') {
          this.attention = '报单此产品需通过资管资产证明，请上传相应资产证明!'
        }
        if ( this.isProxy != 1 && this.productDetail.assetCertificateLevel === 2 && this.data.assetInfo.status === '已过期') {
          this.attention = '客户的资管资产证明已过期，请重新上传相应资产证明！'
        }
        this.data.privateInfo.status = data.assetProofInfo.privateStatusStr ? data.assetProofInfo.privateStatusStr : '未认证';
        if (this.data.privateInfo.status === '未认证') {
          this.data.privateInfo.class= 'noSubmitColor';
        }
        if (this.data.privateInfo.status === '已认证' || this.data.privateInfo.status === '已过期') {
          this.data.privateInfo.class= 'submitColor';
        }
        if ( this.isProxy != 1 && this.productDetail.assetCertificateLevel === 1 && this.data.privateInfo.status === '未认证') {
          this.attention = '报单此产品需通过私募资产证明，请上传相应资产证明！'
        }
        if ( this.isProxy != 1 && this.productDetail.assetCertificateLevel === 1 && this.data.privateInfo.status === '已过期') {
          this.attention = '客户的私募资产证明已过期，请重新上传相应资产证明！'
        }
      },
      //处理dom，处理页面dom的显示和隐藏问题
      handelDom(data){
        if(data.realNameInfo.status==2){
          this.remark1='注：该客户实名认证结果有误，请检查京东用户名是否输入正确';
        }else{
          if (this.isProxy != 1){
            // 直销
            if(!data.riskSurveyInfo.status||!data.realNameInfo.status || (this.productDetail.assetCertificateLevel === 1 && this.data.privateInfo.status !== '已认证') || (this.productDetail.assetCertificateLevel === 2 && this.data.assetInfo.status !== '已认证')) {
              $(".imgWrapper").css('visibility','visible');
              this.remark2='请将以下京东金融APP二维码分享给客户，完成以上所需合规认证项';
              return false;
            }
          }else{
            // 代销
            if(!data.riskSurveyInfo.status||!data.realNameInfo.status){
              $(".imgWrapper").css('visibility','visible');
              this.remark2='请将以下京东金融APP二维码分享给客户，完成以上所需合规认证项';
              return false;
            }
          }
          let cusLevel=data.riskSurveyInfo.riskLevel;
          if(cusLevel==1){
            $(".imgWrapper").css('visibility','visible');
            this.remark1='注：预约该产品需客户风险等级高于保守型，当前客户风险等级较低';
            this.remark2='请将以下京东金融APP二维码分享给客户，完成以上所需合规认证项';
          }else{
            this.isNextFormAjax=true;
            if(this.$store.state.orderRss.customerFrom && this.checkUserDeclaration ){
              $('.next').removeClass("grizzle");
              $('.next').addClass("correctBtn");
            }
          }
        }
      }
    }
  }
</script>

<style scoped>
  .orderDiv{
    background: white;
    height: 100%;
    position: relative;
  }

  .order{
    position: relative;
  }

  .order .imgWrapper{
    text-align: center;
    margin: 14px 0px 44px 0px;
    visibility: hidden;
  }
  .order .imgWrapper img{
    height: 100%;
  }


  .order>>>.vux-header .vux-header-left .left-arrow{
    top:9px;
  }

  .order>>>.weui-tab__panel{
    padding-top: 60px!important;
  }

  .customerFromList >>>.vux-label{
    font-size: 16px;
    color: #303030;
    font-weight:600;
  }

  .selectUser>>>.weui-cells .vux-cell-primary .vux-label{
    font-size: 18px;
    font-weight: 600;
    color: #333;
  }

  .selectUser>>>.weui-cells .vux-cell-primary .vux-label-desc{
    color: #999;
  }

  .selectUser>>>.weui-cell__hd img{
    width: 50px!important;
    height: 50px!important;
  }

  .btnWrapper{
    position: absolute;
    bottom: 0px;
    width: 100%;
    padding: 0px;
  }


  .btnWrapper .weui-btn{
    border-radius: 0px;
    padding: 0px;
    height: 50px;
  }

  .btnWrapper .weui-btn:after{
    border-radius: 0px;
  }

  .rightRed .weui-cell__ft{
    color: #EB5954!important;
  }

  .rightGray .weui-cell__ft{
    color: #999999!important;
  }

  .correctBtn{
    background: #505269!important;
    color: white!important;
  }

  .grizzle{
    color: white!important;
    background: #DCDCE1!important;
  }

  .tenHeight{
    height: 10px;
    background: #fafafa;
  }
  .order .infoHeader {
    width: 100%;
    background-color: #EA7C31;
    color:#FFFFFF;
    padding-left: 15px;
    padding-right: 10px;
    font-size: 12px;
    padding-top: 5px;
    -webkit-text-size-adjust: none;
  }
  .order .infoHeader div{
    line-height: 18px;
    width: 111%;
    font-size: 12px;
    transform: scale(0.9);
    -webkit-transform: scale(0.9);     /* for Chrome || Safari */
    -moz-transform: scale(0.9);        /* for Firefox */
    -ms-transform: scale(0.9);         /* for IE */
    -o-transform: scale(0.9);
    transform-origin: top left;
    -webkit-text-size-adjust: none;
  }
  .order>>> #vux_view_box_body .detailsHeader .vux-header:after {
    height: 0px;
  }
  .certification, .showImg {
    padding-left: 15px;
    padding-right: 15px;
    padding-bottom: 15px;
    color: #303030;
    font-size: 14px;
  }
  .certification div {
    margin-top: 15px;
  }
  .certification .line {
    width: 100%;
    height: 1px;
    background: #E6E6E6;
  }
  .orangeColor {
    color: #EA7C31;
  }
  .fz{
    font-size: 12px;
  }
  .clear {
    overflow: hidden;
  }
  .showImg{
  }
  .noSubmitColor {
    color: #E45736;
  }
  .noSubmitColor >>> .weui-cell__ft{
    color: #E45736;
  }
  .submitColor >>> .weui-cell__ft{
    color: #000000
  }
  #app .order>>> .weui-input {
    color: #000000
  }
  #app .order>>> .weui-cell_access .weui-cell__ft {
    color: #000000
  }
</style>
