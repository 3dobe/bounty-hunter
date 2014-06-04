/**
 * User
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */
var crypto = require('crypto');

module.exports = {

  adapter: 'mysql',
  schema: true,
  tableName : 'users',
  attributes: {
    id : 'string',
    password : 'string',
    name : 'string',
    gender : 'string',
    class : 'string',
    dormNo : 'string',
    email: 'email',
    phone:  'string',
    condition: {
      type: 'boolean',
      defaultsTo: false
    }//用于检测用户是否完善个人信息
  },

  beforeCreate: function(user, next) {
    str = user.password;
    user.password = crypto.createHash('md5')
        .update(str).digest('hex');
    next();
  }
};
