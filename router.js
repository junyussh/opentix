const url = require('url');
function route(handle, pathname, request, response, postData) {
  console.log("About to route a request for " + pathname);
  if (typeof handle[pathname] === 'function') {
    request.query = url.parse(request.url, 1).query;
    handle[pathname](request, response, postData);
  } else {
    if (pathname != "/time") {
      console.log("No request handler found for " + pathname);
      response.writeHead(404, {"Content-Type": "text/plain"});
      response.write("404 Not found");
      response.end();
    }
  }
}

exports.route = route;
