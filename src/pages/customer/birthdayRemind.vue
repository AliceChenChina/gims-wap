<template>
  <view-box class="birthdayRemind noFooter">
    <Header title="生日提醒" :showLeft="false"/>
    <div class="birthday-header">
      <p>客户生日月份：</p>
      <p class="font-weight500">{{this.month}}月</p>
    </div>
    <div class="gap"></div>
    <div class="table-wrapper">
      <div class="table-header">
        <p class="flex-1">日期</p>
        <p class="flex-2">客户姓名</p>
        <p class="flex-3">pin</p>
      </div>
      <div class="table-content" v-for="(item,index) in this.showContent" :key="index">
        <p class="flex-1">{{item.td1}}</p>
        <p class="flex-2">{{item.td2}}</p>
        <p class="flex-3 colorBlue" @click="toCustomer(item)">{{item.td3}}</p>
      </div>
    </div>
  </view-box>
</template>

<script>
  import Header from '@/pages/common/header'
  export default {
    name: 'birthdayRemind',
    components:{
      Header
    },
    data() {
      return{
        showContent:[],
        month:'',
      }
    },
    beforeCreate(){
      document.querySelector('body').setAttribute('style', 'background:white');
    },
    beforeRouteLeave(to,from,next){
      document.querySelector('body').removeAttribute("style");
      next();
    },
    mounted() {
      this.func.ajaxPost(this.api.customer.birthday,{},res=>{
        let content = res.data.data;
        let keys = Object.keys(content);
        this.month = keys[0].split('月')[0];
        keys.forEach(item =>{
          content[item].forEach((item1,index) =>{
            let obj = {};
            if(index===0){
              obj.td1 = item;
            }else {
              obj.td1 = '';
            }
            obj.td2 = item1.customerName;
            obj.td3 = item1.pinCode;
            obj.userId = item1.userId;
            obj.id = item1.relationshipId;
            this.showContent.push(obj);
          });
        });
      });
    },
    methods:{
      toCustomer(item){
        this.$router.push({
          name:'customerDetails',
          query:{
            id: item.id,
            userId: item.userId
          }
        });
      }
    }
  };
</script>

<style lang="scss">
.birthdayRemind{
  .font-weight500{
    font-weight: 500;
  }
  .flex-1{
    flex: 1;
  }
  .flex-2{
    flex: 2;
  }
  .flex-3{
    flex: 3;
  }
  .colorBlue{
    color: #5276B2;
  }
  .birthday-header{
    padding: 15px;
    font-size:14px;
    color: #333333;
    line-height: 20px;
    display: flex;
    justify-content: space-between;
  }
  .gap{
    width: 100%;
    height: 10px;
    background: #FAFAFA;
  }
  .table-wrapper{
    padding: 15px;
    .table-header{
      width: 100%;
      padding: 15px 0 7px 0;
      background: #FAFAFA;
      font-size:12px;
      color: #999999;
      display: flex;
      justify-content: flex-start;
      border-bottom:1px solid #EEEEEE;
      p{
        text-align: center;
      }
    }
    .table-content{
      line-height: 33px;
      font-size:12px;
      color: #666666;
      display: flex;
      justify-content: flex-start;
      text-align: center;
      border-bottom:1px solid #EEEEEE;
    }
  }
}
</style>
