/**
 * Created by Administrator on 14-5-5.
 */
module.exports = function(req, res, next) {
  console.log('登出测试');
  if (req.session['admin'] || req.session['user']) {
    return next();
  }
  return res.forbidden('You are not permitted to perform this action.');
};
