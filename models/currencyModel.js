'use strict';

var mongoose = require('mongoose');

var CurrencyModel = function() {
  var currencySchema = mongoose.Schema({
    label: String,
    rate: Number,
    symbol: String,
    country: String
  });

  currencySchema.methods.convert = function(amount, to_currency) {
    return (amount * to_currency.rate / this.rate).toFixed(2);
  };

  return mongoose.model('Currency', currencySchema);
};

module.exports = new CurrencyModel();
