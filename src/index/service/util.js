import md5 from "blueimp-md5";
import store from "@@/store/";
import axios from "@@/plugins/rsa/axios";
// console.log(11111)
console.log(
  md5(
    'ct001fb8ada5237c5ae97978ff07fc7471d20{"contenttype":"article","startindex":0,"endindex":10}'
  )
);

/**
 * 工具方法
 */

/**
 * 计算两个经纬度之间的距离
 */
export const GetDistance = (lat1, lng1, lat2, lng2) => {
  lat1 = window.LATITUDE || window.LBSINFO.Latitude; // 维度
  lng1 = window.LONGITUDE || window.LBSINFO.Longitude;
  // console.log(lat1)
  // console.log(lng1)

  var radLat1 = (lat1 * Math.PI) / 180.0;
  var radLat2 = (lat2 * Math.PI) / 180.0;
  var a = radLat1 - radLat2;
  var b = (lng1 * Math.PI) / 180.0 - (lng2 * Math.PI) / 180.0;
  var s =
    2 *
    Math.asin(
      Math.sqrt(
        Math.pow(Math.sin(a / 2), 2) +
          Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)
      )
    );
  s = s * 6378.137; // EARTH_RADIUS;
  s = (Math.round(s * 10000) / 10000).toFixed(1);
  // alert(s)
  // if(s > 10){
  //     return 10 + Math.random().toFixed(2)
  // }
  return s + "";
};
export const formatDate_1 = (time, format = "YY-MM-DD hh:mm:ss.SSS") => {
  var date = new Date(time);
  var year = date.getFullYear(),
    month = date.getMonth() + 1, //月份是从0开始的
    day = date.getDate(),
    hour = date.getHours(),
    min = date.getMinutes(),
    sec = date.getSeconds(),
    Msec = date.getMilliseconds();
  var preArr = Array.apply(null, Array(10)).map(function(elem, index) {
    return "0" + index;
  }); ////开个长度为10的数组 格式为 00 01 02 03

  var newTime = format
    .replace(/YY/g, year)
    .replace(/MM/g, preArr[month] || month)
    .replace(/DD/g, preArr[day] || day)
    .replace(/hh/g, preArr[hour] || hour)
    .replace(/mm/g, preArr[min] || min)
    .replace(/ss/g, preArr[sec] || sec)
    .replace(/SSS/g, preArr[Msec]||Msec);

  return newTime;
};
//
export const setMd5 = data => {
  let d = "ct001fb8ada5237c5ae97978ff07fc7471d20" + JSON.stringify(data);
  return "ct001;" + md5(d);
};
export const setMd5HY = data => {
  let se = "CE59E262D7AD716E24BA3D613DC617EB"; //md5秘钥
  let d = "" + data.channel + data.requestId + se;
  return md5(d).toUpperCase();
};

export const fetchPoints = (
  parent_title,
  sub_title,
  phone,
  remark,
  session
) => {
  axios
    .post("collectOpera", {
      channel: /iP(ad|hone|od)/.test(navigator.userAgent) ? "ios" : "android", // 渠道> android、ios、html5
      parent_title: parent_title, // 父标题
      sub_title: sub_title, //子 标题
      phone: phone, // 手机号
      remark: remark, // 备注
      session: session
    })
    .then(res => {
      console.log("埋点成功");
    })
    .catch(() => {
      console.log("异常");
    });
};
/**
 * 获取当前页面的url参数，并处理
 * @param  {[type]} name [description]
 * @return {[type]}      [description]
 */
export const geURLParam = name => {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var r = window.location.search
    .substr(1)
    .replace(/\$/g, "=")
    .replace(/@/g, "&")
    .match(reg); //获取get参数字窜，与正在匹配
  if (r !== null) {
    return decodeURI(r[2]);
  } else {
    return null; //传递中文参数时候，需要使用encodeURI()进行编码
  }
};
// 区分 安卓 0  苹果 1
export const AppFlag = () => {
  var u = navigator.userAgent,
      isAppFlag = '';
  if (u.indexOf('iPhone') > -1 || u.indexOf('iPad') > -1 || u.indexOf('iPod') > -1) {
      isAppFlag = '1'; // ios
  } else if (u.indexOf('Android') > -1 || u.indexOf('Adr') > -1 || u.indexOf('Linux') > -1) {
      isAppFlag = '0'; // Android
  }
  return isAppFlag;
};
// 和包分享到微信、QQ
export const shareNow = (shareUrl, shareTxt) =>  {
  if (AppFlag() === '1') {
      window.location.href = "cyberapp://IOSShare#IOSShareTitle= #IOSShareURL=" + shareUrl + "#IOSShareDetails=" + shareTxt;
  } else if (AppFlag() === '0' && typeof(goActivity) !== 'undefined' && typeof(goActivity.goTopSpeed) === 'function') {
      window.MobileWalletShare.startShare('', shareUrl, shareTxt);
  }
};
// 判断是否在和包浏览器环境
export const isHebaoApp = () => {
  var u = navigator.userAgent;
  if (u.match(/hebao/i)) {
      return true;
  } else {
      return false;
  }
};
/**
 * 异步加载JS
 * @param {*} url 
 * @param {*} callBack 
 */
export const asyncLoaded = function(url, callBack) {
  /*url为js的链接，callBack为url的js中的函数（该函数调用应该写到匿名函数中，如function(){console.log(div.getScrollOffset())}）*/
  var script = document.createElement("script");
  script.type = "text/javascript";
  /*if else 这几句话必须要写到这位置处，不能放最后，因为if中js加载中script.readyState存在好几种状态，
只有状态改变‘readystatechange’事件才会触发，但现在浏览器加载速度很快，当解析到该事件时JS有可能已经加载完，
所以事件根本不会触发，所以要写到前面*/
  if (script.readystate) {
    //兼容IE
    script.onreadystatechange = function() {
      //状态改变事件才触发
      if (script.readyState == "loaded" || script.readyState == "complete") {
          console.log('hello')
        callBack();
        script.onreadystatechange = null;
      }
    };
  } else {
    script.onload = function(e) {
      callBack();
    };
  }
  script.src = url;
  document.body.appendChild(script);
};

export const encodeJson = obj => {
  let res = "";
  for (let k in obj) {
    res += k + "=" + obj[k] + "&";
  }
  return res.substr(0, res.length - 1);
};

/**
 * 格式化日期
 * @param fmt
 * @param date
 * @returns {*}
 */
export const formatDate = (fmt, date) => {
  if (!(date instanceof Date)) {
    return date;
  }
  const o = {
    "M+": date.getMonth() + 1,
    "d+": date.getDate(),
    "h+": date.getHours(),
    "m+": date.getMinutes(),
    "s+": date.getSeconds(),
    "q+": Math.floor((date.getMonth() + 3) / 3),
    S: date.getMilliseconds()
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      `${date.getFullYear()}`.substr(4 - RegExp.$1.length)
    );
  }
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : `00${o[k]}`.substr(`${o[k]}`.length)
      );
    }
  }
  return fmt;
};
/**
 * 数组去重
 * @param {数组} arrOld
 * eg :removeReapt([1,2,3,6,5,2,2,5,6,2,1]) // [1, 2, 3, 6, 5]
 */
export const removeReapt = arrOld => {
  var arr = [];
  for (var i = 0, len = arrOld.length; i < len; i++) {
    if (arr.indexOf(arrOld[i]) == -1) {
      arr.push(arrOld[i]);
    }
  }
  return arr;
};

/**
 * 数组最大值
 * @param {*} arr
 * maxArr([1,4,65,843,2,1,4]) // 843
 */
export const maxArr = arr => {
  return Math.max.apply(null, arr);
};

/**
 * 数组最小值
 * @param {*} arr
 * minArr([1,4,65,843,2,10,4]) // 1
 */
export const minArr = arr => {
  return Math.min.apply(null, arr);
};

/**
 * 数组求和
 * @param {*} arr
 * sumArr([1,4,65,843,2,1,4]) // 920
 */
export const sumArr = arr => {
  var sumText = 0;
  for (var i = 0, len = arr.length; i < len; i++) {
    sumText += arr[i];
  }
  return sumText;
};

/**
 * 数组求和
 * @param {} arr
 * covArr([1,4,65,843,2,1,4]) // 131.42857142857142
 */
export const covArr = arr => {
  var sumText = sumArr(arr);
  var covText = sumText / arr.length;
  return covText;
};
/**
 * 数组中获取随机数
 * @param {*} arr
 * randomOne([1,2,3,6,8,5,4,2,6]) // 1
 */
export const randomOne = arr => {
  return arr[Math.floor(Math.random() * arr.length)];
};
/**
 * 返回对应元素在数组中的下标
 * @param {*} arr
 * @param {*} value
 * isHasElementOne([1,2,3,4,5],3) // 2
 */
export const isHasElementOne = (arr, value) => {
  for (var i = 0, vlen = arr.length; i < vlen; i++) {
    if (arr[i] == value) {
      return i;
    }
  }
  return -1;
};
/**
 * 返回数组（字符串）一个元素出现的次数
 * @param {*} obj
 * @param {*} ele
 * getEleCount('asd56+asdasdwqe','a') // 3
 * getEleCount([1,2,3,4,5,66,77,22,55,22],22) // 2
 */
export const getEleCount = (obj, ele) => {
  var num = 0;
  for (var i = 0, len = obj.length; i < len; i++) {
    if (ele == obj[i]) {
      num++;
    }
  }
  return num;
};
/**
 * 得到n1-n2下标的数组，即返回数组下标arr[n1]到数组arr[n2]的值
 * @param {*} arr
 * @param {*} n1
 * @param {*} n2
 * getArrayNum([0,1,2,3,4,5,6,7,8,9],5,9) // [5, 6, 7, 8, 9]
 */
export const getArrayNum = (arr, n1, n2) => {
  var arr1 = [],
    len = n2 || arr.length - 1;
  for (var i = n1; i <= len; i++) {
    arr1.push(arr[i]);
  }
  return arr1;
};

/* arr:要进行操作的数组
 * val:要删除的值
 * type: 如果有值，则删除数组中所有含有val值的元素，如果没值或者不指定，则删除必须完全匹配val的值
 * removeArrayForValue(['test','test1','test2','test','aaa'],'test','%')  // ["aaa"]
 * removeArrayForValue(['test','test1','test2','test','aaa'],'test') // ["test1", "test2", "aaa"]
 */
export const removeArrayForValue = (arr, val, type) => {
  return arr.filter(function(item) {
    return type ? item.indexOf(val) === -1 : item !== val;
  });
};

/**
 * 获取日子跟踪号
 */
export const getUUID = () => {
  var s = [];
  var hexDigits = "0123456789abcdef";
  for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = "-";

  var uuid = s.join("");
  return uuid;
};

export const checkUtil = (slider, slider1, slider2, next) => {
  if (slider && slider1 && slider2) {
    try {
      setTimeout(() => {
        document.body.className = ""; // 重置body加载动画
      }, 400);
    } catch (e) {}
    store.commit("FLAG", 1);
    next();
  }
};

export const animationProgress = (to, from, next, history, historyCount) => {
  const toIndex = store.state.animation[to.path]; /// tab/home  undefined
  // history.getItem(to.path);
  const fromIndex = store.state.animation[from.path]; // / 0
  console.log("to.path", to.path, toIndex);
  console.log("from.path", from.path, fromIndex);
  // history.getItem(from.path);
  if (toIndex) {
    if (
      !fromIndex ||
      parseInt(toIndex, 10) > parseInt(fromIndex, 10) ||
      (toIndex === "0" && fromIndex === "0")
    ) {
      store.commit("DIRECTION", "forward");
    } else {
      store.commit("DIRECTION", "reverse");
    }
  } else {
    // ++historyCount;
    store.commit("HISTORYCOUNT", store.state.historyCount + 1);
    console.log("store.state.historyCount", store.state.historyCount + 1);

    store.commit("ANIMATION", {
      key: "count",
      value: store.state.historyCount
    });
    console.log(store.state.animation);
    // history.setItem('count', historyCount);
    to.path !== "/" &&
      store.commit("ANIMATION", {
        key: to.path,
        value: store.state.historyCount
      });
    // history.setItem(to.path, historyCount);
    // alert(89)
    store.commit("DIRECTION", "forward");
    console.log("store.state.direction", store.state.direction);
  }
  // alert(store.state.flag)
};

export const animationInit = () => {
  // const history = window.sessionStorage;
  // history.clear()
  store.commit("ANIMATION", null);
  store.commit(
    "HISTORYCOUNT",
    store.state.animation.count ? store.state.animation.count * 1 : 0
  );
  // let historyCount = history.getItem('count') * 1 || 0;
  store.commit("ANIMATION", {
    key: "/",
    value: 0
  });
  // history.setItem('/', 0);
  // return {
  //     history,
  //     historyCount
  // }
};

/**
 * [fenToyuan]
 * 分转化元的工具函数。
 * */
export const fenToyuan = val => {
  val = val || "0";
  var result,
    re = /^[\+|-]?[0-9]+$/;
  if (typeof val != "string") {
    val = val.toString();
  }
  return re.test(val) ? (parseFloat(val) / 100).toFixed(2) : "0.00";
};
/**获取当前时间
 */
export const getCustomerTime = (flag, isMill) => {
  var date = new Date();
  var yy, MM, dd, hh, mm, ss, ms;
  yy = flag ? date.getFullYear() + "" : (date.getYear() + "").substr(1, 2);

  MM = date.getMonth() + 1 + "";
  MM = MM.length < 2 ? "0" + MM : MM;

  dd = date.getDate() + "";
  dd = dd.length < 2 ? "0" + dd : dd;

  hh = date.getHours() + "";
  hh = hh.length < 2 ? "0" + hh : hh;

  mm = date.getMinutes() + "";
  mm = mm.length < 2 ? "0" + mm : mm;

  ss = date.getSeconds() + "";
  ss = ss.length < 2 ? "0" + ss : ss;

  ms = date.getMilliseconds() + "";
  if (isMill) {
    var _msLength = (ms + "").length;
    if (_msLength == 0) {
      ms == "000";
    } else if (_msLength == 1) {
      ms = "00" + ms;
    } else if (_msLength == 2) {
      ms = "0" + ms;
    }
    return yy + MM + dd + hh + mm + ss + ms;
  }
  return yy + MM + dd + hh + mm + ss;
  return re.test(val) ? (parseFloat(val) / 100).toFixed(2) : "0.00";
};

/**
 * [billFormatDate]
 * 日期格式化工具
 * 将后端传过来的日期调整格式。
 * */
export const billDateYear = datestr => {
  if (!datestr) {
    return "";
  }
  var datehtml = "";
  var dateArr = datestr.split("-");
  if (dateArr[1].substring(0, 1) === "0") {
    datehtml += dateArr[0] + "年" + dateArr[1].substring(1, 2) + "月";
    // console.log(datehtml)
    if (dateArr[2].substring(0, 1) === "0") {
      datehtml += dateArr[2].substring(1, 2) + "日";
    } else {
      datehtml += dateArr[2] + "日";
    }
  } else {
    datehtml += dateArr[0] + "年" + dateArr[1] + "月";
    if (dateArr[2].substring(0, 1) === "0") {
      datehtml += dateArr[2].substring(1, 2) + "日";
    } else {
      datehtml += dateArr[2] + "日";
    }
  }
  return datehtml;
};

/**
 * [billDate]
 * 日期格式化工具
 * 将后端传过来的日期调整格式。
 * */
export const billDate = datestr => {
  if (!datestr) {
    return "";
  }
  var datehtml = "";
  var dateArr = datestr.split("-");
  if (dateArr[1].substring(0, 1) === "0") {
    datehtml += dateArr[1].substring(1, 2) + "月";
    if (dateArr[2].substring(0, 1) === "0") {
      datehtml += dateArr[2].substring(1, 2) + "日";
    } else {
      datehtml += dateArr[2] + "日";
    }
  } else {
    datehtml += dateArr[1] + "月";
    if (dateArr[2].substring(0, 1) === "0") {
      datehtml += dateArr[2].substring(1, 2) + "日";
    } else {
      datehtml += dateArr[2] + "日";
    }
  }
  return datehtml;
};

/**总的订单状态订单状态
 * 只有两种状态 0 和 1
 * [judgebillstate]
 * @param {} billstate
 */
export const judgebillstate = billstate => {
  if (billstate === "0") {
    return `正常`;
  } else if (billstate === "1") {
    return `已逾期`;
  }
};

/**总的订单状态订单状态
 * 只有两种状态 0 和 1
 * [judgebillstate]
 * @param {} billstate
 */
export const billdetailstate = billstate => {
  if (billstate === "0") {
    return `待还款`;
  } else if (billstate === "1") {
    return `已还款`;
  } else if (billstate === "2") {
    return `已逾期`;
  }
};

//随意借sign生成
export const getFreeSign = (arg, freeToken) => {
  let data = arg;
  for (var key in data) {
    if (data[key] == null || data[key] == undefined) {
      data[key] = "";
    }
  }
  var sign,
    newArgStr,
    sendDate = {};
  var token = freeToken || ""; //随意借token
  newArgStr = JSON.stringify(keysort(arg));
  try {
    sign = MessageDigest.digest("md5", newArgStr + token);
  } catch (e) {}
  return sign;
};

export const objPlan = data => {
  let res = "";
  for (let d in data) {
    res += d + "=" + data[d] + "&";
  }
  if (res) {
    res = res.substr(0, res.length - 1);
  }
  return res;
};
export const setLItem = (key, value) => {
  var curTime = new Date().getTime();
  try {
    localStorage.setItem(key, JSON.stringify({ data: value, time: curTime }));
  } catch (e) {
    console.log("没有对象");
  }
};
export const getLItem = (key, exp) => {
  try {
    var data = localStorage.getItem(key);
    if (!data) {
      return false;
    }
    var dataObj = JSON.parse(data);
    if (new Date().getTime() - dataObj.time > exp) {
      localStorage.removeItem(key);
      console.log("信息已过期");
      //alert("信息已过期")
    } else {
      //console.log("data="+dataObj.data);
      //console.log(JSON.parse(dataObj.data));
      var dataObjDatatoJson = JSON.parse(dataObj.data);
      return dataObjDatatoJson;
    }
  } catch (e) {
    return false;
  }
};
// 判断请求shopDetail接口时跳转外放拼接使用
export const isShopDetail = () => {
  var u = window.location.href;
  if (u.match(/merc_id/i)) {
      return true;
  } else {
      return false;
  }
};
/**
 * 获取和包客户端的LBS
 */
export const getLBS = () => {
  let longitude = window.goActivity.getLongitude(); //查询经度信息
  let latitude = window.goActivity.getLatitude(); //查询纬度
  let city = window.goActivity.getCity();
  //   alert(longitude)
  //   alert(latitude)
  //   alert(city)

  return {
    longitude,
    latitude,
    city
  };
};

/**
 * 根据省市信息获取城市code
 *
 * @param pr
 *            省份名称
 * @param city
 *            城市名称
 * @returns 城市code
 */
// export const getCode = (city) => {
//     let citys = [ {
//         "pr" : "香港",
//         "code" : "1852",
//         "city" : "香港"
//     }, {
//         "pr" : "澳门",
//         "code" : "1852",
//         "city" : "澳门"
//     }, {
//         "pr" : "北京",
//         "code" : "100",
//         "city" : "北京"
//     }, {
//         "pr" : "上海",
//         "code" : "210",
//         "city" : "上海"
//     }, {
//         "pr" : "天津",
//         "code" : "220",
//         "city" : "天津"
//     }, {
//         "pr" : "重庆",
//         "code" : "230",
//         "city" : "重庆"
//     }, {
//         "pr" : "重庆",
//         "code" : "231",
//         "city" : "黔江"
//     }, {
//         "pr" : "重庆",
//         "code" : "232",
//         "city" : "万州"
//     }, {
//         "pr" : "重庆",
//         "code" : "233",
//         "city" : "涪陵"
//     },
//      {
//         "pr" : "安徽",
//         "code" : "551",
//         "city" : "合肥"
//     }, {
//         "pr" : "安徽",
//         "code" : "553",
//         "city" : "芜湖"
//     }, {
//         "pr" : "安徽",
//         "code" : "556",
//         "city" : "安庆"
//     }, {
//         "pr" : "安徽",
//         "code" : "552",
//         "city" : "蚌埠"
//     }, {
//         "pr" : "安徽",
//         "code" : "558",
//         "city" : "亳州"
//     }, {
//         "pr" : "安徽",
//         "code" : "565",
//         "city" : "巢湖"
//     }, {
//         "pr" : "安徽",
//         "code" : "566",
//         "city" : "池州"
//     }, {
//         "pr" : "安徽",
//         "code" : "550",
//         "city" : "滁州"
//     }, {
//         "pr" : "安徽",
//         "code" : "558",
//         "city" : "阜阳"
//     }, {
//         "pr" : "安徽",
//         "code" : "559",
//         "city" : "黄山"
//     }, {
//         "pr" : "安徽",
//         "code" : "561",
//         "city" : "淮北"
//     }, {
//         "pr" : "安徽",
//         "code" : "554",
//         "city" : "淮南"
//     }, {
//         "pr" : "安徽",
//         "code" : "564",
//         "city" : "六安"
//     }, {
//         "pr" : "安徽",
//         "code" : "555",
//         "city" : "马鞍山"
//     }, {
//         "pr" : "安徽",
//         "code" : "557",
//         "city" : "宿州"
//     }, {
//         "pr" : "安徽",
//         "code" : "562",
//         "city" : "铜陵"
//     }, {
//         "pr" : "安徽",
//         "code" : "563",
//         "city" : "宣城"
//     }, {
//         "pr" : "福建",
//         "code" : "591",
//         "city" : "福州"
//     }, {
//         "pr" : "福建",
//         "code" : "592",
//         "city" : "厦门"
//     }, {
//         "pr" : "福建",
//         "code" : "595",
//         "city" : "泉州"
//     }, {
//         "pr" : "福建",
//         "code" : "597",
//         "city" : "龙岩"
//     }, {
//         "pr" : "福建",
//         "code" : "593",
//         "city" : "宁德"
//     }, {
//         "pr" : "福建",
//         "code" : "599",
//         "city" : "南平"
//     }, {
//         "pr" : "福建",
//         "code" : "594",
//         "city" : "莆田"
//     }, {
//         "pr" : "福建",
//         "code" : "598",
//         "city" : "三明"
//     }, {
//         "pr" : "福建",
//         "code" : "596",
//         "city" : "漳州"
//     }, {
//         "pr" : "甘肃",
//         "code" : "931",
//         "city" : "兰州"
//     }, {
//         "pr" : "甘肃",
//         "code" : "943",
//         "city" : "白银"
//     }, {
//         "pr" : "甘肃",
//         "code" : "932",
//         "city" : "定西"
//     }, {
//         "pr" : "甘肃",
//         "code" : "935",
//         "city" : "金昌"
//     }, {
//         "pr" : "甘肃",
//         "code" : "937",
//         "city" : "酒泉"
//     }, {
//         "pr" : "甘肃",
//         "code" : "933",
//         "city" : "平凉"
//     }, {
//         "pr" : "甘肃",
//         "code" : "934",
//         "city" : "庆阳"
//     }, {
//         "pr" : "甘肃",
//         "code" : "929",
//         "city" : "武威"
//     }, {
//         "pr" : "甘肃",
//         "code" : "938",
//         "city" : "天水"
//     }, {
//         "pr" : "甘肃",
//         "code" : "936",
//         "city" : "张掖"
//     }, {
//         "pr" : "甘肃",
//         "code" : "941",
//         "city" : "甘南"
//     }, {
//         "pr" : "甘肃",
//         "code" : "942",
//         "city" : "嘉峪关"
//     }, {
//         "pr" : "甘肃",
//         "code" : "930",
//         "city" : "临夏"
//     }, {
//         "pr" : "甘肃",
//         "code" : "939",
//         "city" : "陇南"
//     }, {
//         "pr" : "广东",
//         "code" : "200",
//         "city" : "广州"
//     }, {
//         "pr" : "广东",
//         "code" : "755",
//         "city" : "深圳"
//     }, {
//         "pr" : "广东",
//         "code" : "756",
//         "city" : "珠海"
//     }, {
//         "pr" : "广东",
//         "code" : "769",
//         "city" : "东莞"
//     }, {
//         "pr" : "广东",
//         "code" : "757",
//         "city" : "佛山"
//     }, {
//         "pr" : "广东",
//         "code" : "752",
//         "city" : "惠州"
//     }, {
//         "pr" : "广东",
//         "code" : "750",
//         "city" : "江门"
//     }, {
//         "pr" : "广东",
//         "code" : "760",
//         "city" : "中山"
//     }, {
//         "pr" : "广东",
//         "code" : "754",
//         "city" : "汕头"
//     }, {
//         "pr" : "广东",
//         "code" : "759",
//         "city" : "湛江"
//     }, {
//         "pr" : "广东",
//         "code" : "768",
//         "city" : "潮州"
//     }, {
//         "pr" : "广东",
//         "code" : "762",
//         "city" : "河源"
//     }, {
//         "pr" : "广东",
//         "code" : "663",
//         "city" : "揭阳"
//     }, {
//         "pr" : "广东",
//         "code" : "668",
//         "city" : "茂名"
//     }, {
//         "pr" : "广东",
//         "code" : "753",
//         "city" : "梅州"
//     }, {
//         "pr" : "广东",
//         "code" : "763",
//         "city" : "清远"
//     }, {
//         "pr" : "广东",
//         "code" : "751",
//         "city" : "韶关"
//     }, {
//         "pr" : "广东",
//         "code" : "660",
//         "city" : "汕尾"
//     }, {
//         "pr" : "广东",
//         "code" : "662",
//         "city" : "阳江"
//     }, {
//         "pr" : "广东",
//         "code" : "766",
//         "city" : "云浮"
//     }, {
//         "pr" : "广东",
//         "code" : "758",
//         "city" : "肇庆"
//     }, {
//         "pr" : "广西",
//         "code" : "771",
//         "city" : "南宁"
//     }, {
//         "pr" : "广西",
//         "code" : "779",
//         "city" : "北海"
//     }, {
//         "pr" : "广西",
//         "code" : "770",
//         "city" : "防城港"
//     }, {
//         "pr" : "广西",
//         "code" : "773",
//         "city" : "桂林"
//     }, {
//         "pr" : "广西",
//         "code" : "772",
//         "city" : "柳州"
//     }, {
//         "pr" : "广西",
//         "code" : "783",
//         "city" : "崇左"
//     }, {
//         "pr" : "广西",
//         "code" : "781",
//         "city" : "来宾"
//     }, {
//         "pr" : "广西",
//         "code" : "774",
//         "city" : "梧州"
//     }, {
//         "pr" : "广西",
//         "code" : "778",
//         "city" : "河池"
//     }, {
//         "pr" : "广西",
//         "code" : "775",
//         "city" : "玉林"
//     }, {
//         "pr" : "广西",
//         "code" : "780",
//         "city" : "贵港"
//     }, {
//         "pr" : "广西",
//         "code" : "782",
//         "city" : "贺州"
//     }, {
//         "pr" : "广西",
//         "code" : "777",
//         "city" : "钦州"
//     }, {
//         "pr" : "广西",
//         "code" : "776",
//         "city" : "百色"
//     }, {
//         "pr" : "贵州",
//         "code" : "851",
//         "city" : "贵阳"
//     }, {
//         "pr" : "贵州",
//         "code" : "853",
//         "city" : "安顺"
//     }, {
//         "pr" : "贵州",
//         "code" : "852",
//         "city" : "遵义"
//     }, {
//         "pr" : "贵州",
//         "code" : "858",
//         "city" : "六盘水"
//     }, {
//         "pr" : "贵州",
//         "code" : "857",
//         "city" : "毕节"
//     }, {
//         "pr" : "贵州",
//         "code" : "855",
//         "city" : "黔东南"
//     }, {
//         "pr" : "贵州",
//         "code" : "859",
//         "city" : "黔西南"
//     }, {
//         "pr" : "贵州",
//         "code" : "854",
//         "city" : "黔南"
//     }, {
//         "pr" : "贵州",
//         "code" : "856",
//         "city" : "铜仁"
//     }, {
//         "pr" : "海南",
//         "code" : "898",
//         "city" : "海口"
//     }, {
//         "pr" : "海南",
//         "code" : "899",
//         "city" : "三亚"
//     }, {
//         "pr" : "海南",
//         "code" : "802",
//         "city" : "白沙县"
//     }, {
//         "pr" : "海南",
//         "code" : "801",
//         "city" : "保亭县"
//     }, {
//         "pr" : "海南",
//         "code" : "803",
//         "city" : "昌江县"
//     }, {
//         "pr" : "海南",
//         "code" : "804",
//         "city" : "澄迈县"
//     }, {
//         "pr" : "海南",
//         "code" : "806",
//         "city" : "定安县"
//     }, {
//         "pr" : "海南",
//         "code" : "807",
//         "city" : "东方"
//     }, {
//         "pr" : "海南",
//         "code" : "2802",
//         "city" : "乐东县"
//     }, {
//         "pr" : "海南",
//         "code" : "1896",
//         "city" : "临高县"
//     }, {
//         "pr" : "海南",
//         "code" : "809",
//         "city" : "陵水县"
//     }, {
//         "pr" : "海南",
//         "code" : "1894",
//         "city" : "琼海"
//     }, {
//         "pr" : "海南",
//         "code" : "1899",
//         "city" : "琼中县"
//     }, {
//         "pr" : "海南",
//         "code" : "1892",
//         "city" : "屯昌县"
//     }, {
//         "pr" : "海南",
//         "code" : "1898",
//         "city" : "万宁"
//     }, {
//         "pr" : "海南",
//         "code" : "1893",
//         "city" : "文昌"
//     }, {
//         "pr" : "海南",
//         "code" : "1897",
//         "city" : "五指山"
//     }, {
//         "pr" : "海南",
//         "code" : "805",
//         "city" : "儋州"
//     }, {
//         "pr" : "河北",
//         "code" : "311",
//         "city" : "石家庄"
//     }, {
//         "pr" : "河北",
//         "code" : "312",
//         "city" : "保定"
//     }, {
//         "pr" : "河北",
//         "code" : "314",
//         "city" : "承德"
//     }, {
//         "pr" : "河北",
//         "code" : "310",
//         "city" : "邯郸"
//     }, {
//         "pr" : "河北",
//         "code" : "315",
//         "city" : "唐山"
//     }, {
//         "pr" : "河北",
//         "code" : "335",
//         "city" : "秦皇岛"
//     }, {
//         "pr" : "河北",
//         "code" : "317",
//         "city" : "沧州"
//     }, {
//         "pr" : "河北",
//         "code" : "318",
//         "city" : "衡水"
//     }, {
//         "pr" : "河北",
//         "code" : "316",
//         "city" : "廊坊"
//     }, {
//         "pr" : "河北",
//         "code" : "319",
//         "city" : "邢台"
//     }, {
//         "pr" : "河北",
//         "code" : "313",
//         "city" : "张家口"
//     }, {
//         "pr" : "河南",
//         "code" : "371",
//         "city" : "郑州"
//     }, {
//         "pr" : "河南",
//         "code" : "379",
//         "city" : "洛阳"
//     }, {
//         "pr" : "河南",
//         "code" : "378",
//         "city" : "开封"
//     }, {
//         "pr" : "河南",
//         "code" : "374",
//         "city" : "许昌"
//     }, {
//         "pr" : "河南",
//         "code" : "372",
//         "city" : "安阳"
//     }, {
//         "pr" : "河南",
//         "code" : "375",
//         "city" : "平顶山"
//     }, {
//         "pr" : "河南",
//         "code" : "392",
//         "city" : "鹤壁"
//     }, {
//         "pr" : "河南",
//         "code" : "391",
//         "city" : "焦作"
//     }, {
//         "pr" : "河南",
//         "code" : "1391",
//         "city" : "济源"
//     }, {
//         "pr" : "河南",
//         "code" : "395",
//         "city" : "漯河"
//     }, {
//         "pr" : "河南",
//         "code" : "377",
//         "city" : "南阳"
//     }, {
//         "pr" : "河南",
//         "code" : "393",
//         "city" : "濮阳"
//     }, {
//         "pr" : "河南",
//         "code" : "398",
//         "city" : "三门峡"
//     }, {
//         "pr" : "河南",
//         "code" : "370",
//         "city" : "商丘"
//     }, {
//         "pr" : "河南",
//         "code" : "373",
//         "city" : "新乡"
//     }, {
//         "pr" : "河南",
//         "code" : "376",
//         "city" : "信阳"
//     }, {
//         "pr" : "河南",
//         "code" : "396",
//         "city" : "驻马店"
//     }, {
//         "pr" : "河南",
//         "code" : "394",
//         "city" : "周口"
//     }, {
//         "pr" : "黑龙江",
//         "code" : "451",
//         "city" : "哈尔滨"
//     }, {
//         "pr" : "黑龙江",
//         "code" : "459",
//         "city" : "大庆"
//     }, {
//         "pr" : "黑龙江",
//         "code" : "452",
//         "city" : "齐齐哈尔"
//     }, {
//         "pr" : "黑龙江",
//         "code" : "454",
//         "city" : "佳木斯"
//     }, {
//         "pr" : "黑龙江",
//         "code" : "457",
//         "city" : "大兴安岭"
//     }, {
//         "pr" : "黑龙江",
//         "code" : "456",
//         "city" : "黑河"
//     }, {
//         "pr" : "黑龙江",
//         "code" : "468",
//         "city" : "鹤岗"
//     }, {
//         "pr" : "黑龙江",
//         "code" : "467",
//         "city" : "鸡西"
//     }, {
//         "pr" : "黑龙江",
//         "code" : "453",
//         "city" : "牡丹江"
//     }, {
//         "pr" : "黑龙江",
//         "code" : "464",
//         "city" : "七台河"
//     }, {
//         "pr" : "黑龙江",
//         "code" : "455",
//         "city" : "绥化"
//     }, {
//         "pr" : "黑龙江",
//         "code" : "469",
//         "city" : "双鸭山"
//     }, {
//         "pr" : "黑龙江",
//         "code" : "458",
//         "city" : "伊春"
//     }, {
//         "pr" : "湖北",
//         "code" : "270",
//         "city" : "武汉"
//     }, {
//         "pr" : "湖北",
//         "code" : "710",
//         "city" : "襄阳"
//     }, {
//         "pr" : "湖北",
//         "code" : "719",
//         "city" : "十堰"
//     }, {
//         "pr" : "湖北",
//         "code" : "714",
//         "city" : "黄石"
//     }, {
//         "pr" : "湖北",
//         "code" : "711",
//         "city" : "鄂州"
//     }, {
//         "pr" : "湖北",
//         "code" : "718",
//         "city" : "恩施"
//     }, {
//         "pr" : "湖北",
//         "code" : "713",
//         "city" : "黄冈"
//     }, {
//         "pr" : "湖北",
//         "code" : "716",
//         "city" : "荆州"
//     }, {
//         "pr" : "湖北",
//         "code" : "724",
//         "city" : "荆门"
//     }, {
//         "pr" : "湖北",
//         "code" : "722",
//         "city" : "随州"
//     }, {
//         "pr" : "湖北",
//         "code" : "717",
//         "city" : "宜昌"
//     }, {
//         "pr" : "湖北",
//         "code" : "1728",
//         "city" : "天门"
//     }, {
//         "pr" : "湖北",
//         "code" : "2728",
//         "city" : "潜江"
//     }, {
//         "pr" : "湖北",
//         "code" : "728",
//         "city" : "仙桃"
//     }, {
//         "pr" : "湖北",
//         "code" : "712",
//         "city" : "孝感"
//     }, {
//         "pr" : "湖北",
//         "code" : "715",
//         "city" : "咸宁"
//     }, {
//         "pr" : "湖北",
//         "code" : "1719",
//         "city" : "神农架"
//     }, {
//         "pr" : "湖南",
//         "code" : "731",
//         "city" : "长沙"
//     }, {
//         "pr" : "湖南",
//         "code" : "730",
//         "city" : "岳阳"
//     }, {
//         "pr" : "湖南",
//         "code" : "732",
//         "city" : "湘潭"
//     }, {
//         "pr" : "湖南",
//         "code" : "736",
//         "city" : "常德"
//     }, {
//         "pr" : "湖南",
//         "code" : "735",
//         "city" : "郴州"
//     }, {
//         "pr" : "湖南",
//         "code" : "734",
//         "city" : "衡阳"
//     }, {
//         "pr" : "湖南",
//         "code" : "745",
//         "city" : "怀化"
//     }, {
//         "pr" : "湖南",
//         "code" : "738",
//         "city" : "娄底"
//     }, {
//         "pr" : "湖南",
//         "code" : "739",
//         "city" : "邵阳"
//     }, {
//         "pr" : "湖南",
//         "code" : "737",
//         "city" : "益阳"
//     }, {
//         "pr" : "湖南",
//         "code" : "746",
//         "city" : "永州"
//     }, {
//         "pr" : "湖南",
//         "code" : "733",
//         "city" : "株洲"
//     }, {
//         "pr" : "湖南",
//         "code" : "744",
//         "city" : "张家界"
//     }, {
//         "pr" : "湖南",
//         "code" : "743",
//         "city" : "湘西"
//     }, {
//         "pr" : "吉林",
//         "code" : "431",
//         "city" : "长春"
//     }, {
//         "pr" : "吉林",
//         "code" : "432",
//         "city" : "吉林"
//     }, {
//         "pr" : "吉林",
//         "code" : "1433",
//         "city" : "延边"
//     }, {
//         "pr" : "吉林",
//         "code" : "436",
//         "city" : "白城"
//     }, {
//         "pr" : "吉林",
//         "code" : "439",
//         "city" : "白山"
//     }, {
//         "pr" : "吉林",
//         "code" : "437",
//         "city" : "辽源"
//     }, {
//         "pr" : "吉林",
//         "code" : "434",
//         "city" : "四平"
//     }, {
//         "pr" : "吉林",
//         "code" : "438",
//         "city" : "松原"
//     }, {
//         "pr" : "吉林",
//         "code" : "435",
//         "city" : "通化"
//     }, {
//         "pr" : "江苏",
//         "code" : "250",
//         "city" : "南京"
//     }, {
//         "pr" : "江苏",
//         "code" : "512",
//         "city" : "苏州"
//     }, {
//         "pr" : "江苏",
//         "code" : "519",
//         "city" : "常州"
//     }, {
//         "pr" : "江苏",
//         "code" : "518",
//         "city" : "连云港"
//     }, {
//         "pr" : "江苏",
//         "code" : "523",
//         "city" : "泰州"
//     }, {
//         "pr" : "江苏",
//         "code" : "510",
//         "city" : "无锡"
//     }, {
//         "pr" : "江苏",
//         "code" : "516",
//         "city" : "徐州"
//     }, {
//         "pr" : "江苏",
//         "code" : "514",
//         "city" : "扬州"
//     }, {
//         "pr" : "江苏",
//         "code" : "511",
//         "city" : "镇江"
//     }, {
//         "pr" : "江苏",
//         "code" : "517",
//         "city" : "淮安"
//     }, {
//         "pr" : "江苏",
//         "code" : "513",
//         "city" : "南通"
//     }, {
//         "pr" : "江苏",
//         "code" : "527",
//         "city" : "宿迁"
//     }, {
//         "pr" : "江苏",
//         "code" : "515",
//         "city" : "盐城"
//     }, {
//         "pr" : "江西",
//         "code" : "791",
//         "city" : "南昌"
//     }, {
//         "pr" : "江西",
//         "code" : "797",
//         "city" : "赣州"
//     }, {
//         "pr" : "江西",
//         "code" : "792",
//         "city" : "九江"
//     }, {
//         "pr" : "江西",
//         "code" : "798",
//         "city" : "景德镇"
//     }, {
//         "pr" : "江西",
//         "code" : "796",
//         "city" : "吉安"
//     }, {
//         "pr" : "江西",
//         "code" : "799",
//         "city" : "萍乡"
//     }, {
//         "pr" : "江西",
//         "code" : "793",
//         "city" : "上饶"
//     }, {
//         "pr" : "江西",
//         "code" : "790",
//         "city" : "新余"
//     }, {
//         "pr" : "江西",
//         "code" : "795",
//         "city" : "宜春"
//     }, {
//         "pr" : "江西",
//         "code" : "701",
//         "city" : "鹰潭"
//     }, {
//         "pr" : "江西",
//         "code" : "794",
//         "city" : "抚州"
//     }, {
//         "pr" : "辽宁",
//         "code" : "24",
//         "city" : "沈阳"
//     }, {
//         "pr" : "辽宁",
//         "code" : "411",
//         "city" : "大连"
//     }, {
//         "pr" : "辽宁",
//         "code" : "412",
//         "city" : "鞍山"
//     }, {
//         "pr" : "辽宁",
//         "code" : "415",
//         "city" : "丹东"
//     }, {
//         "pr" : "辽宁",
//         "code" : "413",
//         "city" : "抚顺"
//     }, {
//         "pr" : "辽宁",
//         "code" : "416",
//         "city" : "锦州"
//     }, {
//         "pr" : "辽宁",
//         "code" : "417",
//         "city" : "营口"
//     }, {
//         "pr" : "辽宁",
//         "code" : "414",
//         "city" : "本溪"
//     }, {
//         "pr" : "辽宁",
//         "code" : "421",
//         "city" : "朝阳"
//     }, {
//         "pr" : "辽宁",
//         "code" : "418",
//         "city" : "阜新"
//     }, {
//         "pr" : "辽宁",
//         "code" : "429",
//         "city" : "葫芦岛"
//     }, {
//         "pr" : "辽宁",
//         "code" : "419",
//         "city" : "辽阳"
//     }, {
//         "pr" : "辽宁",
//         "code" : "427",
//         "city" : "盘锦"
//     }, {
//         "pr" : "辽宁",
//         "code" : "410",
//         "city" : "铁岭"
//     }, {
//         "pr" : "内蒙古",
//         "code" : "471",
//         "city" : "呼和浩特"
//     }, {
//         "pr" : "内蒙古",
//         "code" : "472",
//         "city" : "包头"
//     }, {
//         "pr" : "内蒙古",
//         "code" : "476",
//         "city" : "赤峰"
//     }, {
//         "pr" : "内蒙古",
//         "code" : "477",
//         "city" : "鄂尔多斯"
//     }, {
//         "pr" : "内蒙古",
//         "code" : "474",
//         "city" : "乌兰察布"
//     }, {
//         "pr" : "内蒙古",
//         "code" : "473",
//         "city" : "乌海"
//     }, {
//         "pr" : "内蒙古",
//         "code" : "482",
//         "city" : "兴安盟"
//     }, {
//         "pr" : "内蒙古",
//         "code" : "470",
//         "city" : "呼伦贝尔"
//     }, {
//         "pr" : "内蒙古",
//         "code" : "475",
//         "city" : "通辽"
//     }, {
//         "pr" : "内蒙古",
//         "code" : "483",
//         "city" : "阿拉善盟"
//     }, {
//         "pr" : "内蒙古",
//         "code" : "478",
//         "city" : "巴彦淖尔"
//     }, {
//         "pr" : "内蒙古",
//         "code" : "479",
//         "city" : "锡林郭勒"
//     }, {
//         "pr" : "宁夏",
//         "code" : "951",
//         "city" : "银川"
//     }, {
//         "pr" : "宁夏",
//         "code" : "952",
//         "city" : "石嘴山"
//     }, {
//         "pr" : "宁夏",
//         "code" : "954",
//         "city" : "固原"
//     }, {
//         "pr" : "宁夏",
//         "code" : "953",
//         "city" : "吴忠"
//     }, {
//         "pr" : "宁夏",
//         "code" : "1953",
//         "city" : "中卫"
//     }, {
//         "pr" : "青海",
//         "code" : "971",
//         "city" : "西宁"
//     }, {
//         "pr" : "青海",
//         "code" : "973",
//         "city" : "黄南"
//     }, {
//         "pr" : "青海",
//         "code" : "976",
//         "city" : "玉树"
//     }, {
//         "pr" : "青海",
//         "code" : "975",
//         "city" : "果洛"
//     }, {
//         "pr" : "青海",
//         "code" : "972",
//         "city" : "海东"
//     }, {
//         "pr" : "青海",
//         "code" : "977",
//         "city" : "海西"
//     }, {
//         "pr" : "青海",
//         "code" : "974",
//         "city" : "海南"
//     }, {
//         "pr" : "青海",
//         "code" : "970",
//         "city" : "海北"
//     }, {
//         "pr" : "山东",
//         "code" : "531",
//         "city" : "济南"
//     }, {
//         "pr" : "山东",
//         "code" : "532",
//         "city" : "青岛"
//     }, {
//         "pr" : "山东",
//         "code" : "631",
//         "city" : "威海"
//     }, {
//         "pr" : "山东",
//         "code" : "535",
//         "city" : "烟台"
//     }, {
//         "pr" : "山东",
//         "code" : "536",
//         "city" : "潍坊"
//     }, {
//         "pr" : "山东",
//         "code" : "538",
//         "city" : "泰安"
//     }, {
//         "pr" : "山东",
//         "code" : "543",
//         "city" : "滨州"
//     }, {
//         "pr" : "山东",
//         "code" : "534",
//         "city" : "德州"
//     }, {
//         "pr" : "山东",
//         "code" : "546",
//         "city" : "东营"
//     }, {
//         "pr" : "山东",
//         "code" : "530",
//         "city" : "菏泽"
//     }, {
//         "pr" : "山东",
//         "code" : "537",
//         "city" : "济宁"
//     }, {
//         "pr" : "山东",
//         "code" : "635",
//         "city" : "聊城"
//     }, {
//         "pr" : "山东",
//         "code" : "539",
//         "city" : "临沂"
//     }, {
//         "pr" : "山东",
//         "code" : "634",
//         "city" : "莱芜"
//     }, {
//         "pr" : "山东",
//         "code" : "633",
//         "city" : "日照"
//     }, {
//         "pr" : "山东",
//         "code" : "533",
//         "city" : "淄博"
//     }, {
//         "pr" : "山东",
//         "code" : "632",
//         "city" : "枣庄"
//     }, {
//         "pr" : "山西",
//         "code" : "351",
//         "city" : "太原"
//     }, {
//         "pr" : "山西",
//         "code" : "355",
//         "city" : "长治"
//     }, {
//         "pr" : "山西",
//         "code" : "352",
//         "city" : "大同"
//     }, {
//         "pr" : "山西",
//         "code" : "356",
//         "city" : "晋城"
//     }, {
//         "pr" : "山西",
//         "code" : "354",
//         "city" : "晋中"
//     }, {
//         "pr" : "山西",
//         "code" : "357",
//         "city" : "临汾"
//     }, {
//         "pr" : "山西",
//         "code" : "358",
//         "city" : "吕梁"
//     }, {
//         "pr" : "山西",
//         "code" : "349",
//         "city" : "朔州"
//     }, {
//         "pr" : "山西",
//         "code" : "350",
//         "city" : "忻州"
//     }, {
//         "pr" : "山西",
//         "code" : "359",
//         "city" : "运城"
//     }, {
//         "pr" : "山西",
//         "code" : "353",
//         "city" : "阳泉"
//     }, {
//         "pr" : "陕西",
//         "code" : "29",
//         "city" : "西安"
//     }, {
//         "pr" : "陕西",
//         "code" : "915",
//         "city" : "安康"
//     }, {
//         "pr" : "陕西",
//         "code" : "917",
//         "city" : "宝鸡"
//     }, {
//         "pr" : "陕西",
//         "code" : "916",
//         "city" : "汉中"
//     }, {
//         "pr" : "陕西",
//         "code" : "914",
//         "city" : "商洛"
//     }, {
//         "pr" : "陕西",
//         "code" : "919",
//         "city" : "铜川"
//     }, {
//         "pr" : "陕西",
//         "code" : "913",
//         "city" : "渭南"
//     }, {
//         "pr" : "陕西",
//         "code" : "910",
//         "city" : "咸阳"
//     }, {
//         "pr" : "陕西",
//         "code" : "911",
//         "city" : "延安"
//     }, {
//         "pr" : "陕西",
//         "code" : "912",
//         "city" : "榆林"
//     }, {
//         "pr" : "四川",
//         "code" : "280",
//         "city" : "成都"
//     }, {
//         "pr" : "四川",
//         "code" : "816",
//         "city" : "绵阳"
//     }, {
//         "pr" : "四川",
//         "code" : "832",
//         "city" : "资阳"
//     }, {
//         "pr" : "四川",
//         "code" : "827",
//         "city" : "巴中"
//     }, {
//         "pr" : "四川",
//         "code" : "838",
//         "city" : "德阳"
//     }, {
//         "pr" : "四川",
//         "code" : "818",
//         "city" : "达州"
//     }, {
//         "pr" : "四川",
//         "code" : "826",
//         "city" : "广安"
//     }, {
//         "pr" : "四川",
//         "code" : "839",
//         "city" : "广元"
//     }, {
//         "pr" : "四川",
//         "code" : "833",
//         "city" : "乐山"
//     }, {
//         "pr" : "四川",
//         "code" : "830",
//         "city" : "泸州"
//     }, {
//         "pr" : "四川",
//         "code" : "829",
//         "city" : "眉山"
//     }, {
//         "pr" : "四川",
//         "code" : "832",
//         "city" : "内江"
//     }, {
//         "pr" : "四川",
//         "code" : "817",
//         "city" : "南充"
//     }, {
//         "pr" : "四川",
//         "code" : "812",
//         "city" : "攀枝花"
//     }, {
//         "pr" : "四川",
//         "code" : "825",
//         "city" : "遂宁"
//     }, {
//         "pr" : "四川",
//         "code" : "831",
//         "city" : "宜宾"
//     }, {
//         "pr" : "四川",
//         "code" : "835",
//         "city" : "雅安"
//     }, {
//         "pr" : "四川",
//         "code" : "813",
//         "city" : "自贡"
//     }, {
//         "pr" : "四川",
//         "code" : "837",
//         "city" : "阿坝"
//     }, {
//         "pr" : "四川",
//         "code" : "836",
//         "city" : "甘孜"
//     }, {
//         "pr" : "四川",
//         "code" : "834",
//         "city" : "凉山"
//     }, {
//         "pr" : "西藏",
//         "code" : "891",
//         "city" : "拉萨"
//     }, {
//         "pr" : "西藏",
//         "code" : "892",
//         "city" : "日喀则"
//     }, {
//         "pr" : "西藏",
//         "code" : "897",
//         "city" : "阿里"
//     }, {
//         "pr" : "西藏",
//         "code" : "895",
//         "city" : "昌都"
//     }, {
//         "pr" : "西藏",
//         "code" : "894",
//         "city" : "林芝"
//     }, {
//         "pr" : "西藏",
//         "code" : "896",
//         "city" : "那曲"
//     }, {
//         "pr" : "西藏",
//         "code" : "893",
//         "city" : "山南"
//     }, {
//         "pr" : "新疆",
//         "code" : "991",
//         "city" : "乌鲁木齐"
//     }, {
//         "pr" : "新疆",
//         "code" : "993",
//         "city" : "石河子"
//     }, {
//         "pr" : "新疆",
//         "code" : "995",
//         "city" : "吐鲁番"
//     }, {
//         "pr" : "新疆",
//         "code" : "999",
//         "city" : "伊犁"
//     }, {
//         "pr" : "新疆",
//         "code" : "997",
//         "city" : "阿克苏"
//     }, {
//         "pr" : "新疆",
//         "code" : "906",
//         "city" : "阿勒泰"
//     }, {
//         "pr" : "新疆",
//         "code" : "996",
//         "city" : "巴音"
//     }, {
//         "pr" : "新疆",
//         "code" : "909",
//         "city" : "博尔塔拉"
//     }, {
//         "pr" : "新疆",
//         "code" : "994",
//         "city" : "昌吉"
//     }, {
//         "pr" : "新疆",
//         "code" : "902",
//         "city" : "哈密"
//     }, {
//         "pr" : "新疆",
//         "code" : "903",
//         "city" : "和田"
//     }, {
//         "pr" : "新疆",
//         "code" : "998",
//         "city" : "喀什"
//     }, {
//         "pr" : "新疆",
//         "code" : "990",
//         "city" : "克拉玛依"
//     }, {
//         "pr" : "新疆",
//         "code" : "908",
//         "city" : "克孜勒"
//     }, {
//         "pr" : "新疆",
//         "code" : "901",
//         "city" : "塔城"
//     }, {
//         "pr" : "云南",
//         "code" : "871",
//         "city" : "昆明"
//     }, {
//         "pr" : "云南",
//         "code" : "877",
//         "city" : "玉溪"
//     }, {
//         "pr" : "云南",
//         "code" : "878",
//         "city" : "楚雄"
//     }, {
//         "pr" : "云南",
//         "code" : "872",
//         "city" : "大理"
//     }, {
//         "pr" : "云南",
//         "code" : "873",
//         "city" : "红河"
//     }, {
//         "pr" : "云南",
//         "code" : "874",
//         "city" : "曲靖"
//     }, {
//         "pr" : "云南",
//         "code" : "691",
//         "city" : "西双版纳"
//     }, {
//         "pr" : "云南",
//         "code" : "870",
//         "city" : "昭通"
//     }, {
//         "pr" : "云南",
//         "code" : "875",
//         "city" : "保山"
//     }, {
//         "pr" : "云南",
//         "code" : "692",
//         "city" : "德宏"
//     }, {
//         "pr" : "云南",
//         "code" : "887",
//         "city" : "迪庆"
//     }, {
//         "pr" : "云南",
//         "code" : "888",
//         "city" : "丽江"
//     }, {
//         "pr" : "云南",
//         "code" : "883",
//         "city" : "临沧"
//     }, {
//         "pr" : "云南",
//         "code" : "886",
//         "city" : "怒江"
//     }, {
//         "pr" : "云南",
//         "code" : "879",
//         "city" : "普洱"
//     }, {
//         "pr" : "云南",
//         "code" : "876",
//         "city" : "文山"
//     }, {
//         "pr" : "浙江",
//         "code" : "571",
//         "city" : "杭州"
//     }, {
//         "pr" : "浙江",
//         "code" : "574",
//         "city" : "宁波"
//     }, {
//         "pr" : "浙江",
//         "code" : "573",
//         "city" : "嘉兴"
//     }, {
//         "pr" : "浙江",
//         "code" : "575",
//         "city" : "绍兴"
//     }, {
//         "pr" : "浙江",
//         "code" : "577",
//         "city" : "温州"
//     }, {
//         "pr" : "浙江",
//         "code" : "580",
//         "city" : "舟山"
//     }, {
//         "pr" : "浙江",
//         "code" : "572",
//         "city" : "湖州"
//     }, {
//         "pr" : "浙江",
//         "code" : "579",
//         "city" : "金华"
//     }, {
//         "pr" : "浙江",
//         "code" : "578",
//         "city" : "丽水"
//     }, {
//         "pr" : "浙江",
//         "code" : "576",
//         "city" : "台州"
//     }, {
//         "pr" : "浙江",
//         "code" : "570",
//         "city" : "衢州"
//     } ];
//     for (let i = 0;i<citys.length;i++) {
//         // alert(index)
//         if (city === citys[i].code) {
//             return citys[i].city;
//         }
//     }
//     return '加载中';
// }
