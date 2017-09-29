var google = require('googleapis');
var auth = require('./auth.js');
var crawler = require('./crawler.js');
var _ = require('lodash');
var searchconsole = google.searchconsole('v1');

var API_KEY = auth.getApiKey();
var urls = crawler.getAdUrls(process.argv[2]);

urls.then(function (urls) {
    _.forEach(urls, function(value) {
      responsiveFilter(value).then(function (data) {
        console.log(data);
      });
      wait(5000);
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

