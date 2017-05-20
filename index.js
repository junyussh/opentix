var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");
var config = require("./config.json");
var handle = {}
handle["/"] = requestHandlers.index;
handle["/api"] = requestHandlers.api;
handle["/upload"] = requestHandlers.upload;

server.start(router.route, handle);
