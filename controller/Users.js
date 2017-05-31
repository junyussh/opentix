var User = require("../model/db.model.js");

exports.create = function (req, res) {
  User.create()
}
