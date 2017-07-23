/**
 * Created by WLouis on 2017/6/11.
 */

var mongoose = require('mongoose');
//创建模型类
var usersSchema = require('../schemas/users');

module.exports = mongoose.model('User',usersSchema);
