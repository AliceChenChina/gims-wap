<template>
  <div >
    <div class="list-content" v-if="showMore">
      <ul>
        <li v-for="item in customerCapitalList" class="list-content-li" @click="goTo(item.pinCode)">
          <span>{{item.customerName?item.customerName:'--'}}</span>
          <a  href="javascript:void(0)" class="header-icon-right" ></a>
          <span class="UDC-Bold">{{item.amount}}</span>
        </li>
      </ul>
    </div>
    <div class="list-content-arrow" :class="showMore?'arrow-verse':''">
      <div class="arrow" @click="showMore = !showMore" >
      </div>
    </div>
  </div>
</template>
<script>
    export default {
        props: {
          customerCapitalList: {
              type: Array,
              default: []
            },
        },
        data () {
          return {
            showMore:true
          }
        },
      created(){
        this.customerCapitalList.forEach(item =>{
          for(var key in item){
            if(item.hasOwnProperty(key)){
              if(key === 'amount'){
                if(!item[key]){
                  item[key] = '--'
                  return false;
                }
                item[key] =  this.utils.formatData(item[key]);
              }
            }
          }
        })

      },
      methods:{
        goTo(pinCode){
          this.$router.push({ path: '/customer/assetsList',query:{pinCode:pinCode}});
        }

      }
    }
</script>
