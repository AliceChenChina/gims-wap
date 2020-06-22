<template>
<div id="cropWrapper" class="container">
  <div><img id="previewImage" :src="previewImageUrl">
  </div>
  <span class="btn-cancel" type="button" @click="cancel">取消</span>
  <span class="btn-confirm" type="button" @click="confirm">选取</span>
</div>
</template>

<script>
import Cropper from 'cropperjs'
import ImageUtil from './image'
export default {
  data() {
    return {
      cropWrapper: null, // 裁剪布局
      previewImageEl: null, // 用于裁剪的展示图片元素
      previewImageUrl: '', // 用于裁剪的展示图片链接
      Orientation: '', // 拍照时的图片朝向
      fakeLoading: true,
      bigBody: '',
      loadingDiv: ''
    }
  },
  methods: {
    // 取消裁切
    cancel() {
      this.removeCrop()
    },
    // 开始裁切
    confirm() {
      this.startCrop()
    },
    initCrop(url, Orientation) {
      // 初始化裁剪
      // 图片方向
      this.Orientation = Orientation;
      let t = this;
      if (!this.cropper) {
        let body = document.getElementsByTagName('body')[0]
        this.cropWrapper = document.getElementById('cropWrapper');
        this.previewImageEl = document.getElementById('previewImage');
        body.appendChild(this.cropWrapper)
        this.cropper = new Cropper(this.previewImageEl, {
          aspectRatio:  1, // 裁剪设置固定的宽高比
          autoCropArea:  0, // 自动裁切
          viewMode: 1, // 限制在canvas范围
          dragMode: 'move', // 拖拽模式
          guides: true, // 显示在裁剪框上方的虚线。
          cropBoxResizable: true, // 是否通过拖动来调整剪裁框的大小
          cropBoxMovable: true, // 是否通过拖拽来移动剪裁框
          dragCrop: true,  // 拖动
          background: false, // 显示在裁剪框上方的虚线
          checkOrientation: true, // 检查当前图像的Exif定向信息
          checkCrossOrigin: true, // 裁剪设置固定的宽高比
          zoomable: true, // 是否允许放大图像
          zoomOnWheel: false, // 是否可以通过移动鼠标来放大图像
          center: false, // 裁剪框在图片正中心
          toggleDragModeOnDblclick: false // 当点击两次时可以在“crop”和“move”之间切换拖拽模式
          // ready: function () {
          //   if (aspectRatio === 'Free') {
          //     let cropBox = t.cropper.cropBox
          //     cropBox.querySelector('span.cropper-view-box').style.outline = 'none'
          //     t.cropper.disable()
          //   }
          // }
        })
      }
      this.previewImageUrl = url;
      this.cropper.replace(url) // 替换图像的src并重新构建cropper
    },
    creatLoading() {
      // 创建一个Loading元素
      this.bigBody = document.getElementsByTagName('body')[0];
      this.loadingDiv = document.createElement('div');
      let img1 = document.createElement('img');
      this.loadingDiv.setAttribute('id', 'fakeLoading');
      img1.setAttribute('src', '../../../static/img/logoLoading.gif');
      this.loadingDiv.appendChild(img1);
      this.bigBody.appendChild(this.loadingDiv);
    },
    startCrop() {
       // 开始裁剪
      let t = this
      this.creatLoading();
      setTimeout(function () {
        // 一张剪裁的图片,如果没有剪裁，则返回一个绘制整个im的画布
        let croppedCanvas = t.cropper.getCroppedCanvas();
        // 绘制图像
        let roundedCanvas = t.getRoundedCanvas(croppedCanvas);
        // 用canvas的toDataURL()将图片转为dataURL(base64)
        let base64 = roundedCanvas.toDataURL();
        t.compress(base64)
      }, 20)
    },
    compress(base64) {
      // 压缩并修正方向
      let t = this;
      let image = new Image();
      image.src = base64;
      // 图片加载完成后执行
      image.onload = () => {
        this.fakeLoading = true;
        let data = ImageUtil.compress(image, this.Orientation);
        this.fakeLoading = false;
        // 删除Loading元素
        this.bigBody.removeChild(this.loadingDiv);
        this.$emit('finish', data);
      }
    },
    getRoundedCanvas(sourceCanvas) {
      // 绘制图像
      let canvas = document.createElement('canvas')
      let context = canvas.getContext('2d')
      let width = sourceCanvas.width
      let height = sourceCanvas.height
      canvas.width = width
      canvas.height = height
      context.imageSmoothingEnabled = true
      context.drawImage(sourceCanvas, 0, 0, width, height)
      context.globalCompositeOperation = 'destination-in'
      context.beginPath()
      context.rect(0, 0, width, height)
      context.fill()
      return canvas
    },
    removeCrop () {
      // 销毁裁剪对象
      this.$emit('hide')
      this.cropper.destroy()
      this.cropper = null
    }
  }
}
</script>

<style>
img {
  display: block;
  margin: 0 auto;
}
*{
  margin: 0;
  padding: 0;
}
.btn-cancel {
  font-size: 16px;
  position: absolute;
  left: 10%;
  bottom: 20px;
  border:none;
  color: #fff;
  font-weight: bold;
}
.btn-confirm {
  font-size: 16px;
  position: absolute;
  right: 10%;
  bottom: 20px;
  border:none;
  color: #fff;
  font-weight: bold;
}
#cropWrapper.container {
  z-index: 99999;
  position: fixed;
  padding-top: 60px;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background:rgba(0,0,0,1);
}
#cropWrapper.container > div{
  position: absolute;
  width: 100%;
  height: 100%;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%,-50%);
  transform: translate(-50%,-50%);
}
#previewImage {
  max-width: 100%;
}

.cropper-container {
  font-size: 0;
  line-height: 0;
  position: relative;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  direction: ltr;
  -ms-touch-action: none;
  touch-action: none
}
.cropper-container img {
  display: block;
  min-width: 0 !important;
  max-width: none !important;
  min-height: 0 !important;
  max-height: none !important;
  width: 100%;
  height: 100%;
  image-orientation: 0deg
}

.cropper-wrap-box,
.cropper-canvas,
.cropper-drag-box,
.cropper-crop-box,
.cropper-modal {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

.cropper-wrap-box {
  overflow: hidden;
}

.cropper-drag-box {
  opacity: 0;
  background-color: #fff;
}

.cropper-modal {
  opacity: .5;
  background-color: #000;
}

.cropper-view-box {
  display: block;
  overflow: hidden;

  width: 100%;
  height: 100%;

  outline: 1px solid #39f;
  outline-color: rgba(51, 153, 255, 0.75);
}

.cropper-dashed {
  position: absolute;

  display: block;

  opacity: .5;
  border: 0 dashed #eee
}

.cropper-dashed.dashed-h {
  top: 33.33333%;
  left: 0;
  width: 100%;
  height: 33.33333%;
  border-top-width: 1px;
  border-bottom-width: 1px
}

.cropper-dashed.dashed-v {
  top: 0;
  left: 33.33333%;
  width: 33.33333%;
  height: 100%;
  border-right-width: 1px;
  border-left-width: 1px
}

.cropper-center {
  position: absolute;
  top: 50%;
  left: 50%;

  display: block;

  width: 0;
  height: 0;

  opacity: .75
}

.cropper-center:before,
.cropper-center:after {
  position: absolute;
  display: block;
  content: ' ';
  background-color: #eee
}

.cropper-center:before {
  top: 0;
  left: -3px;
  width: 7px;
  height: 1px
}

.cropper-center:after {
  top: -3px;
  left: 0;
  width: 1px;
  height: 7px
}

.cropper-face,
.cropper-line,
.cropper-point {
  position: absolute;

  display: block;

  width: 100%;
  height: 100%;

  opacity: .1;
}

.cropper-face {
  top: 0;
  left: 0;

  background-color: #fff;
}

.cropper-line {
  background-color: #39f
}

.cropper-line.line-e {
  top: 0;
  right: -3px;
  width: 5px;
  cursor: e-resize
}

.cropper-line.line-n {
  top: -3px;
  left: 0;
  height: 5px;
  cursor: n-resize
}

.cropper-line.line-w {
  top: 0;
  left: -3px;
  width: 5px;
  cursor: w-resize
}

.cropper-line.line-s {
  bottom: -3px;
  left: 0;
  height: 5px;
  cursor: s-resize
}

.cropper-point {
  width: 5px;
  height: 5px;

  opacity: .75;
  background-color: #39f
}

.cropper-point.point-e {
  top: 50%;
  right: -3px;
  margin-top: -3px;
  cursor: e-resize
}

.cropper-point.point-n {
  top: -3px;
  left: 50%;
  margin-left: -3px;
  cursor: n-resize
}

.cropper-point.point-w {
  top: 50%;
  left: -3px;
  margin-top: -3px;
  cursor: w-resize
}

.cropper-point.point-s {
  bottom: -3px;
  left: 50%;
  margin-left: -3px;
  cursor: s-resize
}

.cropper-point.point-ne {
  top: -3px;
  right: -3px;
  cursor: ne-resize
}

.cropper-point.point-nw {
  top: -3px;
  left: -3px;
  cursor: nw-resize
}

.cropper-point.point-sw {
  bottom: -3px;
  left: -3px;
  cursor: sw-resize
}

.cropper-point.point-se {
  right: -3px;
  bottom: -3px;
  width: 20px;
  height: 20px;
  cursor: se-resize;
  opacity: 1
}

@media (min-width: 768px) {

  .cropper-point.point-se {
    width: 15px;
    height: 15px
  }
}

@media (min-width: 992px) {

  .cropper-point.point-se {
    width: 10px;
    height: 10px
  }
}

@media (min-width: 1200px) {

  .cropper-point.point-se {
    width: 5px;
    height: 5px;
    opacity: .75
  }
}

.cropper-point.point-se:before {
  position: absolute;
  right: -50%;
  bottom: -50%;
  display: block;
  width: 200%;
  height: 200%;
  content: ' ';
  opacity: 0;
  background-color: #39f
}

.cropper-invisible {
  opacity: 0;
}

.cropper-bg {
  background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAAA3NCSVQICAjb4U/gAAAABlBMVEXMzMz////TjRV2AAAACXBIWXMAAArrAAAK6wGCiw1aAAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1M26LyyjAAAABFJREFUCJlj+M/AgBVhF/0PAH6/D/HkDxOGAAAAAElFTkSuQmCC');
}

.cropper-hide {
  position: absolute;

  display: block;

  width: 0;
  height: 0;
}

.cropper-hidden {
  display: none !important;
}

.cropper-move {
  cursor: move;
}

.cropper-crop {
  cursor: crosshair;
}

.cropper-disabled .cropper-drag-box,
.cropper-disabled .cropper-face,
.cropper-disabled .cropper-line,
.cropper-disabled .cropper-point {
  cursor: not-allowed;
}
.upload-status-wrapper {
// 文件上传状态 布局
position: absolute;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  color: #fff;
}
</style>
