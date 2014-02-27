'use strict';

var Currency = require('../models/currencyModel');

module.exports =  {
  createOrUpdate: function (label, rate) {
    Currency.findOne({label: label}, function (err, curr) {
      if (err) {
        console.log('error', err);
        return;
      }
      if (!curr) {
        console.log('creating new currency', label);
        var newCurrency = new Currency({label: label, rate: rate});
        newCurrency.save();
      } else {
        console.log('updating currency', label);
        curr.update({rate: rate});
      }
    });
  }
};
