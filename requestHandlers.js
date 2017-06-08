var querystring = require("querystring");
var assert = require("assert");
var url = require("url");
var User = require("./model/db.model.js").User;
var Ticket = require("./model/db.model.js").Ticket;
var crypto = require("crypto");
var localStorage = require("localStorage");
var Jwt = require("jsonwebtoken");
var config = require("./config.json");
var privateKey = config.privateKey;
var Ajv = require('ajv');
var ajv = new Ajv();
var exist = 0,
  ip;

function PrintJSON(response, res, code) {
  if (typeof code != "number") {
    var code = 200;
  }
  code = 200;
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

function UpdateTime(res, id) {
  var callback = {};
  var query = {
    created_at: new Date().toISOString(),
  };
  User.updateById(id, query, function(err, result) {
    if (err) {
      callback = {
        "error": true,
        "message": "Server Error"
      };
      return PrintJSON(res, callback, 500);
    } else {
      return true;
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
    User.get({
      username: postData.username
    }, function(err, user) {
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
            ip = req.connection.remoteAddress;
            UpdateTime(res, user.id);
            var tokenData = {
              username: user.username,
              email: user.email,
              name: user.name,
              type: user.type
            };
            var result = {
              error: false,
              message: "Enjoy your token!",
              token: Jwt.sign(tokenData, privateKey)
            };
            localStorage.setItem("token", result.token);
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
    callback = {
      "error": true,
      "message": ajv.errors[0].message
    };
    return PrintJSON(res, callback, 401);
  }
}

function AddUser(request, response, postData) {
  // add a user
  // Validate Schema
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
  var valid = ajv.validate(schema, postData); // True/False
  var res = {};
  if (valid) {
    var ip = request.headers['x-forwarded-for'] || request.connection.remoteAddress;
    var hash = Encrypt(postData.password);
    // Create a new user
    var user = {
      username: postData.username,
      email: postData.email,
      password: hash,
      name: postData.name,
      gender: postData.gender,
      birth: new Date(postData.birth).toISOString(),
      telephone: postData.telephone,
      type: "user",
      isVerified: true,
      created_at: new Date().toISOString(),
      last_at: new Date().toISOString(),
    };
    User.get({
      username: postData.username
    }, function(err, result) {
      if (err) {
        res = {
          "error": true,
          "message": result
        };
        return PrintJSON(response, res, 500);
      } else {
        if (result) {
          res = {
            "error": true,
            "message": "User has existed"
          };
          return PrintJSON(response, res, 401);
        } else {
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
            return PrintJSON(response, res, code);
          });
        }
      }
    });
  } else {
    console.error(ajv.errors);
    res = {
      "error": true,
      "message": ajv.errors[0].message
    }
    return PrintJSON(response, res, 400);
  }
}

function users(request, response, postData) {
  var res = {};
  var code = 200;
  var token = localStorage.getItem("token");

  switch (request.method) {
    case "GET":
      if (typeof request.query.id === "undefined") {
        res = {
          "error": true,
          "message": "Bad request"
        };
        return PrintJSON(response, res, 401);
      } else {
        Find(request, response);
      }
      break;
    case "POST":
      if (token) {
        res = {
          "error": true,
          "message": "You've logged in"
        };
        return PrintJSON(response, res, 400);
      } else {
        return AddUser(request, response, postData);
      }
      break;
    default:
      res = {
        "error": true,
        "message": "Unknown request"
      };
      return PrintJSON(response, res, 400);
  }
}
function GetTicket(req, res) {
  var callback = {};
  Ticket.getAll({_id: req.query.id}, function (err, data) {
    if (err) {
      callback = {error: true, "message": "Ground Control to Major Tom. Your circuit's dead, there's something wrong."};
      return PrintJSON(res, callback);
    } else {
      var token = localStorage.getItem("token");
      var decoded = Jwt.verify(token, privateKey);
      if (decoded.types === "admin") {
        callback = {"error": false, "message": data};
      } else {
        delete data.order;
        callback = {"error": false, "message": data};
      }
      return PrintJSON(res, callback);
    }
  })
}
function AddTicket(req, res, postData) {
  var infoshema = {
    "type": "object",
    "properties": {
      "name": {
        "type": "string",
        "maxLength": 32
      },
      "description": {
        "type": "string"
      },
      "location": {
        "type": "string"
      },
      "start_at": {
        "format": "date-time",
        "formatMaximum": "2017-06-08T10:56:39.745Z",
        "formatExclusiveMaximum": false
      },
      "end_at": {
        "format": "date-time",
        "formatMinimum": new Date(postData.start_at).toISOString(),
        "formatExclusiveMinimum": true
      },
      "from": {
        "format": "date-time",
        "formatMinimum": new Date().toISOString(),
        "formatExclusiveMinimum": false
      },
      "to": {
        "format": "date-time",
        "formatMinimum": new Date(postData.end_at).toISOString(),
        "formatExclusiveMinimum": true
      },
      "types": {"type": "object"},
      "fields": {"type": "object"}
    },
    "required": ["name", "description", "location", "start_at", "end_at", "from", "to"]
  }
  var infovaild = ajv.validate(infoshema, postData);
  var callback = {};
  if (infovaild) {
    if (new Date() - postData.start_at) {
      console.log("active");
      postData.status = "active";
    } else {
      postData.status = "pending"
    }
    console.log(postData);
    Ticket.add(postData, function (err, result) {
        if (err) {
          callback = {"error": true, "message": result}
          return PrintJSON(res, callback);
        } else {
          callback = {"error": false, "added": true}
          return PrintJSON(res, callback);
        }
    });
  } else {
    callback = {"error": true, "message": ajv.errors};
    return PrintJSON(res, callback);
  }
}
function DeleteTicket(res,postData) {
  var schema = {
    "type": "object",
    "properties": {
      "_id": {"type": "string"},
      "password": {"type": "string"}
    },
    "required": ["_id", "password"]
  }
  var valid = ajv.validate(schema, postData);
  var callback = {};
  if (valid) {
    var token = localStorage.getItem("token");
    Jwt.verify(token, privateKey, function (err, decoded) {
      if (err) {
        callback = {"error": true, "message": "Failed to authenticate token."};
        return PrintJSON(res, callback);
      } else {
        User.get({username: decoded.username, password: postData.password}, function (err, data) {
          if (err) {
            callback = {"error": true, "message": "Server went wrong"}
            return PrintJSON(res, callback);
          } else {
            Ticket.delete({_id: postData._id, username: decoded.username}, function (err, result) {
              if (err) {
                callback = {"error": true, "message": "Server went wrong"};
                return PrintJSON(res, callback);
              } else {
                if (result.n) {
                  callback = {"error": false, "message": result};
                } else {
                  callback = {"error": true, "message": result};
                }
                return PrintJSON(res, callback);
              }
            });
          }
        })
      }
    });
  } else {
    callback = {"error": "true", "message": ajv.errors};
    return PrintJSON(res, callback);
  }
}
function ticket(req, res, postData) {
  var callback = {};
  switch (req.method) {
    case "GET":
    if (typeof req.query.id === "undefined") {
      callback = {
        "error": true,
        "message": "Bad request"
      };
      return PrintJSON(res, callback);
    } else {
      return GetTicket(req, res);
    }
      break;
    case "POST":
    // add a ticket
    var token = localStorage.getItem("token");
    Jwt.verify(token, privateKey, function (err, decoded) {
      if (err) {
        callback = {
          error: true,
          message: 'Failed to authenticate token.'
        }
        return PrintJSON(res, callback);
      } else if(decoded.type === "admin"){
        postData.username = decoded.username;
        return AddTicket(req, res, postData);
      } else {
        callback = {"error": true, "admin": false, "message": "Permission denied"};
        return PrintJSON(res, callback);
      }
    });
      break;
      case "DELETE":
      // delete a ticket
      var token = localStorage.getItem("token");
      Jwt.verify(token, privateKey, function (err, decoded) {
        if (err) {
          callback = {
            error: true,
            message: 'Failed to authenticate token.'
          }
          return PrintJSON(res, callback);
        } else if(decoded.type === "admin"){
          return DeleteTicket(res, postData);
        } else {
          callback = {"error": true, "admin": false, "message": "Permission denied"};
          return PrintJSON(res, callback);
        }
      });
        break;
    default:
      callback = {
        "message": "Hello this is ticket"
      };
      return PrintJSON(res, callback);
  }
}

function Userlogin(req, res, postData) {
  var callback = {};
  var token = localStorage.getItem("token");
  if (req.method === "POST") {
    console.log(token);
    if (token === null) {
      login(req, res, postData);
    } else {
      callback = {
        "error": true,
        "login": true,
        "message": "You've logged in."
      };
      return PrintJSON(res, callback, 401);
    }
  } else {
    callback = {
      "error": true,
      "login": false,
      "message": "Bad request"
    };
    return PrintJSON(res, callback, 401);
  }
}

function logout(req, res) {
  var callback = {};
  var token = localStorage.getItem("token");
  if (token) {
    localStorage.clear();
    callback = {
      "error": false,
      "login": false,
      "message": "You've logged out"
    }
    return PrintJSON(res, callback, 200);
  } else {
    callback = {
      "error": true,
      "login": false,
      "message": "Token doesn't exist"
    }
    return PrintJSON(res, callback, 404);
  }
}

function index(request, response) {
  var res = {};
  if (token) {
    Jwt.verify(token, privateKey, function(err, decoded) {
      if (err) {
        res = {
          "error": false,
          "message": "Failed to authenticate token."
        };
      } else {
        request.decoded = decoded;
        res = {
          error: false,
          message: "No token provided."
        };
      }
      return PrintJSON(response, res);
    });
  } else {
    res = {
      "error": false,
      "message": "Hello API"
    };
  }
  return PrintJSON(response, res);
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
exports.logout = logout;
exports.ticket = ticket;
