var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");
var config = require("./config.json");
var runtime = new Date();
var auth = { // if middleware
	"/ticket": {
		"GET": false,
		"POST": false
	}
};
var handle = {}
handle["/"] = requestHandlers.index;
handle["/api"] = requestHandlers.api;
handle["/upload"] = requestHandlers.upload;
handle["/users"] = requestHandlers.users;
handle["PrintJSON"] = requestHandlers.PrintJSON;
handle["/login"] = requestHandlers.login;
handle["/logout"] = requestHandlers.logout;
handle["/ticket"] =  requestHandlers.ticket;
handle["middleware"] = auth;

server.start(router.route, handle);
