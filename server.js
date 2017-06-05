var http = require('http');
var url = require("url");
var querystring = require("querystring");
var config = require("./config.json");
var begin = Date.now();

function start(route, handle) {
  function onRequest(request, response) {
    var postData = "";
    var pathname = url.parse(request.url).pathname;
    console.log("Request for " + pathname + " received.");
    response.setHeader("Access-Control-Allow-Origin", "*");
    request.setEncoding("utf8");
    request.addListener("data", function(postDataChunk) {
      postData += postDataChunk;
      console.log("Received POST data chunk '" +
        postDataChunk + "'.");
    });
    var convert = function() {
      try {
        postData = JSON.parse(postData);
        return 1;
      }
      catch (e) {
        return 0;
      }
    }
    request.addListener("end", function() {
      if (pathname === "/time") {
        var now = Date.now();
        var time = new Date().setTime(now-begin);
        var runtime = (now - begin) / (1000 * 60 * 60 * 24);
        response.writeHead(200, {
          "Content-Type": "text/plain"
        });
        response.write("Server has run for " + time.getMinutes + " Minutes " + time.getSeconds + " Seconds");
        response.end();
      }
      if(convert)
      {
        convert();
        route(handle, pathname, request, response, postData);
      } else {
        handle["PrintJSON"](response,{
          "error": true,
          "message": "Data is not json"
        },406);
      }

    });

  }

  http.createServer(onRequest).listen(config.listen_port);
  console.log("Server has started.");
}

exports.start = start;
