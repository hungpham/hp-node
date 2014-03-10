var http = require('http');
var fs = require('fs');
var request = require('request');
var path = require('path');
var url = require('url');
var flow = require('nimble');
var server = http.createServer();
var pathname, path_file;

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
				var urls = data.toString().split(';');				
				
				
				var arrFn = [];
				for (var i = 0; i< urls.length; i++){
					var file_url = urls[i].replace(/\n$/g, '');
					var writeImage = function(file_url){
						var file_name = file_url.substring(file_url.lastIndexOf('/') + 1);
						console.log('\n' + 'start download file: ' + file_name);
						
						request.get({url: file_url, encoding: 'binary'}, function (err, response, body) {
						  fs.writeFile('images/' + file_name, body, 'binary', function(err) {
							if(err)
							  console.log(err);
							else
							  console.log(file_name + " was saved!" + '\n');
							  
						  }); 
						});
					}
					arrFn.push(writeImage(file_url));
				};
				flow.series([
					function (callback){						
						console.time();
					},
					function (callback){
						console.log("All files start download!" + '\n');
						flow.parallel(arrFn);
					},
					function (callback){
						console.log("All files were saved!" + '\n');
					}
				]);
				
		  }
		});
	}
	
	
};
server.on('request', requestHandle);
server.listen(8080);


