var http = require('http');
var fs = require('fs');
var request = require('request');
var path = require('path');
var url = require('url');
var server = http.createServer();
var pathname, path_file;

var urls, file_index, file_url, time_start, time_end;
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
				file_index = 0;
				file_url = urls[file_index].replace(/\n$/g, '');				
				time_start = process.hrtime();
				console.log("Start time: %d", time_start[0]);
				console.log("\nStart flow series !" + '\n');
				
				writeImage(file_url, save_callback);
				response.end(data.toString());
				
		  }
		});
	}
	
	
};
server.on('request', requestHandle);
server.listen(8088);

function writeImage(file_url, callback){
	var file_name = file_url.substring(file_url.lastIndexOf('/') + 1);
	console.log('\nstart download file: ' + file_name);
	
	request.get({url: file_url, encoding: 'binary'}, function (err, response, body) {
	  fs.writeFile('images/' + file_name, body, 'binary', function(err) {
		if(err)
		  console.log(err);
		else
		  console.log(file_name + " was saved!");
		  
		  callback();
	  }); 
	});
}


function save_callback(){					
	if(file_index < urls.length - 1) {
		file_index++;
		writeImage(urls[file_index], save_callback);
	} else {
		console.log("\nAll files were saved!");
		time_end = process.hrtime(time_start);
		console.log("Total time: %d seconds", time_end[0]);
		
	}
};