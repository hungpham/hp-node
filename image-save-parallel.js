var http = require('http');
var fs = require('fs');
var request = require('request');
var path = require('path');
var url = require('url');
var flow = require('nimble');
var server = http.createServer();
var util = require('util');

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
				var time_start = process.hrtime();
				console.log("Start time: %d", time_start[0]);
				for (index in urls) {	 
					var task = function(cb) {
						var file_url = urls[filesIndex++].replace(/\n$/g, '');						
						var file_name = file_url.substring(file_url.lastIndexOf('/') + 1);
						console.log('start download file: ' + file_name);						
						request.get({url: file_url, encoding: 'binary'}, function (err, response, body) {
						  fs.writeFile('images/' + file_name, body, 'binary', function(err) {
							if(err)
							  console.log(err);
							else
							  console.log(file_name + " was saved!");
							  cb();
						  }); 
						});
					};
					tasks.push(task);
				};
				console.log(tasks.length);
				flow.series([
					function (callback) {
						console.log("\nStart flow series !" + '\n');
						callback();
					},
					function (callback) {
						console.log("\nStart flow parallel download !" + '\n');
						flow.parallel(tasks,callback);
					},
					function (callback) {
						console.log("\nAll files were saved!");
						callback();
						var time_end = process.hrtime(time_start);
						console.log("Total time: %d seconds", time_end[0]);
						response.end(data.toString());
					}
				]);
				 
				
		  }
		});
	}
	
	
};
server.on('request', requestHandle);
server.listen(8080);


