/**
 * Created by Administrator on 14-5-13.
 */
var crypto = require('crypto');

module.exports = function(req, res, next) {
  if(req.session['admin'] || req.session['user']) {
    res.cookie('msg', '你已登录,别闹了');
    return res.redirect('/');
  }
  if(req.body['option'] === 'admin') {
    return next();
  } else if(req.body['option'] === 'user') {
    User.findOne({
      id : req.body['username']
    }).done(function(err, user) {
      if(err) {
        //错误直接拒绝请求
        res.cookie('msg', err.message);
        return res.redirect('/login');
      }
      if(!user) {
        //没有相应用户时向req添加添加noUser标识值,并设为true
        req.body['noUser'] = true;
        return next();
      } else {
        //有相应用户时将noUser标识值设为false
        req.body['noUser'] = false;
        var password = crypto.createHash('md5')
            .update(req.body['password']).digest('hex');
        if(user.password != password) {
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
    res.cookie('msg', '操作出错');
    return res.redirect('/login');
  }
};
