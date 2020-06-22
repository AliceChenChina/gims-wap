<template>
  <view-box ref="viewBox" class="personal">
    <div class="personal-header">
      <div class="personal-content">
        <div class="personal-content-below" @click="goToSalesManBusinessCard">
          <div class="user" >
            <img :src="avatarUrl">
          </div>
          <div class="desc">
            <div class="desc-title" :class=" cardEntry ? 'header-icon-right' : ''">
              <span><b style="color: #666">{{personData.trueName}}</b></span>
              <span>{{personData.pinCode ? personData.pinCode: ''}}</span>
            </div>
            <div>
              <span>{{personData.mobile}}</span><span v-if="personData.cardStatus === 1">{{personData.prov}}</span>
            </div>
            <div v-if="personData.cardStatus === 1 && personData.email">
              <span>{{personData.email}}</span>
            </div>
            <div v-if="personData.cardStatus === 1 && showProfessionalCertificate">
              <span class="certifications" style="color: #666;font-size: 12px;transform: scale(0.9);" v-for="item in showProfessionalCertificate">{{item.value}}</span>
            </div>
            <div>
            </div>
          </div>
        </div>
        <div class="investInfo" v-if="personData.cardStatus === 1 && personData.profile">
          {{personData.profile}}
        </div>
      </div>
    </div>
      <div>
        <group>
          <cell title="管理资产" is-link link="/personal/manageAssetsList" v-if="manageAssetListKey">
            <span style="padding-right: 10px;">{{personDataAsset.nowSaleCount?personDataAsset.nowSaleCount.toLocaleString():'-'}}</span>元
          </cell>
          <cell title="报单记录" is-link link="/personal/declarationForm" v-if="declarationRecordsKey">
          </cell>
          <cell title="赎回记录" is-link link="/customer/redeem" v-if="redeemRecordsListKey">
          </cell>
          <cell title="营销工具" is-link link="/marketShare/shareRecords" v-if="marketShareKey">
          </cell>
        </group>
        <group v-if="onlineKey">
          <x-switch title="聊天状态" prevent-default  @on-click="getOnlineStatus" :value-map="['0', '1']" v-model="onlineStatus" @switch-checked-bg-color="bg" v-if="onlineKey"></x-switch>
          <div class="switchSpan">注：设置为离线状态时，客户的电话咨询将自动转接到95118</div>
        </group>
      </div>
    <Footer :active="3"/>
  </view-box>
</template>

<script>
  import Header from '@/pages/common/header'
  import Footer from '@/pages/common/footer'
  const defaultImg = '../../../static/img/upload_photo_bg.png'
  export default {
    name: 'personal',
    components: {
      Header,
      Footer
    },
    data () {
      return {
        defaultIndex: 0,
        certificateList: this.utils.arg.getSelect("professional_certificate"), // 全部专业资质数据
        showProfessionalCertificate: [], // 处理后的专业资质数据
        avatarUrl: '',
        personDataAsset: '',
        productList: [
          {price: '8.7%', prictType: '预期年化', state: '认购期', title: '慧投溢添8号66期', type: '固收', percent: 70, progress: '剩余规模：29873万元'},
          {price: '1.1230', prictType: '单位净值', state: '暂停交易', title: '慧投溢添8号66期', type: '暂停交易', percent: 0, progress: '停售'}
        ],
        loadMoreState: false,
        personData:{},
        cardEntry: this.utils.userInfo.checkUserPowerKey(this.powerKey.cardEntry), // 名片入口权限控制
        manageAssetListKey: this.utils.userInfo.checkUserPowerKey(this.powerKey.manageAssetListKey), // 管理资产权限控制
        declarationRecordsKey: this.utils.userInfo.checkUserPowerKey(this.powerKey.declarationRecordsKey), // 报单记录权限控制
        redeemRecordsListKey: this.utils.userInfo.checkUserPowerKey(this.powerKey.redeemRecordsListKey), // 赎回记录权限控制
        onlineKey: this.utils.userInfo.checkUserPowerKey(this.powerKey.onlineKey), // 聊天状态权限控制
        marketShareKey: this.utils.userInfo.checkUserPowerKey(this.powerKey.marketShareKey),
        onlineStatus: '0',
        fromCancel : false,
        bg:'#04BE02'
      }
    },
    mounted() {
      // 进入页面获取睡会的提醒信息数据
      // 有个人中心的权限才弹提醒 this.utils.userInfo.checkUserPowerKey(this.powerKey.personalKey)
      if (!this.utils.userInfo.checkUserPowerKey(this.powerKey.messageListKey)) {
        this.func.ajaxPost(this.api.home.queryTradeApply, {}, res => {
          if (res.data.code == 200) {
            let data = res.data.data.records;
            if (data && data.length > 0) {
              this.confirm(data, 0, data.length);
            } else {
              this.querySalesCard();
            }
          }
        })
      }
    },
    methods: {
      confirm(data, i, len) {
        this.$vux.confirm.show({
          title: '赎回申请',
          confirmText: '立即完成',
          cancelText: '稍后',
          content: '<div class="confirm-body"><div class="confirmBody2"><p>产品名称：' + data[i].productName + '</p><p>客户名称：' + data[i].customerName + '</p><div class="text-center lightGrey mt10 fw400">请及时补全赎回材料提交审核。</div></div>',
          // 组件除show外的属性
          onCancel: () => {
            i++
            if (i < len) {
              this.$vux.confirm.hide()
              let that = this;
              setTimeout(function () {
                that.confirm(data, i, len)
              }, 200)

            } else {
              this.$vux.confirm.hide();
              this.querySalesCard();
            }
          },
          onConfirm: () => {
            this.$vux.confirm.hide();
            this.$router.push({name: 'redeem', params: {tradeId: data[i].tradeId, status: data[i].status}})
          }
        })
      },
      // 查询理财师名片信息
      querySalesCard() {
        this.func.ajaxPost(this.api.personal.queryCard,{}, res=>{
          // cardStatus:1已设置,非1未设置
          if(res.data.code === 200 && res.data.data.cardStatus !== 1){
            this.remindSalesEditInfo();
          }
        })
      },
      remindSalesEditInfo() {
        this.$vux.confirm.show({
          title: '设置您的个人名片',
          confirmText: '立即设置',
          cancelText: '稍后',
          content: '<div class="confirm-body"><div class="confirmBody2">为了帮助客户更加了解您，提高信任感，建议您立即设置个人名片<div class="text-left lightGrey mt10 fw400 fz12">您也可以稍后在【我的】个人信息中设置</div></div></div>',
          // 组件除show外的属性
          onCancel: () => {
            this.$vux.confirm.hide();
          },
          onConfirm: () => {
            this.$vux.confirm.hide()
            // this.$router.push({name: 'editSalesManBusinessCard'})
            this.$router.push({ path: '/personal/editSalesManBusinessCard'});
          }
        })
      },
      getOnlineStatus(newVal, oldVal) {
        if (newVal){
          this.func.ajaxPost(this.api.personal.updateStatus,{onlineStatus:'1'},res=>{
            if(res.data.code===200){
              this.onlineStatus = '1';
            }
          });
        } else {
          this.$vux.confirm.show({
            title: '友情提示',
            confirmText: '确定',
            cancelText: '取消',
            content: '<div class="confirm-body"><div class="confirmBody2">是否确认将聊天状态设置为“离线”</div></div>',
            // 组件除show外的属性
            onCancel: () => {
              this.$vux.confirm.hide();
              this.onlineStatus = '1';
              return false;
            },
            onConfirm: () => {
              this.$vux.confirm.hide();
              this.func.ajaxPost(this.api.personal.updateStatus,{onlineStatus:'0'},res=>{
                if(res.data.code===200){
                  this.onlineStatus = '0';
                }
              });
            }
          })
        }
      },
      goToSalesManBusinessCard() {
        // 名片入口权限控制
        if (!this.utils.userInfo.checkUserPowerKey(this.powerKey.cardEntry)) {
          return false;
        }
        this.$router.push({ path: '/personal/editSalesManBusinessCard', query:{cardStatus:this.personData.cardStatus}});
      },
    },
    created(){
      this.func.ajaxPost(this.api.personal.queryCard,{},res=>{
        if(res.data.code===200){
          this.personData=res.data.data;
          this.avatarUrl = this.personData.avatar ? this.personData.avatar : '../../../static/img/user.png';
          this.onlineStatus = this.personData.onlineStatus ? this.personData.onlineStatus + '' : '0';
          if(this.personData.professionalCertificate) {
            let arr = this.personData.professionalCertificate.split(',');
            // arr 1,2,3,4
            arr.forEach(item => {
              if(this.utils.ifNumber(item)) {
                for ( let i = 0;i<this.certificateList.length;i++) {
                  if (item === this.certificateList[i].key ) {
                    this.showProfessionalCertificate.push(this.certificateList[i]);
                  }
                }

              }
            })
          }
        }
      },false);
      this.func.ajaxPost(this.api.personal.Query,{},res=>{
        if(res.data.code===200){
          this.personDataAsset=res.data.data;
        }
      });
    }
  }
</script>
<style scoped>
  .weui-cell >>> .vux-label{
    font-size: 16px;
    color: #303030;
  }
  .vux-x-switch >>> .weui-label {
    font-size: 16px;
    color: #303030;
  }
  .weui-cell_access >>> .weui-cell__ft:after{
    height: 8px;
    width: 8px;
  }
  .customerDetails{
    background: white;
  }
  #app .weui-cells .weui-cell{
    padding: 14px 15px;
  }
  .weui-cell_access >>> .weui-cell__ft{
    font-size: 16px;
    color: #000000;
    font-weight: bold;
  }
  .weui-cell_access >>> .weui-cell__ft span{
    color: #EB5954;
  }
  .switchSpan {
    padding-left: 14px;
    font-size: 12px;
    color: #999999;
    line-height: 20px;
    margin-bottom: 5px;
  }


</style>
