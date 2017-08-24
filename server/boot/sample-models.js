'use strict';

// see https://github.com/strongloop/loopback-example-access-control/blob/master/server/boot/sample-models.js
module.exports = function(app) {
  var Account = app.models.Account;
  var Item = app.models.Item;

  Account.destroyAll(function (err, info) {
    if (err) throw err;
    console.log('Account.destroyAll success');

    Item.destroyAll(function (err, info) {
      if (err) throw err;
      console.log('Item.destroyAll success');

      Account.create([
        {username: 'ldh1', password: 'ldh1', role: 'user'},
        {username: 'ldh2', password: 'ldh2', role: 'approver'},
        {username: 'ldh3', password: 'ldh3', role: 'sender'},
        {username: 'ldh4', password: 'ldh4', role: 'admin'},
      ], function(err, accounts) {
        if (err) throw err;

        console.log('Created accounts:', accounts);
      });

      Item.create([
        {name: 'item1', description: 'item1', amount: 10, balance: 10},
        {name: 'item2', description: 'item2', amount: 5, balance: 5},
        {name: 'item3', description: 'item3', amount: 3, balance: 3},
        {name: 'item4', description: 'item4', amount: 1, balance: 1},
      ], function(err, accounts) {
        if (err) throw err;

        console.log('Created accounts:', accounts);
      });
    });
  });

};
