<template>
    <view-box class="orderResult">
        <Header title="报单结果" :showLeft='false'></Header>
        <div class='content'>
            <div class="wrapper">
              <div style="text-align: center">
                <img src='../../assets/images/success.png'/>
              </div>
                <div class='title'>报单已提交</div>
                <div class='remark'>请等待运营部门审核报单，可通过报单记录页跟踪审核结果。</div>
                <div class='btnWrapper'>
                    <x-button link='../../home' class="completeBtn">完成</x-button>
                    <x-button type="default" link='../../personal/declarationForm'>查看报单记录</x-button>
                </div>
            </div>
        </div>
    </view-box>
</template>

<script>
import Header from '@/pages/common/header'
export default {
    name:'orderResult',
    components:{
        Header
    },
}
</script>

<style scoped>
.completeBtn{
   background: #505269!important;
   color: white!important;
}
.orderResult .content>>> .wrapper{
  padding: 0;
}
</style>
