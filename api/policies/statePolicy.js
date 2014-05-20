/**
 * Created by Administrator on 14-5-5.
 */
module.exports = function(req, res, next) {
  if(req.target.action === 'info') {
    if(req.session['admin']) {
      return res.forbidden('You are not permitted to perform this action.');
    }
    if(req.session['user']) {
      return next();
    }
  }
  if (req.session['admin'] || req.session['user']) {
    return next();
  }
  return res.forbidden('You are not permitted to perform this action.');
};
