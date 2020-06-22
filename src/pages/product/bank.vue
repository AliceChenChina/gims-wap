<template>
    <div>
      <view-box class='bank'>
          <Header title="选择银行卡" />
          <scroller  lock-x height="-44" :bounce='false'>
              <div class='remark'>注：因集团合规要求，请选择客户线下汇款银行卡，若无银行卡信息，请引导客户前往京东金融APP-我-我的银行卡处添加银行卡 </div>
              <div :class="'bankWrapper '+item.bankBg" v-for='item in bankCardList' :key='item.id' @click="select(item)">
                  <div>
                     <div class='imgWrapper' style="float:left">
                         <div class='imgItem'>
                              <img :src="'../../../static/img/bank/'+item.bankCode+'.png'" onerror="this.src='../../../static/img/bank/erro.png'">
                         </div>
                     </div>
                     <div class="fontWrapper">
                         <div class='bankName'>{{item.bank}}</div>
                         <div class='bankType'>{{item.cardType==1?'储蓄卡':'信用卡'}}</div>
                     </div>
                  </div>
                  <div class="account">
                      <span>**** **** **** </span>
                      <span>{{item.cardNoEnd}}</span>
                  </div>
              </div>
          </scroller> 
      </view-box>
    </div>
</template>

<script>
import Header from '@/pages/common/header'
export default {
    name:'bank',
    components:{
        Header
    },
    data(){
        return{
            customerId:this.$route.query.customerId,
            bankCardList:[]
        }
    },
    created(){
        this.func.ajaxPost(this.api.customer.customerBankCard,{userId:this.customerId},res=>{
            if(res.data.code=='200'){
                this.bankCardList=res.data.data.bankCardList;
            }
        })
    },
    methods:{
        select(item){
            let name=item.bank;
            let id=item.id;
            this.$store.commit("changeOrderRss",{'bankName':name,'bankId':id})
            this.$router.go(-1);
        }
    }
}
</script>
<style scoped>
.remark{
    padding-top: 10px;
}
</style>

