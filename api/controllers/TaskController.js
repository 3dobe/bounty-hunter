/**
 * TaskController
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

  find : function(req, res) {

  },

  add : function(req, res) {
    var title = req.body['title'];
    var descp = req.body['descp'];
    var id = req.body['userid'];
    var avatar = req.body['avatar'];
    var phone = req.body['phone'];
    var email = req.body['email'];
    Task.create({
      title: title,
      descp: descp,
      publisherId: id,
      publisherAvatar: avatar,
      publisherPhone: phone,
      publisherEmail: email
    }).done(function(err, task) {
          if(err) {
            res.cookie('msg', '内部错误');
            return res.redirect('back');
          }
          if(!task) {
            res.cookie('msg', '发布任务失败');
            return res.redirect('back');
          }
          res.cookie('msg', '发布任务成功');
          return res.redirect('task/view/' + task.id);
        })
  },

  update : function(req, res) {
    var title = req.body['title'];
    var descp = req.body['descp'];
    var id = req.params['id'];
    console.log(2221);
    Task.findOne({
      id: id
    }).done(function(err, task) {
          if(err) {
            res.cookie('msg', '内部错误');
            return res.redirect('back');
          }
          if(!task) {
            res.cookie('msg', '没有该任务');
            return res.redirect('back');
          }
          if(task.publisherId != req.session['user'].id) {
            res.cookie('msg', '你没有权限喔亲');
            return res.redirect('back');
          }
          task.title = title;
          task.descp = descp;
          task.save(function(err) {
            if(err) {
              res.cookie('msg', '内部错误');
              return res.redirect('back');
            }
            res.cookie('msg', '更新成功');
            return res.redirect('task/view/'+task.id);
          })
        });
  },

  destroy : function(req, res) {
    var id = req.params['id'];
    if(req.session['admin']) {
      Task.destroy({
        id: id
      }).done(function(err) {
            if(err) {
              res.cookid('msg', '内部错误');
              return res.redirect('back');
            }
            res.cookie('msg', '删除成功');
            return res.redirect('/');
          });
    } else {
      var uid = req.session['user'].id;
      Task.destroy({
        id: id,
        publisherId: uid
      }).done(function(err) {
            if(err) {
              res.cookid('msg', '内部错误');
              return res.redirect('back');
            }
            if(!task) {
              res.cookid('msg', '没有该任务');
              return res.redirect('/');
            }
            if(task.accepterId) {
              res.cookie('msg', '已有人接受该任务,删除失败');
              return res.redirect('back');
            }
            res.cookie('msg', '删除成功');
            return res.redirect('/');
          });
    }
  },

  accept : function(req, res) {
    //用户接受任务
    var tid = req.params['id'];
    var id = req.session['user'].id;
    Task.findOne({
      id : tid,
      isCheck : true,
      accepterId : null
    }).done(function (err, task) {
      if(err) {
        res.cookie('msg', '内部错误');
        return res.redirect('back');
      }
      if(!task) {
        res.cookie('msg', '没有该任务');
        return res.redirect('back');
      }
      if(task.publisherId == id) {
        res.cookie('msg', '自己接受自己发布的任务?');
        return res.redirect('back');
      }
      task.accepterId = id;
      task.save(function(err) {
        if(err) {
          res.cookie('msg', '内部错误');
          return res.redirect('back');
        } else {
          res.cookie('msg', '成功接受');
          return res.redirect('task/view/'+tid);
        }
      });
    });
  },

  fulfil : function(req, res) {
    //完成任务
    var uid = req.query['uid'];
    var id = req.params['id'];
    Task.findOne({
      id : id,
      isFinish : false
    }).done(function (err, task) {
          if(err) {
            console.log(err);
            res.cookie('msg', '内部错误');
            return res.redirect('back');
          }
          if(!task) {
            res.cookie('msg', '没有该任务');
            return res.redirect('back');
          }
          task.isFinish = true;
          task.save(function(err) {
            if(err) {
              console.log(err);
              res.cookie('msg', '内部错误');
              return res.redirect('back');
            }
            res.cookie('msg', '终结任务成功');
            return res.redirect('/task/view/'+task.id);
          });
        });
  },

  checkTask : function(req, res) {
    var id = req.params['id'];
    Task.findOne({
      id : id,
      isCheck : false
    }).done(function (err, task) {
          if(err) {
            console.log(err);
            res.cookie('msg', '内部错误');
            return res.redirect('back');
          }
          if(!task) {
            res.cookie('msg', '没有该任务');
            return res.redirect('back');
          }
          task.isCheck = true;
          task.save(function(err) {
            if(err) {
              console.log(err);
              res.cookie('msg', '内部错误');
              return res.redirect('back');
            }
            res.cookie('msg', '通过审核');
            return res.redirect('/task/view/'+task.id);
          });
        });
  }
};
