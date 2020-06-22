<template>
  <view-box ref="viewBox" class="customerDetails noFooter">
    <Header title="客户详情"  preventGoBack :leftAction='goBack'/>
      <div>
        <div class="details-header">
          <div class="details-content">
            <div class="user">
              <img src="@/assets/images/user.png" class="user-img">
            </div>
            <template v-if="info.oriContact || info.trueName">
              <div style="width: 70%" @click="goBaseInfo">
                <div class="name" v-if="info.oriContact || info.trueName">
                  <b>{{info.oriContact ? info.oriContact : info.trueName ? info.trueName : ''}}</b>
                </div>
                <div class="lightGrey mt10 fz14">京东用户名：{{info.pinCode}}</div>
                <div class="lightGrey mt10 fz12" v-if="info.oriContact && info.trueName">客户姓名：{{info.trueName}}</div>
              </div>
            </template>
            <template v-else>
              <div class="name fz14">
                {{info.pinCode}}
              </div>

            </template>

            <a v-if="editCustomerPower" @click="goBaseInfo" href="javascript:void(0)" class="header-icon-right"></a>
          </div>
          <div class="details-footer">
            <p>
              <span>实名认证</span>
              <b :class="complianceInfo.realNameInfo.class">{{complianceInfo.realNameInfo.status}}</b>
            </p>
            <p>
              <span>风险等级</span>
              <b :class="complianceInfo.riskSurveyInfo.class">{{complianceInfo.riskSurveyInfo.status}}</b>
            </p>
            <p>
              <span>私募资产证明</span>
              <b :class='complianceInfo.privateStatus.privateStatusClass'>{{complianceInfo.privateStatus.privateStatusStr}}</b>
            </p>
            <p>
              <span>资管资产证明</span>
              <b :class='complianceInfo.assetStatus.assetStatusClass'>{{complianceInfo.assetStatus.assetStatusStr}}</b>
            </p>
          </div>
        </div>
        <group class="noBorder mt10">
          <cell title="总资产" is-link v-if="info.type !== 0 && totalAssetrKey"  @click.native="goToAssetsList"></cell>
          <cell title="财富规划" is-link v-if="assetListKey"  @click.native="goToAssetAllocationList"></cell>
          <cell title="认申购记录" v-if="buyRecordsKey" is-link :link="'/personal/declarationForm?customerId='+userId"></cell>
          <cell title="赎回记录" v-if="redeemRecordsKey" is-link :link="'/customer/redeem?customerId=' + userId"></cell>
          <cell title="拜访记录" v-if="visitRecordsKey" is-link :link="'/customer/recordList?customerId=' + userId+'&name='+info.contact"></cell>
        </group>
        <div class="footer" v-if="controlShowBtn">
          <div class="btn" @click="sendMessage">
            发送消息
          </div>
        </div>
      </div>
  </view-box>
</template>

  <script>
  import Header from '@/pages/common/header'
  import Footer from '@/pages/common/footer'
  var lastClick;
  export default {
    name: 'customerDetails',
    components: {
      Header,
      Footer
    },
    data () {
      return {
        ifRealName: 0, // 是否已实名
        id: this.$route.query.id,
        userId: this.$route.query.userId,
        pinCode: this.$route.query.pinCode,
        editCustomerPower: this.utils.userInfo.checkUserPowerKey(this.powerKey.editCustomerKey), // 编辑客户权限控制
        info:{},
        controlShowBtn: false,
        complianceInfo:{
          realNameInfo:{   //实名信息
            status:'未实名',
            class:'',
          },
          privateStatus:{ //私募资产证明
            privateStatusStr:'未提交',
            privateStatusClass:'',
          },
          assetStatus:{  //资管资产证明
            assetStatusStr:'未提交',
            assetStatusClass:'',
          },
          riskSurveyInfo:{  //风险测评
            status:'未测评',
            class:'',
          }
        },
        totalAssetrKey: this.utils.userInfo.checkUserPowerKey(this.powerKey.totalAssetrKey), // 总资产权限控制
        buyRecordsKey: this.utils.userInfo.checkUserPowerKey(this.powerKey.buyRecordsKey), // 认申购记录权限控制
        redeemRecordsKey: this.utils.userInfo.checkUserPowerKey(this.powerKey.redeemRecordsKey), // 赎回记录权限控制
        visitRecordsKey: this.utils.userInfo.checkUserPowerKey(this.powerKey.visitRecordsKey), // 拜访记录权限控制
        assetListKey: this.utils.userInfo.checkUserPowerKey(this.powerKey.assetListKey), // 财富规划报告
      }
    },
    created(){
       this.func.ajaxPost(this.api.customer.Info, {id:this.id}, res => {
        if (res.data.code === 200) {
          this.info=res.data.data;
          if(this.info.type !== 0 ) {
            this.controlShowBtn = true
          }
        } else {
          this.utils.msg(res.data.message);
        }
      })
       this.func.ajaxPost(this.api.customer.getCustomerComplianceInfo,{customerId:this.userId},res=>{
          if (res.data.code === 200 && res.data.data) {
           let data=res.data.data.complianceInfo;
           //实名信息
           if(data.realNameInfo.status==0){
             this.ifRealName = 0;
             this.complianceInfo.realNameInfo.status="未认证";
             this.complianceInfo.realNameInfo.class='lightGrey';
           }else if(data.realNameInfo.status==1){
             this.ifRealName = 1;
             this.complianceInfo.realNameInfo.status="已认证";
             this.complianceInfo.realNameInfo.class='darkGrey';
           }else if(data.realNameInfo.status==2){
             this.ifRealName = 0;
             this.complianceInfo.realNameInfo.status="认证错误";
             this.complianceInfo.realNameInfo.class='lightGrey';
             this.complianceInfo.riskSurveyInfo.status="-";
             this.complianceInfo.assetProofInfo.status='-';
             return;
           }
           //风险测评
           if(data.riskSurveyInfo.status==0){
             this.complianceInfo.riskSurveyInfo.status="未测评";
             this.complianceInfo.riskSurveyInfo.class="lightGrey";
           }else{
             this.complianceInfo.riskSurveyInfo.status=data.riskSurveyInfo.riskLevelName;
             switch(data.riskSurveyInfo.riskLevel){
               case 1:
                this.complianceInfo.riskSurveyInfo.class="darkGrey";
                break;
               case 2:
                this.complianceInfo.riskSurveyInfo.class="darkGrey";
                break;
              case 3:
                this.complianceInfo.riskSurveyInfo.class="darkGrey";
                break;
              case 4:
                this.complianceInfo.riskSurveyInfo.class="darkGrey";
                break;
              case 5:
                this.complianceInfo.riskSurveyInfo.class="darkGrey";
                break;
             }
           }
            //私募资产证明
           if(!data.assetProofInfo.privateStatusStr || data.assetProofInfo.privateStatusStr === '未认证') {
             this.complianceInfo.privateStatus.privateStatusStr='未认证';
             this.complianceInfo.privateStatus.privateStatusClass='lightGrey';
           } else if (data.assetProofInfo.privateStatusStr === '已过期') {
             this.complianceInfo.privateStatus.privateStatusStr='已过期';
             this.complianceInfo.privateStatus.privateStatusClass='lightGrey';
           }else {
             this.complianceInfo.privateStatus.privateStatusStr='已认证';
             this.complianceInfo.privateStatus.privateStatusClass='darkGrey';
           }
           // 资管资产证明
            if(!data.assetProofInfo.assetStatusStr || data.assetProofInfo.assetStatusStr === '未认证') {
              this.complianceInfo.assetStatus.assetStatusStr='未认证';
              this.complianceInfo.assetStatus.assetStatusClass='lightGrey';
            } else if (data.assetProofInfo.assetStatusStr === '已过期') {
              this.complianceInfo.assetStatus.assetStatusStr='已过期';
              this.complianceInfo.assetStatus.assetStatusClass='lightGrey';
            }else {
              this.complianceInfo.assetStatus.assetStatusStr='已认证';
              this.complianceInfo.assetStatus.assetStatusClass='darkGrey';
            }
          } else {
                this.complianceInfo.realNameInfo.status="-";
                this.complianceInfo.assetStatus.assetStatusStr="-";
                this.complianceInfo.privateStatus.privateStatusStr="-";
                this.complianceInfo.riskSurveyInfo.status="-";
          }
       })
    },
    mounted(){},
    methods: {
      sendMessage() {
        this.$router.push({ path: '/customer/customerTalk',query:{pinCode:this.info.encodePinCode}});
      },
      goToAssetsList(){
        //:link="'/customer/assetsList?pinCode='+info.pinCode"
        if (this.info.type === 0){
          this.utils.msg("相关客户不可查看总资产！");
          return false;
        }
        this.$router.push({ path: '/customer/assetsList',query:{pinCode:this.info.pinCode}});
      },
      goToAssetAllocationList() {
        let param = { query: {customerId:this.info.customerId,
            customerfrom:this.$route.query.from,
            id:this.id, ifRealName: this.ifRealName,
            userPin: this.info.pinCode,
            userId: this.$route.query.userId

        }};
        this.$router.push({ path: '/customer/assetAllocate/assetAllocationList', ...param});
      },
      tel(phone){
        if(phone){
          let nofastClick=this.nofastClick();
          if(nofastClick){
            window.location.href = 'tel:'+phone;
          }
        }else{
          this.utils.msg("该客户没有绑定电话")
        }
      },
      //判断是否是快速点击
      nofastClick(){
        var nowClick = new Date();
        if (lastClick === undefined) {
            lastClick = nowClick;
            return true;
            } else {
                if (Math.round((nowClick.getTime() - lastClick.getTime())) > 500) {
                    lastClick = nowClick;
                    return true;
                }
                else {
                    lastClick = nowClick;
                    return false
                }
            }
      },
      goBack(){
        if(this.$route.query.from && this.$route.query.from === 'shareRecordInfo'){
            // 调回分享记录列表
          let shareRecordInfo =  window.localStorage.getItem('shareRecordInfo');
          shareRecordInfo = JSON.parse(shareRecordInfo);
          let query={
            shareId:this.$route.query.shareId,
            shareTitle:this.$route.query.shareTitle,
            shareCode:this.$route.query.shareCode,
            shareUrl:this.$route.query.shareUrl,
            ...shareRecordInfo
          }
          this.$router.push({ name: 'sharedRecordInfo',query:query })
          return;
        }
       //返回客户
        this.$router.push({ path: '/customer' })
      },
      goBaseInfo(){
        // 客户详情权限
        if (!this.utils.userInfo.checkUserPowerKey(this.powerKey.editCustomerKey)) {
          return false;
        }
        this.$router.push({ path: '/customer/info',query:{id:this.id} })
      }
    }
  }
  </script>
<style scoped>
  .header-icon-right{
    position: relative;
  }
  .header-icon-right:after{
    content: " ";
    display: inline-block;
    height: 10px;
    width: 10px;
    border-width: 2px 2px 0 0;
    border-color: #C8C8CD;
    border-style: solid;
    -webkit-transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
    transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
    position: relative;
    top: -2px;
    position: absolute;
    top: 50%;
    margin-top: -4px;
    right: 2px;
  }
  .weui-cell >>> .vux-label{
    font-size: 16px;
    color: #303030;
  }
  .weui-cell_access >>> .weui-cell__ft:after{
    height: 10px;
    width: 10px;
  }
  .customerDetails{
    background: white;
  }
  #app .weui-cells .weui-cell{
    padding: 14px 15px;
  }
  .footer {
    margin: 50px auto 0;
  }
  .footer .btn {
    border-radius: 3px;
    height: 50px;
    width: 94%;
    font-size: 15px;
    text-align: center;
    line-height: 50px;
    font-weight:500;
    background: #505269!important;
    color: white;
    margin: 0 auto;
  }
  .footer .btn:hover {
    cursor: pointer;
  }
  .darkGrey{
    color: #333333;
  }
  .lightGrey{
    color:#9B9B9B ;
  }

</style>
