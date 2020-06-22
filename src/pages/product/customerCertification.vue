<template>
    <view-box class='customerCertification noFooter'>
      <Header title="客户合规认证"/>
      <group  class="noBorder">
          <cell title="实名认证" :class='data.realNameInfo.class'>{{data.realNameInfo.status}}</cell>
          <cell title="风险等级" :class='data.riskSurveyInfo.class'>{{data.riskSurveyInfo.status}}</cell>
          <cell title="资产证明" :class='data.assetProofInfo.class'>{{data.assetProofInfo.status}}</cell>
          <div class="remark colorRed" id="remark1">
              {{remark1}}
          </div>
          <div class="remark" id="remark2">
              {{remark2}}
          </div>
          <div class='imgWrapper'>
              <img src="../../../static/img/eqcode.png" alt="">
          </div>
          <div class="btnWrapper">
                <x-button  class="grizzle next" @click.native="nextStep">下一步</x-button>
                <x-button type="default" class='editBtn' @click.native='editCus'>编辑客户信息</x-button>
          </div>
      </group>
    </view-box>
</template>

<script>
import Header from '@/pages/common/header'
import detailsVue from './details.vue';
export default {
    name:'customerCertification',
    components: {
        Header
    },
    data(){
        return{
            customerId:this.$store.state.orderDetail.customerDetail.customerId,
            cusLevelName:'',
            proRiskLevelCode:this.$store.state.orderDetail.productDetail.riskLevelCode,
            cusLevel:undefined,
            productId:this.$store.state.orderDetail.productDetail.productId,
            //后台返回的信息
            data:{
                realNameInfo:{   //实名信息
                    status:'未实名',
                    class:'',
                },
                riskSurveyInfo:{  //风险测评
                    status:'未测评',
                    class:'',
                },
                assetProofInfo:{  //资产证明
                    status:'未提交',
                    class:'',
                }
            },
            remark1:'',
            remark2:'',
            isNext:false,
        }
    },
    mounted(){
        this.func.ajaxPost(this.api.customer.getCustomerComplianceInfo, {customerId:this.customerId}, res => {
            if (res.data.code == 200) {
                let data=res.data.data.complianceInfo;
                this.cusLevel=data.riskSurveyInfo.riskLevel;
                this.cusLevelName=data.riskSurveyInfo.riskLevelName;
                //处理数据,将后台返回的数据变成渲染到页面的数据和class
                this.handelData(data);
                //处理dom，处理页面dom的显示和隐藏问题
                this.handelDom(data);
            }
        })
    },
    methods:{
        nextStep(){
            //下一步的操作
            if(this.isNext){
                let proLevel=this.proRiskLevelCode;
                let cusLevel=this.cusLevel;
                if(proLevel>cusLevel){
                    //上传资产证明页面
                    this.$store.commit('changeOrderRss',{"cusLevelName":this.cusLevelName})
                    this.$router.push({name:'orderRisk'})
                }else{
                    //报单页面
                    this.$router.push({name:'orderRss'})
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
                this.data.realNameInfo.class='rightRed';
            }else if(status_realNameInfo==1){
                this.data.realNameInfo.status='已认证';
                this.data.realNameInfo.class='rightGray';
            }else if(status_realNameInfo==2){
                this.data.realNameInfo.status='认证错误';
                this.data.realNameInfo.class='rightRed';
            }
            //风险等级
            let status_riskSurveyInfo=data.riskSurveyInfo.status;
            if(status_riskSurveyInfo==0){
                this.data.riskSurveyInfo.status= '未测评';
                this.data.riskSurveyInfo.class= 'rightRed';
            }else{
                this.data.riskSurveyInfo.status=data.riskSurveyInfo.riskLevelName;
                this.data.riskSurveyInfo.class= 'rightGray';
            }
            //资产证明
            let status_assetProofInfo=data.assetProofInfo.status;
            if(status_assetProofInfo==0){
                this.data.assetProofInfo.status= '未提交';
                this.data.assetProofInfo.class= 'rightRed';
            }else if(status_assetProofInfo==1){
                this.data.assetProofInfo.status= '已认证';
                this.data.assetProofInfo.class= 'rightGray';
            }
        },
        //处理dom，处理页面dom的显示和隐藏问题
        handelDom(data){
            if(data.realNameInfo.status==2){
                this.remark1='注：该客户实名认证结果有误，请检查京东用户名是否输入正确';
                // $(".editBtn").css('visibility','visible');
                $(".editBtn").show();
            }else{
                if(!data.riskSurveyInfo.status||!data.realNameInfo.status||!data.assetProofInfo.status){
                   $(".imgWrapper").css('visibility','visible');
                   this.remark2='请将以下京东金融APP二维码分享给客户，完成以上所需合规认证项';
                }else{
                    let cusLevel=data.riskSurveyInfo.riskLevel;
                    if(cusLevel==1){
                        $(".imgWrapper").css('visibility','visible');
                        this.remark1='注：预约该产品需客户风险等级高于保守型，当前客户风险等级较低';
                        this.remark2='请将以下京东金融APP二维码分享给客户，完成以上所需合规认证项';
                    }else{
                        this.isNext=true;
                        $('.next').removeClass("grizzle");
                        $('.next').addClass("correctBtn")
                    }
                }
            }
        },
        editCus(){
            //跳转到客户信息编辑页面
            this.$router.push({name:'customerInfo',query:{customerId:this.customerId}})
        }
    }
}
</script>

<style>
.customerCertification{
  position: relative;
  background: white;
}

.customerCertification .imgWrapper{
    text-align: center;
    margin:14px 0px;
    visibility: hidden;
}

.customerCertification .editBtn{
   /* visibility: hidden; */
   display: none;
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

.btnWrapper{
    position: fixed;
    bottom: 40px;
    width: 100%;
    padding-left: 10px;
    padding-right: 10px;
}
</style>

