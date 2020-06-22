<template>
    <view-box ref="viewBox" class="bagFafafa">
      <Header title="修改背景资料" rightText="保存" :rightAction="save"/>
      <div>
        <p class="C999 pl15 fz12 lh40">基本资料</p>
        <ul>
          <li
            class="flex jcsb pl15 pr15 whiteBg lh50 bLine rel"
            v-for="(basicItem, basicIndex) in basicInfoHead"
            :key="basicIndex">
            <p class="C666 fz14">{{basicItem.labelName}}</p>
            <p class="C333 fz12 PFSC-Medium">{{basicItem.value}}</p>
          </li>
        </ul>
        <p class="C999 pl15 fz12 lh40">财务资料与需求</p>
        <div class="whiteBg">
          <new-selector
            v-for="(item,index) in questionList "
            :type="item.qTypeName" :key = "index"
            :title=item.content_mean placeholder="选填"
            :options="item.questionLst"
            @change="(value,label,no) => select(value,label,item.no)"
            :deepValue = "item.editVal"
            :deepValue1 = "item.editVal"
            :value = "item.val"
          />
        </div>
      </div>
    </view-box>
</template>
<script>
  import Header from '@/pages/common/header'
  import Footer from '@/pages/common/footer'
  import newSelector from '@/pages/common/newSelector'
  import Select from '@/pages/common/select'
  export default {
    name: 'modifyBasicInfo',
    components: {
      Header,
      Footer,
      newSelector,
      Select
    },
    data () {
      return {
        reportVersion: '05867c248e864febaa577cf1581fa64e',
        from: this.$route.query.from,
        hh: '11',
        kycversion: '',
        consumerInfo:{},
        basicInfo: {},
        questionList:[],
        answerItems:[],
        reportInfo:{},
        answerList:[],
        answerItemsVal:[],
        basicInfoHead: [
          {labelName:'姓名', value: ''},
          {labelName:'性别', value: ''},
          {labelName:'出生日期', value: ''},
          {labelName:'风险等级', value: ''}
          ]
      }
    },
    created(){
      this.getBasicInfo();
      this.queryUserInfo();
    },
    methods: {
      getBasicInfo(){
        this.func.ajaxPost(this.api.customer.Info, {id:this.$route.query.id}, res => {
          if (res.data.code === 200) {
            let info = res.data.data;
            this.consumerInfo = info;
            this.basicInfoHead[0].value = (info.customerRealNameDto  && info.customerRealNameDto.customerName) || '-';
            this.basicInfoHead[1].value = info.customerRealNameDto ? this.utils.IdCard(info.customerRealNameDto.identificationNo, 2) : '-';
            this.basicInfoHead[2].value = info.customerRealNameDto ? this.utils.IdCard(info.customerRealNameDto.identificationNo, 1) : '-';
            this.basicInfoHead[3].value = (info.customerRiskRatingDto  && info.customerRiskRatingDto.riskLevelName) || '-';
          } else {
            this.utils.msg(res.data.message);
          }
        })
      },
      queryUserInfo(){
        let param = {userPin: this.$route.query.userPin, rep_version: this.$route.query.reportVersion || '', customerId: this.$route.query.customerId};
        this.request.post(this.api.assetAllocate.queryUserInfo, param, (data) => {
              this.kycversion = data.kyc_paper.kycversion;
              let answerItems = data.kyc_info.testResult.testResultMapper;
              this.answerItemsVal = data.kyc_info.testResult.testResultMapper_CH;
              this.questionList = data.kyc_paper.paper;
              this.formatQuestion(this.questionList, answerItems);
        })
      },
      formatQuestion(data,answerItems){
        data.forEach(item =>{
            this.answerItems.push({no:item.no,answerNo:answerItems[item.no]});
          // 1 单选 2 多选
          item.qTypeName = item.qType === '1' ? 'radio' : 'checkList';
            if (item.qType === '1') {
              answerItems[item.no] = answerItems[item.no].join('');
            }
            this.answerItemsVal[item.no] = this.answerItemsVal[item.no].join('');
            item.editVal = answerItems[item.no];
            item.val = this.answerItemsVal[item.no];
          if (item.questionLst.length > 0) {
            item.questionLst.forEach( questionItem => {
              questionItem.key = questionItem.subNo;
              questionItem.value = questionItem.content;
              delete questionItem.subNo;
              delete questionItem.content;
            })
          }
        })
      },
      save() {
        let param ;
        console.log('this.answerItems', this.questionList);
        if(this.answerItems[0].answerNo.length === 0) {
          this.utils.msg(`“${this.questionList[0].content_mean}”不能为空！`);
          return false;
        }
        if (this.from === 'add') {
          param = {
            "oprType":"sales",
            "userPin":this.consumerInfo.pinCode,
            answerItems: this.answerItems,
            customerId: this.$route.query.customerId,
            "KYCVersion":this.kycversion
          }
          this.saveAdd(param);
        }
        if (this.from === 'edit') {
          param = {
            "oprType":"sales",
            "rep_version":this.$route.query.reportVersion,
            customerId: this.$route.query.customerId,
            answerItems: this.answerItems,
          }
          this.saveEdit(param);
        }
      },
      saveAdd(param){
        this.request.post(this.api.assetAllocate.commitKycPaper, param, (data) => {
            this.reportInfo = data;
            let param = {query:{userPin:this.consumerInfo.pinCode,
                reportVersion:this.reportInfo.userInfoBean.report_version,customerId:this.$route.query.customerId,userId: this.$route.query.userId,
                id:this.$route.query.id, customerfrom:this.$route.query.customerfrom,ifRealName: this.$route.query.ifRealName}}
            this.$router.push({ name: 'assetAllocationReportDetail', ...param});
        })
      },
      saveEdit(param){
        this.request.post(this.api.assetAllocate.modifyUserInfoPaper, param, (data) => {
          this.reportInfo = data;
          let param = {query:{userPin:this.consumerInfo.pinCode,reportVersion:this.$route.query.reportVersion,
              id:this.$route.query.id,customerId:this.$route.query.customerId,customerfrom:this.$route.query.customerfrom,
              userId: this.$route.query.userId,
              ifRealName: this.$route.query.ifRealName,
              seriesId: this.$route.query.seriesId || '',
              comment: this.$route.query.comment || '',
              portfolioId: this.$route.query.portfolioId || '',
              reportInfo: this.$route.query.reportInfo || '',
              marketId: this.$route.query.marketId || '',
              ifRequestComment: this.$route.query.ifRequestComment || ''
            }}
          this.$router.push({ name: 'assetAllocationReportDetail', ...param});
        })
      },
      select( value,label,no){
        value = (value instanceof Array) ? value : [value];
        for(let i=0; i<this.answerItems.length; i++) {
          if (this.answerItems[i].no === no){
            this.answerItems[i].answerNo = value;
            break;
          }
        }
      }
    }
  }
</script>
<style scoped>

</style>
