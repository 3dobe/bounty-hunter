/**
 * ViewController
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
  loginView : function(req, res) {
    if(req.session['user'] || req.session['admin']) {
      res.cookie('msg', '你已登录');
      return res.redirect('/');
    } else {
      return res.view('home/login');
    }
  },

  infoView : function(req, res) {
    //返回渲染个人信息页
    if(req.session['user']) {
      res.view('home/info', {
        user: req.session['user']
      });
    } else if(req.session['admin']) {
      res.cookie('msg', '别闹了管理员先生');
      return res.redirect('/');
    } else {
      res.cookie('msg', '用户请先登录');
      return res.redirect('/login');
    }
  },

  cTaskView : function(req, res) {
    //进入发布任务页
    if(req.session['user']) {
      res.view('task/addtask');
    } else if(req.session['admin']) {
      res.cookie('msg', '别闹了管理员先生');
      return res.redirect('/');
    } else {
      res.cookie('msg', '用户请先登录');
      return res.redirect('/login');
    }
  }
};
