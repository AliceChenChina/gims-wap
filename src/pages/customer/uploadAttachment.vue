<template>
  <view-box ref="viewBox">
    <Header title="附件上传" :leftAction='save' :preventGoBack='true'/>
    <div style="margin:16px;overflow: auto;position: relative">
      <div class="add-img">
        <p class="fz14" v-show="attachList.length">图片(一张不超过10M,最多{{limit}}张,还可上传<span v-text="limit-attachList.length"></span>张)</p>
        <div class="img-list">
          <div class="img-list-pic" v-for="(url,index) in attachList" :key="index" v-show="attachList.length">
            <img class="del" src="../../assets/images/del.png" @click.stop="delImg(index)"/>
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
          <div class="upload" v-if="attachList.length<limit" style="position: relative">
            <input @change="fileChange($event)" type="file" style="width: 100%;height:114px;opacity: 0;position:absolute;background: red;cursor: pointer;z-index: 33" id="upload_file" accept="image/*" multiple/>
            <div class="add" @click="chooseType">
              <div class="add-image" align="center">
                <i class="icon-camera"></i>
                <p class="font13">选择附件上传</p>
              </div>
            </div>
            <div v-if="loadingLi"  class="loadingDiv">
              <img :src="loadingImg" class="loadingImg"/>
            </div>
          </div>
        </div>
      </div>



    </div>

  </view-box>
</template>

<script>
  import Header from '@/pages/common/header';
  import loadingImg from '@/assets/images/loading.gif';
  export default {
    name: 'uploadAttachment',
    data() {
      return {
        showFace: false,
        size: 0,
        limit: 5, //限制图片上传的数量
        customerId:this.$route.query.customerId,
        visitId:this.$route.query.visitId,
        attachList:this.$store.state.recordDetail.attachList,
        loadingImg:loadingImg,
        loadingLi:false,//loading的li
      }
    },
    components: {
      Header
    },
    methods: {
      chooseType() {
        document.getElementById('upload_file').click();
      },
      fileChange(el) {
        //获取信息
        if (!el.target.files[0].size) return;
        this.fileList(el.target);
        el.target.value = ''
      },
      fileList(fileList) {
        let files = fileList.files;
        for (let i = 0; i < files.length; i++) {
          //判断是否为文件夹
          if (files[i].type != '') {
            this.fileAdd(files[i]);
          } else {
            //文件夹处理
            this.folders(fileList.items[i]);
          }
        }
      },
      //文件夹处理
      folders(files) {
        let _this = this;
        //判断是否为原生file
        if (files.kind) {
          files = files.webkitGetAsEntry();
        }
        files.createReader().readEntries(function (file) {
          for (let i = 0; i < file.length; i++) {
            if (file[i].isFile) {
              _this.foldersAdd(file[i]);
            } else {
              _this.folders(file[i]);
            }
          }
        });

      },
      foldersAdd(entry) {
        let _this = this;
        entry.file(function (file) {
          _this.fileAdd(file)
        })
      },
      fileAdd(file) {
        //上传数量不能超过5张
        if (this.attachList.length==this.limit) {
          this.utils.msg("上传数量不能超过5个")
          return;
        }
        //当这个文件上传大于10M的话，就超出上传范围
        if(file.size>10240000){
          this.utils.msg("上传图片大于10M,请重新上传");
          return;
        }
        var that=this;
        //判断是否为图片文件
        if (file.type.indexOf('image') == -1) {
          this.utils.msg("请选择图片文件");
        } else {
          this.loadingLi=true;
          let reader = new FileReader();
          let image = new Image();
          let _this = this;
          reader.readAsDataURL(file);
          reader.onload = function () {
            //给file添加src
            file.src = this.result;
            image.src = this.result;
            image.onload = function () {
              let width = image.width;
              let height = image.height;
              file.width = width;
              file.height = height;
              //ajax传送到后台
              var formData = new FormData();
              formData.append("file",file);
              $.ajax({
                url:'/djjf-web/fileUpload/upload',
                type:"post",
                data:formData,
                processData: false,
                contentType:false,
                success:function(res){
                  that.loadingLi=false;
                  if(res.code==200){
                    let fileTmp=res.data;
                    fileTmp.module='customerVisit';
                    that.attachList.push(fileTmp);
                  }else{
                    this.utils.msg("上传失败,请重试");
                  }
                },
                error:function(){
                  that.loadingLi=false;
                  this.utils.msg("上传失败,请重试");
                }
              })
            };
          }
        }
      },
      delImg(index) {
        this.attachList.splice(index,1);
      },
      save() {
       //编辑保存了之后返回到上一页
       this.$store.commit("changeRecordDetail",{'attachList':this.attachList});
       this.$router.go(-1);
      }
    },

  }
</script>
<style>
  #upload_file{
    width: 27%;height:114px;opacity: 0;position:absolute;background: red;cursor: pointer;z-index: 33
  }
</style>

<style scoped>
  .app-bg,.img-list-pic {

    width: 2.8rem;
    height: 2.8rem;
    display: inline-block;
  }
  .app-bg >>> img {
    width: 2.8rem;
    height: 2.8rem;
  }
  .img-list-pic{
    margin-right: 0.2rem;
    position: relative;
  }
  textarea {
    padding: 10px;
  }

  .font13 {
    font-size:14px;
  }

  .text-length {
    font-size: 14px;
    z-index: 999;
    width: 100%;
    text-align: right;
    margin-bottom: 10px;
    color: #e4e4e4;
  }

  .warning {
    color: #fe9900;
  }

  .add-img {
    width: 100%;

  }

  .add-img p {
    color: #999;
  }

  .mui-content {
    padding-bottom: 60px;
  }

  .mui-content .idea {
    margin-top: 8px;
    background-color: #FFFFFF;
  }

  .good-item {
    text-align: center;
    width: 33%;
    max-width: 100%;
    overflow: hidden;
    padding-right: 10px;
    padding-bottom: 10px;
    float: left;
  }

  .good-item span {
    font-size: 15px;
    height: 30px;
    line-height: 30px;
    border-radius: 50px;
    display: block;
    width: 100%;
    color: #333;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    border: 1px solid #CCCCCC;
  }

  .mui-table {
    padding-top: 10px;
    color: #333;
    padding-left: calc(0.5% + 10px);
  }

  .h-line-behind {
    line-height: 40px;
    padding-left: 10px;
  }

  .question {
    border: 0;
    margin-bottom: 10px;
  }

  .add {
    display: inline-block;
    margin-bottom: 20px;
    float: left;
  }

  .add-image {
    padding-top: 15px;
    width: 115px;
    height: 115px;
    position: relative;
    border: 1px dashed rgba(0, 0, 0, .2);
  }

  .add-image .icon-camera {
    background:url("../../assets/images/upload.png") no-repeat;
    width: 40px;
    background-size: contain;
    height: 40px;
    margin: 10px;
    display: inline-block;
  }

  .good-item .choose {
    color: #fff;
    background-color: #87582E;
    color: #FFF;
    border: 0;
  }

  .mui-btn-block {
    border: 0;
    border-radius: 0;
    background-color: #87582E;
    color: #fff;
    margin-bottom: 0;
    bottom: 0;
  }

  .mui-buttom {
    position: fixed;
    width: 100%;
    bottom: 0;
    z-index: 999;

  }

  /*九宫格*/
  .img-list{
    padding-top: 15px;
  }


  .mui-fullscreen {
    z-index: 9999;
  }

  .del {
    position: absolute;
    width: 25px;
    top: 0;
    right: 0;
    z-index: 999
  }
  .upload{
    display: inline-block;
    width: 2.8rem;
    height: 2.8rem;
  }
  .add >>> .add-image{
    width: 2.8rem;
    height: 2.8rem;
  }
  /*loading图片样式设置*/
  .loadingDiv{
    width:100%;
    height: 100%;
    position:absolute;
    left:0;
    top:0;
    z-index: 9999;
    text-align: center;
    background-color:rgba(0,0,0,0.7);
  }
  .loadingDiv:before{
    content: "";display: inline-block;height: 100%;vertical-align: middle;width: 0;
  }
  .loadingDiv .loadingImg{
    width:50%;height: 50%;vertical-align: middle;
  }

</style>
