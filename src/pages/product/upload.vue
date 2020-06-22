<template>
<div class="uploadDiv">
    <div class="imgMax"  v-show="imgMaxBoolean">
        <div class="imgMaxHeader">
            <div class="left-arrow" @click="closeImgMax"></div>
            <div class="floatRight">
                <input
                    type="file"
                    accept="image/jpeg,image/x-png,image/gif"
                    ref='inputFile'
                    @change="modifyFileChange($event)"
                    class='modify_file'/>
               <span class="dot"> ...</span>
            </div>
        </div>
        <div class="imgMaxCotent">
            <img :src="loadingImg" v-if="modifyLoadingBoolean" class="loadingImg"/>
            <img :src="src[currentIndex]" v-if="!modifyLoadingBoolean">
        </div>
    </div>
    <div v-show="!imgMaxBoolean" style="width:100%">
        <!-- 图片 -->
        <div v-show="imgBoolean" @click="showImg(index)" v-for="(item,index) in src" :key="index" class="ydDiv">
            <div class='yd'>
                <img src="@/assets/images/delete.png"  class="delete" @click.stop="deleteImg(index)"/>
                <img :src="item">
           </div>
        </div>
        <!-- loading图片 -->
        <div v-if="loadingBoolean" class="loadingWrapperDiv">
            <div class='loadingWrapper'>
                 <img :src="loadingImg"/>
            </div>
        </div>
        <!-- 上传文件 -->
        <div  v-if="upBoolean" class="uploadWrapperDiv">
            <div class="uploadWrapper">
                <div class="upload">
                    <input
                            type="file"
                            accept="image/*"
                            ref='inputFile'
                            @change="fileChange($event)"
                            class='upload_file'/>
                        <img src="@/assets/images/upload.png" class="add"/>
                        <p class="add-title">{{title}}</p>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import loadingImg from '@/assets/images/loading.gif';
import { setTimeout } from 'timers';
    export default {
        props:{
            title:String,
            module:String,
            fileCatalog:String,
            finalFuc:Function,
            maxLength:{
                type:Number,
                default:1
            },
            value:[Object,Array],
        },
        data(){
            return{
                loadingImg:loadingImg,//loading的图片
                loadingBoolean:false,//是否开始loading
                upBoolean:true,//上传判断
                imgBoolean:false,//图片显示
                imgMaxBoolean:false,//大图片显示
                modifyLoadingBoolean:false,//修改图片的loading显示
                src:[],//图片地址
                file:[],//输出图片地址
                currentIndex:0,//当前点击的图片
            }
        },
        created(){
            //给src,file赋值
            if(!Array.isArray(this.value)){
                if(this.value.filePath){
                    this.file.push(this.value);
                    this.src.push('/djjf-web/file/download?directory=' + this.value.filePath + '&downloadFile=' + this.value.fileId + this.value.fileNameExt + '&fileName=' + this.value.fileName);
                }
            }else{
                for(var i=0;i<this.value.length;i++){
                    if(this.value[i].filePath){
                        this.file.push(this.value[i]);
                        this.src.push('/djjf-web/file/download?directory=' + this.value[i].filePath + '&downloadFile=' + this.value[i].fileId + this.value[i].fileNameExt + '&fileName=' + this.value[i].fileName);
                    }
                }
            }
            //显示还是隐藏图片,和上传按钮
            if(this.src.length){
                this.imgBoolean=true;
                //是否还显示上传按钮
                if(this.src.length>=this.maxLength){
                    this.upBoolean=false;
                }else{
                    this.upBoolean=true;
                }
            }
        },
        methods:{
            fileChange(el){
                //是否还显示上传按钮
                if(this.src.length+1>=this.maxLength){
                    this.upBoolean=false;
                }
                let target=el.target;
                let file=target.files[0];
                 //限制图片大小不能超过10M
                let fileSize=file.size;
                if(fileSize>10485760){
                    this.utils.msg('图片上传不能超过10M');
                    return;
                }
                //开启loading图片
                this.loadingBoolean=true;
                let reader=new FileReader();
                var that=this;
                reader.readAsDataURL(file);
                reader.onload=function(ev){
                    //上传模块给后台
                    var orderRss = new FormData();
                    orderRss.append("file",file, file.name);
                    $.ajax({
                        url:'/djjf-web/fileUpload/upload',
                        type:"post",
                        data:orderRss,
                        processData: false,
                        contentType:false,
                        success:function(res){
                            if(res.code==200){
                                let fileTmp=res.data;
                                fileTmp.module=that.module;
                                fileTmp.fileCatalog=that.fileCatalog;
                                //将loading图片删除
                                that.loadingBoolean=false;
                                //赋值新的src
                                that.src.push(ev.target.result);
                                //that.src.push('/djjf-web/file/download?directory=' + fileTmp.filePath + '&downloadFile=' + fileTmp.fileId + fileTmp.fileNameExt + '&fileName=' + fileTmp.fileName);
                                that.imgBoolean=true;
                                //报单上传附件
                                that.file.push(fileTmp);
                                //清空input的val值
                                target.value='';
                                //执行最后的回调函数
                                that.finalFuc();
                            }
                        }
                    })
                }
            },
            modifyFileChange(el){
                let target=el.target;
                let file=target.files[0];
                 //限制图片大小不能超过10M
                let fileSize=file.size;
                if(fileSize>10485760){
                    this.utils.msg('图片上传不能超过10M');
                    return;
                }
                let reader=new FileReader();
                var that=this;
                this.modifyLoadingBoolean=true;
                reader.readAsDataURL(file);
                reader.onload=function(ev){
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
                                that.modifyLoadingBoolean=false;
                                let fileTmp=res.data;
                                fileTmp.module=that.module;
                                fileTmp.fileCatalog=that.fileCatalog;
                                //修改新的src地址
                                 that.src[that.currentIndex]=ev.target.result;
                               // that.src[that.currentIndex]='/djjf-web/file/download?directory=' + fileTmp.filePath + '&downloadFile=' + fileTmp.fileId + fileTmp.fileNameExt + '&fileName=' + fileTmp.fileName;
                                //报单上传附件
                                that.file[that.currentIndex]=$.extend(true,{},fileTmp);
                                //清空input的val值
                                target.value='';
                                //执行最后的回调函数
                                that.finalFuc();
                                $('.detailsHeader').hide();
                                $('.vux-header').hide();
                                setTimeout(function(){
                                    $("#app .weui-tab__panel").css("padding-top",'0px');
                                },1)
                            }
                        }
                    })
                }
            },
            showImg(index){
               this.currentIndex=index;
               $('.btnDiv').hide();
               $('.detailsHeader').hide();
               $('.vux-header').hide();
               $("#app .weui-tab__panel").css("padding-top",'0px')
               this.imgMaxBoolean=true;
            },
            closeImgMax(){
               this.imgMaxBoolean=false;
               $('.btnDiv').show();
               $('.vux-header').show();
               $('.detailsHeader').show();
               $("#app .weui-tab__panel").css("padding-top",'44px')
            },
            deleteImg(index){
                this.src.splice(index,1);
                this.file.splice(index,1);
                //减少的时候看看是否显示上传按钮
                if(this.src.length<this.maxLength){
                    this.upBoolean=true;
                }
                //执行最后的回调函数
                this.finalFuc();
            }
        }
    }
</script>

<style scoped>
div{
  display: inline-block;
  vertical-align: top;
}

*{
  margin: 0px;
  padding: 0px;
}

.uploadDiv{
  font-size: 0px;
  width: 100%;
}

.upload{
    font-size: 12px;
}

.uploadWrapper,.loadingWrapper{
   /* margin-right: 4px; */
   width: 90px;
   height: 90px;
   background: #FAFAFA;
   display: flex;
   position: relative;
   justify-content: center;
   align-items: center;
}

.yd{
    position: relative;
    /* margin-right: 4px; */
}

.yd img{
   width: 90px;
   height: 90px;
}

.delete{
   height: 30px!important;
   width: 30px!important;
   position: absolute;
   top: 0px;
   right: 0px;
}

.upload{
    position: absolute;
    width: 80px;
    height: 60px;
    text-align: center;
    margin-top: -30px;
    margin-left: -40px;
    top: 50%;
    left: 50%;
    z-index: 999;
}

.upload img{
    width: 38px;
    height: 38px;
    display: inline-block;
}

.upload_file{
    width: 100%;
    height: 100%;
    opacity: 0;
    position: absolute;
    margin-top: -30px;
    margin-left: -40px;
    top: 50%;
    left: 50%;
}

/* 大图片显示 */
.imgMax{
    background-color: rgb(0, 0, 0);
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1502;
    display: flex;
    align-items: center;
    justify-content: center;
}

.imgMaxHeader{
  width: 100%;
  height: 38px;
  position: absolute;
  top: 0px;
  padding-left:10px;
  padding-right: 10px;
  background: rgba(0, 0, 0, 0.3);
  z-index: 999999;
}

.imgMaxHeader div{
    color: white;
}

.dot{
    font-size: 28px;
    line-height: 28px;
}


.imgMaxHeader .left-arrow{
    position: absolute;
    width: 30px;
    height: 30px;
    top: 8px;
    left: 10px;
}

.imgMaxHeader .left-arrow::before{
    content: "";
    position: absolute;
    width: 12px;
    height: 12px;
    border: 2px solid white;
    border-width: 2px 0 0 2px;
    -webkit-transform: rotate(315deg);
    transform: rotate(315deg);
    top: 8px;
    left: 7px;
}

.floatLeft{
    float: left;
}

.floatRight{
  float: right;
  width: 40px;
  height: 38px;
  text-align: right;
}

.modify_file{
  opacity: 0;
  position: absolute;
  width: 40px;
  height: 38px;
  right: 10px;
}

.imgMaxCotent{
  width: 100%;
  text-align: center;
}

.imgMaxCotent img{
    width: 100%;
}

.loadingImg{
    width: 50px!important;
}
</style>
