var express = require('express');
var router = express.Router();
var Data = require('../models/Data');


router.get('/add',function (req, res, next) {
    res.render('add');
});

//内容首页
 router.get('/',function (req, res) {
    var page = Number(req.query.page || 1);
    var limit = 10;
    var pages = 0;

    Data.count().then(function(count){
        //计算总页数
        pages = Math.ceil(count/limit);
        page = Math.min(page, pages);
        page = Math.max(page,1);

        var skip = (page-1)*limit;
        //sort参数：1:升序，-1:降序
        Data.find().limit(limit).skip(skip).populate('data').sort({
            addTime:1
        }).then(function(data){
            res.render('index',{
                data:data,
                page:page,
                count:count,
                pages:pages,
                limit:limit
            });
        });
    });
});

 /**
 * 添加联系人
 * 逻辑：
 * 1.电话符合规则
 * 2.邮箱符合规则
 * 3.姓名不能为空
 */

 //添加联系人
router.post('/add',function (req,res){
    var name = req.body.name;
    var tel = req.body.tel;
    var email = req.body.email;

    var emailPattern = /^([a-zA-Z0-9]+[-_.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[-_.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,6}$/;
    var telPattern = /(^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$)|(^0{0,1}1[3|4|5|6|7|8|9][0-9]{9}$)/;

    if(name===''){
        res.render('error',{
            message:'姓名不能为空'
        });
        return;
    }
    if(!telPattern.test(tel) || tel===''){
        res.render('error',{
            message:'输入的电话不符合规则'
        });
        return;
    }
    if(!emailPattern.test(email) || email===''){
        res.render('error',{
            message:'输入的邮箱不符合规则'
        });
        return;
    }

    new Data({
       name:name,
       tel:tel,
       email:email
    }).save().then(function() {
        res.render('success', {
            message: '联系人保存成功',
            url: '/'
        });
    })
});

//信息修改
router.get('/edit',function (req, res) {
    Data.find().sort({_id: -1}).then(function () {
        return Data.findOne({
            _id: req.query.id
        }).populate('data');
    }).then(function (data) {
        if (!data) {
            res.render('error', {
                message: '指定内容不存在'
            });
        } else {
            res.render('edit', {
                data: data
            });
        }
    });

});

//保存修改
router.post('/edit',function (req, res) {
    var id = req.query.id || '';
    var name = req.body.name;
    var tel = req.body.tel;
    var email = req.body.email;

    var emailPattern = /^([a-zA-Z0-9]+[-_.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[-_.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,6}$/;
    var telPattern = /(^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$)|(^0{0,1}1[3|4|5|6|7|8|9][0-9]{9}$)/;

    if(name===''){
        res.render('error',{
            message:'姓名不能为空'
        });
        return;
    }
    if(!telPattern.test(tel) || tel===''){
        res.render('error',{
            message:'输入的电话不符合规则'
        });
        return;
    }
    if(!emailPattern.test(email) || email===''){
        res.render('error',{
            message:'输入的邮箱不符合规则'
        });
        return;
    }
    Data.update({
        _id:id
    },{
        name:name,
        tel:tel,
        email:email
    }).then(function () {
        res.render('success',{
            message:'内容保存成功',
            url:'/'
        })
    })

});

//联系人删除
router.get('/delete',function (req, res) {
    var id = req.query.id || '';
    Data.remove({
        _id:id
    }).then(function () {
        res.render('success',{
            message:'删除成功',
            url:'/'
        });
    });
});

module.exports=router;