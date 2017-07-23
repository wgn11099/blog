/**
 * Created by WLouis on 2017/6/10.
 */

var mongoose = require('mongoose');
//创建模型类
var contentsSchema = require('../schemas/contents');

module.exports = mongoose.model('Content',contentsSchema);
