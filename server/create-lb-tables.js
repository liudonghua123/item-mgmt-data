var server = require('./server');
var ds = server.dataSources.db;
var lbTables = ['Account', 'Item', 'Order'];
ds.automigrate(lbTables, function(err) {
  if (err) throw err;
  console.log('Loopback tables [' - lbTables - '] created in ', ds.adapter.name);
  ds.disconnect();
});
