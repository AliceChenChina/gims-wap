<template>
<div>
  <div class="upload-wrapper" :class="{'upload-status-bg': showStatusWrapper, 'mb15': (!showSpan || defaultUrl)}" :style="{backgroundImage: 'url(' + imgUrl + ')'}">
    <input v-if="isIos && !destroyInput" @change="onChange" class="input" type="file" accept="image/jpg,image/jpeg,image/png,image/gif" />
    <input v-if="!isIos && !destroyInput" @change="onChange" class="input" type="file" accept="image/jpg,image/jpeg,image/png,image/gif" />
    <!-- 上传状态 -->
    <div v-if="showStatusWrapper" class="upload-status-wrapper">
      <i class="fail" v-if="showStatusFail">！</i>
      <i v-else>{{procent}}%</i>
    </div>
  </div>
  <div class="uploadSpan" v-if="showSpan && !defaultUrl">
    <p>建议上传留肩职业照，</p>
    <p>作为客户沟通的形象展示</p>
  </div>
  <crop ref="cropWrapper" v-show="showCrop" @hide="showCrop=false" @finish="setUpload"></crop>
</div>
</template>

<script>
import Exif from 'exif-js'
import Crop from './crop'
import ImageUtil from './image'
const defaultImg = '../../../static/img/upload_photo_bg.png'
export default {
  components: {
    Crop
  },
  props: {
    defaultUrl: {
      type: String,
      default: ''
    }
  },
  watch: {
    defaultUrl() {
      this.setImageUrl()
    }
  },
  mounted() {
    this.setImageUrl()
  },
  data() {
    return {
      destroyInput: false, // 是否销毁input元素, 解决在第二次和第一次选择的文件相同时不触发onchange事件的问题
      isIos: ImageUtil.isIos, // 是否为ios设备
      imgUrl: '', // 显示的图片地址
      filename: '', // 上传的文件名称
      Orientation: '', // 拍照时的图片方向
      showCrop: false, // 是否显示裁剪组件
      showStatusWrapper: false, // 上传状态布局
      showStatusFail: false, // 上传失败
      procent: 0, // 上传进度
      showSpan: true
    }
  },
  methods: {
    setImageUrl() {
      this.imgUrl = this.defaultUrl ? this.defaultUrl : defaultImg
    },
    onChange(e) {
      // 监测input传入file文件
      let files = e.target.files
      let file = e.target.files[0]
      if (files.length > 1) {
        this.utils.msg('最多只能上传1张图片，请重新选择')
        return false
      }
      if (['image/jpg', 'image/jpeg', 'image/png', 'image/gif'].indexOf(file.type) < 0) {
        this.utils.msg('请上传图片')
        return false
      }
      if (file.size > 10 * 1024 * 1024) {
        this.utils.msg('请上传不超过10M的图片')
        return false
      }
      let url = ImageUtil.getObjectURL(file);
      this.filename = file.name
      this.destroyInput = true
      setTimeout(() => {
        this.destroyInput = false
      }, 20)
      // 获取拍照时的信息，解决拍出来的照片旋转问题
      let t = this
      Exif.getData(file, function() {
        let Orientation = Exif.getTag(file, 'Orientation');
        t.Orientation = Orientation;
        t.initCrop(url)
      })
    },
    initCrop(url) {
      // 初始化裁剪
      this.showCrop = true
      this.$refs.cropWrapper.initCrop(url, this.Orientation)
    },
    setUpload(base64) {
      // 设置上传
      let t = this
      t.showCrop = false
      t.imgUrl = base64
      t.procent = 0
      t.showStatusFail = false
      t.showStatusWrapper = true
      t.showSpan = false;
      t.upload(base64)
    },
    upload(base64) {
      // 再执行上传
      let t = this
      let that = this;
      let imgFile = ImageUtil.base64Img2Blog(base64)
      imgFile.lastModifiedDate = new Date()
      ImageUtil.upload({
        file: imgFile,
        filename: t.filename,
        url: '/djjf-web/fileUpload/jdCloud/upload',
        onProgress: function(file, procent) {
          t.procent = procent
        },
        onSuccess: function(file, res) {
          t.showStatusWrapper = false
          t.$emit('uploadSuccess', res)
        },
        onError: function(file, err) {
          t.showStatusFail = true
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.upload-wrapper {
  position: relative;
  width: 60px;
  height: 60px;
  background-size: cover;
  border: 0;
  border-radius: 50%;
  margin: 25px auto 0px;
  .input {
    position: absolute;
    z-index: 1;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    -webkit-tap-highlight-color: rgba(0,0,0,0);
  }
  &.upload-status-bg:before {
    // 文件上传状态 半透明背景
    content: " ";
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 50%;
  }
  .upload-status-wrapper {
    // 文件上传状态 布局
    position: absolute;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    color: #fff;
    .fail {
      // 上传失败
      text-align: center;
      width: 25px;
      height: 25px;
      line-height: 25px;
      border-radius: 50%;
      background: #F43530;
    }
  }
}
.uploadSpan{
  margin-top: 3px;
  margin-bottom: 15px;
}
.uploadSpan p{
  text-align: center;
  font-size: 12px;
  line-height: 20px;
  color: #666666;
}
  .mb15{
    margin-bottom: 15px;
  }
</style>
