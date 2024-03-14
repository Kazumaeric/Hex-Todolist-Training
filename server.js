const http = require('http');
const { v4: uuidv4 } = require('uuid');
const { errHandle, errNotFound } = require('./errorHandle');
const todos = []

const requestListener = (req, res) => {
    const headers = {
        "Access-Control-Allow-Headers": "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "PATCH, OPTIONS, POST, GET, DELETE",
        "Content-Type": "application/json"
    }

    let body = "";

    req.on('data', (chunk) => {
        body += chunk;
    });

    // console.log("URL", req.url);
    // console.log("Method", req.method);

    if(req.url == "/todos" && req.method == "GET"){
        res.writeHead(200, headers);
        res.write(JSON.stringify({
            "status": "Get Success",
            "data": todos,
            "method": "GET"
        }));
        res.end();
    } else if (req.url == "/todos" && req.method == "POST") {
        req.on('end', () => {
            try {
                const title = JSON.parse(body).title;
                if(title !== undefined) {
                    const todo = {
                        "title": title,
                        "id": uuidv4()
                    }
                    todos.push(todo);
                    res.writeHead(200, headers);
                    res.write(JSON.stringify({
                        "status": "Post Success",
                        "data": todos,
                        "method": "POST"
                    }));
                    res.end();
                } else {
                    errHandle(res);
                }
                
            } catch (error) {
                errHandle(res);
            }
        });
    } else if (req.url == "/todos" && req.method == "DELETE") {
        todos.length = 0
        res.writeHead(200, headers);
        res.write(JSON.stringify({
            "status": "Delete Success",
            "data": todos,
            "method": "DELETE"
        }));
        res.end();
    } else if (req.url.startsWith("/todos/") && req.method == "DELETE") {
        const id = req.url.split("/").pop();
        const index = todos.findIndex(e => e.id == id);
        if(index !== -1) {
            todos.splice(index, 1);
            res.writeHead(200, headers);
            res.write(JSON.stringify({
                "status": "Delete One Success",
                "data": todos,
                "id": 1,
                "method": "DELETE"
            }));
            res.end();
        } else {
            errHandle(res);
        }        
    } else if (req.url.startsWith("/todos/") && req.method == "PATCH") {
        req.on('end', () => {
            try {
                const todo = JSON.parse(body).title;
                const id = req.url.split("/").pop();
                const index = todos.findIndex(e => e.id == id);

                if(index !== -1 && todo !== undefined) {
                    todos[index].title = todo;
                    res.writeHead(200, headers);
                    res.write(JSON.stringify({
                        "status": "Success",
                        "data": todos,
                        "method": "PATCH"
                    }));
                    res.end();
                } else {
                    errHandle(res);
                }

            } catch (error) {
                errHandle(res);
            }            
        })
    } else if (req.method == "OPTIONS") {  // Preflight request
        res.writeHead(200, headers);
        res.end();
    } else {
        errNotFound(res);
    }
}

const server = http.createServer(requestListener);
server.listen(process.env.PORT || 3005);

console.log('Server is running');

