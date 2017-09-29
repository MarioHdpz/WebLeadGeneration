var http = require("http");

module.exports = {
  query : "",
  
  getOptions : function () {
    var options = {
        host: "www.google.com.mx",
        port: 80,
        path: "/search?q=" + this.query,
    };
    return options;
  },
  
  getContent : function () {
    var self = this;
    var options = this.getOptions();
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
              content = content.replace(/<b>/g, "");
              content = content.replace(/<\/b>/g, "");
              urls = self.scrapContent(content);
              resolve(urls);
            });
          });
      req.end();
    });
  },
  
  scrapContent : function (content) {
    var regex = /<cite class="_WGk">(.*?)<\/cite>/g,
        result = [],
        m;
    while ((m=regex.exec(content)) !== null) {
      result.push(m[1]);
    }
    return result;    
  },
  
  getAdUrls : function (query) {
    this.query = query.split(' ').join('+');   
    return this.getContent();
  }
};
