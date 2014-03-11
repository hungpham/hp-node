var http = require('http');
var fs = require('fs');
var request = require('request');
var path = require('path');
var url = require('url');
var flow = require('nimble');
var server = http.createServer();
var pathname, path_file, tasks = [], urls = [], filesIndex = 0;

var requestHandle = function(req, response){
	pathname = url.parse(req.url).pathname;
	path_file = __dirname + pathname;
	
	if(pathname != '/favicon.ico') {
		console.log("__dirname: " + __dirname);	
		console.log("pathname:" + pathname);
		
		fs.readFile(path_file, function(e, data) {
			if(e) {
				response.writeHead(500, {"Content-Type": "text/plain"});
				response.write(e + "\n");
				response.end();
				return;
			} else {
				response.writeHead(200, {});				
				urls = data.toString().split(';');				
				console.log(urls.length); 
				for (index in urls) {	 
					var task = function() {
						var file_url = urls[filesIndex++].replace(/\n$/g, '');						
						var file_name = file_url.substring(file_url.lastIndexOf('/') + 1);
						console.log('\n' + 'start download file: ' + file_name);						
						request.get({url: file_url, encoding: 'binary'}, function (err, response, body) {
						  fs.writeFile('images/' + file_name, body, 'binary', function(err) {
							if(err)
							  console.log(err);
							else
							  console.log(file_name + " was saved!" + '\n');
							  console.timeEnd();
						  }); 
						});
					};
					tasks.push(task);
				};
				console.log(tasks.length);
				flow.series([
					function (callback) {
						console.log("Start flow series !" + '\n');
						console.time();
						callback();
					},
					function (callback) {
						console.log("Start flow parallel download !" + '\n');
						flow.parallel(tasks);
						console.timeEnd();
						callback();
					},
					function (callback) {
						console.log("All files were saved!" + '\n');
						console.timeEnd();
						callback();
					}
				]);
				 
				
		  }
		});
	}
	
	
};
server.on('request', requestHandle);
server.listen(8080);


