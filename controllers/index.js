'use strict';

var Currency = require('../models/currencyModel'),
  filters = require('../lib/filters'),
  Converter = require('../lib/converter');

module.exports = function (app) {


  app.get('/', function(req, res){

    filters.loadCurrencies(function(err, currs) {
      if (err) {
        res.redirect('errors/missing_currency');
      }
      var model = {
        currencies: currs
      };
      res.render('index', model);
    });
  });
  app.get('/convert', function (req, res) {

    Converter.convert(req.query.from, req.query.to, req.query.amount, function (err, from_curr, to_curr, to_amount) {
      if (err){
        res.render('errors/bad_input', {bad_input: true});
        return;
      }
      var from_amount = parseFloat(req.query.amount, 10);

      if (isNaN(from_amount)) {
        res.render('errors/bad_input', {amount_nan: true});
        return;
      }
      filters.loadCurrencies(function (err, currs) {
        if (err) {
          res.redirect('errors/missing_currency');
        }
        var model = {
          currencies: currs,
          from_curr: from_curr,
          to_curr: to_curr,
          from_amount: from_amount.toFixed(2),
          to_amount: to_amount
        };
        res.render('convert', model);
      });
    });
  });
};
