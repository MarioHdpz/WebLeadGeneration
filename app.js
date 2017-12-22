var google = require('googleapis');
var auth = require('./auth.js');
var crawler = require('./crawler.js');
var _ = require('lodash');
var searchconsole = google.searchconsole('v1');
var http = require("http");

var API_KEY = auth.getApiKey();
//var urls = crawler.getAdUrls(process.argv[2]);
var urls = crawler.getAdUrls('payasos');

urls.then(function (urls) {
    _.forEach(urls, function(value) {
      checkResponsiveness(value).then(function (data) {
        console.log(data);
      });
      //wait(5000);
    });
});

function responsiveFilter(url) {
  return new Promise(function(resolve, reject) {
    searchconsole.urlTestingTools.mobileFriendlyTest.run({
      auth: API_KEY,
      url: 'https://' + url
    },
      function (error,result) {
        if(result != null) {
          resolve(url +' - ' + result.mobileFriendliness);
        } else {
          console.log(url + '- Test error: ' + error);
        }
      }  
    );
  });
}

function wait(ms){
   var start = new Date().getTime();
   var end = start;
   while(end < start + ms) {
     end = new Date().getTime();
  }
}

function checkResponsiveness(url) {
  var self = this,
      all = url.split(/\/(.+)/)
      host = url.split(/\/(.+)/)[0],
      path = url.split(/\/(.+)/)[1];

  host = host.replace('/','');
  console.log(all);
  var options = {
    host: host,
    port: 80,
    path: path,
  };
  var content = "";
  return new Promise(function(resolve, reject) {
    var req = http.request(options, function(response) {
          if (response.statusCode < 200 || response.statusCode > 299) {
            reject(new Error('Failed to load page, status code: ' + response.statusCode));
          }
          response.setEncoding("utf8");
          response.on("data", function (chunk) {
              content += chunk;
            });
          response.on("end", function () {
            usingFrameworks = lookforCssFrameworks(content);
            resolve(usingFrameworks ? 'RESPONSIVE' : 'NOT RESPONSIVE');
          });
        });
    req.end();
  });
}

function lookforCssFrameworks(content) {
  var regex = /bootstrap|materialize/g;
  return regex.test(content) ? true : false; 
}