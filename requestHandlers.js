var querystring = require("querystring");
var assert = require("assert");
var url = require("url");
var User = require("./model/db.model.js").User;
var crypto = require("crypto");
var Jwt = require("jsonwebtoken");
var config = require("./config.json");
var privateKey = config.privateKey;
var Ajv = require('ajv');
var ajv = new Ajv();
var exist = 0;

function PrintJSON(response, res, code) {
  if (typeof code != "number") {
    var code = 200;
  }
  response.writeHead(code, {
    "Content-Type": "application/json"
  });
  response.write(JSON.stringify(res, null, 2));
  response.end();
}

function Encrypt(password) {
  // Encrypted password
  var hash = crypto.createHash('sha256').update(password).digest('base64');
  return hash;

}

function api(request, response, postData) {
  var query = querystring.parse(url.parse(request.url).query);
  console.log("API Query");
  response.writeHead(200, {
    "Content-Type": "text/html"
  });
  response.write("<p>Hello " + JSON.stringify(query) + "</p>");
  response.end();
}

function IfExist(query) {
  User.get(query, function(err, result) {
    if (err) {
      callback = {
        "error": true,
        "message": result
      };
      return PrintJSON(res, callback, 404);
    } else {
      if (result == null) {
        return exist=0;
      } else {
        return exist=1;
      }
    }
  });
}

function Find(req, res) {
  User.get({
    username: req.query.id
  }, function(err, result) {
    var callback = {};
    if (err) {
      callback = {
        "error": true,
        "message": result
      };
      return PrintJSON(res, callback, 404);
    } else {
      if (result) {
        var userdata = {
          "email": result.email,
          "name": result.name,
          "gender": result.gender,
          "birth": result.birth,
          "type": result.type,
          "created_at": result.created_at,
          "last_at": result.last_at
        };
        callback = {
          "error": false,
          "message": userdata
        };
        return PrintJSON(res, callback, 200);
      } else {
        callback = {
          "error": true,
          "message": "User not found"
        }
      }
      return PrintJSON(res, callback, 404);
    }
  });
}

function login(req, res, postData) {
  var schema = {
    "type": "object",
    "properties": {
      "username": {
        "type": "string"
      },
      "password": {
        "type": "string"
      }
    },
    "required": ["username", "password"],
    "additionalProperties": false
  };
  var callback = {};
  var valid = ajv.validate(schema, postData);
  if (valid) {
    // Input format correct
    User.get({ username: postData.username }, function(err, user) {
      if (err) {
        // Server Error
        callback = {
          "error": true,
          "message": user
        };
        return PrintJSON(res, callback, 500);
      } else if (user == null) {
        // User not found
        callback = {
          "error": true,
          "message": "User isn't existed!"
        };
        return PrintJSON(res, callback, 404);
      } else {
        // Found
        if (user.password === Encrypt(postData.password)) { // password pass
          if (!user.isVerified) {
            // Email not verified
            callback = {
              "error": true,
              "verified": false,
              "message": "Your email address is not verified."
            };
            return PrintJSON(res, callback, 401);
          } else {
            // Everything ok
            var tokenData = {
              username: user.username,
              id: user._id
            };
            var result = {
              username: user.username,
              token: Jwt.sign(tokenData, privateKey)
            };
            return PrintJSON(res, result, 200);
          }
        } else {
          // wrong password
          callback = {
            "error": true,
            "login": false,
            "message": "Login failed!"
          };
          return PrintJSON(res, callback, 403);
        }
      }
    });
  } else {
    // Input format error
    return PrintJSON(res, callback, 401);
  }
}

function users(request, response, postData) {
  var res = {};
  var code = 200;
  var ip = request.headers['x-forwarded-for'] || request.connection.remoteAddress;

  switch (request.method) {
    case "GET":
      Find(request, response);
      break;
    case "POST":
      // add a user
      // Validate Schema
      IfExist({ username: postData.username });
      console.log(exist);
      if (!exist) {
        var schema = {
          "type": "object",
          "properties": {
            "username": {
              "type": "string"
            },
            "email": {
              "format": "email"
            },
            "password": {
              "type": "string"
            },
            "name": {
              "type": "string"
            },
            "gender": {
              "enum": ["male", "female"]
            },
            "birth": {
              "format": "date-time"
            },
            "telephone": {
              "type": "number"
            }
          },
          "required": ["username", "email", "password", "name", "gender", "birth"],
          "additionalProperties": true
        };
        var valid = ajv.validate(schema, postData);
        // True/False
        if (valid) {
          var hash = Encrypt(postData.password);
          // Create a new user
          var user = {
            username: postData.username,
            email: postData.email,
            password: hash,
            name: postData.name,
            gender: postData.gender,
            birth: postData.birth,
            telephone: postData.telephone,
            type: "user",
            isVerified: true,
            created_at: new Date().toISOString(),
            created_ip: ip,
            last_at: new Date().toISOString(),
            last_ip: ip
          };
          User.create(user, function(err, result) {
            // save() will run insert() command of MongoDB.
            // it will add new data in collection.
            console.log("Data Save");
            if (err) {
              res = {
                "error": true,
                "message": "Error adding data"
              };
              code = 500;
            } else {
              res = {
                "error": false,
                "message": "User added"
              };
              code = 201;
            }
            PrintJSON(response, res, code);
          });
        } else {
          console.error(ajv.errors);
          res = {
            "error": true,
            "message": ajv.errors[0].message
          }
          PrintJSON(response, res, 400);
        }
      } else {
        res = {
          "error": true,
          "message": "User has existed"
        };
        PrintJSON(response, res, 401);
      }

      break;
    default:
      res = {
        "error": true,
        "message": "Unknown request"
      };
      PrintJSON(response, res, 400);
  }
}

function Userlogin(req, res, postData) {
  if (req.method === "POST") {
    login(req, res, postData);
  } else {
    var callback = {"error": true, "login": false, "message": "Bad request"};
    return PrintJSON(res, callback, 401);
  }
}

function index(request, response) {
  var res = {};
  res = {
    "error": false,
    "message": "Hello API"
  };
  PrintJSON(response, res);
}

function upload(request, response, postData) {
  console.log("Request handler 'upload' was called.");
  response.writeHead(200, {
    "Content-Type": "text/plain"
  });
  response.write("You've sent: " + querystring.parse(postData).text);
  response.end();
}

exports.api = api;
exports.upload = upload;
exports.index = index;
exports.users = users;
exports.PrintJSON = PrintJSON;
exports.login = Userlogin;
