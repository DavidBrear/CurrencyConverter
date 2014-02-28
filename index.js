'use strict';


var kraken = require('kraken-js'),
    db = require('./lib/database'),
    express = require('express'),
    http = require('http'),
    Currency = require('./models/currencyModel'),
    currencyAdder = require('./lib/currencyAdder'),
    app = {};

app.configure = function configure(nconf, next) {
  db.config(nconf.get('databaseConfig'));

  global.dataLocation = nconf.get('dataLocation');
  global.exchangeApi = nconf.get('exchangeApi');

  //probably want to put this in a background job but for now lets put it here.
  http.get(nconf.get('exchangeApi').url + nconf.get('exchangeApi').key, function (res) {

    var ratesData = '';
    res.setEncoding('utf8');
    res.on('data', function(data) {
      ratesData += data
    });
    res.on('end', function() {
      var rateJson = JSON.parse(ratesData);
      var rates = rateJson.rates
      for (var rate in rates) {
        console.log('rate', rate);
        currencyAdder.createOrUpdate(rate, rates[rate]);
      }
      next(null);
    });
  }).on('error', function (err) {
    console.log('error:', err);
    next(err);
  });
};


app.requestStart = function requestStart(server) {
  // Run before most express middleware has been registered.
};


app.requestBeforeRoute = function requestBeforeRoute(server) {
  // use methodOverride so we can send PUT and DELETE http commands.
  server.use(express.methodOverride());
};


app.requestAfterRoute = function requestAfterRoute(server) {
    // Run after all routes have been added.
};


if (require.main === module) {
  kraken.create(app).listen(function (err) {
    if (err) {
      console.error(err.stack);
    }
  });
}


module.exports = app;
