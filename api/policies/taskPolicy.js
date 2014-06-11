/**
 * Created by Administrator on 14-5-5.
 */
module.exports = function(req, res, next) {
  if(req.target.action === 'find') {
    //获取任何用户都能看到的任务时 直接通过
    return next();
  }
  console.log(req.target.action);
  if (req.session['user']) {
    //如session中user信息,则向req中添加id信息
    var user = req.session['user'];
    var action = req.target.action;
    if(action === 'accept') {
      return next();
    } else if(action === 'myTasksPublish') {
      //获取用户发布的任务 添加publisherId信息
      req.query['publisherId'] = user.id;
      return next();
    } else if(action === 'myTasksAccept') {
      //获取用户接受的任务 添加accepterId信息
      req.query['accepterId'] = user.id;
      return next();
    } else if(action === 'add') {
      //如是新建任务,则添加用户publisherId信息
      if(!user.condition) {
        res.cookie('msg', '请先完善个人信息');
        return res.redirect('back');
      }
      req.body['userid'] = user.id;
      req.body['phone'] = user.phone;
      req.body['email'] = user.email;
      req.body['avatar'] = user.avatar;
      return next();
    } else if(action === 'update' || action === 'destroy') {
      return next();
    } else if(action === 'fulfil') {
      req.query['uid'] = user.id;
      return next();
    }
  } else if(req.session['admin']) {
    if(req.target.action === 'checktask') {
      return next();
    } else if(req.target.action === 'destroy') {
      return next();
    } else {
      res.cookie('msg', '管理员请别闹');
      return res.redirect('/');
    }
  } else {
    res.cookie('msg', '请先登录');
    return res.redirect('/login');
  }
};
