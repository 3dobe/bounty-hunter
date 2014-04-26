/**
 * Admin
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {
  adapter: 'mysql',
  schema: true,
  tableName : 'admins',
  attributes: {
    id : 'integer',
    username : 'string',
    password : 'string'
  }
};
