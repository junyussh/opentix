var querystring = require("querystring"),
    url = require("url");

function api(request, response, postData) {
  var query = querystring.parse(url.parse(request.url).query);
  console.log("API Query");
  response.writeHead(200, {"Content-Type": "text/html"});
  response.write("<p>Hello "+JSON.stringify(query)+"</p>");
  response.end();
}
function index(request, response) {
  response.writeHead(200, {"Content-Type": "text/html"});
  response.write("<p>Bad Request</p>");
  response.end();
}
function upload(request, response, postData) {
  console.log("Request handler 'upload' was called.");
  response.writeHead(200, {"Content-Type": "text/plain"});
  response.write("You've sent: " + querystring.parse(postData).text);
  response.end();
}

exports.api = api;
exports.upload = upload;
exports.index = index;
