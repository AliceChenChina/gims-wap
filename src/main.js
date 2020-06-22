import Vue from 'vue'
import App from './App'
import utils from './utils/utils.js'
import powerKey from './utils/powerKey.js'
import './vuxConfig' //vux配置
import jquery from 'jquery'
import axios from 'axios'
import func from './public/func'
import request from './public/request'
import api from './api/api'
import store from './store/store'
import router from './router'
import uploader from 'vue-simple-uploader'
Vue.use(uploader)
// import VConsole from 'vconsole'
// const vConsole = new VConsole()
// console.log(vConsole.version)

import {LightBox, LightBoxImg, LightBoxTxt} from 'vue-ydui/dist/lib.rem/lightbox';
import ErroToast from "./pages/common/erroToast"

Vue.component(LightBox.name, LightBox);
Vue.component(LightBoxImg.name, LightBoxImg);
Vue.component(LightBoxTxt.name, LightBoxTxt);
import 'vue-ydui/dist/ydui.base.css';

import VueLazyload from 'vue-lazyload'
import './assets/css/base.less'
Vue.use(VueLazyload)

Vue.prototype.$http = axios
Vue.prototype.api = api
Vue.prototype.func = func
Vue.prototype.request = request

Vue.config.productionTip = false
const FastClick = require('fastclick');
FastClick.attach(document.body)
Vue.prototype.utils = utils;
Vue.prototype.powerKey = powerKey;
window.$ = jquery

Vue.use(ErroToast)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
let deviceWidth = document.documentElement.clientWidth || document.body.clientWidth;
let htmlObj = document.documentElement;
htmlObj.style.fontSize = deviceWidth/10 + 'px';

//输入框兼容处理
window.addEventListener("resize", function () {
  let deviceWidth = document.documentElement.clientWidth || document.body.clientWidth;
  let htmlObj = document.documentElement;
  htmlObj.style.fontSize = deviceWidth/10 + 'px';
  if (document.activeElement.tagName == "INPUT" || document.activeElement.tagName == "TEXTAREA") {
    window.setTimeout(function () {
      document.activeElement.scrollIntoViewIfNeeded();
    }, 0);
  }
})


