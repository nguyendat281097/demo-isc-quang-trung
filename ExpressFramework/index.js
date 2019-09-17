const express = require('express');
var fs = require('fs');
var multer = require('multer');
var app = express();
var bodyParser = require('body-parser');

const cors = require('cors');

app.use(cors({
    methods: ['OPTIONS', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE']
}));

const auth = require('./middleware/auth');
app.use(auth);

// const auth = require('./middleware/auth');
// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Headers', '*');
//     res.header('Access-Control-Allow-Methods', '*');

//     if(req.url == '/users/login')
//         next();
//     else 
//         auth(req, res, next);
//     // next();
// })

const {ErrorResult, Result} = require('./utils/base_response');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
const {CustomerType, Customer} = require('./models/DB');

const customerTypeCtrl = require('./controllers/CUSTOMER_TYPES');
app.use('/customerTypes', customerTypeCtrl);

const customerCtrl = require('./controllers/CUSTOMERS');
app.use('/customers', customerCtrl);

const userCtrl = require('./controllers/USERS');
app.use('/Users', userCtrl);

app.use((req, res) =>{
    res.status(404).json(ErrorResult(404, 'API Not Found'));
});

var server = app.listen(8080, () => {
    const host = server.address().address;
    const port = server.address().port;
    console.log('Server is running at http://%s:%s', host, port);
});