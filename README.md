# 项目运行
npm install
npm run dev demo 调试demo项目
npm run dev index 调试index项目
npm run build index 发布index项目

#测试地址
http://113.108.79.80:3020/test1/?hebaosso=true&showtitle=false

#本地模拟测试
http://113.108.79.80:3020/test1/?CREDTENTIAL=credtential&SIGN_DATA=sign_data

##优惠频道优化
1、删除冗余的代码 （0926）
2、nginx配置
    keepalive_timeout  60;
    关闭gzip（etag发生冲突）
    开启https
    开启http2
##首屏优化
#vue-awesome-swiper问题
1、初始化添加该属性：setWrapperSize



#	public static final String TEST_credtential = "credtential";
#   public static final String TEST_sign_data = "sign_data";


