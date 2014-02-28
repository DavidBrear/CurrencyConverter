'use strict';

var Currency = require('../models/currencyModel'),
  remoteApi = require('../lib/remoteApi'),
  async = require('async');

module.exports = {

  //convert takes in a from and to currencies as well as a callback and returns the
  //Currency objects from those two currencies.
  // @params:
  //  from: label for the from currency
  //  to: label for the to currency
  //  next: callback to pass the resulting currencies.
  convert: function(from, to, amount, next) {
    if (global.dataLocation === 'remote') {
      remoteApi.fetch(from, to, amount, next);
    } else {
      async.waterfall([
        function (cb) {
          Currency.findOne({label: from}, cb);
        },
        function (from_curr, cb) {
          Currency.findOne({label: to}, function(err, to_curr){
            cb(err, from_curr, to_curr, from_curr.convert(amount, to_curr));
          });
        }
      ],
      next); //tell the result from waterfall to pass its args to the callback sent in.
    }
  }
};
