var url = require('url');
var querystring = require("querystring");
var localStorage = require("localStorage");
var jwt = require("jsonwebtoken");
var config = require("./config.json");
function middleware(callback) {
  var token = localStorage.getItem("token");
  var res = {}, err;
function middleware(req, res) {
  var token = localStorage.getItem("token");
  var callback = {};
  if (token) {
    jwt.verify(token, config.privateKey, function (err, decoded) {
      if (err) {
        console.log("error");
        err = {error: true, message: 'Failed to authenticate token.'};
      } else {
        res = decoded;
      }
    });
  } else {
    err = {
      error: true,
      message: 'No token provided.'
    };
        callback = {error: true, message: 'Failed to authenticate token.'}
        return callback;
      } else {
        console.log("verify");
        console.log("decode:"+JSON.stringify(decoded));
        return decoded;
      }
    });
  } else {
    callback = {
      error: true,
      message: 'No token provided.'
    };
    return callback;
  }
  callback(err, res);
}
function route(handle, pathname, request, response, postData) {
  //request.pathname = url.parse(request.url, 1).pathname;
  console.log("About to route a request for " + pathname);
  if (typeof handle[pathname] === 'function') {
    request.query = url.parse(request.url, 1).query;
    console.log(handle["middleware"]);
    //middleware(request,response);
    if (typeof handle["middleware"][pathname] != "undefined") {
      if (typeof handle["middleware"][pathname][request.method] === "boolean" && handle["middleware"][pathname][request.method] === true) {
        /*
	      if (middleware(request, response) && middleware(request, response).error != true) {
        console.log(middleware(request, response));
        if (middleware(request, response) && middleware(request, response).error != true) {
          console.log(middleware(request, response));
          handle[pathname](request, response, postData);
        } else {
          return handle["PrintJSON"](response, middleware(request, response));
        }
	      */
	      middleware(function (data) {
		      if (data && data.error != true) {
			      handle[pathname](request, response, postData);
		      } else {
			      return handle["PrintJSON"](request, response, postData);
		      }
	      }
      } else {
        handle[pathname](request, response, postData);
      }
    } else {
      handle[pathname](request, response, postData);
    }
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
