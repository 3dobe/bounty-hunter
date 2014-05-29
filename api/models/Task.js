/**
 * Task
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {
  adapter: 'mysql',
  schema: true,
  tableName : 'tasks',
  attributes: {
    title: {
      type: 'string',
      required: true
    },
    descp: {
      type: 'string',
      maxLength: 500,
      required: true
    },
    publisherId: {
      type: 'string',
      required: true
    },
    accepterId: 'string',
    isFinish: {
      type: 'boolean',
      defaultsTo: false
    }
  }
};
