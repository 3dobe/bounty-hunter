/**
 * Created by Administrator on 14-5-5.
 */
module.exports = function(req, res, next) {
  if(req.target.action === 'modiInfo') {
    if(req.session['admin']) {
      res.cookie('msg', '别闹了,管理员先生');
      return res.redirect('/');
    }
    if(req.session['user']) {
      return next();
    }
  }
  if (req.session['admin'] || req.session['user']) {
    return next();
  }
  res.cookie('msg', '操作出错');
  return res.redirect('/');
};
