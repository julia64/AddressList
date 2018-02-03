var mongoose = require('mongoose');

module.exports = new mongoose.Schema({
    //姓名
    name:String,
    //电话
    tel:String,
    //邮箱
    email:String
});