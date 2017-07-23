/**
 * Created by WLouis on 2017/6/10.
 */
//前台模块
var express = require('express');
var router = express.Router(); //创建路由对象
var Category = require('../models/Category');
var Content = require('../models/Content');

var data;

/**
 * 设置处理通用类的信息
 */
router.use(function (req,res,next) {
     data = {
         userInfo : req.userInfo,
         categories : []
     };
    //读取所有的分类信息
     Category.find().then(function (categories) {
       data.categories = categories;
       next();
    });
});

/**
 * 首页
 */
router.get('/',function (req,res,next) {

     data.category = req.query.category || '';
     data.count = 0;
     data.page = Number(req.query.page || 1);
     data.limit = 10;
     data.pages = 0;

    var where = {};
    if(data.category){
        where.category = data.category;
    }


    Content.where(where).count().then(function (count) {
       //返回内容的总记录数
       data.count = count;
       //计算总页数
       data.pages = Math.ceil(data.count/data.limit);//向上取整
       data.page = Math.min(data.page,data.pages);//取值不能超过pages
       data.page = Math.max(data.page,1);//取值不能小于1

       var skip = (data.page - 1) * data.limit;

       return  Content.where(where).find().limit(data.limit).skip(skip).populate(['category','user']).sort({
           addTime : -1
       });

   }).then(function (contents) {
       data.contents = contents;
       //console.log(data);
       res.render('main/index', data);
   });
});

router.get('/view',function (req,res) {

    var contentId = req.query.contentid || '';
    Content.findOne({
        _id: contentId
    }).then(function (content) {
       data.content = content;

       content.views++;
       content.save();

       res.render('main/view',data);
    });
});

module.exports = router; //返回数据