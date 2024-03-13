const headers = {
    "Access-Control-Allow-Headers": "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "PATCH, OPTIONS, POST, GET, DELETE",
    "Content-Type": "application/json"
}

function errHandle(res) {
    res.writeHead(400, headers);
    res.write(JSON.stringify({
        "status": "Post Failed",
        "message": "欄位未填寫正確，或無此 Todo ID"
    }));
    res.end();
}

function errNotFound(res) {
    res.writeHead(404, headers);
    res.write(JSON.stringify({
        "status": "false",
        "message": "無此網站路由"
    }));
    res.end();
}

module.exports = { errHandle, errNotFound };

