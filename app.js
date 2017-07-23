/**
 * Created by WLouis on 2017/6/10.
 *应用程序启动入口文件
 */
//创建express模块
var express = require('express');
//加载模板处理模块
var swig = require('swig');
//加载数据库模块
var mongoose = require('mongoose');
//加载body-parser,用来处理post提交过来的数据
var bodyParser = require('body-parser');
//加载cookies模块
var cookies = require('cookies');
//创建app应用  =>  NodeJs  Http.createServer()对象
var app = express();

var User= require('./models/User');

//设置静态文件托管
//当用户访问的url以/public开始，那么直接返回对应的__dirname + '/public'下的文件
app.use('/public', express.static(__dirname + '/public'));

//配置应用模板  swig是模板解析引擎
//定义当前应用所使用的模板引擎
//第一个参数：模板引擎的名称，同时也是模板文件的后缀
//第二个参数：表示用于解析处理模板内容的方法
app.engine('html',swig.renderFile);
//设置模板文件存放的目录，第一个参数必须是views，第二个参数是目录
app.set('views','./views');
//注册所使用的模板引擎,第一个参数必须是 view engine，第二个参数和app.engine这个方法中定义的模板引擎的名称是一致的(其第一个参数)
app.set('view engine','html');
//在开发过程中，需要取消模板缓存
swig.setDefaults({cache : false});

//body-parser设置
app.use( bodyParser.urlencoded({extended: true}) );

//设置cookies
app.use( function (req,res,next) {
    req.cookies = new cookies(req,res);

    //解析登录用户的cookies信息
    req.userInfo = {};
    if(req.cookies.get('userInfo')){
        try{
            req.userInfo = JSON.parse(req.cookies.get('userInfo'));
            //获取当前登录用户的类型，是否是管理员
            User.findById(req.userInfo._id).then(function (userInfo) {
                req.userInfo.isAdmin = Boolean(userInfo.isAdmin);
                next();
            });
        }catch (e){
            next();
        }
    }else{
        next();
    }
} );
/*
 根据不同的功能划分的模块：后台、api、前台
 */
app.use('/admin',require('./routers/admin'));
app.use('/api',require('./routers/api'));
app.use('/',require('./routers/main'));

/**
 * 首页
 *    req request对象
 *    res response对象
 *    next 函数
 */
/*
app.get('/',function (req,res,next) {

    //res.send('<h1>欢迎光临我的博客! </h1>');
    /*
     *  读取views目录下的指定文件，解析并返回给客户端
     *  第一个参数：表示模板文件，相对于views目录  =>  views/index.html
     *  第二个参数：传递给模板使用的数据
     */
    //res.render('index');
//});


/*
app.get('/main.css',function (req, res, next) {
    res.setHeader('content-type','text/css');
    res.send("body {background:green;}");
});
*/

//监听http请求
mongoose.connect('mongodb://localhost:27017/Blog',function(err) {
    if(err){
        console.log('数据库连接失败');
    }else{
        console.log('数据库连接成功');
        app.listen(8081);
    }
});//连接数据库


/*
 用户发送http请求 =》 url =》 后端解析路由 =》 找到匹配的规则 =》 执行绑定的函数，返回对应的内容至客户端

 /public =》 静态 =》 直接读取指定目录下的文件，返回给用户

 '/' =》 动态 =》 处理业务逻辑，加载模板，解析模板 =》 返回数据给用户
 */
