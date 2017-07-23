/**
 * Created by WLouis on 2017/6/10.
 */

var mongoose = require('mongoose');
//创建模型类
var categoriesSchema = require('../schemas/categories');

module.exports = mongoose.model('Category',categoriesSchema);
