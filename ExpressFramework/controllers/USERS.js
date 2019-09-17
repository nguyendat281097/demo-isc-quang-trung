const express = require('express');
const jwt = require('jsonwebtoken');
const helper = require('../utils/HELPER');
const { User } = require('./../models/DB');
const {ErrorResult, Result} = require('./../utils/base_response');
const router = express.Router();
router.use((req, res, next) => {
    next();
});

router.post('/', (req, res) => {
    req.body.password = helper.hash(req.body.password);
    User.create(req.body).then(type => {
        res.json(Result(type));
    }).catch(err => {
        return res.status(400).json(ErrorResult(404, err.errors));
    });
})

router.post('/login', (req, res) => {
    User.findOne({
        where: {
            userName: req.body.userName,
            password: helper.hash(req.body.password)
        }
    }).then(aUser => {
        if(aUser != null) {
            const token = jwt.sign({userId: aUser.id, userName: aUser.userName}, helper.appKey, {expiresIn: '1h'});
            res.json(Result({
                id: aUser.id,
                userName: aUser.userName,
                fullName: aUser.fullName,
                token: token,
            }));
        } else {
            res.status(401).json(ErrorResult(401, 'Invalid username or password'));
        }
    });
});

module.exports = router;