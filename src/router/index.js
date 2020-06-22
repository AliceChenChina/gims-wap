import Vue from 'vue'
import Router from 'vue-router'
import index from '@/pages/index'
import func from '@/public/func'
import api from '@/api/api'
import utils from '@/utils/utils'
import powerKey from '@/utils/powerKey'
import { resolve } from 'path';

Vue.use(Router)
const routers = [
  {path: '/login', name: 'login', component: '/login'},//登录页
  {path: '/autoLogin', name: 'autoLogin', component: '/autoLogin'},//登录页
  {path: '/home', name: 'home', component: '/indexNew'},//首页
  {path: '/customer', name: 'customer', component: '/customer'},//客户
  {path: '/product', name: 'product', component: '/product'},//产品
  {path: '/personal', name: 'personal', component: '/personal'},//我的
  {path: '/achievement', name: 'achievement', component: '/achievement'},//业绩详情
  {path: '/product/details', name: 'productDetails', component: '/product/details'},//产品详情
  {path: '/product/order', name: 'order', component: '/product/order'},//新建报单
  {path: '/product/orderCustomer', name: 'orderCustomer', component: '/product/orderCustomer'},//新建报单-客户信息
  {path: '/product/orderRisk', name: 'orderRisk', component: '/product/orderRisk'},//新建报单-风险不匹配确认函
  {path: '/product/orderRss', name: 'orderRss', component: '/product/orderRss'},//新建报单-认购信息
  {path: '/product/report', name: 'productReport', component: '/product/report'},//产品报告
  {path: '/product/recommondProductInfo', name: 'recommondProductInfo', component: '/product/recommondProductInfo'},//产品推荐详情
  {path: '/customer/add', name: 'customerAdd', component: '/customer/add'},//新建客户
  {path: '/customer/details', name: 'customerDetails', component: '/customer/details'},//客户详情
  {path: '/customer/recordList', name: 'recordList', component: '/customer/recordList'},//拜访记录列表
  {path: '/customer/recordDetail', name: 'recordDetail', component: '/customer/recordDetail'},//拜访记录详情
  {path: '/customer/investment', name: 'customerInvestment', component: '/customer/investment'},//在投资产
  {path: '/customer/redeemAdd', name: 'customerRedeemAdd', component: '/customer/redeemAdd'},//新建赎回
  {path: '/customer/redeem', name: 'customerRedeem', component: '/customer/redeem'},//赎回记录
  {path: '/customer/info', name: 'customerInfo', component: '/customer/info'},//基础信息
  {path: '/message', name: 'message', component: '/customer/message'},//消息中心
  {path: '/personal/declarationForm', name: 'declarationForm', component: '/personal/declarationForm'},//报单
  {path: '/personal/contract', name: 'contract', component: '/personal/contract'},//合同
  {path: '/personal/contractAdd', name: 'contractAdd', component: '/personal/contractAdd'},//录入信息
  {path: '/personal/contractAddSuccess', name: 'contractAddSuccess', component: '/personal/contractAddSuccess'},//录入成功
  {path: '/customer/authentication', name: 'authentication', component: '/customer/authentication'},//实名认证申请
  {path: '/customer/questions', name: 'questions', component: '/customer/questions'},//评测试题
  {path: '/customer/evaluation', name: 'evaluation', component: '/customer/evaluation'},//评测结果
  {path: '/customer/evaluationNo', name: 'evaluationNo', component: '/customer/evaluationNo'},//风险评测
  {path: '/customer/asset', name: 'asset', component: '/customer/asset'},//资产证明
  {path: '/customer/selectCustomer', name: 'selectCustomer', component: '/customer/selectCustomer'},//选择客户
  {path:'/customer/customerSearch',name:'customerSearch',component:'/customer/customerSearch'},//客户搜索页面
  {path:'/product/productSearch',name:'productSearch',component:'/product/productSearch'},//客户搜索页面
  {path:'/customer/uploadAttachment',name:'uploadAttachment',component:'/customer/uploadAttachment'},//附件上传页面
  {path:'/product/customerCertification',name:'customerCertification',component:'/product/customerCertification'},//客户合规认证
  {path:'/product/bank',name:'bank',component:'/product/bank'},//报单银行卡
  {path:'/product/orderResult',name:'orderResult',component:'/product/orderResult'},//报单结果
  {path:'/staff/staff',name:'staff',component:'/staff/staff'},//陪谈员工
  {path: '/product/productDetail', name: 'productDetail', component: '/product/productDetail'},//新的产品介绍
  {path: '/product/fee', name: 'fee', component: '/product/fee'},//产品费率
  {path: '/product/moreDetail', name: 'moreDetail', component: '/product/moreDetail'},//产品概况、分红、合同、公告
  {path: '/product/netValueList', name: 'netValueList', component: '/product/netValueList'},//产品净值
  {path: '/test', name: 'test', component: '/product/test'},//test测试页面
  {path: '/product/redeem', name: 'redeem', component: '/product/redeem'},//申请赎回，赎回详情
  {path: '/product/redeemResult', name: 'redeemResult', component: '/product/redeemResult'},//赎回结果
  {path: '/customer/assetsList', name: 'assetsList', component: '/customer/assetsList'},//用户总资产列表
  {path: '/customer/assetAllocate/assetAllocationList', name: 'assetAllocationList', component: '/customer/assetAllocate/assetAllocationList'},//用户资产配置列表
  {path: '/customer/assetAllocate/assetAllocateDetail/assetAllocationReportDetail', name: 'assetAllocationReportDetail', component: '/customer/assetAllocate/assetAllocateDetail/assetAllocationReportDetail'},//用户资产配置报告
  {path: '/customer/assetAllocate/modifyBasicInfo', name: 'modifyBasicInfo', component: '/customer/assetAllocate/modifyBasicInfo'},//修改基础信息
  {path: '/customer/assetAllocate/assetAllocateDetail/checkAssetClassifyDetail', name: 'checkAssetClassifyDetail', component: '/customer/assetAllocate/assetAllocateDetail/checkAssetClassifyDetail'},//查看资产分类说明
  {path: '/customer/assetAllocate/modifyInvestSuggest', name: 'modifyInvestSuggest', component: '/customer/assetAllocate/modifyInvestSuggest'},//修改资产投资建议列表
  {path: '/customer/assetAllocate/addSuggestProduct', name: 'addSuggestProduct', component: '/customer/assetAllocate/addSuggestProduct'},//添加资产投资建议产品
  {path: '/personal/manageAssetsList', name: 'manageAssetsList', component: '/personal/manageAssetsList'},//管理客户资产列表
  {path: '/personal/editSalesManBusinessCard', name: 'editSalesManBusinessCard', component: '/personal/editSalesManBusinessCard'},//新增、编辑理财师名片
  {path: '/personal/salesManBusinessCardInfo', name: 'salesManBusinessCardInfo', component: '/personal/salesManBusinessCardInfo'},//查看理财师名片信息
  {path: '/customer/customerTalk', name: 'customerTalk', component: '/customer/customerTalk'},//客户
  {path: '/customer/birthdayRemind', name: 'birthdayRemind', component: '/customer/birthdayRemind'},//客户生日提醒
  {path: '/marketShare/shareRecords', name: 'shareRecords', component: '/marketShare/shareRecords'}, // 营销平台-分享记录
  {path: '/marketShare/activityList', name: 'activityList', component: '/marketShare/activityList'}, // 营销平台-可分享的活动列表
  {path: '/marketShare/activityInfo', name: 'activityInfo', component: '/marketShare/activityInfo'}, // 营销平台-可分享的活动详情
  {path: '/marketShare/articleInfo', name: 'articleInfo', component: '/marketShare/articleInfo'}, // 营销平台-可分享的文章详情
  {path: '/marketShare/posterInfo', name: 'posterInfo', component: '/marketShare/posterInfo'}, // 营销平台-可分享的海报详情
  {path: '/marketShare/sharedRecordInfo', name: 'sharedRecordInfo', component: '/marketShare/sharedRecordInfo'}, // 营销平台-已分享的活动的记录
  {path: '/marketShare/userVisitRecords', name: 'userVisitRecords', component: '/marketShare/userVisitRecords'} // 营销平台-用户访问记录
]
let newRouters = [
  { path: '/', redirect: '/login' }
]
for (let i = 0; i < routers.length; i++){
  newRouters.push({path: routers[i].path, name: routers[i].name,component:resolve=>require(['@/pages' + routers[i].component],resolve)})
}

const router=new Router({
  routes: [
    ...newRouters
  ]
})

//全局路由守卫,获取所有的arg参数列表
router.beforeEach((to,from,next)=>{
  if(from.name === 'activityList') {
    // if(to.query.itemIndex === '0'){
    //   next()
    // }else{
    //   next({path: '/marketShare/activityList?itemIndex=0'})
    // }
    // return;

  }
  // if(from.name === 'posterInfo' && to.name === 'activityList') {
  //   if(to.query.itemIndex === '1'){
  //     next()
  //   }else{
  //     next({path: '/marketShare/activityList?itemIndex=1'})
  //   }
  //   return;
  // }
  // if(from.name === 'activityInfo' && to.name === 'activityList') {
  //   if(to.query.itemIndex === '2'){
  //     next()
  //   }else{
  //     next({path: '/marketShare/activityList?itemIndex=2'})
  //   }
  //   return;
  // }
    //排除login页面的调取arg的方法
    if(to.name=="login" || to.name=="autoLogin"){
      next();
      return;
    }
  if(utils.userInfo.userPowerKey.length > 0 ) {
    if (!utils.userInfo.checkUserPowerKey(powerKey.messageListKey) && to.name === "home" || !utils.userInfo.checkUserPowerKey(powerKey.customerListKey) && to.name === "customer" ||  !utils.userInfo.checkUserPowerKey(powerKey.productListKey) && to.name === "product") {
      next( "/personal");
      return;
    }
  }
    if(to.query.token) {
      const searchParams = to.query.token;
      if (searchParams) {
        localStorage.setItem("token", searchParams);
          func.ajaxPost(api.userInfo.getUserInfo, {}, res=> {
            if (res.data.code === 200) {
              if (!res.data.data) {
                return false
              }
              let data = JSON.parse(res.data.data);
              if (!data.userPowerKey) {
                return false;
              }
              // 权限数据放入全局对象中
              localStorage.setItem('pinCode', data.pinCode);
              localStorage.setItem('oriPinCode', data.oriPinCode);
              localStorage.setItem('userName', encodeURIComponent(data.trueName));
              // 是否是理财师
              localStorage.setItem('isSales', data.isSales);
              utils.userInfo.userPowerKey = data.userPowerKey.split(',');
              // 判读是否有首页权限，有先调入首页，无则跳入个人中心
              if(!utils.userInfo.checkUserPowerKey(powerKey.messageListKey)){
                next( "/personal");
                return;
              }
            };
          })
      }
    }
    if(utils.arg.data.length!=0){
      next();
    }else{
      func.ajaxPost(api.arg.getArgAll,{},res=>{
        utils.arg.data = [];
        if (res.data.code === 200) {
             if (res.data.data) {
               let data=res.data.data;
                for (var i = 0; i < data.length; i++) {
                    var item = data[i];
                    utils.arg.data.push({
                        group: item.argGroup,
                        code: item.argCode,
                        text: item.argText,
                        remark: item.argRemark
                    })
                }
                utils.arg.init();
                next();
            }
        }
      })
    }
  if(utils.userInfo.userPowerKey && utils.userInfo.userPowerKey.length !== 0){
    next();
  }else{
    func.ajaxPost(api.userInfo.getUserInfo, {}, res=> {
      if (res.data.code === 200) {
        if (!res.data.data) {
          return false
        }
        let data = JSON.parse(res.data.data);
        if (!data.userPowerKey) {
          return false;
        }
        // 权限数据放入全局对象中
        localStorage.setItem('pinCode', data.pinCode);
        utils.userInfo.userPowerKey = data.userPowerKey.split(',')
        next();
      };
    })
  }

})

//全局路由守卫
export default router
