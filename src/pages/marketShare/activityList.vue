<template>
  <view-box ref="viewBox" body-padding-top="56px" class="noFooter x-fixed-bottom-bar">
    <template v-if="!productDetailHref">
      <tab custom-bar-width="28px" default-color="#666666" bar-active-color="#4D7BFE" active-color="#333333" style="position: fixed; top:0;left:0;width:100%;background:white;z-index:6">
        <tab-item @on-item-click="changeItem" :selected="itemIndex === 0" >精选文章</tab-item>
        <tab-item  @on-item-click="changeItem" :selected="itemIndex === 1" >节日海报</tab-item>
        <tab-item  @on-item-click="changeItem" :selected="itemIndex === 2" >活动</tab-item>
        <tab-item  @on-item-click="changeItem" :selected="itemIndex === 3" >产品</tab-item>
      </tab>
    </template>
    <template v-else>
      <div class="activityHead h44 lh44 text-center whiteBg C333 PFSC-Medium fz17 fixed left0 top0 w100P" >
        {{productDetailName}}
      </div>
      <div class="btnGroup x-fixed-bottom-bar-inner">
        <ul class="btnGroupWrap">
          <li @click="share1"><img src="/static/img/send.png"/>发给好友</li>
          <li @click="share2"><img src="/static/img/wx.png"/>转发微信好友</li>
        </ul>
        <div class="btnLine"></div>
      </div>
    </template>
    <div class="lstBody h100P whiteBg">
      <div v-show="itemIndex === 0">
        <div v-show="articleList.length > 0">
          <ul>
            <li class="p16 rel bLine" v-for="(articleItem, articleIndex) in articleList" :key="articleIndex" @click="goToArticleDetail(articleItem)">
              <p class="PFSC-Medium-Bold C3333 lh25 fz18 activityTitle">
                {{articleItem.activityTitle}}
              </p>
              <div class="mt8 C606266 fz14 articleSpan lh20">
                {{articleItem.remarkName}}
              </div>
              <p class="mt7 C999 fz12 lh16">
                {{utils.transferTimeToDate(articleItem.createdTime,'.')}}
              </p>
            </li>
          </ul>
        </div>
        <div v-show="articleList.length === 0" class="text-center pt20">
          暂无数据
        </div>
      </div>
<!--      节日海报-->
      <div v-show="itemIndex === 1">
        <div class="waterfalls">
          <ul>
            <li class="photo mb12 bd-radius3 overflow-hidden" v-for="item in waterfallsLeft" :key="item.id+Math.random()" @click="goToPosterDetail(item)">
              <div class="w100P">
                <img class="maxW100P" :src="item.cfgPicture" alt="">
              </div>
              <div class="posterInfoHead">{{item.cfgName}}</div>
            </li>
          </ul>
          <ul>
            <li class="photo mb12 bd-radius3 overflow-hidden" v-for="item in waterfallsRight" :key="item.id+Math.random()" @click="goToPosterDetail(item)">
              <div>
                <img class="maxW100P" :src="item.cfgPicture" alt="">
              </div>
              <div class="posterInfoHead">{{item.cfgName}}</div>
            </li>
          </ul>
        </div>
        <div v-show="posterList.length === 0" class="text-center pt20">
          暂无数据
        </div>
      </div>
      <div v-show="itemIndex === 2">
        <ul>
          <li v-for="activityItem in activityList" class="pl22 pt20 pr22 pb20 rel bLine" @click="goToActivityInfo(activityItem)">
            <p class="C333 lh22 mb8 fz16">{{activityItem.activityTitle}}</p>
            <p class="C606266 fz14 mb8">
              活动时间：{{activityItem.validTime}}
            </p>
            <p class="C606266 fz14">
              参与用户：{{activityItem.viewUser}}
            </p>
            <div class='rightRow'></div>

          </li>
        </ul>
      </div>
      <div v-show="itemIndex === 3" class="productList" :style="{height:(productDetailName ? 'calc(100% - 68px)' : 'calc(100%)')}">
        <iframe width="100%" height="100%" :src="src" frameborder="0" ></iframe>
      </div>
    </div>
  </view-box>
</template>

<script>
  import Share from  './share';
  import merge from 'webpack-merge'
  export default {
    name: 'shareRecords',
    components: {
    },
    data () {
      return {
        itemIndex: 0,
        activityList: [], // 可分享的活动列表
        articleList: [], // 可分享的文章列表
        posterList: [], // 可分享的海报列表
        productDetailHref:'', // 私募产品详情页面链接
        productDetailName:'',// 私募产品详情页面标题
        aa:'',
        src : '',
        list: [],
        waterfallsLeft:[],  //  存储在左侧的数据
        waterfallsRight: [],//  存储在右侧的数据
        leftHeight: 0,      //  存储相同宽度情况下，左侧图片的高度
        rightHeight: 0,     //  存储相同宽度情况下，右侧图片的高度
        flag: 0,            //  标志位：检测请求回的数据当中图片是否已经全部加载完毕
      }
    },
    created(){
      let hostname = location.hostname;
      if(hostname === 'gimswap.jdfmgt.com' || hostname === 'djgimswap.jr.jd.com') {
        this.src = 'https://djcf.jd.com/dongrich/productList/sunprivate?from=djwechat';
      }else if(hostname === 'gimswap.jd.com'){
        this.src = 'https://dongjia.jd.com/dongrich/productList/sunprivate?from=djwechat';
      }else{
        this.src = 'https://djgj.jd.com/dongrich/productList/sunprivate?from=djwechat';
      }
      this.itemIndex = Number(this.$route.query.itemIndex);
      if(this.itemIndex === 0 ) {
        this.getArticleList();
      }
      if(this.itemIndex === 2 ) {
        this.getActivityList();
      }
      let that = this;
      window.addEventListener('message', event => {
          that.productDetailHref = event.data.url;
          if(event.data.toDetail){
            let businessId = that.productDetailHref ? that.productDetailHref.substring(that.productDetailHref.indexOf('?productId')+11) : ''
            console.log('pp',  businessId)
            that.productDetailName = event.data.name;
            const shareData = {
              title: that.productDetailName,
              desc:'我很看好京东金融这只高端理财产品，推荐您了解一下！',
              link: that.productDetailHref,
              imgUrl:'https://storage.360buyimg.com/jr-assets/mobile/images/logo.jpg',
              shareCode: '4',
              businessId:businessId
            };
            console.log('dadada', event.data);
            if(event.data) {
              this.share = new Share(shareData);
              this.share.shareInit();
            }
          }else {
            that.productDetailHref = '';
            that.productDetailName = '';
          }
      }, false);
    },
    mounted(){
      if (window.history && window.history.pushState) {
        history.pushState(null, null, document.URL);
        window.addEventListener('popstate', this.fun, false);//false阻止默认事件
      }
    },
    destroyed(){
      window.removeEventListener('popstate', this.fun, false);//false阻止默认事件
    },
    watch:{
      itemIndex(val){
        if(val === 0) {
          this.getArticleList();
        }
        if(val === 1) {
          this.getPosterList();
        }
        if(val === 2) {
          this.getActivityList();
        }
      }
    },
    methods: {
      judgeAllLoaded(items){   // 判断所有图片是否加载完成
        this.waterfallsLeft = [];
        this.waterfallsRight = [];
          items.forEach((item,index) => {
            if(index%2 === 0) {
              this.waterfallsLeft.push(item)
            }else{
              this.waterfallsRight.push(item)
            }
          })
      },
      share1(){
        this.share.shareComWeChart();
      },
      share2(){
        this.share.shareWeChart();
      },
      changeItem(index) {
        this.itemIndex = index;
        this.$router.push({
          query:merge(this.$route.query,{'itemIndex':index})
        })
      },
      fun(){
        this.$router.push({name: 'shareRecords'})
      },
      getActivityList(){
        let param = {activityStatus: 2,pageNumber: 1, pageSize: 999, ynShare: 1, dataType: 1};
        this.request.post(this.api.marketShare.activityQuery, param, (data) => {
          this.activityList = data.records;
          this.activityList.forEach( item=> {
            item.validTime = item.validTime ? this.handleTime(item.validTime) : '-';
            item.viewUser = this.utils.arg.getText('view_permission',item.viewPermissions);
          })
        })
      },
      getArticleList(){
        let param = {activityStatus: 2,pageNumber: 1, pageSize: 999, ynShare: 1,dataType: 2};
        this.request.post(this.api.marketShare.activityQuery, param, (data) => {
         this.articleList = (data && data.records) || [];
        })
      },
      getPosterList(){
        let param = {onlineStatus: 1,pageNumber: 1, pageSize: 999,cmsCfg: ''};
        this.request.post(this.api.marketShare.getPosterList, param, (data) => {
          this.posterList = (data && data.records) || [];
          //this.posterList = posterList.filter(item => item.cfgPicture && item.cfgPicture.indexOf('http://') !== -1)
          this.judgeAllLoaded(this.posterList);
        })
      },
      handleTime(validTime){
        let arr = [];
        arr = validTime.split('至');
        arr[0] = arr[0].substring(0,10);
        arr[1] = arr[1].substring(0,10);
        return arr[0] + '至' + arr[1];
      },
      goToActivityInfo(item){
        this.$router.push({name: 'activityInfo', query: {id: item.id, activityTitle: item.activityTitle}})
      },
      goToArticleDetail(item) {
        this.$router.push({name: 'articleInfo', query: {id: item.id}})
      },
      goToPosterDetail(item){
        this.$router.push({name: 'posterInfo', query: {id: item.id, activityTitle: item.cfgName}})
      },
      downloadPic(posterItem){
        this.download(posterItem.cfgPicture);
      },
      download(url){
        let that = this;
        wx.previewImage({
          current: url, // 当前显示图片的http链接
          urls: [url], // 需要预览的图片http链接列表
          success(res){
            // alert('长按图片可分享！');
            // that.$vux.toast.text('长按图片可分享！')
          }
        });
      }
    }
  }
</script>
<style lang="scss" scoped>
  /*! autoprefixer: off */
  .articleSpan{
    overflow:hidden;
    text-overflow:ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp:2;
    overflow: hidden;
  }
  .activityTitle {
    overflow:hidden;
    text-overflow:ellipsis;
    display:-webkit-box;
    -webkit-box-orient:vertical;
    -webkit-line-clamp:2;
    max-height:50px;
  }
  .posterWrap {
    /*display: flex;*/
    /*flex-direction: column;*/
    column-count: 2;
    column-gap: 0;
    padding-left: 6px;
    padding-right: 6px;
  }
  .posterWrap li {
    padding: 12px 6px;
  }
  .btnGroup {
    position: fixed;
    left:0;
    bottom:0;
    width: 100%;
    background:white;
  }
  .btnGroup .btnGroupWrap {
    display: flex;
  }
  .btnGroup .btnLine {
    width: 1px;
    height: 22px;
    background-color: rgb(246, 246, 246);
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translateY(-50%);

  }
  .btnGroupWrap li {
    height: 68px;
    line-height: 68px;
    color: #333333;
    font-size: 12px;
    /*border-right: 1px solid rgb(246, 246, 246);*/
    flex-grow: 1;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .btnGroupWrap li img{
    width: 25px;
    height: 25px;
  }
  img{
    max-width: 100%;
  }
  .posterInfoHead {
    overflow:hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    background-color: white;
    line-height: 37px;
    height: 37px;
    padding-left: 10px;
    color:rgba(51, 51, 51, 1);
    font-size: 16px;

  }
  /*! autoprefixer: on */
  .main{
    padding: 5px 10px;
    box-sizing: border-box;
  }

  .waterfalls {
    background-color: rgba(250, 250, 250, 1);
    display: flex;
    padding-left: 6px;
    padding-right: 6px;
    justify-content: space-around;
    ul{
      width: 169px;
      img{
        vertical-align: bottom;
      }
      li{
        box-shadow: 0 2px 10px rgba(155, 155, 155, 0.2);
      }
    }
  }


</style>
