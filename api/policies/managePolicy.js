module.exports = function(req, res, next) {
  if(!req.session['admin']) {
    res.cookie('msg', '超级管理员请登录');
    return res.redirect('/login');
  } else if(!req.session['admin'].isSuper){
    res.cookie('msg', '你权限不够喔');
    return res.redirect('/');
  } else {
    return next();
  }
};