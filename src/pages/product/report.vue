<template>
  <view-box ref="viewBox" class="productReport noFooter">
    <Header title="产品公告" />
    <scroller lock-x height="-33">
      <div>
        <group class="noBorder">  
          <a :href="'/djjf-web/file/download?directory=' + item.filePath + '&downloadFile=' + item.fileId + item.fileNameExt + '&fileName=' + item.fileName"  v-for="(item,index) in productAnnouncement" :key="index">
            <cell :title="item.title"></cell>  
          </a>   
        </group>     
        <NoData></NoData>
      </div>
    </scroller>
  </view-box>
</template>

<script>
import Header from '@/pages/common/header'
import Footer from '@/pages/common/footer'
import NoData from '@/pages/common/noData'
export default {
  name: 'productReport',
  components: {
    Header,
    Footer,
    NoData
  },
  data () {
    return {
      productId:this.$route.query.productId,
      productAnnouncement:[],//产品公告
    }
  },
  mounted(){
    this.fetchList();
  },
  methods: {
    //获取产品财报
    fetchList(){
      $(".noData").hide();
      let data={};
      data={"productId":this.productId,"category":3};
      this.func.ajaxPost(this.api.product.Report,data,res=>{
        if(res.data.code==200){
          if(res.data.data.length==0){
            $(".noData").show();
          }
          this.productAnnouncement=res.data.data;
        }
      })
    }
  }
}
</script>
