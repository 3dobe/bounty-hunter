/**
 * Created by Administrator on 14-5-13.
 */
var crypto = require('crypto');

module.exports = function(req, res, next) {
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
        console.log(222);
        req.body['noUser'] = true;
        return next();
      } else {
        //有相应用户时将noUser标识值设为false
        req.body['noUser'] = false;
        req.body['password'] = crypto.createHash('md5')
            .update(req.body['password']).digest('hex');
        if(user.password != req.body['password']) {
          //密码不匹配,添加wrongPw标识值,设为true
          req.body['wrongPw'] = true;
          req.body['encryptPw'] = crypto.createHash('md5')
              .update(req.body['password']).digest('hex');
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
