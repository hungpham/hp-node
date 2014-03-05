var http = require('http');
var fs = require('fs');
var path = require('path');
var url = require('url');
var server = http.createServer();
var pathname, path_file;

var requestHandle = function(request, response){
	pathname = url.parse(request.url).pathname;
	console.log("__dirname: " + __dirname);
	
	console.log("request.url:" + request.url);
	console.log("pathname:" + pathname);
	path_file = __dirname + pathname;
	if(pathname != '/favicon.ico') {
		path.exists(path_file, function(exists){
			if(!exists) {
				response.writeHead(404, {"Content-Type": "text/plain"});
				response.write("404 Not Found\n");
				response.end();
				return;
			}
		});
		fs.readFile(path_file, function(e, data) {
			if(e) {
				response.writeHead(500, {"Content-Type": "text/plain"});
				response.write(e + "\n");
				response.end();
				return;
			} else {
				response.writeHead(200, {});
				console.log('file string start ............\n' + data.toString());
				response.end(data.toString());
				console.log('\n............file string end ');
		  }
		});
	}
	
	
};
server.on('request', requestHandle);
server.listen(8080);
