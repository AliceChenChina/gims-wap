<template >
  <view-box ref="viewBox" class="productRedeem ">
    <Header title="赎回" />
    <div class='orderDiv'>
      <div class='orderDivC whiteBg ' :class="{'noPadding':status!==0}">
      <group class=" pt10 whiteBg" title="赎回信息" >
        <!--<group-title >赎回信息</group-title>-->
        <cell title="产品名称" class="bottom-border">{{data.productName}}</cell>
        <cell title="客户名称" class="bottom-border">{{data.customerName}}</cell>
        <cell title="赎回份额（份）" >{{data.redeemShare}}</cell>
        <cell title="" inline-desc="仅针对线下汇款的产品确认份额，赎回的款项将由基金管理人确认后划款至客户原汇款银行卡"></cell>
      </group>
      <div class="tenHeight"></div>
      <!--身份证正反面显示 -- 开始-->
      <div class=" pt10">
      <group class="noBorder" title="必填上传资料" title-color="#303030"></group>
      <div class="img-list">
        <div class="img-list-pic" style="display: inline-block;">
          <yd-lightbox>
            <div class="app-bg">
              <yd-lightbox-img
                class="app-bg"
                :src="'/djjf-web/file/downloadCretFileUrl?downloadFile='+data.frontCretFileUrl"
              >
              </yd-lightbox-img>
            </div>
          </yd-lightbox>
        </div>
        <div  class="img-list-pic" style="display: inline-block;">
          <yd-lightbox>
            <div class="app-bg">
              <yd-lightbox-img
                class="app-bg"
                :src="'/djjf-web/file/downloadCretFileUrl?downloadFile='+data.backCretFileUrl"
              >
              </yd-lightbox-img>
            </div>
          </yd-lightbox>
        </div>
      </div>
        <div class="tenHeight"></div>
      <!--身份证正反面显示 -- 结束-->
      <!--上传其他资料 -- 开始-->
      <group class="noBorder" title="选填上传资料" title-color="#303030"></group>
      <div class="applyFileList">
      <div class="uploadTitle">
        <p class="fl">申请表</p>
        <p class="fr" v-if="status==0">最多能上传<span class="red">1</span>张，已上传<span class="red">{{applyFileList.length}}</span>张,还可上传<span class="red">{{1-applyFileList.length}}</span>张</p>
      </div>
        <div class="add-img">
          <p v-if="applyFileList.length == 0 && status !=0" style="padding: 6px 15px;color: #999999;font-size: 12px">无资料</p>

      <div class="img-list" >
        <div v-for="(url,index) in applyFileList" :key="index" class="img-list-pic" v-if="applyFileList.length">
          <img class="del" src="../../assets/images/del.png" @click.stop="delImg(applyFileList,index)" v-if="status==0"/>
          <yd-lightbox>
            <div class="app-bg">
              <yd-lightbox-img
                class="app-bg"
                :src="'/djjf-web/file/download?directory=' + url.filePath + '&downloadFile=' + url.fileId + url.fileNameExt + '&fileName=' + url.fileName"
              >
              </yd-lightbox-img>
            </div>
          </yd-lightbox>
        </div>
        <uploader
          name="file"
          :showHeader = "false"
          :images="applyFileList"
          upload-url="/djjf-web/fileUpload/upload"
          v-if="applyFileList.length<1 && status==0"
          :max-size="10240000"
          class="upload"
        ></uploader>
      </div>
        </div>
    </div>
      <div class="redeemOtherFileList">
        <div class="uploadTitle">
          <p class="fl">其他资料</p>
          <p class="fr" v-if="status==0">最多能上传<span class="red">3</span>张，已上传<span class="red">{{redeemOtherFileList.length}}</span>张,还可上传<span class="red">{{3-redeemOtherFileList.length}}</span>张</p>
        </div>
        <div class="add-img">
          <p v-if="redeemOtherFileList.length == 0 && status !=0" style="padding: 6px 15px;color: #999999;font-size: 12px">无资料</p>
          <div class="img-list" >
            <div class="img-list-pic" v-for="(url,index) in redeemOtherFileList" :key="index" v-if="redeemOtherFileList.length">
              <img class="del" src="../../assets/images/del.png" @click.stop="delImg(redeemOtherFileList,index)" v-if="status==0"/>
              <yd-lightbox>
                <div class="app-bg">
                  <yd-lightbox-img
                    class="app-bg"
                    :src="'/djjf-web/file/download?directory=' + url.filePath + '&downloadFile=' + url.fileId + url.fileNameExt + '&fileName=' + url.fileName"
                  >
                  </yd-lightbox-img>
                </div>
              </yd-lightbox>
            </div>
            <uploader
              name="file"
              :max="3"
              :showHeader = "false"
              :images="redeemOtherFileList"
              upload-url="/djjf-web/fileUpload/upload"
              v-if="redeemOtherFileList.length < 3 && status==0"
              :max-size="10240000"
              class="upload redeemOtherFileList-upload"
            ></uploader>
          </div>

        </div>

      </div>
      </div>
      </div>

    </div>
    <div class="footer-btn" v-if="status==0">

      <span  class="submitButton btn" @click="submit" v-if="status==0">提交</span>
      <span  class="cancelButton btn" @click="cancel" v-if="status==0">撤单</span>
    </div>

</view-box>
</template>

<script>
import Header from '@/pages/common/header'
import Footer from '@/pages/common/footer'
import GroupTitle from "vux/src/components/group-title/index";
import loadingImg from '@/assets/images/loading.gif';
import Uploader from 'vux-uploader'
import BScroll from 'better-scroll'
import { setTimeout } from 'timers';
export default {
  name: 'redeem',
  components: {
    GroupTitle,
    Header,
    Uploader,
    Footer,
  },
  data () {
    return {
      tradeId:this.$route.params.tradeId,
      status:this.$route.params.status,
      data:'',
      applyFileList:[],
      redeemOtherFileList:[],
    }
  },
  created(){
    var that = this;
    //通过客户赎回申请订单得到赎回详细
    if(this.tradeId){
      this.func.ajaxPost(this.api.product.getRedeemApplyInfo, {tradeId:this.tradeId}, res => {
          if (res.data.code == 200) {
             that.data=res.data.data;
             if(that.data.applyFileList){
               that.applyFileList = that.data.applyFileList;
             }
            if(that.data.redeemOtherFileList){
              that.redeemOtherFileList = that.data.redeemOtherFileList;
            }
          }
      })
    }

  },
  mounted(){
    var that = this;
    that.$nextTick(function () {
      setTimeout(function(){
        let wrapper = document.querySelector('.orderDiv')
        let scroll = new BScroll(wrapper,{
          bounce: false,
          click: true,
        })
      },500)
    })
  },
  methods: {
    submit:function(){
      var params = {
        tradeId:this.tradeId,
        applyFileList:this.applyFileList,
        redeemOtherFileList:this.redeemOtherFileList
      }
      this.$vux.confirm.show({
        title:'赎回申请确认',
        confirmText:'确认提交',
        cancelText:'再想想',
        content:'<div class="confirm-body"><div class="confirmBody2"><p>产品名称：'+this.data.productName+'</p><p>客户名称：'+this.data.customerName+'</p><p>赎回份额：'+this.data.redeemShare.toLocaleString()+'份</p><div class="text-center lightGrey mt10 fw400">是否确认赎回？</div></div>',
        // 组件除show外的属性
        onCancel : () => {
          this.$vux.confirm.hide();
        },
        onConfirm : () => {
          this.$vux.confirm.hide();
          this.func.ajaxPost(this.api.product.submitRedeemApplyInfo, params, res => {
          if (res.data.code == 200) {
            this.$router.push({name:'redeemResult',params:{redeemStatus:1}})
          }
          })
        }
      })

    },
    cancel:function(){
      var params = {
        tradeId:this.tradeId,
      }
      this.$vux.confirm.show({
        title:'撤单确认',
        confirmText:'确认',
        cancelText:'再想想',
        content:'<div class="confirm-body"><div class="confirmBody2"><p>产品名称：'+this.data.productName+'</p><p>客户名称：'+this.data.customerName+'</p><p>赎回份额：'+this.data.redeemShare.toLocaleString()+'份</p><div class="text-center lightGrey mt10 fw400">是否确认撤单？</div></div>',
        // 组件除show外的属性
        onCancel : () => {
          this.$vux.confirm.hide();
        },
        onConfirm : () => {
          this.$vux.confirm.hide();
          this.func.ajaxPost(this.api.product.cancelRedeemApplyInfo, params, res => {
            if (res.data.code == 200) {
              this.$router.push({name:'redeemResult',params:{redeemStatus:2}})
            }
          })
        }
      })

    },
    delImg(imgArr,index) {
      imgArr.splice(index,1);
    },

  }
}
</script>


<style scoped>
  .productRedeem {
    height: 100%;
  }
  #app .productRedeem>>>.weui-tab__panel {
    padding-bottom: 55px;
  }
  #app .productRedeem>>>.weui-tab__panel .detailsHeader{
    position: absolute;
  }
.orderDiv{
  height: 100%;
}
  .orderDiv .orderDivC{
    padding-bottom: 60px;
  }
  .orderDiv .orderDivC.noPadding{
    padding-bottom: 0;
  }

  #app .footer-btn{
    z-index:99;

    font-size: 0;
    text-align: center;

    background-color: #ffffff;

  }

 .footer-btn .btn{
    border-radius: 3px;
    padding: 0px;
    height: 50px;
   width: 94%;
   display: inline-block;
   font-size: 15px;
   text-align: center;
   line-height: 50px;
   font-weight:500;
   margin-bottom: 10px;

 }


  #app .footer-btn .cancelButton{
    background-color: #ffffff;
    color: #666666;
    border: 1px solid #DDDDDD;
    height: 49px;
    line-height: 49px;
    box-sizing: border-box;


  }

.tenHeight{
  height: 10px;
  background: #fafafa;
}
.img-list{
  padding: 0.4rem;
  overflow: hidden;
}
.img-list > .img-list-pic {

  width: 2.8rem;
  height: 2.8rem;
  position: relative;
  display: inline-block;
  margin-right: 0.2rem;

}
  .app-bg{
    width: 2.8rem;
    height: 2.8rem;
  }
  .upload{
    display: inline-block;
    padding: 0;
  }

.submitButton{
  color: white!important;
  background: #505269!important;
}
.grizzle{
  color: white!important;
  background: #DCDCE1!important;
}
.uploadTitle{
  overflow: hidden;
  padding: 0 15px;
}
.red{
  color: red;
}
.del {
  position: absolute;
  width: 25px;
  top: 0;
  right: 0;
  z-index: 999
}
/* 修改上传组件的样式 */
.weui-cell:before{
  border-top: none;
}
.weui-tab >>>.weui-uploader__input-box{
  width: 100px;
  height: 100px;
  background-color: #fafafa;
  border: none;

}
.weui-tab >>>.weui-uploader__files{
  display: none;
}
.weui-tab >>>.weui-uploader__input-box.remove{
  display: none;

}
.weui-tab >>> .weui-uploader__input-box:before{
  content: ' ';
  width: 80%;
  height: 40px;
  top: 30%;
  background:url("../../assets/images/upload.png") no-repeat;
  background-color: #fafafa;
 background-position: center;
  background-size: contain;

}
.upload >>> .weui-uploader__input-box:after{
  content: '上传申请表';
  font-size: 12px;
  width: 80%;
  text-align: center;
  height: auto;
  top: 70%;
  background-color: #fafafa;

}
  .redeemOtherFileList-upload >>> .weui-uploader__input-box:after{
    content: '上传其他资料';
  }
  .applyFileList,.redeemOtherFileList{
    background: white;
    padding-top: 10px;

  }
  .redeemOtherFileList{
    margin-bottom: 10px;
  }

 .productRedeem >>> .weui-cells__title{
    font-size: 16px;
   color: #333333;
   font-weight: 500;
  }
  #app .productRedeem >>> .weui-cells .weui-cell {
    font-size: 16px;
    color: #303030;
  }
  #app .productRedeem >>> .weui-cells .weui-cell .weui-cell__ft{
    font-size: 14px;
    color: #999999;
    max-width:65%;
    word-break: break-all;
    display: -webkit-box;
    -webkit-line-clamp:2;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
  }
  #app .productRedeem >>> .weui-cells .weui-cell .vux-cell-bd .vux-label-desc{
    color: #9B9B9B;
    font-size: 10px!important;

  }
  .bottom-border{
    border-bottom: 1px solid #E6E6E6;
  }
  .weui-tab >>> .weui-uploader__input-box{
    width: 2.8rem;
    height: 2.8rem;
  }
  .pb20{
    padding-bottom: 20px;
  }

</style>


