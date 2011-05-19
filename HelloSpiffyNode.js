    var sys = require("sys"),  
        http = require("http"),  
        url = require("url"),  
        path = require("path"),  
        fs = require("fs");  
      
    http.createServer(function(request, response) {  
        var uri = url.parse(request.url).pathname;
//        sys.puts("uri = " + uri);
        
        //process.cwd() gets the current working directory
        var filename = path.join(process.cwd() + "/target/www", uri);  
        path.exists(filename, function(exists) {  
            if(!exists) {  
                //this might be the REST call!
                if (uri.indexOf("/simple/") == 0) {            
                	var user = uri.substring(8);
                    var userAgent = request.headers['user-agent'];
                    var payload = {user: user, userAgent: userAgent, serverInfo: "Node.js"};                                        
                    response.writeHeader(200, {"Content-Type": "application/json"});  
                    response.end(JSON.stringify(payload));  
                    return;
                } else {            
                    response.writeHeader(404, {"Content-Type": "text/plain"});  
                    response.end("404 Not Found\n"); 
                    return;
                }
            }  
            //serve up the static file that is in /target/www
            fs.readFile(filename, "binary", function(err, file) {  
                if(err) {  
                    response.writeHeader(500, {"Content-Type": "text/plain"});  
                    response.end(err + "\n");  
                    return;  
                }  
      
                response.writeHeader(200);  
                response.write(file, "binary");  
                response.end();  
            });  
        });  
    }).listen(8181);  
    
    sys.puts("========================================================================");
    sys.puts("");
    sys.puts("Access Hello Spiffy Node at http://localhost:8181/index.html");
    sys.puts("");
    sys.puts("========================================================================");
