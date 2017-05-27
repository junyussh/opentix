var mongoose = require('mongoose');
var f = require("util").format;
var config = require("../config.json").db;
var url = f("mongodb://%s:%s@" + config.host + ":" + config.port + "/" + config.database + "?authMechanism=%s",
  config.username, config.password, config.authMechanism);

mongoose.Promise = global.Promise;
mongoose.connect(url);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log("Database connected. ");
});
var UserSchema = new mongoose.Schema({
  username: {type: String, required: true},
  email: {type: String, required: true},
  password: {type: String, required: true},
  name: {type: String, required: true},
  gender: {type: String, required: true},
  birth: {type: Date, required: true},
  telephone: Number,
  type: String,
  register_date: Date,
  register_ip: String,
  last_date: Date,
  last_ip: String
});

var User = mongoose.model("User", UserSchema);
module.exports = User;
