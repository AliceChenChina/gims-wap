<template>
  <view-box ref="viewBox" class="noFooter editSalesManBusinessCard">
    <Header title="理财师名片" rightText="保存" :rightAction="save"/>
    <div class="salesManBusinessCardDiv">
      <div>
        <div>
          <upload-avator :defaultUrl = "avatarPic" @uploadSuccess="uploadSuccess"></upload-avator>
        </div>
        <group class="noBorder">
          <x-input title="姓名" text-align="right" v-model="cardData.trueName" readonly></x-input>
          <x-input title="手机号码" text-align="right" v-model="cardData.mobile" readonly></x-input>
          <x-input title="手机小号" text-align="right" v-model="cardData.dummyMobile" readonly></x-input>
          <x-address title="所在地区" required="true" :list="provinceData" placeholder="请选择您所在的地区" :raw-value='true' v-model="address"></x-address>
          <x-input title="邮箱" text-align="right"  placeholder="请输入邮箱地址" v-model="cardData.email"></x-input>
          <cell title="个人简介"></cell>
          <x-textarea class="bbs" placeholder="请输入您的个人简介，限100字以内" :max="100" v-model="cardData.profile" :autosize="true"></x-textarea>
          <cell title="已选证书"><div class="certificationRemarkInfo" v-if="certificateChoosedList.length == 0"></div>
            <div class="certificationRemarkInfo" v-if="certificateChoosedList.length > 0">下面标签排序,点击可取消选中</div></cell>
          <div class="certification-list">
            <div class="choosedMarks">
              <draggable v-model="certificateChoosedList" @choose="choose" @start = "startMove" @unchoose="unchoose">
                <div v-for="element in certificateChoosedList" :key="element.key" class="choosedMarks-item">
                  {{element.value}}
                </div>
              </draggable>
            </div>
          </div>
          <cell title="专业证书"><div class="certificationRemarkInfo">请选择以下专业证书标签，最多可选5个</div></cell>
          <div class="certification-list mb50">

            <div class="allMarks">
              <div
                class="certification-item"
                v-for="item in certificateAllList"
                :key="item.key"
                @click="() => chooseCertificate(item)"
              ><span :class="item.isComb ? 'bagGrey' : '' ">{{item.value}}</span>
              </div>
            </div>
          </div>
        </group>
      </div>
    </div>
  </view-box>
</template>

<script>
  import Header from '@/pages/common/header'
  import Footer from '@/pages/common/footer'
  import Select from '@/pages/common/select'
  import provinceData from '@/utils/province.json'
  import UploadAvator from '@/pages/uploadHeadShort/uploadAvator'
  import draggable from "vuedraggable";
  import BScroll from 'better-scroll'
  import * as Vue from "vue";
  let lastClick;
  export default {
    name: 'editSalesManBusinessCard',
    components: {
      Header,
      Footer,
      Select,
      UploadAvator,
      draggable
    },
    data () {
      return {
        move: true,
        cardData:{}, // 页面数据
        avatarPic: '', // 头像
        fakeLoading: false, // 控制Loading显示与隐藏
        certificateList: this.utils.arg.getSelect("professional_certificate"), // 专业证书数据
        checkInfo: false, // 名片查看页面与编辑页面'开关'
        provinceData: provinceData, // 省份
        address:[], // 地区
        certificateChoosedList: [], // 查看页面中的专业证书列表数据
        certificateAllList:[], // 编辑页面中的专业证书列表数据
        timeStamp: {startMvTimeStamp:0, endMvTimeStamp: 0, movingUseTime: 0}
      }
    },
    mounted: function() {
      this.$nextTick(function () {
        setTimeout(function(){
          let wrapper = document.querySelector('.salesManBusinessCardDiv')
          new BScroll(wrapper,{
            bounce: false,
            click: true,
          })
        },500)
      });
    },
    created(){
      // 初始化专业证书标签数据格式
      this.certificateAllList = this.certificateList.map( item => {
        this.$set(item, 'isComb', false);
        return item;
      });
      // 获取理财师名片信息
      this.func.ajaxPost(this.api.personal.queryCard,{}, res=>{
        // cardStatus 1已设置,非1未设置
        if(res.data.code === 200 && res.data.data){
          this.cardData = res.data.data;
          // 初始化头像
          this.avatarPic = this.cardData.avatar ? this.cardData.avatar : '';
          // 初始化地区
          if (this.cardData.prov) {
            this.address.push(this.cardData.prov);
          }
          // 初始化 专业证书标签
          if(!this.cardData.professionalCertificate) {
            return false;
          }
          let arr = this.cardData.professionalCertificate.split(',');
          arr.forEach(item => {
            if(this.utils.ifNumber(item)) {
              for ( let i = 0;i<this.certificateAllList.length;i++) {
                if (item === this.certificateAllList[i].key ) {
                  this.certificateAllList[i].isComb=true;
                  this.certificateChoosedList.push(this.certificateAllList[i]);
                }
              }
            }
          })
        }
      },false)
    },
    methods: {
      chooseCertificate(item) {
        if(!item.isComb) {
          if(this.certificateChoosedList.length === 5) {
            this.utils.msg('最多能选择5个标签！');
            return false;
          }else{
            this.certificateChoosedList.push(item);
            item.isComb=!item.isComb;
          }
        }
      },
      choose(item) {
        this.move = true
      },
      startMove(ev) {
        this.move = false;
        this.timeStamp.startMvTimeStamp = ev.timeStamp;
      },
      handleDragData(index) {
        let chooseItem = this.certificateChoosedList[index];
        this.certificateChoosedList.splice(index, 1);
        let belowIndex = this.certificateAllList.indexOf(chooseItem);
        this.certificateAllList[belowIndex].isComb = false;
      },
      // 未选中回调
      unchoose(evt) {
        let index = evt.oldIndex;
        this.timeStamp.endMvTimeStamp = evt.timeStamp;
        this.timeStamp.movingUseTime = this.timeStamp.endMvTimeStamp - this.timeStamp.startMvTimeStamp;
        if (this.move) {
          this.handleDragData(index);
        }else {
          if (this.timeStamp.movingUseTime < 300) {
            this.handleDragData(index);
          }
        }
      },
      // 得到选择的标签数据
      getCertificationsList(sourceArr, attr) {
        let arr = [];
        sourceArr.forEach(item => {
          if (item[attr]) {
            arr.push(item);
          }
        });
        return arr;
      },
      // 由数组得到关键属性的字符串
      convertArrToStr(arr, basedAttr) {
        let middelArr = [];
        arr.forEach( item => {
          middelArr.push(item[basedAttr]);
        });
        return middelArr.join(',');
      },
      //编辑客户
      save() {
        // 点击编辑不做校验
        // 验证是否通过
        let check = this.check();
        if (!check) {
          return false;
        }
        this.cardData.prov = $(".vux-popup-picker-value.vux-cell-value").text();

        this.submit();

      },
      submit() {
        // 得到专业资质字符串数据
        this.cardData.professionalCertificate = this.convertArrToStr(this.certificateChoosedList, 'key');
        this.func.ajaxPost(this.api.personal.editCard,this.cardData, res=>{
          if (res.data.code == '200') {
            this.$vux.toast.text('编辑成功', 'middle');
            this.$router.push({ name: 'personal'});
          } else {
            this.utils.msg(res.data.message);
          }
        },false)
      },
      // 做必要的验证
      check(){
        let checkTrue = false;
        let emailReg = /^([A-Za-z0-9_\-\.\u4e00-\u9fa5])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,8})$/
        if (!this.cardData.avatar) {
          this.utils.msg('请上传头像！');
          return checkTrue;
        }
        if (this.address.length < 1) {
          this.utils.msg('请选择您所在地区！');
          return checkTrue;
        }
        if (!this.cardData.profile) {
          this.utils.msg('请填写您的个人简介！');
          return checkTrue;
        }
        if (this.cardData.email && !emailReg.test(this.cardData.email)) {
          this.utils.msg('邮箱格式不正确！');
          return checkTrue;
        }
        checkTrue = true;
        return checkTrue;
      },
      // 头像上传成功后得到的数据
      uploadSuccess(data) {
        this.cardData.avatar = JSON.parse(data).data;
      }
    }
  }
</script>
<style scoped>
  #app .editSalesManBusinessCard {
    height: 100%;
  }
  #app .editSalesManBusinessCard>>>.weui-tab__panel .detailsHeader{
    position: absolute;
  }
  #app .salesManBusinessCardDiv {
    height:100%;
  }
  #app .editSalesManBusinessCard ::-webkit-input-placeholder {
    color: #ccc!important;
    font-size: 12px;
  }
  #app .editSalesManBusinessCard >>> .vux-popup-picker-placeholder {
    color: #ccc!important;
    font-size: 12px;
  }
  .certification-list {
    padding: 0 15px;
  }

  .choosedMarks,.allMarks {
    overflow: hidden;
    padding-top: 5px;
  }
  .certification-item {
    float: left;
    margin-right: 13px;
    margin-bottom: 13px;
    transition: transform .3s;
  }
  .choosedMarks-item {
    font-size: 12px;
    padding: 5px 10px;
    margin-right: 13px;
    display: inline-block;
    background-color: #5488FF;
    color: white;
    border-color: #5488FF;
    border-radius: 13px;
    margin-bottom: 13px;
  }
  .certification-item span {
    font-size: 12px;
    padding: 5px 10px;
    border: 1px solid #DCDFE6;
    border-radius: 13px;
  }
  .certificationRemarkInfo {
    font-size: 12px;
    color: #CCCCCC;
  }
  .certification-item .bagBlue {
    background-color: #5488FF;
    color: white;
    border-color: #5488FF;
  }
  .vux-x-textarea{
    padding-top: 0!important;
  }
  .vux-x-textarea >>>.weui-textarea{
    line-height: 22px;
    overflow: auto !important;
    height: 110px !important;
  }
  #app .bbs:before{
    border-top:0px solid #ff0000;
  }
  .vux-x-textarea >>>.weui-textarea-counter {
    display: none;
  }
  .certification-item .bagGrey {
    background-color: #DEDEDE;
    color: white;
    border-color: #DEDEDE;
  }
  .choosedMarks.sortable_drag {
    background-color: #fff;
  }
  .certification-item:hover{
    cursor: pointer;
  }

</style>


