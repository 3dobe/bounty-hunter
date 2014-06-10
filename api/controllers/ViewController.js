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

  indexView : function(req, res) {
    Task.find()
        .sort('updatedAt')
        .exec(function(err, tasks) {
          if(err) {
            res.cookie('msg', '内部错误');
            return  res.view('403');
          }
          if(req.session['user']) {
            return res.view('home/index', {
              username: req.session['user'].name,
              avatar: req.session['user'].avatar,
              tasks: tasks
            });
          } else if(req.session['admin']) {
            return res.view('home/index', {
              admin: req.session['admin'],
              tasks: tasks
            });
          } else {
            return res.view('home/index', {
              tasks: tasks
            });
          }
        });
  },

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
        username: req.session['user'].name,
        avatar: req.session['user'].avatar,
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
      res.view('task/add', {
        username : req.session['user'].name,
        avatar: req.session['user'].avatar
      });
    } else if(req.session['admin']) {
      res.cookie('msg', '别闹了管理员先生');
      return res.redirect('/');
    } else {
      res.cookie('msg', '用户请先登录');
      return res.redirect('/login');
    }
  },

  taskView : function(req, res) {
    //任务详情页
    var id = req.params['id'];
    Task.findOne({
      id: id
    }).done(function(err, task) {
          if(err) {
            res.cookie('msg', '内部错误');
            return res.redirect('/');
          }
          if(!task) {
            res.cookie('msg', '没有此任务');
            return res.redirect('/');
          }
          if(req.session['user']) {
            return res.view('task/view', {
              username: req.session['user'].name,
              userid: req.session['user'].id,
              avatar: req.session['user'].avatar,
              task: task
            });
          } else if(req.session['admin']) {
            return res.view('task/view', {
              admin: req.session['admin'],
              task: task
            });
          } else {
            return res.view('task/view', {
              task: task
            });
          }
        });
  },

  //修改任务页
  modi : function(req, res) {
    if(!req.session['user']){
      res.cookie('msg', '用户请先登录');
      return res.redirect('/login');
    }
    var id = req.params['id'];
    var uid = req.session['user'].id;
    Task.findOne({
      id: id
    }).done(function(err, task) {
          if(err) {
            res.cookie('msg', '内部错误');
            return res.redirect('/');
          }
          if(!task) {
            res.cookie('msg', '没有此任务');
            return res.redirect('/');
          }
          if(task.accepterId != null) {
            res.cookie('msg', '已有人接受,不能修改');
            return res.redirect('back');
          }
          if(task.publisherId != uid) {
            console.log(11);
            res.cookie('msg', '你没权限喔亲');
            return res.redirect('back');
          } else {
            return res.view('task/modi', {
              username: req.session['user'].name,
              avatar: req.session['user'].avatar,
              task: task
            });
          }
        });
  },

  myTasksView: function(req, res) {
    if(req.session['admin']) {
      res.cookie('msg', '别闹了管理员先生');
      return res.redirect('/');
    } else if(!req.session['user']) {
      res.cookie('msg', '用户请先登录');
      return res.redirect('/login');
    }
    var id = req.session['user'].id;
    var username = req.session['user'].name;
    var avatar = req.session['user'].avatar;
    var sign = req.params['publishOrAccept'];
    if(sign == 'publish'){
      Task.find({
        publisherId: id
      }).done(function(err, tasks) {
            if(err) {
              res.cookie('msg', '内部错误');
              return res.redirect('/');
            }
            if(tasks.length == 0) {
              return res.view('home/tasklist', {
                username: username,
                avatar: avatar,
                title: '我发布的任务',
                none: 1
              });
            }
            return res.view('home/tasklist', {
              username: username,
              avatar: avatar,
              title: '我发布的任务',
              tasks: tasks
            });
          });
    } else if(sign == 'accept') {
      Task.find({
        accepterId: id
      }).done(function(err, tasks) {
            if(err) {
              res.cookie('msg', '内部错误');
              return res.redirect('/');
            }
            if(tasks.length == 0) {
              return res.view('home/tasklist', {
                username: username,
                avatar: avatar,
                title: '我接受的任务',
                none: 1
              });
            }
            return res.view('home/tasklist', {
              username: username,
              avatar: avatar,
              title: '我接受的任务',
              tasks: tasks
            });
          });
    } else {
      return res.view('404');
    }
  }
};
