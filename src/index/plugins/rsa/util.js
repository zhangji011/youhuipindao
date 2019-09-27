import {
  JSEncrypt
} from './jsencrypt'
import {
  GibberishAES
} from './gibberish-aes'
// import CryptoJS from 'crypto-js/crypto-js'
// import Base64 from 'crypto-js/enc-base64';
// import AES from "crypto-js/aes"
export default {
  // 获取公钥KEY(获取后端KEY)
  RSA() {
    // 获取公钥KEY(获取后端KEY)
    var publicKey = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCx2zk90WzGIzGjl7opxIFdoinxyp+pjvN1wC0OTrGk6o/c0RyrmQstu690IJPXu/6urLmB7/T2Iy/UUvSkqwzL7oX6D7llTjyR4MQjwvPVy7JZR2WYu1dvPgQn++/DVBuFDtfYW6pRlIi27iPxXyQ3ozAfHo5biR5nNelhu0lnVQIDAQAB';
    // REA加密组件JS方法
    var RSAUtils = new JSEncrypt();
    // 设置公钥
    RSAUtils.setPublicKey(publicKey);
    return {
      //获取16随机数
      generateMixed: function () {
        var jschars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
        var key = "";
        for (var i = 0; i < 16; i++) {
          var id = Math.ceil(Math.random() * 35);
          key += jschars[id];
        }
        return key;
      },
      AES_Encode: function (plain_text, key) {
        // var encrypt = CryptoJS.AES.encrypt(plain_text, CryptoJS.enc.Utf8.parse(key), {
        //   mode: CryptoJS.mode.ECB,
        //   padding: CryptoJS.pad.Pkcs7
        // });
        // console.log(encrypt.toString())
        // return encrypt.toString()
        GibberishAES.size(128);
        return GibberishAES.aesEncrypt(plain_text, key);

      },
      AES_Decrypt: function (plain_text, key) {
        GibberishAES_.size(128);
        return GibberishAES_.aesDecrypt(plain_text, key);
      },
      RSA_Encode: function (key) {
        return RSAUtils.encrypt(key);
      },
      RSA_decode: function (text) {
        return RSAUtils.decrypt(text);
      }
    }
  },
  setRSA(params, rsa) {
    var params = params || {};
    params = (typeof params == "object") ? params : JSON.parse(params.replace(/\n| /g, ""));
    if (typeof params == "object") {
      var rsa = rsa || new this.RSA();
      var _key = rsa.generateMixed();
      // console.log(_key)
      // console.log(JSON.stringify(params))
      var creditPay = rsa.AES_Encode(JSON.stringify(params), _key)
      var encodeKey = rsa.RSA_Encode(_key)
      // console.log(creditPay)
      // console.log(encodeKey)
      return {
        "creditPay": creditPay,
        "encodeKey": encodeKey
      }
    } else {
      return {}
    }
  },
  /**
   * 拦截器
   */
  insepector() {

  }
}
