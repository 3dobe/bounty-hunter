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
  myTasksPublish : function(req, res) {
    //用户发布的任务列表
    var id = req.session['user'].id;
    Task.find({
      publisherId : id
    }).done(function (err, tasks) {
      if(err) {
        console.log(err);
      } else if (tasks==null){
        return res.send({ msg : 'no task' });
      } else {
        return res.send({ tasks : tasks });
      }
    });
  },

  myTasksAccept : function(req, res) {
    //用户接受的任务列表
    var id = req.session['user'].id;
    Task.find({
      accepterId : id
    }).done(function (err, tasks) {
          if(err) {
            console.log(err);
          } else if (tasks==null){
            return res.send({ msg : 'no task' });
          } else {
            return res.send({ tasks : tasks });
          }
        });
  },

  acceptTask : function(req, res) {
    //用户接受任务
    var tid = req.query['id'];
    var id = req.session['user'].id;
    Task.findOne({
      id : tid,
      accepterId : null
    }).done(function (err, task) {
      if(err) {
        console.log(err);
      }
      if(!task) {
        return res.send({ msg : 'no task'})
      }
      task.accepterId = id;
      task.save(function(err) {
        if(err) {
          return res.send({ msg : 'accept fail' })
        }
      });
    });
  },

  fulfilTask : function(req, res) {
    //完成任务
    var tid = req.query['id'];
    var id = req.session['user'].id;
    Task.findOne({
      id : tid,
      isFinish : false
    }).done(function (err, task) {
          if(err) {
            console.log(err);
          }
          if(!task) {
            return res.send({ msg : 'no task'})
          }
          task.isFinish = true;
          task.save(function(err) {
            if(err) {
              return res.send({ msg : 'finish fail' })
            }
          });
        });
  },

  accuseTask : function(req, res) {

  }
};
