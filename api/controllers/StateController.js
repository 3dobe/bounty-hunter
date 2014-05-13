/**
 * StateController
 *
 * @module      :: Controller
 * @description    :: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

var Client = require('../../assets/js/client');
var parseProfile = require('../../assets/js/parseProfile');
var async = require('async');
module.exports = {
  //登陆操作
  login: function (req, res) {
    console.log(111111);
    //1 获取参数前端
    var option = req.body['option'];

    //2判断为admin登陆 还是 普通用户登陆
    if (option === 'admin') {
      //3 如admin登陆,直接获取数据库数据进行比较
      //3.1 匹配信息成功,把admin信息保存到session中
      //3.2 匹配信息失败,返回错误信息,转页
      Admin.findOne({
        username: req.body['username']
      }).done(function (err, admin) {
        console.log(admin);
        if (err) {
          console.log(err);
          return res.redirect('/login');
        }
        if (!admin) {
          //登陆信息错误处理
          return res.redirect('/login');
        } else {
          //密码错误处理
          if (admin.password === req.body['password']) {
            //用户状态保存
            req.session['admin'] = admin;
            console.log(admin);
            return res.redirect('/');
          } else {
            return res.redirect('/login');
          }
        }
      });
    }

    if (option === 'user') {
      //4 如是普通用户登陆
      var data = {
        UserCode: req.body['username'],
        UserPwd: req.body['password']
      };

      //如果已经匹配成功,直接转页
      if(req.session['user']) {
        //直接转页
        return res.redirect('/');
      }

      //数据库中没有相应用户
      if(req.body['noUser']) {
        //4.2 数据中没有相应记录,则发送请求道学生服务子系统进行抓取,;
        var client = new Client('jwc.wyu.cn', '/student', 'gbk');
        async.waterfall([
          function(next) {
            client.get('/createsession_a.asp', {}, {}, next(null));
          }, function(next) {
            client.get('/createsession_b.asp', {}, {}, next(null));
          }, function(next) {
            client.get('/rndnum.asp', {}, {}, next(null));
          }, function(next) {
            client.cookie['LogonNumber'] = '';
            client.post('/logon.asp', data, {
              Referer: 'http://jwc.wyu.cn/student/body.htm'
            }, function (err, res, body) {
              if(err) {
                next(new Error('登陆出错'));
              } else {
                next(null, res, body);
              }
            });
          }, function(res, body, next) {
            var success = /welcome/.test(body);
            if (success) {
              client.get('/f1.asp', {}, {}, function (err, res, body) {
                try {
                  //4.2.1 抓取成功,保存数据到数据库,保存用户信息到session,转页
                  var profile = parseProfile(body);
                  User.create({
                    id: profile.code,
                    password: data.UserPwd,
                    name: profile.name,
                    gender: profile.sex,
                    class: profile.class,
                    dormNo: profile.dormitory,
                    condition: false
                  }).done(function(err, user) {
                        if (err) {
                          console.log(err);
                          next(new Error('新增数据出错'));
                        }else {
                          console.log("User created:", user);
                          next(null, user);
                        }
                      });
                } catch (err) {
                  //4.2.2 抓取失败 返回错误信息,转页
                  console.log(err);
                  next(new Error('资料加载失败'));
                }
              });
            } else {
              next(new Error('登陆出错'));
            }
          }
        ], function(err, user) {
          if(err) {
            console.log(err);
            return res.redirect('/');
          } else {
            req.session['user'] = user;
            return res.redirect('/');
          }
        });
      }

      //密码不匹配
      if(!req.body['noUser'] && req.body['wrongPw']) {
        //4.1.1 如密码不匹配,则发送请求到学生服务子系统进行抓取,
        var client = new Client('jwc.wyu.cn', '/student', 'gbk');
        async.waterfall([
          function(next) {
            client.get('/createsession_a.asp', {}, {}, next(null));
          }, function(next) {
            client.get('/createsession_b.asp', {}, {}, next(null));
          }, function(next) {
            client.get('/rndnum.asp', {}, {}, next(null));
          }, function(next) {
            client.cookie['LogonNumber'] = '';
            client.post('/logon.asp', data, {
              Referer: 'http://jwc.wyu.cn/student/body.htm'
            }, function (err, res, body) {
              if(err) {
                next(new Error('登陆出错'));
              } else {
                next(null, res, body);
              }
            });
          }, function(res, body, next) {
            console.log(body);
            var success = /welcome/.test(body);
            if (success) {
              //4.1.1.1 抓取成功,更新数据到数据库,保存用户信息到session,转页
              user.password = data.UserPwd;
              user.save(function(err) {
                if(err) {
                  console.log(err);
                  next(new Error("更新出错"));
                } else {
                  console.log(user);
                  next(null, user);
                }
              });
            } else {
              next(new Error('密码错误'));
            }
          }
        ], function(err, user) {
          if(err) {
            console.log(err);
            return res.redirect('/');
          } else {
            req.session['user'] = user;
            return res.redirect('/');
          }
        });
      }
    }
  },

  //登出操作
  logout: function (req, res) {
    if(req.session['admin']) {
      delete req.session['admin'];
    } else if(req.session['user']) {
      delete req.session['user'];
    }
    return res.redirect('/');
  }
};
