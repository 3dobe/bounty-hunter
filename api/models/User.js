/**
 * User
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  adapter: 'mysql',
  schema: true,
  tableName : 'users',
  attributes: {
    id : 'string',
    password : 'string',
    name : 'string',
    nickname: {
      type : 'string',
      maxLength : '20',
      minLength : '5'
    },
    gender : 'string',
    class : 'string',
    dataInSchool : 'DATE',
    dormNo : 'string',
    email: {
      type : 'email',
      required : true
    },
    phone: {
      type : 'string',
      required : true
    }
  }
};
