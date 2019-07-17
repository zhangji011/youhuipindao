/* global App, Util, Contacts, Camera, Scanner, User, Payment */
/**
 * @author YANGJING
 * created on 18.07.2017
 *
 * Spec:
 *     hyBridgeService creat a bridge between h5 and native
 */

export const system = /iP(ad|hone|od)/.test(navigator.userAgent)?"ios":"android";

/**
 * 获取用户产品号
 *  var product = User_.getProduct();
 */
export const getProduct = function () {
    try {
        return User.getProduct();
    } catch (e) {
        return "18857364363";

    }
}


export const getSessionKey = function () {
    try {
        return App.getSessionKey();
    } catch (e) {
        return "sdfldsnfkasdngkndgksngk";
    }
}

export const setTopRightBar = function(value){
    try{
        App.setTopRightBar({
            type: 'text',
            value: value
        });
    }catch(e){

    }
  
} 