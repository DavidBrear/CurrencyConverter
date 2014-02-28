'use strict';


var http = require('http');

module.exports = {

  fetch: function(from, to, amount, next) {
    http.get(global.exchangeApi.remoteApi.replace('AMOUNT', amount).replace('FROM', from).replace('TO', to) + global.exchangeApi.key, function(res) {

      var resData = '';
      res.setEncoding('utf8');
      res.on('data', function(data) {
        resData += data
      });
      res.on('end', function() {
        var jsonResponse = JSON.parse(resData);
        if (jsonResponse.error) {
          next(new Error(jsonResponse.description));
          return
        }
        var from_curr = jsonResponse.request.from;
        var to_curr = jsonResponse.request.to;
        var to_amount = jsonResponse.amount;
        next(null, from_curr, to_curr, to_amount);
      });
    }).on('error', function (err) {
      console.log('error:', err);
      next(err);
    });
  }
};
