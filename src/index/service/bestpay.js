/* global App, Util, Contacts, Camera, Scanner, User, Payment */
/**
 * @author YANGJING
 * created on 18.07.2017
 *
 * Spec:
 *     hyBridgeService creat a bridge between h5 and native
 */
import { getUUID } from '@@/service/util'
import {getStore, setStore, removeStore} from '@@/config/mUtils'
let DEVICE_IS_IOS = /iP(ad|hone|od)/.test(navigator.userAgent);

let User_ = {};
let App_ = {};
let Dialog_ = {};
let Util_ = {};
let LBS_ = {};
let Toast_ = {};
let Payment_ = {};
let Camera_ = {};
let Contacts_ = {};
let Security_ = {};
let Scanner_ = {};
let MessageDigest_ = {}

Camera_.chooseImage = function (scb, ecb) {
    /**
     * 拍照或从相册中选择照片      >= 5.0.5
     * @method chooseImage
     * @param args json参数，见example
     * @example
     *  bp.chooseImage({
     *        dataType: 'dataURL',    //结果数据格式:dataURL: base64编码的图片数据；
     *        imageFormat: 'jpg', //图片格式：jpg / png
     *        quality: 75,    //jpg的图片质量, 取值1到100
     *        maxWidth: 500,  //图片的最大宽度. 过大将被等比缩小
     *        maxHeight: 500, //图片的最大高度. 过大将被等比缩小
     *        allowEdit: true //是否允许编辑(框选). 为true时，拍照时会有一个方形的选框
     *  }, function(result){    //成功选择图片后的回调
     *        image = document.getElementById('myImage');
     *        image.src = "data:image/jpeg;base64," + result;
     *  });
     */
    if (typeof Camera !== "undefined") {
        if (/iP(ad|hone|od)/.test(navigator.userAgent)) {
            Camera.chooseImage({
                dataType: 'dataURL', //结果数据格式:dataURL: base64编码的图片数据；
                imageFormat: 'jpg', //图片格式：jpg / png
                quality: 45, //jpg的图片质量, 取值1到100
                maxWidth: 1024, //图片的最大宽度. 过大将被等比缩小
                maxHeight: 1024, //图片的最大高度. 过大将被等比缩小
                allowEdit: false, //是否允许编辑(框选). 为true时，拍照时会有一个方形的选框
                enableAlbum: false, //允许使用相册 默认true
                enableCamera: true, //允许使用相机 默认true
            }, function (result) {
                scb(result);
            }, function (result) {
                ecb(result);
            });
        } else {
            Camera.chooseImage({
                dataType: 'dataURL', //结果数据格式:dataURL: base64编码的图片数据；
                imageFormat: 'jpg', //图片格式：jpg / png
                quality: 100, //jpg的图片质量, 取值1到100
                maxWidth: 1024, //图片的最大宽度. 过大将被等比缩小
                maxHeight: 1024, //图片的最大高度. 过大将被等比缩小
                allowEdit: false, //是否允许编辑(框选). 为true时，拍照时会有一个方形的选框
                enableAlbum: false, //允许使用相册 默认true
                enableCamera: true, //允许使用相机 默认true
            }, function (result) {
                scb(result);
            }, function (result) {
                ecb(result);
            });
        }

    }
};
Camera_.getImage = function (scb) {
    /**
         拍照或从相册中选择照片 >= 5.1 .8
            quality: 80, //图片质量 默认100
            allowEdit: true, //允许编辑 默认true
            targetWidth: 800 px, //图片宽 默认500px
            targetHeight: 800 px, //图片高 默认500px
            correctOrientation: true, //纠正方向 默认true
            saveToPhotoAlbum: true, //使用完后保存到相册 默认true
            enableCamera: true, //可用相机功能 默认true
            enableAlbum: true, //可用相册功能 默认true
            compress: true, //是否压缩 默认true
            cameraDirection: 'back' //指定前置或后置摄像
            */
    if (typeof Camera !== "undefined") {
        Camera.getImage({
            quality: 95, //图片质量 默认100
            allowEdit: false, //允许编辑 默认true
            correctOrientation: false, //纠正方向 默认true
            saveToPhotoAlbum: true, //使用完后保存到相册 默认true
            enableCamera: true, //可用相机功能 默认true
            enableAlbum: false, //可用相册功能 默认true
            compress: true, //是否压缩 默认true
            cameraDirection: 'back' //指定前置或后置摄像
        }, function (result) {
            scb(result);
        });
    }
};

//User_
Payment_.onPay = function (re, sc, ec) {
    if (typeof Payment !== "undefined") {
        Payment.onPay(re, sc, ec);
    }

}
/**
 * 获取用户产品号
 *  var product = User_.getProduct();
 */
User_.getProduct = function () {
    try {
        return User.getProduct();
    } catch (e) {
        return "18857364363";

    }
}
/**
 * 获取用户地区码
 *  var locationCode = User_.getLocation();
 */
User_.getLocation = function () {
    try {
        return User.getLocation();
    } catch (e) {

    }
}

/**
 * 获取大厅信息
 * @param {[Json]} location 归属地
 * @param {[Json]} coordinates 经纬度坐标
 * @param {[Json]} balance 账户余额
 * @param {[Json]} certNo 证件号
 * @param {[Json]} userName 用户名
 * @param {[Json]} realNameStatus 实名状态
 * @param {[Json]} headPhotoURL 头像的URL
 * @param {[Json]} nickName 昵称
 * @param {[Json]} operatorType 运营商类型
 * @param {[Json]} certType 证件类型
 * @param {[Json]} loginToken 登录令牌
 * @param {[Json]} loginEmail 邮箱
 * @return {[String]}
 * @example
 *  var ClientInfo = User_.getClientInfo();
 */
User_.getClientInfo = function () {
    if (typeof User != "undefined") {
        if (!DEVICE_IS_IOS) {
            return JSON.parse(User.getClientInfo());
        } else {
            return User.getClientInfo();
        }

    } else {
        return { 'certNo': '342824199010140492', 'userName': '熊二', 'loginEmail': '84788778@qq.com', 'coordinates': '121221.121' };
    }
}



//APP
/**
 *获取设备公共请求参数, android: >= 4.2.5, ios: >= 3.3.0
 * @method getCommonRequestParams
 * @return
 * @example
 *  var comParams = hyBridgeService.App('getCommonRequestParams');
 */
App_.getCommonRequestParams = function () {
    try {
        var commonp = App.getCommonRequestParams();
        var re = !DEVICE_IS_IOS ? JSON.parse(commonp) : commonp;
        return re;
    } catch (e) {
        //调不到
        return { IMEI: '121321312321', AIDENTIFIER: '123456', IP: '123.123.123.123', LOCALINFO: '{accuracy:30,speed:0,longitude:121.479985,latitude:31.247455}', DEML: 'iPhone 6s', areaCode: "370000", cityCode: "370100", SYSTEMTYPE: "ios", imei: "123456" };
    }
};
App_.getSessionKey = function () {
    try {
        return App.getSessionKey();
    } catch (e) {
        return "sdfldsnfkasdngkndgksngk";
    }
}
App_.setTitle = function (name) {
    try {
        App.setTitle(name);
    } catch (e) {

    }

}
App_.setKeyEventListener = function (cb) {
    if (typeof App != "undefined") {
        App.setKeyEventListener(function (event) {
            if (event == 'backpress') {
                cb(event);
            }
        });
    } else {
        //调不到
    }
};
App_.getNetworkType = function () {
    try {
        return App.getNetworkType();
    } catch (e) {
        return 'wi-fi';
    }
};
/**
 * 截断返回键事件，用户在按下返回键的时触发js方法
 * @method overrideBackPressed
 * @param {[Boolean]} bound 是否截断
 * @example
 *  hyBridgeService.App('overrideBackPressed',true);
 */
App_.overrideBackPressed = function (bound) {
    if (typeof App != "undefined") {
        App.overrideBackPressed(bound);
    } else {
        //调不到
    }
};
App_.exitApp = function () {
    if (typeof App != "undefined") {
        App.exitApp();
    } else {

    }

}
App_.setTopRightBar = function (obj) {
    obj.type = "text";
    if (typeof App != "undefined") {
        App.setTopRightBar(obj);
    }

};
App_.hideTopRightBar = function () {
    if (typeof App != "undefined") {
        App.hideTopRightBar();
    }
};
App_.jumpToApp = function (args, success, fail) {
    //bestpay://app?id=881&client_to_page=5&test1=123&test2=bc"
    if (typeof App != 'undefined') {
        App.jumpToApp(args, success, fail);
    } else {
        //调不到
        return;
    }
};
App_.jumpToNativeView = function (viewName, args, callback, fail, cancel) {
    if (typeof App != "undefined") {
        App.jumpToNativeView(viewName, args, callback, fail, cancel);
    } else {
        alert("暂不支持");
    }
};
App_.jumpToNView = function (viewNo, args, success, fail, cancel) {
    if (typeof App != "undefined") {
        App.jumpToNView(viewNo, args, success, fail, cancel)
    } else {
        alert('暂不支持');
    }
}

App_.openBrowser = function (link) {
    if (typeof App != "undefined") {
        App.openBrowser(link, false);
    }

}
App_.openSafeKeyBoard = function (success, fail) {
    if (typeof App != "undefined") {
        App.openSafeKeyBoard(6, "支付密码", success, fail);
    }
}
/**
 * 获取当前手机连接的网络类型(wifi | monet | unline)  android: >= 4.2.x, ios: >= 3.2.x
 * @method getNetworkType
 * @return {[String]} 当前手机连接的网络类型
 * @example
 *  var networkType = hyBridgeService.App('getNetworkType');
 */
// this.App_.getNetworkType = function() {
//     if (!!App && !!App.getNetworkType) {
//         App.getNetworkType();
//     } else {
//         //调不到
//         return "";
//     }
// };

//配置左上角关闭按钮是否可见
App_.setCloseButtonVisible = function (isVisible) {
    if (typeof App != "undefined") {
        App.setCloseButtonVisible(isVisible);
    }
};

//Contacts
Contacts_.tel = function (t) {
    try {
        Contacts.tel(t);
    } catch (e) { }

}


//Dialog
Dialog_.showSwitchDialog = function (msg, callback, fail) {
    if (typeof Dialog != "undefined") {
        Dialog.showSwitchDialog("提示", msg, "确定", "取消", callback, fail);
    } else {
        if (window.confirm(msg)) {
            callback();
        }
    }
}
//1
// if (alertflag == "0") {
//     var confirmPopup = $ionicPopup.confirm({
//         template: '月返红包可覆盖每月分期款',
//         title: '办理“零元”购物',
//         okText: '确认办理',
//         cancelText: '再想一想'
//     });
// } else if (alertflag == "1") {
//     var confirmPopup = $ionicPopup.confirm({
//         template: '月返红包与分期款无关，您需要关注每月还款金额并及时还款',
//         title: '办理商品分期',
//         okText: '确认办理',
//         cancelText: '再想一想'
//     });
// } else if (alertflag == "2") {
//     var confirmPopup = $ionicPopup.confirm({
//         template: '红包仅补贴分期利息，您需要关注每月还款总额并及时还款',
//         title: '办理“免息”分期',
//         okText: '确认办理',
//         cancelText: '再想一想'
//     });
// }
Dialog_.chooseOrderType = function (msg, installType, callback, fail) {
    if (typeof Dialog != "undefined") {
        if (installType == "0") {
            Dialog.showSwitchDialog("办理“零元”购物", msg, "确认办理", "再想一想", callback, fail);
        } else if (installType == "1") {
            Dialog.showSwitchDialog("办理商品分期", msg, "确认办理", "再想一想", callback, fail);
        } else if (installType == "2") {
            Dialog.showSwitchDialog("办理“免息”分期", msg, "确认办理", "再想一想", callback, fail);
        }
    } else {
        if (window.confirm(msg)) {
            callback();
        }
    }

}
/**
 * 弹出消息对话框
 * @method alert
 * @param {[String]} msg
 * @example
 *  Dialog.alert("系统繁忙，请重试...");
 */
Dialog_.alert = function (msg) {
    if (typeof Dialog != "undefined") {
        Dialog.alert(msg);
    } else {
        window.alert(msg);
    }
};

LBS_.getInfo = function (success, fail, isRealTime) {
    DialogService.showLoading();
    if (typeof LBS != "undefined") {
        isRealTime = (isRealTime == undefined) ? false : isRealTime;

        LBS.getInfo({ isUpdated: isRealTime }, function (data) {
            DialogService.hideLoading();
            success(data);
        }, function (data) {
            DialogService.hideLoading();
            fail(data);
        });
    } else {
        DialogService.hideLoading();
        success({
            latitude: "39.990464", //纬度
            longitude: "116.481488", //经度
            address: "XX省XX市XX街道XX号", //格式化地址 
            country: "中国", //国家 
            province: "上海", //省/直辖市 
            city: "枣庄市", //市
            district: "虹口", //区
            township: "江湾镇", //乡镇
            neighborhood: "江湾一村", //社区 
            building: "50号楼", //建筑 
            citycode: "020", //城市编码 
            adcode: "01", //区域编码 
            street: "江湾路", //街道名称 
            number: "500号", //门牌号 
            POIName: "", //兴趣点名称 
            AOIName: "", //所属兴趣点名称
        });
    }
};

Toast_.makeText = function (text, duration) {
    if (typeof Toast != "undefined") {
        var duration = duration || 2;
        Toast.makeText(text, duration);
    } else {
        alert(text);
    }
};
Util_.base64Decode = function (source) {
    return util.base64Decode(source);
};

Contacts_.tel = function (tel) {
    if (typeof Contacts != "undefined") {
        Contacts.tel(tel);
    }
};

/**
 *  人脸识别
 *  @params {type:} faceBase只采集人脸照片 faceContrast比对公安系统
 *  @success 成功回调
 *  @fail 失败回调
 */
Security_.faceCollect = function (params, success, fail) {
    if (typeof Security != "undefined") {
        Security.faceCollect(params, success, fail);
    }

}

/**
 *  用户拍照上传身份证  0130
 *  @params {type:} faceBase只采集人脸照片 faceContrast比对公安系统
 *  @success 成功回调
 *  @fail 失败回调
 */
Camera_.UserIdImage = function (args, success, fail, cancel) {
    if (typeof Camera != "undefined") {
        Camera.chooseImage(args, success, fail, cancel)
    }
}
/**
 *  身份证OCR扫描
 *  @params {type:} idCard扫描身份证
 *  @success 成功回调
 *  @fail 失败回调
 */
Scanner_.scan = function (params, success, fail) {
    if (typeof Scanner != "undefined") {
        Scanner.scan(params, success, fail);
    }
}

/**
 * 打开通讯录联系人
 * @method openContacts
 * @param {[Function]} success 选择联系人后的回调，返回联系人号码
 * @param {[Function]} fail 失败回调
 * @example
 *  function success(phone_no){
 *      alert(phone_no)
 *  }
 *  Contacts.openContacts(success)
 */
Contacts_.openContacts = function (success, fail) {
    if (typeof Contacts != "undefined") {
        Contacts.openContacts(success, fail);
    }
}

MessageDigest_.digest = (msg) => {
    try {
        return MessageDigest.digest("md5", "abcd")
    } catch (e) {
        return "rtyuiopfghjkl"
    }
}
const back = (that) => {
    App.overrideBackPressed(true);
    App.setKeyEventListener((event) => {
        if (event == "backpress") {
            let url = window.location.hash.replace(/#/g, '').replace(/\//g, '')
            if (url == 'tabhome' || url == 'tabshop' || url == 'tabmine') {
                App.exitApp()
            } else if (url == 'idCard') {
                that.bombBox = true;
            } else if (url == 'cashLoan') {
                setStore('selectCardInfo',"");
                setStore('cashLoanInfo','');
                if(JSON.stringify(that.mobileSelect) != '{}') that.mobileSelect.hide();
                that.$router.go(-1);
            }else if (url == 'cashLoanSuccess') {
                setStore('selectCardInfo',"");
                setStore('cashLoanInfo','');
                that.$router.push({path:'/tab/home'});
            }else if (url == 'cashLoanFail') {
                setStore('selectCardInfo',"");
                setStore('cashLoanInfo','');
                that.$router.push({path:'/tab/home'});
            } else {
                that.$router.back()
            }
        }
    })
}
const barRight = (that) => {
    App.overrideBackPressed(true);
    document.addEventListener("topBarClick", function () {
        let url = that.$route.path
        // alert(url)
        if (url.indexOf('tab/home') > 0) {
            that.$router.push({ path: '/bill' })
        }else if(url.indexOf('cashLoan') > 0){
            //that.mobileSelect.hide();
            that.moreShow();
        }else if(url.indexOf('bankCard') > 0){
            that.$router.push({path:'/surportCardList'})
        }



    }, false);

}

export default {
    install(Vue, options) {
        Vue.prototype.Contacts_ = Contacts_
        Vue.prototype.User_ = User_
        Vue.prototype.App_ = App_
        Vue.prototype.Dialog_ = Dialog_
        Vue.prototype.Util_ = Util_
        Vue.prototype.LBS_ = LBS_
        Vue.prototype.Toast_ = Toast_
        Vue.prototype.Payment_ = Payment_
        Vue.prototype.Camera_ = Camera_
        Vue.prototype.Security_ = Security_
        Vue.prototype.Scanner_ = Scanner_
        Vue.prototype.MessageDigest_ = MessageDigest_
        Vue.prototype.getUUID = getUUID
        Vue.prototype.DEVICE_IS_IOS = DEVICE_IS_IOS ? 'ios' : 'android'
        Vue.prototype.back = back
        Vue.prototype.barRight= barRight
    }
}