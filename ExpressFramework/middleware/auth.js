const jwt = require('jsonwebtoken');
const {ErrorResult} = require('./../utils/base_response');
const {appKey} = require('./../utils/HELPER');

module.exports = (req, res, next) => {
    if (req.url == '/users/login')
        next();
    else {
    const authHeader = req.get('Authorization');
    if(!authHeader) {
        return res.status(401).json(ErrorResult(401, 'Not authenticated'));
    }
    const token = authHeader.split(' ')[1];
    let decodedToken;
    try{
        decodedToken = jwt.verify(token, appKey);
    } catch(err) {
        return res.status(401).json(ErrorResult(401, err.message));
    }
    if(!decodedToken) {
        return res.status(401).json(ErrorResult(401, 'Not authenticated'));
    }
    req.userId = decodedToken.userId;
    req.userName = decodedToken.userName;
    next();
}
}