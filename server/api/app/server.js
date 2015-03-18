/**
 * server.js
 * @author Antoine De Gieter
 * @copyright Net Production Köbe & Co
 * @digest starts the server and listens on port 8989
 */
var http = require('http');
var url = require('url');

var server = http.createServer(function(req, res) {
	var page = url.parse(req.url).pathname;
	console.log(page);
	res.writeHead(200, {"Content-Type": "application/json"});
	res.end("{}");
});

server.listen(8989);