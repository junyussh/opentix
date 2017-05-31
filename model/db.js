var MongoClient = require("mongodb").MongoClient,
  f = require("util").format,
  assert = require("assert");
var config = require("../config.json").db;
// Connection URL
var url = f("mongodb://%s:%s@" + config.host + ":" + config.port + "/" + config.database + "?authMechanism=%s",
  config.username, config.password, config.authMechanism);

var connect = MongoClient.connect(url, function(err, db) {
  assert.equal(null, err, "Authenticate failed! Maybe your username or password is wrong.\nIf you haven't added a user for your database, you should add a user to authenticate.\nThere has a dbAddUser.js in the dictionary. \nYou can run the file to add a MongoDB user. \n");
  console.log("Connected correctly to server");
  var collection = db.collection("opentix");
  find();
  db.close();
});
function find() {
  collection.find().toArray(function(err, docs) {
    assert.equal(err, null);
    console.log("Found the following records");
  });
}
/*
MongoClient.connect("mongodb://localhost:27017/opentix", function(err, db) {
  var adminDb = db.admin();
  adminDb.authenticate("junyussh", "j08160816", function(err, result) {
    assert.ok(result);
    console.log("Auth OK!");
  });
  var collection = db.collection("opentix");
  assert.equal(null, err);
  collection.find().toArray(function(err, docs) {
    assert.equal(err, null);
    console.log("Found the following records");
    console.log(docs);
    callback(docs);
  });
  console.log("Connected correctly to server.");
  db.close();
});
*/
