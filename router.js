var url = require('url');
var querystring = require("querystring");
function middleware(req, res) {
  var token = req.body.token || req.query.token || req.headers['x-access-token']
  if (token) {
    jwt.verify(token, app.get('secret'), function (err, decoded) {
      if (err) {
        return handle["PrintJSON"](res,{ error: true, message: 'Failed to authenticate token.' }, 403);
      } else {
        req.decoded = decoded;
      }
    });
  } else {
    return handle["PrintJSON"](res, {
      error: true,
      message: 'No token provided.'
    }, 401);
  }
}
function route(handle, pathname, request, response, postData) {
  //request.pathname = url.parse(request.url, 1).pathname;
  console.log("About to route a request for " + pathname);
  if (typeof handle[pathname] === 'function') {
    request.query = url.parse(request.url, 1).query;
    console.log(handle["middleware"]);
    //middleware(request,response);
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
