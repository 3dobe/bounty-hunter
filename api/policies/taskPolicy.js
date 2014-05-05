/**
 * Created by Administrator on 14-5-5.
 */
module.exports = function(req, res, next) {
  console.log(req);
  console.log(req.target.action);
  console.log(req.params['id']);
  //先判断是否为ajax请求
  //if(req.isAjax) {
    if(req.target.action === 'find') {
      //获取任何用户都能看到的任务时 直接通过
      return next();
    }
    if (req.session['user']) {
      var user = req.session['user'];
      var action = req.target.action;
      //如session中user信息,则向req中添加id信息
      if(action === 'myTasksPublish'){
        //获取用户发布的任务 添加publisherId信息
        console.log(1);
        req.query['publisherId'] = user.id;
        return next();
      } else if(action === 'myTasksAccept'){
        //获取用户接受的任务 添加accepterId信息
        console.log(2);
        req.query['accepterId'] = user.id;
        return next();
      } else if(action === 'create') {
        //如是新建任务,则添加用户publisherId信息
        console.log(3);
        req.body['publisherId'] = user.id
        return next();
      } else if(action === 'update' || action === 'destroy') {
        //如是删除或跟新,则对task.publisherId属性与用户id属性进行比较
        console.log(4);
        var id = req.params['id'];
        console.log(id,4);
        Task.findOne(id).done(function(err, task) {
          if(err) {
            return res.forbidden(err.message);
          }
          if(!task) {
            return res.forbidden('没有该任务');
          }else if(task.publisherId === user.id) {
            //确认该任务为该用户发布,通过请求
            next();
          } else {
            res.forbidden('你无权对该任务进行操作');
          }
        });
        return next();
      }
    } else {
      return res.forbidden('请先登录');
    }
  //}
  return res.forbidden('You are not permitted to perform this action.');
};
