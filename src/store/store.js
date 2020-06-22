import Vue from 'vue'
import Vuex from 'vuex'
import VuexAlong from 'vuex-along'
Vue.use(Vuex)

//当是登录页面的时候，清空所有的state
if(window.location.hash.indexOf('login')>0){
   window.clearVuexAlong;
}

var stateTemp={
  bottomShow: true,
    //拜访记录
    recordDetail:{},
    //报单转客户的时候保存productDetail的数据
    orderDetail:{
      productDetail:{},
      customerDetail:{},
      type:'',
    },
    //汇款信息
    orderRss:{
       //需要传给后台的
       productId:'',//产品id
       bankAccount:'',//银行账号
       bankBranch:'',//银行开户行
       bookingBalance:'',//报单金额
       feeBalance:'',//费用金额
       paymentBlance:'0.00',//汇款金额
       paymentDate:'',//汇款时间
       empJobnumber:'', //配谈员工号
       customerName:'',//客户姓名
       customerId:'',//客户id
       pinCode:'',//京东用户名
       riskMismatch:{},//风险不匹配函
       paymentFile:{},//付款凭证
       identificationFile:{},//身份证附件
       bankcardFile:{},//银行卡附件
       otherFiles:[],//其他附件
       startId:null,
       customerFrom:'',//客户来源
      referPin:'',//推荐人京东用户名
       //不需要传给后台的
       accompanyPersonName:'',//配谈人员名称
       cusLevelName:'',//客户等级中文
    },
  modifySuggestPrdList:[],
  chooseDataList: [],
  portfolio_cfg: {}
};
var stateString=JSON.stringify(stateTemp);
export default new Vuex.Store({
    state:JSON.parse(stateString),
    mutations:{
      storePortFolioCfg(state, obj) {
        state.portfolio_cfg = obj;
      },
      changeChooseDataList(state,obj) {
        state.chooseDataList = obj;
      },
      changeBottomShow(state,value){
        state.bottomShow = value;
      },
      changeRecordDetail(state,obj){
        if(Object.keys(obj).length==0){
          state.recordDetail={};
        }
        for(var x in obj){
          if(obj[x]!=undefined){
            state.recordDetail[x]=obj[x];
          }
        }
      },
      changeOrderDetail(state,obj){
        if(Object.keys(obj).length==0){
          state.orderDetail={
            productDetail:{},
            customerDetail:{},
            type:{},
          };
        }
        if(obj.productDetail!=undefined){
          state.orderDetail.productDetail=obj.productDetail;
        }
        if(obj.customerDetail!=undefined){
          state.orderDetail.customerDetail=obj.customerDetail;
        }
        if(obj.type!=undefined){
          state.orderDetail.type=obj.type;
        }
      },
      changeOrderRss(state,obj){
        if(Object.keys(obj).length==0){
          state.orderRss={
            //需要传给后台的
            productId:'',//产品id
            bankAccount:'',//银行账号
            bankBranch:'',//银行开户行
            bookingBalance:'',//报单金额
            feeBalance:'',//费用金额
            paymentBlance:'0.00',//汇款金额
            paymentDate:'',//汇款时间
            empJobnumber:'', //配谈员工号
            customerName:'',//客户姓名
            customerId:'',//客户id
            pinCode:'',//京东用户名
            riskMismatch:{},//风险不匹配函
            paymentFile:{},//付款凭证
            identificationFile:{},//身份证附件
            bankcardFile:{},//银行卡附件
            otherFiles:[],//其他附件
            startId:null,
            customerFrom:'',//客户来源
            referPin:'',//推荐人京东用户名
            //不需要传给后台的
            accompanyPersonName:'',//配谈人员名称
            cusLevelName:'',//客户等级中文
         };
        }
        for(var x in obj){
          if(obj[x]!=undefined){
            state.orderRss[x]=obj[x];
          }
        }
      },
    },
    plugins:[VuexAlong]
})

