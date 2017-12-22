var google = require('googleapis');
var auth = require('./auth.js');
var crawler = require('./crawler.js');
var _ = require('lodash');
var searchconsole = google.searchconsole('v1');
var request = require('request');

var API_KEY = auth.getApiKey();
var urls = crawler.getAdUrls(process.argv[2]);
//var urls = crawler.getAdUrls('mudanzas');


urls.then(function (urls) {
    _.forEach(urls, function(value) {
      responsiveFilter(value).then(function (data) {
        console.log(data);
      });
      wait(5000);
    });
});

function responsiveFilter(url) {
  var regex = /bootstrap|materialize/g;
  return new Promise(function(resolve, reject) {
    url = url.split('/')[0];
    request('http://'+url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
          var result = (regex.exec(body) !== null) ? 'Responsive' : 'Not responsive';
          resolve(url + ' - '+ result);
       }
    })
  });
}

function wait(ms){
   var start = new Date().getTime();
   var end = start;
   while(end < start + ms) {
     end = new Date().getTime();
  }
}

