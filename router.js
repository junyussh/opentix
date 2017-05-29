var url = require('url');
var querystring = require("querystring");
function route(handle, pathname, request, response, postData) {
  //request.pathname = url.parse(request.url, 1).pathname;
  console.log("About to route a request for " + pathname);
  if (typeof handle[pathname] === 'function') {
    request.query = url.parse(request.url, 1).query;
    handle[pathname](request, response, postData);
  } else {
    if (pathname != "/time") {
      console.log("No request handler found for " + pathname);
      response.writeHead(404, {"Content-Type": "text/json"});
      response.write(JSON.stringify({ error: true, message: "404 Not found"}, null, 2));
      response.end();
    }
  }
}

exports.route = route;
