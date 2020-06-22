<template>
  <view-box ref="viewBox" body-padding-bottom="50px" body-padding-top="16px" class="whiteBg x-fixed-bottom-bar articleInfo">
    <div class="infoBody pl15 pr15 pb20">
      <div v-if="articleInfo">
        <div class="PFSC-Medium-Bold fz24 lh34" style="color: #33343B">
          {{articleTitle}}
        </div>
        <p class="articleTime">
          {{utils.transferTimeToDate(articleTime,'.')}}
        </p>
        <p class="remarkName">
          {{remarkName}}
        </p>
        <div v-html="articleInfo" class="mt20">
        </div>
        <p class="noDuty">
          免责声明：文章内容仅供参考，不构成投资建议。投资者据此操作，风险自担。文章内容如有涉及侵权烦请联系，我们将第一时间处理。
        </p>
      </div>
      <div v-else class="text-center">
        暂无数据
      </div>
    </div>
    <div slot="bottom" >
<!--      <div class="pl15 pr15 fixed left0 b0 w100P bottomBtns">-->
<!--        <div class="btn lh50 h50 text-center Cfff btnBg fz16 PFSC-Medium">发送好友</div>-->
<!--        <div class="btn lh50 h50 text-center Cfff btnBg fz16 PFSC-Medium">转发微信好友</div>-->
<!--      </div>-->
      <div class="btnGroup x-fixed-bottom-bar-inner">
        <ul class="btnGroupWrap">
<!--          <li><img src="/static/img/download.png"/>保存图片</li>-->
          <li @click="share1"><img src="/static/img/send.png"/>发给好友</li>
          <li @click="share2"><img src="/static/img/wx.png"/>转发微信好友</li>
        </ul>
        <div class="btnLine"></div>

      </div>
    </div>
  </view-box>
</template>

<script>
  import Share from  './share';
  export default {
    name: 'articleInfo',
    components: {
    },
    data () {
      return {
        articleTitle: '',
        articleTime: '',
        remarkName: '',
        pictureInfo: [],
        shareInfo:{},
        articleInfo: {},
        position: {
          oriOffestLeft: 0, // 移动开始时进度条的点距离进度条的偏移值
          oriX: 0, // 移动开始时的x坐标
          maxLeft: 0, // 向左最大可拖动距离
          maxRight: 0 // 向右最大可拖动距离
        },
        flag:false
      }
    },
    mounted(){
      let that = this;
      this.$nextTick(function(){
        setTimeout(()=>{
          this.playAndPause();
        }, 1000)
      })


    },
    created(){
      this.getActivityInfo();
      this.request.post(this.api.marketShare.activityShareInfo, {id: parseFloat(this.$route.query.id)}, (data) => {
        this.articleTime = data && data.startTime;
        this.articleTitle = data && data.activityTitle;
        this.remarkName = data && data.remarkName;
        const shareData = {
          title:this.articleTitle,
          desc:data.shareContent,
          link: data.activityLink,
          imgUrl:data.sharePicture || 'https://storage.360buyimg.com/jr-assets/mobile/images/logo.jpg',
          shareCode: '1',
          businessId: this.$route.query.id
        };
        this.share = new Share(shareData);
        this.share.shareInit();
      })
    },
    methods: {
      playAndPause(){
        // 控制音乐的播放与暂停
        let audioWrap = document.querySelectorAll('.audio-wrapper');
        for(let i=0; i<audioWrap.length; i++) {
          let audio = audioWrap[i].querySelector('audio')
          let audioLeft = audioWrap[i].querySelector('.audio-left')
          let playIcon = audioLeft.querySelector('.playicon')
          let pauseIcon = audioLeft.querySelector('.pauseicon')
          let audioRight = audioWrap[i].querySelector('.audio-right')
          this.dragProgressDotEvent(audio);
          audioLeft.addEventListener('click', function () {
            if (audio.paused) {
              audio.play();
              playIcon.style.display = 'none'
              pauseIcon.style.display = 'block'
            } else {
              audio.pause();
              playIcon.style.display = 'block'
              pauseIcon.style.display = 'none'
            }
          }, false);
          // 监听音频播放时间并更新进度条
          audio.addEventListener('timeupdate',  ()=> {
            this.updateProgress(audio);
          }, false);
          // 监听播放完成事件
          audio.addEventListener('ended', () => {
            this.audioEnded(audio);
          }, false);
          // 点击进度条跳到指定点播放
          let progressBarBg = audioRight.querySelector('.progress-bar-bg');
          progressBarBg.addEventListener('touchstart',  (event) => {
            // 只有音乐开始播放后才可以调节，已经播放过但暂停了的也可以
            if (!audio.paused || audio.currentTime != 0) {
              let pgsWidth = parseFloat(window.getComputedStyle(progressBarBg, null).width.replace('px', ''));
              let offsetX = event.offsetX || event.touches[0].clientX;
              let audioLeftWidth = audioLeft.clientWidth;
              console.log('pingmu',audioLeftWidth)
              let rate = (offsetX-audioLeftWidth) / pgsWidth;
              audio.currentTime = audio.duration * rate;
              this.updateProgress(audio);
            }
          }, false);
        }
      },
      updateProgress(audio){
        let value = audio.currentTime / audio.duration;
        audio.parentNode.querySelector('.progressBar').style.width = value * 100 + '%';
        audio.parentNode.querySelector('.progressDot').style.left = value * 100 + '%';
        audio.parentNode.querySelector('.audioCurTime').innerText = this.transTime(audio.currentTime);

      },
      /**
       * 音频播放时间换算
       * @param {number} value - 音频当前播放时间，单位秒
       */
      transTime(value) {
        let time = "";
        let h = parseInt(value / 3600);
    value %= 3600;
        let m = parseInt(value / 60);
        let s = parseInt(value % 60);
    if (h > 0) {
      time = this.formatTime(h + ":" + m + ":" + s);
    } else {
      time = this.formatTime(m + ":" + s);
    }

    return time;
  },

      /**
       * 格式化时间显示，补零对齐
       * eg：2:4  -->  02:04
       * @param {string} value - 形如 h:m:s 的字符串
       */
      formatTime(value) {
        let time = "";
        let s = value.split(':');
        let i = 0;
    for (; i < s.length - 1; i++) {
      time += s[i].length == 1 ? ("0" + s[i]) : s[i];
      time += ":";
    }
    time += s[i].length == 1 ? ("0" + s[i]) : s[i];

    return time;
  },
      /**
       * 播放完成时把进度调回开始的位置
       */
      audioEnded(audio) {
    audio.parentNode.querySelector('.progressBar').style.width = 0;
        audio.parentNode.querySelector('.progressDot').style.left = 0;
        audio.parentNode.querySelector('.audioCurTime').innerText = this.transTime(0);
        let playIcon = audio.parentNode.querySelector('.playicon')
        let pauseIcon = audio.parentNode.querySelector('.pauseicon')
        playIcon.style.display = 'block'
        pauseIcon.style.display = 'none'
  },
      dragProgressDotEvent(audio) {
    let dot = audio.parentNode.querySelector('.progressDot');

    // 鼠标按下时

    dot.addEventListener('mousedown', this.down , false);
    dot.addEventListener('touchstart', this.down, false);

    // 开始拖动
    document.addEventListener('mousemove', this.move, false);
    document.addEventListener('touchmove', this.move, false);

    // 拖动结束
    document.addEventListener('mouseup', this.end, false);
    document.addEventListener('touchend', this.end, false);

  },
    down(event) {
        let audio = event.target.parentNode.parentNode.parentNode.querySelector('audio');
        let dot = event.target;
      let progressBarBg = dot.parentNode;
    if (!audio.paused || audio.currentTime != 0) { // 只有音乐开始播放后才可以调节，已经播放过但暂停了的也可以
      this.flag = true;
      this.position.oriOffestLeft = dot.offsetLeft;
      this.position.oriX = event.touches ? event.touches[0].clientX : event.clientX; // 要同时适配mousedown和touchstart事件
      this.position.maxLeft = this.position.oriOffestLeft; // 向左最大可拖动距离
      this.position.maxRight = progressBarBg.offsetWidth - this.position.oriOffestLeft; // 向右最大可拖动距离

      // 禁止默认事件（避免鼠标拖拽进度点的时候选中文字）
      if (event && event.preventDefault) {
        event.preventDefault();
      } else {
        event.returnValue = false;
      }

      // 禁止事件冒泡
      if (event && event.stopPropagation) {
        event.stopPropagation();
      } else {
        window.event.cancelBubble = true;
      }
    }
  },

  move(event) {
    let audio = event.target.parentNode.parentNode.parentNode.querySelector('audio');
    let progressBarBg = event.target.parentNode;
    if (this.flag) {
      var clientX = event.touches ? event.touches[0].clientX : event.clientX; // 要同时适配mousemove和touchmove事件
      var length = clientX - this.position.oriX;
      if (length > this.position.maxRight) {
        length = this.position.maxRight;
      } else if (length < -this.position.maxLeft) {
        length = -this.position.maxLeft;
      }
      var pgsWidth = parseFloat(window.getComputedStyle(progressBarBg, null).width.replace('px', ''));
      var rate = (this.position.oriOffestLeft + length) / pgsWidth;
      audio.currentTime = audio.duration * rate;
      this.updateProgress(audio);
    }
  },
  end() {
    this.flag = false;
  },
  getActivityInfo(){
        let param = {activityId: this.$route.query.id};
        this.request.post(this.api.marketShare.activityInfo, param, (data) => {
          console.log('ddd', data)
          //this.pictureInfo = data.pictureInfo
          this.articleInfo = data && data.pictureInfo && data.pictureInfo[0] && data.pictureInfo[0].pictureLink;
            console.log('this.articleInfo', this.articleInfo);
        })
      },
      share1(){
        this.share.shareComWeChart();
      },
      share2(){
        this.share.shareWeChart();
      }
    }
  }
</script>
<style lang="scss">
  .articleInfo{
    padding: 20px 16px 12px;
  }
  .activityHead{
    border-bottom:  1px solid rgba(178, 178, 178, 0.5);
    .head {
      margin: auto auto;
      overflow:hidden;
      text-overflow:ellipsis;
      height: 100%;
      display:-webkit-box;
      -webkit-box-orient:vertical;
      -webkit-line-clamp:1;
    }
  }
  img{
    vertical-align: middle;
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
  .infoBody {
    padding: 0;
    margin:0;
    font-size: 15px;
    line-height: 1.6;
  }
  .infoBody > p {
   margin-top: 1em;
  }
  .articleTime{
    color:#999EAC;
    font-size: 12px;
    line-height: 17px;
  }
  .remarkName{
    margin-top: 20px;
    padding: 12px;
    color: #666A76;
    font-size: 14px;
    background-color: #F7F8FA;
  }
  .noDuty{
    font-size: 12px;
    color:#999EAC;
    line-height: 20px;
    margin-top: 30px;
  }
</style>
