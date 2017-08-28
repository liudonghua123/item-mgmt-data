'use strict';

const debug = require('debug')('app:order');

module.exports = function(Order) {

  // Operation-hooks
  // http://loopback.io/doc/en/lb3/Operation-hooks.html#overview
  // http://apidocs.strongloop.com/loopback/#persistedmodel-updateall
  // Order.observe('before save', function updateItemIfNecessary(ctx, next) {
  //   // instance and data are difference, see http://loopback.io/doc/en/lb3/Operation-hooks.html#hook-and-operation-specific-properties
  //   const instance = ctx.instance ? ctx.instance : ctx.data;
  //   if (instance && instance.isSended) {
  //     const count = instance.count;
  //     const itemId = instance.itemId;
  //     const Item = Order.app.models.Item;
  //     Item.findOne({where: {id: itemId}}, function(err, item) {
  //       if (err) {
  //         console.error(err);
  //         next(err);
  //       }
  //       if (count > item.amount || count > item.balance) {
  //         next(new Error('not enough item avaliable'));
  //       }
  //       debug('update item');
  //       item.balance = item.balance - count;
  //       Item.upsert(item, function(err1, result) {
  //         if (err1) {
  //           console.error(err1);
  //           next(err1);
  //         }
  //         debug('begin update order');
  //         next();
  //       });
  //     });
  //   } else {
  //     next();
  //   }
  // });

  // Remote-hooks
  // http://loopback.io/doc/en/lb3/Remote-hooks.html#examples
  // PATCH->patchOrCreate(an alias for updateOrCreate), PUT->replaceOrCreate
  Order.beforeRemote('**', function(context, modelInstance, next) {
    debug(context.methodString, 'was invoked remotely');
    if (context.methodString.endsWith('OrCreate') || context.methodString.endsWith('patchAttributes')) {
      // check isSended flag
      const isSended = context.req.body.isSended;
      const count = context.req.body.count;
      if (isSended) {
        // check whether enough item avaliable
        const itemId = context.req.body.itemId;
        const Item = Order.app.models.Item;
        Item.findOne({where: {id: itemId}}, function(err, item) {
          if (err) {
            console.error(err);
            next(err);
          }
          if (count > item.amount || count > item.balance) {
            next(new Error('not enough item avaliable'));
          }
          debug('update item');
          item.balance = item.balance - count;

          Item.upsert(item, function(err1, newItem) {
            if (err1) {
              console.error(err1);
              next(err1);
            }
            debug('begin update order');
            next();
          });
        });
      } else {
        next();
      }
    } else {
      next();
    }
  });
};
