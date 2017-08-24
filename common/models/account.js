'use strict';

module.exports = function(Account) {
  Account.login = function(accountInfo, cb) {
    // the accountInfo object is an object like {"username":"ldh1","password":"ldh1"}
    Account.find({where: {username: accountInfo.username, password: accountInfo.password}}, function(err, instances) {
      if (err) throw err;
      console.info(instances);
      if (instances.length) {
        cb(null, {status: 'ok', msg: '', username: instances[0].username, role: instances[0].role});
      }
      else {
        cb(null, {status: 'error', msg: 'account not found', username: '', role: ''});
      }
    });

  };

  Account.remoteMethod('login', {
    accepts: {arg: 'accountInfo', type: 'Object', description: 'account info', http: {source: 'body', verb: 'get'}},
    returns: [{arg: 'status', type: 'string', root: true}, {arg: 'msg', type: 'string', root: true}, {arg: 'username', type: 'string', root: true}, {arg: 'role', type: 'string', root: true}],
  });
};
