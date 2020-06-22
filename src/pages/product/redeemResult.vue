<template>
    <view-box class="result">
        <Header title="赎回结果" :showLeft='false'></Header>
        <div class='wrapper'>
            <div class="content">
                <div class="successLogo">
                  <img src='../../assets/images/icon-success.png'/>
                </div>
                <div class='remark' v-if="redeemStatus == 1">赎回申请已提交，请等待审核。</div>
                <div class='remark' v-if="redeemStatus == 2">赎回撤单成功</div>
                <div class='btnWrapper'>
                    <button  class="complete" @click = "leave('/home')">完成</button>
                    <button  @click = "leave('/customer/redeem')">查看赎回记录</button>
                </div>
            </div>
        </div>
    </view-box>
</template>

<script>
import Header from '@/pages/common/header'
export default {
    name:'redeemResult',
    components:{
        Header
    },
  data () {
    return {
      redeemStatus:this.$route.params.redeemStatus,
    }
  },
  methods:{
    leave:function(path){
      this.$router.push(path)
    }

  }

}
</script>

