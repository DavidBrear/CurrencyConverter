'use strict';

var Currency = require('../models/currencyModel');

module.exports = {


  //loadCurrencies is a helper method to load all the currencies on each page.
  //This allows us to show all the currencies on the index and convert pages.
  loadCurrencies: function(cb) {
    Currency.find({}, null, {sort: {label: 1}}, function(err, currs) {
      if (err) {
        console.log('error getting currencies', err);
        cb(new Error('Error loading the currencies'));
        return;
      }
      var model = {
        currencies: currs
      };
      cb(null, currs);
    });
  }
};
