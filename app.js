var express = require('express');
//加载模板处理模块
var swig = require('swig');
//加载数据库模块
var mongoose = require('mongoose');
//加载body-parser，用来处理post提交过来的数据
var bodyParser = require('body-parser');
//加载cookies模块
var Cookies = require('cookies');
var path = require('path');

//创建app应用  => NodeJS Http.createServer();
var app = express();

//设置静态文件托管
//当用户访问的url以/public开始，那么直接返回对应__dirname + '/public'下的文件
app.use('/public',express.static( __dirname + '/public'));

//配置应用模板
//定义当前应用所使用的模板引擎
//第一个参数：模板引擎的名称，也是模板文件的后缀。第二个参数，用于解析处理模板内容的方法
app.engine('html',swig.renderFile);
//设置模板文件存放的目录，第一个参数必须是views，第二个参数是目录
app.set('views','./views');
//注册所使用的模板引擎，第一个参数必须是view engine，第二个参数和app.engine参数中定义模板引擎的名称一致
app.set('view engine','html');
//在开发过程中，需要取消模板缓存
swig.setDefaults({cache:false});

//bodyparser配置
app.use(bodyParser.urlencoded({extended:true}));

app.use('/',require('./routers/main'));

//监听http请求
mongoose.connect('mongodb://localhost:27064/addresslist',function (err) {
    if(err) {
        console.log('数据库连接失败');
    }else{
        console.log('数据库连接成功');
        app.listen(8060);
    }
});

app.set('views', path.join(__dirname, 'views'));



/**
 * 用户发送http请求 -> url -> 解析路由 -> 找到匹配的规则 -> 执行绑定的函数，返回对应内容至用户
 * /public -> 静态 -> 直接读取指定目录下的文件，返回给用户
 * -> 动态 -> 处理业务逻辑，加载模板，解析模板 —> 返回数据给用户
 */

module.exports = app;