<template>
  <view-box ref="viewBox" class="orderRss noFooter">
    <Header title="汇款信息" :leftAction='toCustomerCertification' class="headerer"/>
    <div class="infoHeaderOrder" v-show="isProxy == 1">
      <div>· 请在客户线上下单的3个自然日内（含下单日当天）完成报单，否则无法计入业绩。</div>
    </div>
    <div class="scrollerMain">
      <group class='inputWrapper noBorder'>
        <div class='inputCell'>
          <div class='inputCell_float'>
            <div>报单金额</div>
            <x-input placeholder='请输入报单金额' v-model="orderRss.bookingBalance"  class='bookingBalance' :is-type='balanceVerifica'>
              <span slot='right' class='fontClass'>元</span>
            </x-input>
          </div>
          <div class='inputCell_float'>
            <div>费用</div>
            <x-input placeholder='请输入费用金额' v-model="orderRss.feeBalance" class='feeBalance' :is-type='balanceVerifica'>
              <span slot='right' class='fontClass'>元</span>
            </x-input>
          </div>
        </div>
        <div class='inputCell  lineCell'>
          <div class='inputCell_header'>汇款金额</div>
          <div class='inputCell_content'>
            <span class='number colorRed'>{{orderRss.paymentBlance}}</span>
            <span class='label'>元</span>
          </div>
        </div>
      </group>
      <div class="gap"></div>
      <group class="noBorder">
        <datetime title="汇款时间" v-model="orderRss.paymentDate" @on-change="e => { orderRss.paymentDate = e }" format="YYYY年MM月DD日 HH:mm"></datetime>
      </group>
      <div class="gap"  v-if="isProxy!=1"></div>
      <group v-if="isProxy!=1"  class="noBorder">
        <x-input title="银行卡开户行" type='text' v-model="orderRss.bankBranch" placeholder='请输入银行卡开户行'></x-input>
        <x-input title="银行卡号" type='text' v-model="orderRss.bankAccount" placeholder='请输入银行卡号'></x-input>
      </group>
      <div class="gap" v-if="isProxy!=1"></div>
      <group v-if="isProxy!=1"  class="noBorder">
        <div class="orderRssUpload">
          <div class='requiredFileRemark'>必填上传资料:</div>
          <div class="threePer">
            <upload title="上传证件" module="trade" fileCatalog="identification"  :finalFuc='identificationFinal' ref='identification' :value='orderRss.identificationFile'></upload>
          </div>
          <div  class="threePer">
            <upload title="上传银行卡" module="trade" fileCatalog="bankcard" ref='bankcard' :finalFuc='bankcardFinal' :value='orderRss.bankcardFile'></upload>
          </div>
          <div class="threePer">
            <upload title="上传付款凭证" module="trade" fileCatalog="payment" ref='payment' :finalFuc='paymentFinal' :value='orderRss.paymentFile'></upload>
          </div>
          <div class='optionalFileRemark'>选填上传资料:</div>
          <div class="otherDiv">
            <upload title="上传其他附件" module="trade" fileCatalog="other" :finalFuc='otherFileFinal' ref="other" :value='orderRss.otherFiles' :maxLength='3'></upload>
          </div>
        </div>
      </group>
    </div>
    <group class='btnDiv noBorder'>
      <div class='btn'>
        <x-button type="warn grayBtn" class='next' @click.native='nextStep'>提交</x-button>
      </div>
    </group>
  </view-box>
</template>

<script>
  import Header from '@/pages/common/header'
  import Footer from '@/pages/common/footer'
  import Select from '@/pages/common/select'
  import upload from '@/pages/product/upload.vue'
  import { setTimeout } from 'timers';
  var lastClick;
  export default {
    name: 'orderRss',
    components: {
      Header,
      Footer,
      Select,
      upload
    },
    data () {
      return {
        productStatus:this.$route.params.productStatus,
        customerName:this.$store.state.orderDetail.customerDetail.customerName,
        customerId:this.$store.state.orderDetail.customerDetail.customerId,
        proRiskLevelCode:this.$store.state.orderDetail.productDetail.riskLevelCode,
        productId:this.$store.state.orderDetail.productDetail.productId,
        type: this.$route.query.type,
        orderRss:this.$store.state.orderRss,
        balanceVerificaBoolean:true,//金额输入验证
        balanceVerifica(value){
          var reg = /^([1-9]\d{0,11}|0)(\.\d{1,2})?$/;
          if (!reg.test(value)) {
            this.balanceVerificaBoolean=false;
            return {
              valid:false,
              msg: '最大可输入12位正数(最多2位小数)'
            }
          }else{
            this.balanceVerificaBoolean=true;
            return {
              valid:true,
            }
          }
        },
        isProxy:this.$store.state.orderDetail.productDetail.isProxy, //是否代销
        otherFileBoolean2:false,
        otherFileBoolean3:false,
      }
    },
    created(){
      //将报单的productId存在vuex里面
      this.orderRss.productId=this.productId;
      this.orderRss.customerId=this.customerId;
      this.orderRss.customerName=this.customerName;
      //将pinCode存在vuex里面
      this.orderRss.pinCode=this.$store.state.orderDetail.customerDetail.pinCode;
      if(this.productStatus == 0){
        this.orderRss.tradeType = '10'
      }else{
        this.orderRss.tradeType = '20'
      }
    },
    mounted(){
      //判断报单按钮是否置灰
      this.judgeBtn(this.orderRss);
      var that=this;
      //给输入框添加onkeyup事件
      $('.bookingBalance input').keyup(function(e){
        let inputValue=this;
        setTimeout(function(){
          var a=inputValue.value.toString().match(/^\d+(\.\d{0,2})?/);
          if(a!=null){
            that.orderRss.bookingBalance=a[0];
          }else{
            that.orderRss.bookingBalance='';
          }
        },10)
      })
      $('.feeBalance input').keyup(function(){
        let inputValue=this;
        setTimeout(function(){
          var a=inputValue.value.toString().match(/^\d+(\.\d{0,2})?/);
          if(a!=null){
            that.orderRss.feeBalance=a[0];
          }else{
            that.orderRss.feeBalance='';
          }
        },10)
      })
    },
    beforeRouteLeave(to,from,next){
      if(to.name=='order'||to.name=='custneomerCertification'){
        let resetObj={
          bookingBalance:'',
          paymentBlance:'0.00',
          feeBalance:'',
          paymentDate:'',
          empJobnumber:'',
          paymentFile:{},//付款凭证
          identificationFile:{},//身份证附件
          bankcardFile:{},//银行卡附件
          otherFiles:[],//其他附件
          bankAccount:'',//银行账号
          bankBranch:'',//银行开户行
          accompanyPersonName:'',//配谈人员名称
        }
        this.$store.commit("changeOrderRss",resetObj);
      }else if(to.name=='orderResult'){
        this.$store.commit("changeOrderRss",{});
      }else{
        this.$store.commit("changeOrderRss",this.orderRss);
      }
      next();
    },
    watch:{
      orderRss:{
        handler(newName){
          //计算汇款金额
          let bookingBalance=newName.bookingBalance?parseFloat(newName.bookingBalance):0;
          let feeBalance=newName.feeBalance?parseFloat(newName.feeBalance):0;
          newName.paymentBlance=this.utils.formateYuan(bookingBalance+feeBalance);
          //控制按钮的开启和关闭
          this.judgeBtn(newName);
        },
        deep:true
      },
    },
    methods: {
      //选择证件类型
      certificateChange(value, label){
        this.orderRss.certificate = label
      },
      toCustomerCertification(){
        this.$router.push({name:'customerCertification'})
      },
      nextStep(){
        let noFastClick = this.nofastClick();
        if(noFastClick) {
          let className = $('.next').attr("class");
          if (className.indexOf('grayBtn') < 0) {
            //发送报单保存的ajax
            let params = JSON.parse(JSON.stringify(this.orderRss));
            params.paymentDate=params.paymentDate.replace(/年/g,"-").replace(/月/g,"-").replace(/日/g,"");
            params.paymentDate = params.paymentDate + ':00';
            this.func.ajaxPost(this.api.trade.saveBookingTradeInfo, params, res => {
              this.$router.push({name: 'orderResult'});
            })
          }
        }
      },
      //判断报单按钮是否可以填写
      judgeBtn(newName){
        let bu=true;
        if(!this.balanceVerificaBoolean){
          bu=false;
        }

        for(let key in newName){
          if(key!='paymentFile'&&key!='otherFiles'&&key!='identificationFile'&&key!='bankcardFile'&& key!='riskMismatch'&&key!='empJobnumber'&&key!='accompanyPersonName'&&key!='cusLevelName'&&key!='feeBalance'&&key!='referPin'){
            //代销产品
            if(this.isProxy==1){
              if(key!='bankAccount'&&key!='bankBranch'){
                if(!newName[key]){
                  bu=false
                }
              }
            }else{
              if(!newName[key]){
                bu=false
              }
            }
          }else{
            if(this.isProxy!=1){
              //直销
              if(key=='paymentFile'||key=='identificationFile'||key=='bankcardFile'){
                if(Object.keys(newName[key]).length==0){
                  bu=false
                }
              }
            }
          }
        }

        if(bu){
          $(".next").removeClass('grayBtn');
          $(".next").addClass('correctBtn');
        }else{
          $(".next").addClass('grayBtn');
          $(".next").removeClass('correctBtn');
        }
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
      //上传身份证回调
      identificationFinal(){
        if(this.$refs.identification.file.length){
          this.orderRss.identificationFile=this.$refs.identification.file[0];
        }else{
          this.orderRss.identificationFile={};
        }
      },
      //上传银行卡回调
      bankcardFinal(){
        if(this.$refs.bankcard.file.length){
          this.orderRss.bankcardFile=this.$refs.bankcard.file[0];
        }else{
          this.orderRss.bankcardFile={};
        }
      },
      //上传付款凭证回调
      paymentFinal(){
        if(this.$refs.payment.file.length){
          this.orderRss.paymentFile=this.$refs.payment.file[0];
        }else{
          this.orderRss.paymentFile={};
        }
      },
      //上传其他附件回调
      otherFileFinal(){
        this.orderRss.otherFiles=this.$refs.other.file;
      }
    }
  }
</script>
<style scoped>
  .noFooter{
    background: white;
  }

  .correctBtn{
    background: #505269!important;
    color: white!important;
  }

  .orderRssUpload{
    padding: 11px 15px 15px 15px;
    font-size: 0px;
    margin-bottom: 72px;
  }

  .uploadDiv{
    margin-top: 4px;
  }

  .threePer{
    width: 33.3%;
    display: inline-block;
    text-align: left;
    margin-bottom: 15px;
  }

  .otherDiv{
    width: 100%;
  }

  .otherDiv>>>.uploadDiv .uploadWrapperDiv{
    width: 33.3%!important;
  }

  .otherDiv>>>.uploadDiv .ydDiv{
    width: 33.3%!important;
  }

  .otherDiv>>>.uploadDiv .loadingWrapperDiv{
    width: 33.3%!important;
  }

  .requiredFileRemark{
    font-size: 14px;
    margin-bottom: 10px;
  }

  .optionalFileRemark{
    border-top: 1px solid #e6e6e6;
    font-size: 14px;
    margin-bottom: 10px;
    padding-top: 10px;
    color: #999999;
  }

  .btnDiv{
    background:rgb(246,246,246)!important;
    position: absolute;
    bottom: 0px;
    width: 100%;
    z-index: 9999;
  }

  .btnDiv button{
    height: 50px;
  }

  .gap{
    height: 10px;
    background: rgb(250,250,250);
  }

  .btnDiv .weui-btn{
    border-radius: 0px;
    padding: 0px;
  }

  .btnDiv .weui-btn:after{
    border-radius: 0px;
  }
  .orderRss .infoHeaderOrder {
    width: 100%;
    background-color: #EA7C31;
    color:#FFFFFF;
    padding-left: 15px;
    padding-right: 10px;
    font-size: 12px;
    padding-top: 5px;
    -webkit-text-size-adjust: none;
  }
  .orderRss .infoHeaderOrder div{
    line-height: 18px;
    font-size: 12px;
    width: 111%;
    -webkit-text-size-adjust: none;
    transform: scale(0.9);
    -webkit-transform: scale(0.9);     /* for Chrome || Safari */
    -moz-transform: scale(0.9);        /* for Firefox */
    -ms-transform: scale(0.9);         /* for IE */
    -o-transform: scale(0.9);
    transform-origin: top left;
  }
  .orderRss>>> #vux_view_box_body .detailsHeader .vux-header:after {
    height: 0px;
  }
</style>

