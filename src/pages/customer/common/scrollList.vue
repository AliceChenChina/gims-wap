<template>
 <div class="view-wrapper" :style="isOnlyList ? 'bottom: 0' : ''">
    <div class="index-list-wrapper">
      <PersonalItem ref="lal" :data="data()" :type="type" :title="title" @select="selectItem" @onLoadMore="onLoadMore"></PersonalItem>
    </div>
 </div>
</template>

<script>
import PersonalItem from './personalItem'
export default {
  components: {
    PersonalItem
  },
  props: {
    type: {
      type: Number,
      default: 0
    },
    dataList: {
      type: Array,
      default: []
    },
    isOnlyList: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      title: 'indexListPage.title',
      selectPinCode:'',
      selectCustomerId:'',
      selectCustomerName:'',
      message:'',
      scrollHeight: ''
    }
  },
  methods: {
    data() {
      let ret = [];
      this.dataList.forEach((cityGroup) => {
        let group = {}
        group.name = cityGroup.type
        group.items = []
        cityGroup.data.forEach((item) => {
          group.items.push(item)
        })
        ret.push(group)
      })
      return ret
    },
    resetScroll() {
      this.$refs.lal.scrollReset();
    },
    onLoadMore() {
      this.$emit('onListLoadMore');
    },
    sureSelectItem(groupIndex,itemIndex,val){
      this.dataList[groupIndex].data[itemIndex].pinCode=val;
    },
    saveCustomerPinCode(params,groupIndex,itemIndex,item){
      let vm=this;
      vm.func.ajaxPost(vm.api.customer.saveCustomerPinCode,params,res=>{
          if(res.data.code==200){
            vm.message = res.data.message
            vm.$vux.alert.show({
              title:'友情提示',
              buttonText:'我知道了',
              content:vm.message,
              onHide : () => {
                vm.sureSelectItem(groupIndex,itemIndex,params.pinCode);
                vm.$store.commit("changeOrderDetail",{customerDetail:{customerId:vm.selectCustomerId,pinCode:params.pinCode,customerName:vm.selectCustomerName}});
                if(item.customerFrom){
                  this.$store.commit("changeOrderRss",{customerFrom:item.customerFrom});
                }
                if(item.referPin){
                  this.$store.commit("changeOrderRss",{referPin:item.referPin});
                }
                $(".input_confirm").val('');
                vm.$vux.confirm.hide();
                vm.$router.go(-1);
              },
            })
          }else{
            vm.$vux.toast.show({
              text:res.data.message,
              type:'warn'
            })
          }
      })
    },
    selectItem({groupIndex,itemIndex,item}){
      if (this.isOnlyList) {//选择客户
         this.selectCustomerId=item.userId;
         this.selectCustomerName=item.contact
        if(item.pinCode){
          this.selectPinCode=item.pinCode;
          this.$store.commit("changeOrderDetail",{customerDetail:{customerId:this.selectCustomerId,pinCode:this.selectPinCode,customerName:this.selectCustomerName}});
          this.$store.commit("changeOrderRss",{customerFrom:item.customerFrom});
          this.$store.commit("changeOrderRss",{referPin:item.referPin});
          this.$router.go(-1);
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
                    id:item.id,
                    pinCode:$(".input_confirm").val(),
                  }
                  let param={
                    pinCode:$(".input_confirm").val(),
                    contact:item.contact,
                    mobilePhone:item.mobilePhone
                  }
                  vm.func.ajaxPost(vm.api.customer.verifyCustomer,param,res=>{

                    if(res.status !== 200){
                      this.utils.msg(res.statusText);
                      return false;
                    }
                    if(res.data.code !== 200){
                      this.utils.msg(res.data.message);
                      return false;
                    }
                    if(res.data.data && res.data.data.code === 0){
                      vm.saveCustomerPinCode(params,groupIndex,itemIndex,item);
                    }else if(res.data.data && res.data.data.code === 1103){
                      vm.message = res.data.data.message
                      vm.$vux.confirm.show({
                        title:'友情提示',
                        confirmText:'确定',
                        cancelText:'取消',
                        content:'<div class="confirm-body"><div class="confirmBody2"><p>'+vm.message+'</p></div></div>',
                        onConfirm : () => {
                          vm.$vux.confirm.hide();
                          vm.saveCustomerPinCode(params,groupIndex,itemIndex,item);
                        },
                        onCancel : () => {
                          vm.$vux.confirm.hide();
                        },
                      })
                    }else if(res.data.data && res.data.data.code === 1104){
                      vm.saveCustomerPinCode(params,groupIndex,itemIndex,item);
                    }else{
                      vm.message = res.data.data.message
                      vm.$vux.toast.text(vm.message, 'middle');
                    }
                  })

            }
          })
        }
      } else {//列表路由跳转
        let userId=item.userId;
        let id = item.id;
        let pinCode = item.pinCode;
        if(!pinCode){
          pinCode = ''
        }
        this.utils.goToUrl('/customer/details?id='+id+'&userId='+userId+'&pinCode='+pinCode);
      }
    }
  }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
.split {
  position: relative;
  z-index: 10;
  width: 100%;
  height: 10px;
  margin-top: -10px;
  background: #efeff4;
}

</style>
