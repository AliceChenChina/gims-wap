import Vue from 'vue'
import router from '../router'
// userInfo 存储
let userInfo = {};
userInfo.userPowerKey = [];
// 判断是否有权限
userInfo.checkUserPowerKey = (key) => {
  return userInfo.userPowerKey.includes(key);
};
let arg = {};
arg.data = [];
arg.obj = {};
arg.group = {};
arg.init = function () {
  arg.group = {};
  arg.obj = {};
  var obj = {};
  for (var i = 0; i < this.data.length; i++) {
    var item = this.data[i];
    var group = {
      argCode: item.code,
      argText: item.text,
      argRemark: item.remark
    };
    if (!arg.group[item.group]) {
      arg.group[item.group] = [];
    }
    arg.group[item.group].push(group);
    obj[item.group + '$' + item.code] = item.text;
  }
  arg.obj = obj;
}
//boolean当找不到值得时候返回''
arg.getText = function (group, code, boolean) {
  // if(code ==null){
  // 	return '-';
  // }
  var find = arg.obj[group + '$' + code];
  if (typeof (find) != 'undefined') {
    return find;
  } else {
    // if (typeof (def) != 'undefined') {
    // 	return def;
    // }
    if (boolean) {
      return '';
    } else {
      return '-';
    }
  }
}
arg.getGroup = function (group, start, end) {
  var result = arg.group[group] || [];
  if (start && typeof (start) == 'number' && start < result.length) {
    if (end) {
      return result.slice(start, end)
    }
    return result.slice(start);
  }
  return result;
}

arg.getSelect = function (group) {
  let List = [];
  let temp = arg.getGroup(group);
  temp.forEach(element => {
    let obj = {};
    obj.key = element.argCode;
    obj.value = element.argText;
    List.push(obj);
  });
  return List;
};

export default {
  //返回A-Z
  getEN() {
    let arr = [];
    for (let i = 65; i < 91; i++) {
      arr.push(String.fromCharCode(i));
    }
    return arr.join(',');
  },
  //获取高度
  getHeight(height) {
    let newHeight = document.body.clientHeight - height
    return newHeight + 'px'

  },
  //监听输入框事件
  getFocus(height) {
    let newHeight = parseInt(height)
    let originalHeight = document.body.clientHeight;
    let defaultHeight = originalHeight - newHeight
    window.onresize = function () {
      var resizeHeight = document.body.clientHeight;
      if (resizeHeight < originalHeight) {
        defaultHeight = resizeHeight - newHeight
      } else {
        defaultHeight = originalHeight - newHeight
      }
      return defaultHeight + 'px'
    }
    return defaultHeight + 'px'
  },
  //路由跳转
  goToUrl(path) {
    router.push({
      path
    })
  },
  //返回
  goBack() {
    router.go(-1)
  },
  //弹窗提醒
  alert(content, callBack = () => {
  }, title = '提示') {
    Vue.$vux.alert.show({
      title,
      content,
      onShow() {
      },
      onHide() {
        callBack()
      }
    })
  },
  //验证消息弹框
  msg(title, type) {
    if (!type) {
      Vue.$vux.toast.text(title, 'center')
    } else {
      Vue.$vux.toast.show({
        text: title,
        type
      })
    }
  },
  msgError() {
    // Vue.$vux.toast.show({
    //   text: '<button>shine</button>',
    //   type:'text',
    //   position:'top'
    // })
  },
  //格式化日期格式，例如dateFtt("yyyy-MM-dd",date)
  dateFtt(fmt, date) {
    if (!date) {
      return '-';
    }
    //兼容ios
    date = new Date(date.replace(/-/g, '/'));
    var o = {
      "M+": date.getMonth() + 1, //月份
      "d+": date.getDate(), //日
      "h+": date.getHours(), //小时
      "m+": date.getMinutes(), //分
      "s+": date.getSeconds(), //秒
      "q+": Math.floor((date.getMonth() + 3) / 3), //季度
      "S": date.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt))
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt))
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
  },
  //格式化时间，返回月日,接收的是毫秒数
  transferTimeToMonthDate(timestamp,format){
    if(!timestamp){
      return
    }
    let time='';
    if(typeof(timestamp)!='number'){
      timestamp=timestamp.replace(/\-/g, "/")
      time = new Date(timestamp);
    }else{
      time = new Date(timestamp);
    }
    let month = time.getMonth() + 1;
    let day = time.getDate();
    let data=month + '月'+ day + '日'
    return data;
  },
  //格式化时间，返回月日,接收的是毫秒数
  transferTimeToDate(timestamp,joinSignal){
    if(!timestamp){
      return
    }
    let time='';
    if(typeof(timestamp)!='number'){
      timestamp=timestamp.replace(/\-/g, "/")
      time = new Date(timestamp);
    }else{
      time = new Date(timestamp);
    }
    let year = time.getFullYear();
    let month = time.getMonth() + 1;
    let day = time.getDate();
    let data='';
    if(joinSignal) {
      data=year+joinSignal+this.addZero(month) + joinSignal+ this.addZero(day)
    }
    if(!joinSignal) {
      data=year+'年'+this.addZero(month) + '月'+ this.addZero(day) + '日'
    }
    return data;
  },
transferTimeToDateTime(timestamp){
  if(!timestamp){
    return
  }
  let time='';
  if(typeof(timestamp)!='number'){
    timestamp=timestamp.replace(/\-/g, "/")
    time = new Date(timestamp);
  }else{
    time = new Date(timestamp);
  }
  let year = time.getFullYear();
  let month = time.getMonth() + 1;
  let day = time.getDate();
  let hours = time.getHours();
  let minites = time.getMinutes();
  let data=year+'-'+this.addZero(month) + '-'+ this.addZero(day) + ' ' + this.addZero(hours)+':'+ this.addZero(minites)
  return data;
},
  addZero(num){
    num = num + '';
    let result;
    if(num.length === 1) {
      result = '0'+num;
    }
    if(num.length === 2) {
      result = num;
    }

    return result;

  },
  //金额千分号显示
  formatNum(num) {

    if (num == null) {
      num = 0;
    }
    let parts = num.toString().split(".");
    console.log('parts', parts);
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    parts[1] = parts[1] ? parts[1].length < 2 ? parts[1] + '0' : parts[1]  : '00';
    let temp = parts.join(".");
    return temp
  },
  //参数
  arg,
  //保留四位小数，不足四位的补上0，超过四位的只去不进,单位净值
  keepFourDecimal(num) {
    num = num + '';
    let newNum = parseFloat(num).toFixed(5).slice(0, -1);
    return newNum;
  },
  //业绩比较基准,保留两位小数，四舍五入,不足补0
  formateProPerBen(num) {
    if (num == null || num == undefined) {
      return '--'
    } else {
      let tmp = (parseFloat(num) * 100).toFixed(2);
      return tmp + '%';
    }
  },
  //提成比例,保留三位小数，四舍五入,去0,当是3.00%直接变成3%
  formateComPro(num) {
    if (num == null || num == undefined) {
      return '--'
    } else {
      let tmp = parseFloat((parseFloat(num) * 100).toFixed(3));
      return tmp + '%';
    }
  },
  //元变成万元,并且取整,四舍五入
  toTenThousand(num) {
    if (num == null || num == undefined) {
      return '--'
    } else {
      let newNum = (parseFloat(num) / 10000).toFixed(0);
      var parts = newNum.toString().split(".");
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return parts.join(".")
    }
  },
  //将数据按照一个字段重复属性值来分组,data为数据变量名称，key数据类型为字符串
  formatKeyPacketData(Data, key) {
    var map = {};
    let finalData = [];
    for (var i = 0; i < Data.length; i++) {
      var ai = Data[i];
      if (!map[ai[key]]) {
        finalData.push({
          [key]: ai[key],
          data: [ai]
        });
        map[ai[key]] = ai;
      } else {
        for (var j = 0; j < finalData.length; j++) {
          var dj = finalData[j];
          if (dj[key] == ai[key]) {
            dj.data.push(ai);
            break;
          }
        }
      }
    }

    return finalData;
  },
  //格式化业绩比较基准，将小数变成整数，四舍五入，不足以0补足
  formatePerformanceBenchmark(num) {
    let newNum = parseFloat(num).toFixed(2);
    return newNum;
  },
  //格式化手机号码
  formatMpbilePhone(phone) {
    if (phone) {
      phone = phone.replace(/\B(?=(\d{4})+(?!\d))/g, "-");
      return phone
    } else {
      return ''
    }
  },
  //格式化元,保留小数点后两位
  formateYuan(num) {
    if (num == undefined || num == null) {
      return '0.00'
    } else {
      num = parseFloat(num).toFixed(3).slice(0, -1);
      return num;
    }
  },
  setDefault(data) {
    if (data === undefined || data === '' || data === null) {
      return '--';
    }
    return data;
  },
  formatData(num) {
    num += '';
    if (!num.includes('.')) {
      num += '.00';
    }else{
      var numArr = num.split('.');
      if(numArr.length === 2){
        if(numArr[1].length === 1){
          numArr[1] = numArr[1] + '0';
        }
        num = numArr.join('.');
      }else{
        return false;
      }
      if(num.split('.')[1].length ){

      }
    }
    return num.replace(/(\d)(?=(\d{3})+\.)/g, function ($0, $1) {
      return $1 + ',';
    }).replace(/\.$/, '');
  },
  // 判断参数是否为数字，是返回true,否返回false
  ifNumber(param){
    let reg = /^[1-9]+[0-9]*]*$/;
    return reg.test(param);
  },
  // userInfo 存储
  userInfo,
  changeJtalkUrl() {
    const href = window.location.href;
    let location;
    // 预发与生产
    if (href.indexOf('gimswap.jd.com') !== -1 || href.indexOf('gimswap.jdfmgt.com') !== -1) {
      location = 'https://m-jtalk.jd.com';
    } else {
      location = 'https://m-jtalk2.jd.com';
    }
    return location;
  },
  /**
   * 传入身份证号码和num.获取出生日期,性别跟年龄
   * @param UUserCard 身份证号码
   * @param num 1获取出生日期
   *            2 获取性别
   *            3 获取年龄,年龄小于1岁的时候默认为1岁
   * @returns {*}
   * @constructor
   */
  IdCard(UUserCard,num){
    if(!UUserCard){
      return '--'
    }
  if(num === 1){
    //获取出生日期
    let birth=UUserCard.substring(6, 10) + "年" + UUserCard.substring(10, 12) + "月" + UUserCard.substring(12, 14) + "日";
    return birth;
  }
  if(num === 2){
    //获取性别
    if (parseInt(UUserCard.substr(16, 1)) % 2 === 1) {
      //男
      return "男";
    } else {
      //女
      return "女";
    }
  }
  if(num === 3){
    //获取年龄
    let myDate = new Date();
    let month = myDate.getMonth() + 1;
    let day = myDate.getDate();
    let age = myDate.getFullYear() -   UUserCard.substring(6, 10) - 1;
    if (UUserCard.substring(10, 12) < month || UUserCard.substring(10, 12) == month && UUserCard.substring(12, 14) <= day) {
      age++;
    }
    if(age <= 0){
      age = 1;
    }
    return age;
  }
}

}
