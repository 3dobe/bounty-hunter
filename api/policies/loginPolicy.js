/**
 * Created by Administrator on 14-5-13.
 */
module.exports = function(req, res, next) {
  console.log(000);
  if(req.session['admin'] || req.session['user']) {
    return res.forbidden('你已登录,别闹了');
  }
  if(req.body['option'] === 'admin') {
    return next();
  } else if(req.body['option'] === 'user') {
    User.findOne({
      id : req.body['username']
    }).done(function(err, user) {
      if(err) {
        //错误直接拒绝请求
        return res.forbidden(err.message);
      }
      if(!user) {
        //没有相应用户时向req添加添加noUser标识值,并设为true
        req.body['noUser'] = true;
        return next();
      } else {
        //有相应用户时将noUser标识值设为false
        req.body['noUser'] = false;
        if(user.password !== req.body['password']) {
          //密码不匹配,添加wrongPw标识值,设为true
          req.body['wrongPw'] = true;
          return next();
        } else {
          //密码匹配.直接设值到session,通过请求给controller进行转页
          req.session['user'] = user;
          return next();
        }
      }
    });
  } else {
    console.log(111);
    return res.forbidden('You are not permitted to perform this action.');
  }
};
