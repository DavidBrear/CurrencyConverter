'use strict';

var Currency = require('../models/currencyModel'),
  async = require('async');

module.exports = function (app) {

  var loadCurrencies = function(cb) {
    Currency.find(function(err, currs) {
      if (err) {
        console.log('error getting currencies', err);
        app.redirect('errors/missing_currency');
        return;
      }

      var model = {
        currencies: currs
      };
      cb(currs);
    });

  };

  app.get('/', function(req, res){

    loadCurrencies(function(currs) {
      var model = {
        currencies: currs
      };
      res.render('index', model);
    });
  });
  app.get('/convert', function (req, res) {

    async.waterfall([
      function (cb) {
        Currency.findOne({label: req.query.from}, cb);
      },
      function (from_curr, cb) {
        Currency.findOne({label: req.query.to}, function(err, to_curr){
          cb(err, from_curr, to_curr);
        });
      }
    ],
    function (err, from_curr, to_curr) {
      if (err){
        res.render('errors/bad_input', {bad_input: true});
        return;
      }
      var from_amount = parseFloat(req.query.amount, 10);

      if (isNaN(from_amount)) {
        res.render('errors/bad_input', {amount_nan: true});
        return;
      }
      loadCurrencies(function (currs) {
        var model = {
          currencies: currs,
          from_curr: from_curr,
          to_curr: to_curr,
          from_amount: from_amount.toFixed(2),
          to_amount: from_curr.convert(from_amount, to_curr)
        };
        res.render('convert', model);
      });
    });
  });
};
