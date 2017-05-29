var querystring = require("querystring");
var assert = require("assert");
var url = require("url");
var mongo = require("./lib/db.model.js");
var crypto = require("crypto");
var Ajv = require('ajv');
var ajv = new Ajv();

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

function Convert(response) {
  try {
    JSON.parse(postData);
    return 1;
  } catch (e) {
    var res = {
      "error": true,
      "message": "Data is not json"
    };
    PrintJSON(response, res, 406);
    return 0;
  }
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

function FindUser(id) {
  var callback = {};
  if (typeof id === "string") {
    mongo.find({ username: id }, function(err, data) {
      if (err) {
        callback = {
          "error": true,
          "message": "Error fetching data"
        };
        code = 500;
      } else {
        data = data[0];
        console.log(typeof data);
        if (typeof data != "undefined") {
          var userdata = {
            "email": data.email,
            "name": data.name,
            "gender": data.gender,
            "birth": data.birth,
            "type": data.type,
            "created_at": data.created_at,
            "last_at": data.last_at
          }
          callback = {
            "error": false,
            "message": userdata
          };
          return callback;
        } else {
          callback = {
            "error": true,
            "message": "User not found"
          };
          code = 404;
        }
      }
      return callback;
    });
  } else {
    callback = {
      "error": true,
      "message": "Error: no id input"
    };
    return callback;
  }
}

function users(request, response, postData) {
  var res = {};
  var code = 200;
  var ip = request.headers['x-forwarded-for'] || request.connection.remoteAddress;

  switch (request.method) {
    case "GET":
      FindUser(request.query.id, function(callback) {
        console.log("PrintJSON");
        PrintJSON(response, callback, code);
      });
      var json = FindUser(request.query.id);
      console.log("Return: " + json);
      console.log("OK");
      //console.log(FindUser(request.query.id));
      //PrintJSON(response, res, code);
      break;
    case "POST":
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
      var valid = ajv.validate(schema, postData);
      // True/False
      if (valid) {
        // Encrypted password
        var hash = crypto.createHash('sha256').update(postData.password).digest('base64');
        // Create a new user
        var user = new mongo({
          username: postData.username,
          email: postData.email,
          password: hash,
          name: postData.name,
          gender: postData.gender,
          birth: postData.birth,
          telephone: postData.telephone,
          type: "user",
          created_at: new Date().toISOString(),
          created_ip: ip,
          last_at: new Date().toISOString(),
          last_ip: ip
        });
        user.save(function(err) {
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
              "message": "Data added"
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
      break;
    default:
      res = {
        "error": true,
        "message": "Unknown request"
      };
      PrintJSON(response, res, 400);
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
