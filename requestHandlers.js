var querystring = require("querystring");
var assert = require("assert");
var url = require("url");
var mongo = require("./lib/db.model.js");
var crypto = require("crypto");

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

function users(request, response, postData) {
  var res = {};
  var code = 200;
  var ip = request.headers['x-forwarded-for'] || request.connection.remoteAddress;

  switch (request.method) {
    case "GET":
      mongo.find({}, function(err, data) {
        if (err) {
          res = {
            "error": true,
            "message": "Error fetching data"
          };
          code = 500;
        } else {
          res = {
            "error": false,
            "message": data
          };
        }
        PrintJSON(response, res, code);
      });
      break;
    case "POST":
      if (typeof postData.password === "string") {
        var hash = crypto.createHash('sha256').update(postData.password).digest('base64');
        var error = mongo.validateSync();
        console.log(error.errors['birth'].message);
        assert.equal(error.errors['birth'].message,
          'field `name` is required.')
        var user = new mongo({
          email: postData.email,
          password: hash,
          name: postData.name,
          gender: postData.gender,
          birth: postData.birth,
          telephone: postData.telephone,
          type: "user",
          register_date: new Date().toISOString(),
          register_ip: ip,
          last_date: new Date().toISOString(),
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
        res = {
          "error": true,
          "message": "No data post"
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
