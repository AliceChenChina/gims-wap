import axios from 'axios'
import CryptoJS from 'crypto-js'
import Key from '@/aes/key.js'
import utils from '@/utils/utils.js'
//import RSAData from '@/rsa/rsaData.js'
// 配置axios
axios.defaults.baseURL = '';
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8' ;
axios.defaults.withCredentials = true;
axios.defaults.timeout=10000;//10秒
var loadingNum=0;
var showLoading=true;
var loadingDiv="<div id='loading'><img src='../../../static/img/logoLoading.gif'/></div>";
//配置loading框,发起请求头
axios.interceptors.request.use(config=>{
  //发起loading弹框
  if(loadingNum==0&&showLoading){
    $("body").append(loadingDiv);
  }
 loadingNum++;
  return config
},erro=>{
  return Promise.reject(error)
})

//接收到请求数据
axios.interceptors.response.use(data=>{
  if(loadingNum<0)return;
  loadingNum--;
  //最后一次响应成功关闭loading
  if(loadingNum==0&&showLoading){
    $("#loading").remove();
  }
  return data
},erro=>{
  //请求失败
  $("#loading").remove();
  $('.loadingWrapper').remove();
  if(erro.message.indexOf('timeout')==0){
     //超时捕获
    utils.msg("请求超时,请重新尝试")
  }else{
    utils.msg("请求失败,请重新尝试")
  }
  return Promise.reject(erro)
})


export default {
  //api是路径,post是请求数据,hideloadding是否关闭全局的loading,isSelfHandelErro是否自己单独处理错误的回调函数
  ajaxPost(api, post, cb,hideloadding,isSelfHandelErro) {
    api = '/djjf-web' + api;
    if(hideloadding){

    }else{

    }
    //aes加密
    post = JSON.stringify(post);
    //rsa加密
   // post=RSAData.encrypt(post);
    post=encrypt(post);

    axios.post(api, post, {
      headers: {
        'token': localStorage.getItem("token"),
        'source':'WAP',
      }
    }).then(function(res){
      //当没有登录的时候调回到登录页面
      if(res.data.code == 401){
        var protocol=window.location.protocol;
        var host=window.location.host;
        window.location.href=protocol+'//'+host;
      }
      //特殊处理登录页面的回调函数
      if(isSelfHandelErro){
        cb(res);
      }else{
        if(res.data.code == 200){
          //成功回调
          return cb(res);
        }else{
          //错误回调
          $("#loading").remove();
          $('.loadingWrapper').remove();
          utils.msg(res.data.message);
        }
      }
    })
  },
  ajaxAll(url1,params1,url2,params2,cb){
     params1 = JSON.stringify(params1);
     params1=encrypt(params1);
     params2 = JSON.stringify(params2);
     params2=encrypt(params2);
     let result1=axios.post(url1,params1,{
        headers: {
          'token': localStorage.getItem("token"),
          'source':'WAP',
        }
     });
     let result2=axios.post(url2,params2,{
        headers: {
          'token': localStorage.getItem("token"),
          'source':'WAP',
        }
     });
     axios.all([result1,result2]).then(
      axios.spread(function (acct, perms) {
        // 两个请求现在都执行完成
        cb(acct,perms);
      })
     )
  }
}

//做aes加密
function encrypt(word){
  let publicKey=Key.publicKey;
  var key = CryptoJS.enc.Utf8.parse(publicKey);
  var srcs = CryptoJS.enc.Utf8.parse(word);
  var encrypted = CryptoJS.AES.encrypt(srcs, key, {mode:CryptoJS.mode.ECB,padding: CryptoJS.pad.Pkcs7});
  return encrypted.toString();
}

