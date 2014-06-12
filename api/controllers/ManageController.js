/**
 * ManageController
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

module.exports = {
  add : function(req, res) {
    //超级管理员添加普通管理员
    var username = req.body['username'];
    var password = req.body['password'];
    Admin.findOne({
      username: username
    }).done(function(err, admin) {
          if(err) {
            res.cookid('msg', '内部错误');
            return res.redirect('/admin/add');
          }
          if(admin) {
            res.cookie('msg', '用户名已存在');
            return res.redirect('/admin/add');
          }
          if(!admin) {
            Admin.create({
              username : username,
              password : password
            }).done(function(err, admin) {
                  if(err) {
                    res.cookid('msg', '内部错误');
                    return res.redirect('/admin/add');
                  }
                  console.log("Admin created:", admin);
                  res.cookie('msg', '创建成功');
                  return res.redirect('/admin/add');
                });
          }
        });
  }
};
