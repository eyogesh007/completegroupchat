const jwt=require('jsonwebtoken');
module.exports = function(req, res, next) {
        let token = req.header('usertoken');
        if(!token){
            return res.send('Token Not found');
        }
        let decode = jwt.verify(token,'key')
        req.user = decode.user
        next();
}