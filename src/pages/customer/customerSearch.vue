<template>
  <view-box>
    <Header :showLeft="true" :showRight="false" search :searchChange='searchChange'  main ref='header'/>
    <scroller lock-x :bounce="false" height="-44">
      <div v-show="show">
      <div class="customerSearch">
        <p class="title" v-if="isNoData">暂无数据匹配</p>
        <ul>
          <li v-for="(item,index) in dataList" @click="clickItem(item,index)" :key='index'>
            <b class="name" v-html="getKeyWord(item.contact)"></b>
            <p class="desc">
              <span>{{utils.arg.getText('sex',item.sex)}}</span>
            </p>
            <span class="city">京东用户名: {{item.pinCode}}</span>
          </li>
        </ul>
      </div>
      </div>
    </scroller>
  </view-box>
</template>

<script>
import Header from '@/pages/common/header'
import ScrollList from '@/pages/customer/common/scrollList'
export default {
    name: 'customerSearch',
    data () {
      return {
        show: false,
        dataList: [],
        keyWord:'',
        isNoData:true,
        isOnlyList:this.$route.query.isOnlyList
      }
    },
    components:{
      Header,
      ScrollList
    },
    mounted(){
      this.$nextTick(function(){
        //自动搜索框聚焦
        this.$refs.header.$refs.search.setFocus();
      })
    },
    methods: {
      getKeyWord(str){
        let newStr = str
        if(str && this.keyWord && str.indexOf(this.keyWord) >= 0){
          newStr = str.replace(this.keyWord, '<span class="red">' + this.keyWord + '</span>')
        }
        return newStr
      },
      //关闭
      clickItem(item,index){
        let selectCustomerId=item.userId;
        let pinCode=item.pinCode;
        if(!this.isOnlyList){
         //跳转到详情页面
          this.utils.goToUrl('/customer/details?id='+item.id+'&userId='+selectCustomerId+'&pinCode='+pinCode);
        }else{
          //跳转到报单页面
          let selectCustomerName=item.contact;
          //开始
          if(pinCode){
            this.$store.commit("changeOrderDetail",{customerDetail:{customerId:selectCustomerId,pinCode:pinCode,customerName:selectCustomerName}});
            this.$store.commit("changeOrderRss",{customerFrom:item.customerFrom});
            this.$store.commit("changeOrderRss",{referPin:item.referPin});
            this.$router.push({name:'order'});
          }else{
              let vm=this;
              this.$vux.confirm.show({
                  closeOnConfirm:false,
                  title:'请输入该客户京东用户名',
                  content:"<div><input type='text'class='input_confirm'/></div><div class='remark_confirm'>请客户进入京东金融APP中'我的'页面，点击头像进入个人信息页提供京东用户名。</div>",
                  onCancel () {
                    $(".input_confirm").val('');
                  },
                  onConfirm () {
                    if(!$(".input_confirm").val()){
                      vm.$vux.toast.text('输入京东用户名不能为空', 'middle');
                      return
                    }
                    let params={
                      userId:selectCustomerId,
                      pinCode:$(".input_confirm").val(),
                    }
                    vm.func.ajaxPost(vm.api.customer.saveCustomerPinCode,params,res=>{
                      if(res.data.code==200){
                        vm.dataList[index].pinCode=params.pinCode;
                        vm.$store.commit("changeOrderDetail",{customerDetail:{customerId:selectCustomerId,pinCode:params.pinCode,customerName:selectCustomerName}});
                        this.$store.commit("changeOrderRss",{customerFrom:item.customerFrom});
                        this.$store.commit("changeOrderRss",{referPin:item.referPin});
                        $(".input_confirm").val('');
                        vm.$vux.confirm.hide();
                        vm.$router.push({name:'order'});
                      }else{
                        vm.$vux.toast.show({
                          text:res.data.message,
                          type:'warn'
                        })
                      }
                    })
              }
            })
          }
       }
      },
      searchChange(text){
        //搜索值得改变
        if(text){
          //向后台发送搜索
          this.fetchList(text);
        }else{
          this.show=false;
        }
      },
      fetchList(text){
        let parames={'customerName':text}
        this.func.ajaxPost(this.api.customer.Query,parames,res=>{
           if (res.data.code === 200) {
              this.dataList=res.data.data;
              if(this.dataList.length==0){
                this.isNoData=true;
              }else{
                this.isNoData=false;
              }
              this.keyWord=text;
              this.show=true;
           }
        })
      }
    }
  }
</script>
<style scoped>
.mainHeader>>>.vux-header{
   position: fixed!important;
}

.mainHeader>>>.vux-header-title-area .header-search-left{
    padding-left: 34px!important;
}

.mainHeader>>>.vux-header-left .left-arrow:before{
  border: 1px solid #999;
  border-width: 1px 0 0 1px;
}

</style>
