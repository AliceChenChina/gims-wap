<template>
    <view-box ref="viewBox" class="order noFooter orderRisk">
        <Header title="风险不匹配确认函" />
            <div class="risk">
                <div class='text'>
                    <div class='left'>投资人条件:</div>
                    <div class='right'>
                        <span class="proType type">{{proRiskLevelName}}</span>
                        <span>该客户为：</span>
                        <span class='cusType type'>{{cusRiskLevelName}}</span>
                    </div>
                </div>
                <div class='text'>客户风险等级不匹配，请上传客户签字确认的《风险不匹配确认函</div>
                <div class='riskContent'>
                    <div class='imgWrapper'>
                        <yd-lightbox class="yd">
                            <yd-lightbox-img  id='img' :src='src'></yd-lightbox-img>
                        </yd-lightbox>
                        <div class='loadingWrapper' v-if="loadingBoolean">
                            <img :src="loadingImg"/>
                        </div>
                        <div class='uploadWrapper'>
                            <img src="static/img/risk.png" class='upload_img'>
                            <input
                                type="file"
                                accept="image/jpeg,image/x-png,image/gif"
                                ref='inputFile'
                                @change="fileChange($event)"
                                id='upload_file'/>
                            <div class="upload" @click="chooseType($event)">
                                <img src="@/assets/images/upload.png" class="add" />
                                <p class="add-title">上传风险不匹配确认函附件</p>
                            </div>
                        </div>
                    </div>
                    <x-button type="warn" class='grayBtn next' @click.native="nextStep">下一步</x-button>
                </div>
            </div>
    </view-box>
</template>

<script>
import Header from '@/pages/common/header'
import Footer from '@/pages/common/footer'
import Select from '@/pages/common/select'
import loadingImg from '@/assets/images/loading.gif';
export default {
    name: 'orderRisk',
    components: {
        Header,
        Footer,
        Select
    },
    data () {
        return {
            type: this.$route.query.type,
            subTitle: '二级市场',
            formData: {
                birthday: '',
                certificate: '',
                certificateDate: ''
            },
            src:'',
            proRiskLevelName:this.$store.state.orderDetail.productDetail.riskLevel,
            cusRiskLevelName:this.$store.state.orderRss.cusLevelName,
            riskMismatch:{},//上传的附件
            loadingImg:loadingImg,//loading的图片
            loadingBoolean:false,//是否开始loading
        }
    },
    mounted(){
        //处理当vuex里面有图片的时候的处理
        let riskMismatch=this.$store.state.orderRss.riskMismatch;
        this.riskMismatch=riskMismatch;
        if(!$.isEmptyObject(riskMismatch)){
            this.src='/djjf-web/file/download?directory=' + riskMismatch.filePath + '&downloadFile=' + riskMismatch.fileId + riskMismatch.fileNameExt + '&fileName=' + riskMismatch.fileName;
            //上传按钮去除掉
            $(".uploadWrapper").remove();
            //将预览图片显示出来
            $(".yd").show();
            //将按钮变成可以点击的红色
            $(".next").removeClass("grayBtn");
            $('.next').addClass('correctBtn');
       }
    },
    beforeRouteLeave(to,from,next){
      if(to.name=='orderRss'){
         this.$store.commit("changeOrderRss",{'riskMismatch':this.riskMismatch});
      }else{
         this.$store.commit("changeOrderRss",{'riskMismatch':{}});
      }
      next();
    },
    methods: {
        chooseType(ev){
            //上传附件点击事件
            document.getElementById('upload_file').click();
        },
        fileChange(el){
            this.loadingBoolean=true;
            let target=el.target;
            let file=target.files[0];
            let reader=new FileReader();
            var that=this;
            reader.readAsDataURL(file);
            reader.onload=function(){
                //上传模块给后台
                var orderRss = new FormData();
                orderRss.append("file",file);
                $.ajax({
                url:'/djjf-web/fileUpload/upload',
                type:"post",
                data:orderRss,
                processData: false,
                contentType:false,
                success:function(res){
                  if(res.code==200){
                    let fileTmp=res.data;
                    fileTmp.fileCatalog="risk_mismatch";
                    fileTmp.module="trade";
                    //将loading图片删除
                    that.loadingBoolean=false;
                    //赋值新的src
                    that.src='/djjf-web/file/download?directory=' + fileTmp.filePath + '&downloadFile=' + fileTmp.fileId + fileTmp.fileNameExt + '&fileName=' + fileTmp.fileName;
                   //报单上传附件
                    that.riskMismatch=fileTmp;
                    //上传按钮去除掉
                    $(".uploadWrapper").remove();
                    //将预览图片显示出来
                    $(".yd").show();
                    //将按钮变成可以点击的红色
                    $(".next").removeClass("grayBtn");
                    $(".next").addClass("correctBtn");
                  }
                }
              })
            }
        },
        //下一步方法
        nextStep(){
           if(!$(".next").hasClass("grayBtn")){
               this.$router.push({name:'orderRss'});
           }
        }
    }
}
</script>
<style scoped>
    .yd{
      display: none;
    }

    .loadingWrapper{
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background: #FAFAFA;
    }

    .loadingWrapper img{
        width: 60px!important;
        height: 60px!important;
    }

    .correctBtn{
        background: #505269!important;
        color: white!important;
    }
</style>
