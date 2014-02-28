'use strict';

var sinon = require('sinon'),
  assert = require('assert'),
  Currency = require('../models/currencyModel'),
  sinon = require('sinon'),
  Converter = require('../lib/converter');

describe('Converter', function() {

  Currency.findOne = function(options, callback) {
    callback(null, { label: 'USD', rate: 1, convert: function(amount, to_curr) { return 3; }} );
  };

  it('should convert correctly from USD to GBP ', function (done) {
    Converter.convert('USD', 'GBP', 5, function(err, from, to, amount) {
      done(assert(amount === 3));
    });
  });
});
