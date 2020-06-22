
const apiUrl = '/wap';

module.exports = {
  file: {
    upload: apiUrl + '/fileUpload/upload',
  },
  customer: {
    Query: apiUrl + '/customer/queryCustomerNewList',//企业微信客户列表查询
    Info: '/customerList/v2/get',//获取客户详情/customerList/v2/get
    EditCus: '/customerList/v2/editCustomer',//编辑客户
    addCus: '/customerList/v2/addCustomer',//新建客户
    verifyCustomer:'/customerList/preposeAddCustomer',//验证京东用户名与客户联系方式是否一致
    preposeEdit:'/customerList/preposeEditCustomer',//编辑时无pin验证京东用户名与客户联系方式是否一致
    SubmitRealName: apiUrl + '/customer/submitRealName',//提交实名认证
    GetRealName:apiUrl+'/customer/getRealName', //获取实名认证信息
    GetRiskPaper: apiUrl + '/customer/getRiskPaper',//获取客户风评问卷
    GetAssetCertificate:apiUrl + '/customer/getAssetCertificate',//获取用户的资产证明
    investmentProductList:apiUrl+'/customer/investmentProductList',//获取再投资产
    GetCustomerVisitList:apiUrl+'/customerVisit/query',//获取客户拜访记录列表
    AddCustomerVisit:apiUrl+'/customerVisit/save',//新增拜访记录
    GetCustomerVisit:apiUrl+'/customerVisit/get',//获取拜访记录
    EditCustomerVisit:apiUrl+'/customerVisit/update',//编辑拜访记录
    saveCustomerPinCode:apiUrl+'/customer/saveCustomerPinCode',//保存京东pincode
    getCustomerComplianceInfo:apiUrl+'/customer/getCustomerComplianceInfo',//获取客户合规信息
    checkUserDeclaration:apiUrl+'/customer/checkUserDeclaration',//获取客户合规信息
    customerBankCard:apiUrl+'/customerBankCard/queryBankCardList',//获取客户银行卡列表
    getCustomerPositionAmount:apiUrl+'/customer/getCustomerPositionAmount',//获取客户在投资产统计
    assetsList:apiUrl+'/customer/assetsList',//用户总资产列表
    queryCustomerHoldinfo:'/bookingTrade/v2/queryCustomerHoldInfo', //用户总资产详情
    queryCustomerHoldList:'/bookingTrade/v2/queryCustomerHoldList', //用户总资产列表
    checkPlannerCustomer:'/bookingTrade/checkPlannerCustomer',//报单时检查用户是不是已经有绑定理财师了
    birthday: '/birthCustomer/details', // 生日提醒
  },
  product:{
    Query:apiUrl+'/product/query',//产品列表查询
    SecondaryMarketDetail:apiUrl+'/product/getSecondaryMarket',//二级市场产品详情查询
    FixedIncomeDetail:apiUrl+'/product/getFixedIncome',//固收产品详情查询
    EquityDetail:apiUrl+'/product/getEquity',//股权产品详情查询
    Report:apiUrl+'/product/getNoticeList',//获取产品的财报/公告
    queryProductFeeRate:apiUrl+'/product/queryProductFeeRate',//获取产品的费率
    queryNetValueList:apiUrl+'/product/queryNetValueList',//获取产品的历史净值
    queryFeeRateList:apiUrl+'/product/queryFeeRateList',//获取新的产品的费率
    queryProductSurvey:apiUrl+'/product/queryProductSurvey',//获取产品的概况合同
    queryProductDividend:apiUrl+'/product/queryProductDividend',//获取产品的分红
    getRedeemApplyInfo:apiUrl+'/redeemTrade/getRedeemApplyInfo',//客户赎回申请单详情
    submitRedeemApplyInfo:apiUrl+'/redeemTrade/submitRedeemApplyInfo',//客户赎回申请提交
    cancelRedeemApplyInfo:apiUrl+'/redeemTrade/cancelRedeemApplyInfo',//客户赎回申请撤回
  },
  login: {
    defaultlogin: apiUrl + '/login/doLogin',
    autoLogin: apiUrl + '/login/autoLogin',
    getWechatAccessUrl: apiUrl + '/login/getWechatAccessUrl'
  },//登录页面
  home:{
    Query:apiUrl+'/home/querySalesMonthList', //理财师本月业绩查询
    HotProduct:apiUrl+'/home/hotProducts',//热销产品查询
    newCustomerGroupByMonthly:apiUrl+'/home/newCustomerGroupByMonthly',//本月新增客户
    redeemCustomerGroupByMonthly:apiUrl+'/home/redeemCustomerGroupByMonthly',//本月赎回客户
    buyCustomerGroupByMonthly:apiUrl+'/home/buyCustomerGroupByMonthly',//本月新增资产
    queryTradeApply:'/wap/redeemTrade/queryTradeApply',//赎回申请消息提醒
  },
  personal:{
    Query:apiUrl+'/personal/index',//我的主页
    manageAssetsList:apiUrl+'/personal/queryManageCapitalList', //管理客户资产列表
    getSalesManBusinessCardInfo:apiUrl+'/personal/getSalesManBusinessCardInfo', //管理客户资产列表
    saveSalesManBusinessCardInfo:apiUrl+'/personal/saveSalesManBusinessCardInfo', //管理客户资产列表
    queryCard: apiUrl+'/personal/queryCard', // 查询个人名片详情
    editCard: apiUrl+'/personal/editCard', // 查询个人名片详情
    updateStatus: apiUrl+'/personal/updateStatus' // 查询个人名片详情
  },
  arg:{
    getArgAll:'/getArgAll' //获取到所有的arg
  },
  userInfo: {
    getUserInfo:'/getUserInfo' //获取用户所有权限
  },
  employee:{
    queryEmployeeVisit:apiUrl+'/employee/queryEmployeeVisit',//获取陪谈员工
  },
  trade:{
    queryBookingTradeList:apiUrl+'/bookingTrade/queryBookingTradeList',//报单列表
    saveBookingTradeInfo:apiUrl+'/bookingTrade/saveBookingTradeInfo',//保存报单
    redeemTrade:apiUrl+'/redeemTrade/query',//赎回列表
  },
  message:{
    query:apiUrl+'/message/query',//消息列表查询
  },
  assetAllocate:{
    queryReportList: '/assetAllocation/queryReportList', // 查询报告列表
    sendReport: '/assetAllocation/sendReport', // 理财师发送资产配置报告
    queryPortfolioIncomeRate: '/assetAllocation/queryPortfolioIncomeRate', // 查询用户组合收益率曲线
    queryHoldingAndCfgAssetAllocation: '/assetAllocation/queryHoldingAndCfgAssetAllocation', // 查询用户当前持有和推荐资产比例
    queryReportBaseInfo: '/assetAllocation/queryReportBaseInfo', // 查询报告基本信息
    queryMarketComment: '/assetAllocation/queryMarketComment', // 查询市场快评
    deleteReportModule: '/assetAllocation/deleteReportModule', // 删除报告模块
    commitKycPaper: '/assetAllocation/commitKycPaper', // 提交KYC试题，生成模板报告
    queryStrategyOrder: '/strategyOrder/query/strategyOrder', // 查询资产配置推荐产品信息
    searchStrategyOrder: '/strategyOrder/search/strategyOrder', // 搜索产品池推荐产品信息
    modifyStrategyOrder: '/strategyOrder/modify/strategyOrder', // 修改推荐产品信息
    queryTestPaper: '/assetAllocation/queryTestPaper', // 获取用户最新KYC信息
    queryUserInfo: '/assetAllocation/queryUserInfo', // 获取某个报告版本的kyc信息
    modifyUserInfoPaper: '/assetAllocation/modifyUserInfoPaper', // 修改kfc
  },
  marketShare:{
    activityQuery: '/activity/listPage', // 查询可分享的活动列表
    activityInfo: '/activity/detail/findActivityById', // 查询可分享的活动详情
    share:'/weChat/qyShare/forGims',// 分享
    activityShareInfo:'/activity/basis/findActivityById', // 获取活动的分享信息
    getRecordsData:'/share/queryShare', // 获取已分享活动列表
    getShareId:'/share/getShareId', // 获取分享ID
    insertShareLog:'/share/insertShare', // 插入分享的ID
    getQueryStatistics:'/share/queryStatistics', // 理财师分享指标统计
    getPosterList:'/cmsCfg/listPage', // 海报列表
    getPosterBillUrl:'/cmsCfg/getBillUrl', // 海报详情
    getPosterDetail:'/cmsCfg/queryDetail', // 海报详情
    queryAccessInfo:'/share/queryAccessInfo', // 查询用户分享的访问的用户及统计信息/share/queryInteractInfo
    queryInteractInfo:'/share/queryInteractInfo', // 查询用户分享的访问的用户及统计信息
  },

};
