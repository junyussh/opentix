var mongoose = require('mongoose');
var Schema = mongoose.Schema;
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
    isVerified: Boolean,
    created_at: Date,
    created_ip: String,
    last_at: Date,
    last_ip: String,
    ticket: Schema.Types.Mixed
  });
  UserSchema.statics = {
    get: function (query, callback) {
      this.findOne(query, callback);
    },
    getAll: function(query, callback) {
        this.find(query, callback);
    },

    /**
      updatecompany. return the create company object result.
      @param updateData: updateData is use to update company w.r.t id.
      @param callback: callback of this form.
    */
    updateById: function(id, updateData, callback) {
        this.update(id, {$set: updateData}, callback);
    },
    removeById: function(removeData, callback) {
        this.remove(removeData, callback);
    },
    create: function(data, callback) {
        var user = new this(data);
        user.save(callback);
    }
  }
  var User = mongoose.model("User", UserSchema);

var TicketSchema = new Schema({
  "_id": Number,
  "name": String,
  "start": Date,
  "end": Date,
  "info": {
    "time": Date,
    "location": String
  },
  "field": Schema.Types.Mixed,
  "type": Schema.Types.Mixed
});
module.exports = {
  User: User
};
