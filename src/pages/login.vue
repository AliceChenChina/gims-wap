<template>
  <view-box body-padding-top='0' body-padding-bottom='0'>
    <div class='whole' :style="{ height: this.bodyHeight + 'px' }">
        <div class="content">
            <div class='img'>
              <img src="../../static/img/logo.png" style="margin: 0 auto" alt="">
            </div>
            <group class='form'>
                <x-input title="title" v-model="userName" placeholder='请输入账号'  text-align='left'>
                  <img slot="label" style="padding-left:5px;height:auto" src="@/assets/images/user_login.png">
                </x-input>
                <x-input title="title" v-model="passWord"  placeholder='请输入密码' text-align='left' type="password">
                  <img slot="label" style="padding-left:5px;height:auto" src="@/assets/images/password_login.png">
                </x-input>
                <div class='verificDiv'>
                  <flexbox>
                    <flexbox-item><x-input placeholder='请输入验证码' text-align='left' v-model="verifyCode"></x-input></flexbox-item>
                    <flexbox-item>
                      <div class='imgWrapper'>
                        <img class="verificImg" @click='loadVerficImgSrc'/>
                      </div>
                    </flexbox-item>
                  </flexbox>
                </div>
                <x-button  @click.native="handleRegist" :gradients="['#FA764D', '#FD4E3C']">登录</x-button>
            </group>
        </div>
    </div>
  </view-box>
</template>
<script>
 // import $ from 'jquery'
 // $('body').css({'height':$(window).height()})
  export default {
  name:'login',
  data() {
    return {
      userName: "",
      passWord: "",
      erroNum:0,
      verifyCode: '',
      bodyHeight:0
    };
  },
  mounted(){
    this.bodyHeight=document.documentElement.clientHeight;
    localStorage.setItem('bodyHeight',this.bodyHeight)
  },
  methods: {
    handleRegist() {
      window.scroll(0, 0);
      window.clearVuexAlong;
      if(!this.passWord&&!this.userName){
        this.utils.msg("请填写用户名和密码");
        return
      }
      if(!this.userName){
        this.utils.msg("用户名不能为空");
        return
      }
      if(!this.passWord){
        this.utils.msg("密码不能为空");
        return
      }
      let user = { login_name: this.userName, password: this.passWord,verifyCode:this.verifyCode,loginCnt:this.erroNum};
      localStorage.setItem("token",'');
      this.func.ajaxPost(this.api.login.defaultlogin, user, res => {
        if (res.data.code === 200) {
          this.num=0;
          localStorage.setItem("token", res.data.data);
          this.getPowerKey();
        } else {
          if(this.erroNum==3||this.erroNum>3){
            this.loadVerficImgSrc();
            $(".verificDiv").show();
          }
          this.erroNum=this.erroNum+1;
          this.utils.msg(res.data.message)
        }
      },false,true);
    },
    back(){
       this.$router.go(-1);
    },
    loadVerficImgSrc: function () {
       //验证码
       let src='/djjf-web/image/code?timeStamp=' + new Date();
       $('.verificImg').attr('src',src);
    },
    getPowerKey: function() {
      // 调取用户权限信息
        this.func.ajaxPost(this.api.userInfo.getUserInfo, {}, res=> {
          if (res.data.code === 200) {
            if (!res.data.data) {
              return false
            }
            let data = JSON.parse(res.data.data);
            if (!data.userPowerKey) {
              return false;
            }
            // 权限数据放入全局对象中
            this.utils.userInfo.userPowerKey = data.userPowerKey.split(',');
            localStorage.setItem('pinCode', data.pinCode);
            localStorage.setItem('oriPinCode', data.oriPinCode);
            // 是否是理财师
            localStorage.setItem('isSales', data.isSales);
            localStorage.setItem('userName', encodeURIComponent(data.trueName));
            // 判读是否有首页权限，有先调入首页，无则跳入个人中心
            if(this.utils.userInfo.checkUserPowerKey(this.powerKey.messageListKey)){
              this.$router.push('/home');
            }else{
              this.$router.push('/personal');
            }
          };
        })
      },
    }
};
</script>
<style scoped>
.whole{
  background:url('../../static/img/bg.png') top center no-repeat;
  background-size:cover;
  /* height: 100%; */
  width: 100%;
  position: absolute;
}

.content{
  padding: 0 12px;
}


.img{
  padding-top:60px;
  height: 200px;
  text-align: center;
}

.img img{
  height: 100%;
}

.form{
  padding: 40px 35px 50px 35px;
  background: white;
  margin-top:12px;
  border-radius: 6px;
}

.vux-x-input.weui-cell{
   background: #f5f5f5;
   border-radius: 4px;
}

.vux-x-input{
   margin-bottom: 12px;
}


.weui-btn{
   border-radius: 20px;
}

.imgWrapper {
  text-align: center;
  border-radius: 4px;
  height: 50px;
  margin-bottom: 12px;
}

.verificImg{
  height: 100%;
  width: 100%;
}

.verificDiv{
  display: none;
}
</style>
