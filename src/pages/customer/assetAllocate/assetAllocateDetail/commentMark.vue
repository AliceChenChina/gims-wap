<template>
  <div class="radius10 p12 whiteBg mt12" v-if="commentMark">
    <div class="flex jcsb">
      <p class="PFSC-Medium C666 fz14">市场快评</p>
      <p @click="confirmDialoag('是否确认删除','删除后，此栏目将在财富规划报告中隐藏不予展示。', deleteComment)" class="fz12 textBlue">{{!showButton ? '删除栏目' : ''}}</p>
    </div>
    <div class="mt12 fz12 C666 lh18 commentMark" :class="showMore ? 'showMoreComment' : 'hideMoreComment'">
      {{commentMark}}
    </div>
    <div class="mt12" :class="showMore?'arrow-verse':''" @click="showMore = !showMore" v-if="ifShow">
      <div class="arrow" >
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "commentMark",
    data(){
      return {
        commentMark: '',
        paperResults:[
        ],
        showMore: false,
        showButton: this.$route.query.showButton,
        ifShow: false
      }
    },
    created(){
      this.queryMarketComment();
    },
    mounted(){
      setTimeout(()=>{
        let el = document.querySelector('.commentMark')
        let height = el.scrollHeight;
        if(height > 75) {
          this.ifShow = true;
        }
        el.style.setProperty('--max-height', height + 'px');
      },500)
    },
    methods: {
      queryMarketComment(){
      if(this.$route.query.ifRequestComment === '1'){
        return false;
      }
        let param =  {marketId: this.$route.query.marketId || '',customerId: this.$route.query.customerId, reportVersion: this.$route.query.reportVersion || ''};
        this.request.post(this.api.assetAllocate.queryMarketComment, param, (data) => {
         this.commentMark = data ? data.content : '';
        })

      },
      confirmDialoag(title,content,fn) {
        this.$vux.confirm.show({
          title: title,
          confirmText: '确定',
          cancelText: '取消',
          content: `<div class="confirm-body"><div class="confirmBody2">${content}</div></div>`,
          onConfirm: () => {
            fn()
          }
        })
      },
      deleteComment() {
        if (this.showButton) return false;
        let param = {userPin: this.$route.query.userPin,customerId: this.$route.query.customerId,
          reportVersion: this.$route.query.reportVersion,
          "deleteModuleType":["1"]};
        this.request.post(this.api.assetAllocate.deleteReportModule, param, (data) => {
          this.commentMark = '';
          this.utils.msg("删除成功！");
          this.$router.push({ name: 'assetAllocationReportDetail', query: {userPin: this.$route.query.userPin,
              reportVersion:this.$route.query.reportVersion,
              id: this.$route.query.id,
              customerId:this.$route.query.customerId,
              from: 'detail',ifRealName: this.$route.query.ifRealName,
              seriesId: this.$route.query.seriesId || '',
              comment: this.$route.query.comment || '',
              portfolioId: this.$route.query.portfolioId || '',
              reportInfo: this.$route.query.reportInfo || '',
              marketId: this.$route.query.marketId || '',ifRequestComment: '1'}});
        })
      },
    }
  }
</script>

<style scoped>
  .commentMark{
    overflow:hidden;
    max-height: 74px;
    -webkit-transition: 0.5s all;
    transition: 0.5s all;
  }
  .hideMoreComment {
    text-overflow:ellipsis;
    display:-webkit-box;
    -webkit-box-orient:vertical;
    -webkit-line-clamp:4;
    max-height: 75px;
  }
  .showMoreComment {
    max-height: var(--max-height);
  }
  .arrow{
    width:30px;
    height:14px;
    background:rgba(255,255,255,1);
    box-shadow:0px 2px 10px 0px rgba(75,40,21,0.12);
    border-radius:7px;
    margin: 0 auto;
    position: relative;
  }
  .arrow:after{
    content: " ";
    display: inline-block;
    position: absolute;
    left: 50%;
    top:50%;
    height: 7px;
    width: 7px;
    border-width: 0 1px 1px 0;
    border-color: #C8C8CD;
    border-style: solid;
    -webkit-transform: translateX(-50%) translateY(-70%) rotate(45deg);
    transform: translateX(-50%) translateY(-70%) rotate(45deg);
    -webkit-transition: 0.4s all;
    transition: 0.4s all;
  }
  .arrow-verse  .arrow:after{transform: translateX(-50%) translateY(-20%) rotate(225deg);}

</style>
