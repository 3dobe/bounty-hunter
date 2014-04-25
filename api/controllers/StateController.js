/**
 * StateController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */
var Client = require('../../assets/js/client');
//var User = require('../models/User');
module.exports = {

  //登陆操作
  login : function (req, res) {
    //var c = new Client('127.0.0.1', '111', 'utf-8');
    //console.log(c);
   /*
   测试添加数据,
   User.create({
      id : '11080732',
      phone : '15902010181',
      email : '540886643@qq.com'
    }).done(function (err, user) {
      if (err) {
        console.log(err);
      } else {
        console.log(user);
      }
    });*/
    //console.log(User);
    res.redirect('/');
  },

  //登出操作
  logout : function (req, res) {

  }


};
