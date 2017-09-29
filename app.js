var google = require('googleapis');
var auth = require('./auth.js');

var searchconsole = google.searchconsole('v1');
var customsearch = google.customsearch('v1');

var API_KEY = auth.getApiKey();

/*searchconsole.urlTestingTools.mobileFriendlyTest.run({
  auth: API_KEY,
  url: 'http://www.redmaceta.com'
},
  function functionName(error,result) {
    console.log(result.mobileFriendliness);
  }  
);*/

/*customsearch.cse.list({
    auth: API_KEY,
    q: 'clases de inglés',
    cx: '004560455660358991490:-iqegy_diec'
  }, function functionName(error, result) {
    console.log(error);
    console.log(result.items);
  }
);*/

var util = require("util"),
    http = require("http");

var options = {
    host: "www.google.com.mx",
    port: 80,
    path: "/search?q=mudanzas"
};

var content = "";   

var req = http.request(options, function(res) {
    res.setEncoding("utf8");
    res.on("data", function (chunk) {
        content += chunk;
    });

    res.on("end", function () {
        var fs = require('fs');
        fs.writeFile("./test.txt", content, function(err) {
          if(err) {
              return console.log(err);
          }
          console.log("The file was saved!");
        }); 
    });
});

req.end();