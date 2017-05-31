var MongoClient = require('mongodb').MongoClient,
  assert = require('assert');
var config = require("../config.json").db;
var options = [{
  roles: [
    "readWrite",
    "userAdminAnyDatabase",
    "readWriteAnyDatabase"
  ],
  w: "majority",
  wtimeout: 5000
}];

MongoClient.connect('mongodb://localhost:27017/' + config.database, function(err, db) {
  // Use the admin database for the operation
  assert.equal(null, err);
  console.log("Connected correctly to server");
  // Add the new user to the admin database
  db.addUser(config.username, config.password, options).then(function(result) {
    // Authenticate using the newly added user
    db.authenticate(config.username, config.password).then(function(result) {
      assert.equal(true,result, "Authenticate Error");
      console.log("Result: " + result + "\n User has been added and authenticated!");
      db.close();
    });
  });
});
