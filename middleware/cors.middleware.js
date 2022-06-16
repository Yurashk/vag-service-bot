function cors(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    // Request methods you wish to allow
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, Authorization, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    next();
}

module.exports = cors
