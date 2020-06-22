import request from '@/public/request';
import api from '@/api/api.js';
import Vue from 'vue'


function replaceParamVal(url,paramName,replaceWith) {
  let oUrl = url.toString();
  let re=eval('/('+ paramName+'=)([^&]*)/gi');
  let nUrl = oUrl.replace(re,paramName+'='+replaceWith);
  return nUrl
}

// 分享企业微信
class Share {
  constructor(data) {
    let userPin = localStorage.getItem('oriPinCode');
    let isSales = localStorage.getItem('isSales');
    let userName = decodeURIComponent(localStorage.getItem('userName'))
    userPin = encodeURIComponent(userPin);
    data.title = data.title || '';
    this.sharePin = userPin;
    this.initTitle = data.title;
    this.title = (isSales === '1' && userName && userPin) ? `理财师${userName}为您推荐：${data.title}` : data.title;
    this.desc = data.desc || '';
    this.imgUrl = data.imgUrl || '';
    this.businessId = data.businessId || '';
    //"5" 名片分享 "4" 产品分享 "3" 活动分享 "2" 海报分享 "1" 文章分享
    this.shareCode = data.shareCode;
    if(!data.link) return;
    if(data.link.indexOf('sharePin')>-1){
      //修改sharePin
      data.link =replaceParamVal(data.link,'sharePin',userPin);
    }else{
      //新增sharePin
      if(data.link.indexOf('?')>-1){
        data.link=`${data.link}&sharePin=${userPin}`;
      }else{
        data.link=`${data.link}?sharePin=${userPin}`;
      }
    }
    this.link = data.link || '';
  }

  // 分享的初始化
  async shareInit(){
    request.post(api.marketShare.getShareId, {
        shareCode:this.shareCode,
        businessId:this.businessId
    },res=>{
      this.shareId = res;
      this.channel = 'yxpt';
      this.medium = 'yxpt';
      // 新增shareId,channel,medium
      if(this.link.indexOf('?')>-1){
        this.link=`${this.link}&channel=yxpt&medium=yxpt&shareId=${res}`;
      }else{
        this.link=`${this.link}?channel=yxpt&medium=yxpt&shareId=${res}`;
      }
      request.post(api.marketShare.share,{url:window.location.href.split('#')[0]},res=>{
        wx.config({
          beta: true,
          debug: false,
          appId: res.appId,
          timestamp: res.timestamp,
          nonceStr: res.nonceStr,
          signature: res.signature,
          jsApiList: ['onMenuShareAppMessage','onMenuShareTimeline','shareAppMessage','shareWechatMessage']
        });
        wx.ready(() => {
          //自定义转发到会话，用群发助手发送给客户，群发我的客户群，群发到客户朋友圈
          let that = this;
          wx.onMenuShareAppMessage({
            title: this.title,
            desc:  this.desc,
            link:  this.link,
            imgUrl: this.imgUrl,
            trigger:function() {
              that.shareSuccess();
            }
          });
          // 分享到朋友圈
          wx.onMenuShareTimeline({
            title: this.title,
            desc:  this.desc,
            link:  this.link,
            imgUrl: this.imgUrl,
            trigger:function() {
              // 用户确认分享后执行的回调函数
              that.shareSuccess();
            }
          });
        });
        wx.error((res) => {
          console.log(res);
        })
      });
    })
  }

  // 直接调取--发送给好友
  shareComWeChart(){
    this.shareSuccess();
    wx.invoke(
      "shareAppMessage", {
        title: this.title,
        desc:  this.desc,
        link:  this.link,
        imgUrl: this.imgUrl,
      },res=>{
        if (res.err_msg === "shareAppMessage:ok") {
        }
      }
    );
  }

  // 微信分享
  shareWeChart(){
    this.shareSuccess();
    wx.invoke(
      "shareWechatMessage", {
        title: this.title,
        desc:  this.desc,
        link:  this.link,
        imgUrl: this.imgUrl
      }, res => {
        if (res.err_msg === "shareWechatMessage:ok") {
        }
      }
    );
  }

  // 分享成功回调
  shareSuccess() {
    request.post(api.marketShare.insertShareLog, {
      shareTitle: this.initTitle ? this.initTitle : this.title,
      shareCode: this.shareCode,
      shareContent: this.link,
      shareId: this.shareId,
      channel: this.channel,
      medium: this.medium,
      sharePin: this.sharePin
    },()=>{
    })
  }
}
export default Share;
