<template>
  <div class="radius10 p12 whiteBg">
    <div class="flex jcsb">
      <p class="PFSC-Medium C666 fz14">背景资料</p>
      <p @click="modifyBasicInfo" class="fz12 textBlue">{{!showButton ? '修改信息' : ''}}</p>
    </div>
    <div class="flex mt12 fz12 C666">
      <div class="mr10 w40 h40 mr10"><img class="w100P h100P" src="../../../../assets/images/user.png"/></div>
      <p class="mor30">{{utils.setDefault(basicInfo.firstName)}}{{utils.setDefault(basicInfo.sex)}}</p>
      <p class="mor30">{{utils.setDefault(basicInfo.age)}}岁</p>
      <p v-if="basicInfo.riskLevel">{{utils.setDefault(basicInfo.riskLevel)}}</p>
    </div>
    <div class="mt12 bdt1e6e6e6" v-if="paperResults.length > 0"></div>
    <ul class="mt12 fz12 C999 lh20">
      <li class="flex" v-for="(questionItem,questionIndex) in paperResults" :key="questionIndex" v-if="questionItem.answers.length > 0">
        <p class="mr5">{{questionItem.question}}:</p>
        <p>{{utils.setDefault(questionItem.answers.join(','))}}</p>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: "userBaicInfo",
    data(){
      return {
        basicInfo: {},
        paperResults:[
        ],
        userPin: this.$route.query.userPin,
        reportVersion: this.$route.query.reportVersion,
        id: this.$route.query.id,
        customerId: this.$route.query.customerId,
        showButton: this.$route.query.showButton
      }
    },
    created(){
      this.getBasicInfo();
    },
    methods: {
      getBasicInfo(){
        let param = {userPin: this.userPin, customerId: this.$route.query.customerId,reportVersion: this.reportVersion,reportInfo:this.$route.query.reportInfo|| ''};
        this.request.post(this.api.assetAllocate.queryReportBaseInfo, param, (data) => {
            this.basicInfo = data || {};
            this.paperResults = data.paperResults ? data.paperResults : [];
        })
      },
      modifyBasicInfo() {
        if (this.showButton) return false;
        let param = { query: { from: 'edit', id: this.id, customerId: this.customerId,
            reportVersion: this.reportVersion,
            userId: this.$route.query.userId,
            customerfrom:this.$route.query.customerfrom,
            userPin: this.userPin,
            seriesId: this.$route.query.seriesId || '',
            comment: this.$route.query.comment || '',
            portfolioId: this.$route.query.portfolioId || '',
            reportInfo: this.$route.query.reportInfo || '',
            marketId: this.$route.query.marketId || '',
            ifRequestComment: this.$route.query.ifRequestComment || ''
          }};
        this.$router.push({ path: '/customer/assetAllocate/modifyBasicInfo', ...param});
      },
    }
  }
</script>

<style scoped>


</style>
