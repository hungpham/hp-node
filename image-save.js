var http = require('http');
var fs = require('fs');
var request = require('request');
var path = require('path');
var url = require('url');
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
				var i = 0;
				var file_url = urls[i].replace(/\n$/g, '');				
				console.time();
				function save_callback(){					
					if(i < urls.length - 1) {
						i++;
						writeImage(urls[i], save_callback);
					} else {
						console.timeEnd();
						response.end(data.toString());
					}
				};
				writeImage(file_url, save_callback);
				
				
		  }
		});
	}
	
	
};
server.on('request', requestHandle);
server.listen(8080);

function writeImage(file_url, callback){
	var file_name = file_url.substring(file_url.lastIndexOf('/') + 1);
	console.log('\n' + 'start download file: ' + file_name);
	
	request.get({url: file_url, encoding: 'binary'}, function (err, response, body) {
	  fs.writeFile('images/' + file_name, body, 'binary', function(err) {
		if(err)
		  console.log(err);
		else
		  console.log(file_name + " was saved!" + '\n');
		  
		  callback();
	  }); 
	});
}
