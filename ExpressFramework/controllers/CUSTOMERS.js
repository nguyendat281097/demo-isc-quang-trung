const express = require('express');
const sequelize = require('sequelize');
const { check, validationResult } = require('express-validator');
const Op = sequelize.Op; 
const {Customer, CustomerType} = require('./../models/DB');
const {ErrorResult, Result, PagingResult} = require('./../utils/base_response');
const router = express.Router();
router.use( (req, res, next)=>{
    //phan quyen o day
    next();
});
router.get('/', (req, res) =>{
    let page = 0;
    if (req.query.p) page = parseInt(req.query.p);

    let pageSize = 20;
    if (req.query.s) pageSize = parseInt(req.query.s);

    let queryString = '';
    if(req.query.q) queryString = '%' + decodeURIComponent(req.query.q) +'%';

    let sortColumn = 'name';
    let sortDirection = 'ASC';
    if (req.query.so) {
        const sortStr = decodeURIComponent(req.query.so).split(' ');
        sortColumn = sortStr[0];
        if ( sortStr.length == 2) sortDirection = sortStr[1];
    }

    const offset = page * pageSize;
    // const limit = parseInt(offset) + parseInt(pageSize);
    const limit = pageSize;

    if (queryString.length <= 2 ) {
        Customer.count().then(numRow => {
            const totalRows = numRow;
            const totalPages = Math.ceil(totalRows/pageSize);
            Customer.findAll({
                order: [[sortColumn, sortDirection]],
                offset: offset,
                limit: limit,
                include: [{ model: CustomerType, as: 'customerType'}]
            }).then(customers => {
                return res.json(PagingResult(customers, {
                    pageNumber: page,
                    pageSize: pageSize,
                    totalRows: totalRows,
                    totalPages: totalPages,
                }));
            });
        });
    } else { // search
        // conditions
        const whereClause = {
            [Op.or]: [
                {name: { [Op.like]: queryString}},
                {email: { [Op.like]: queryString}},
                {phone: { [Op.like]: queryString}},
                {address: { [Op.like]: queryString}},
            ]
        }

        Customer.count({ where: whereClause }).then(numRow => {
            const totalRows = numRow;
            const totalPages = Math.ceil(totalRows/pageSize);
            Customer.findAll({
                where: whereClause,
                offset: offset,
                limit: limit,
                include: [{ model: CustomerType, as: 'customerType'}]
            }).then(customers => {
                return res.json(PagingResult(customers, {
                    pageNumber: page,
                    pageSize: pageSize,
                    totalRows: totalRows,
                    totalPages: totalPages,
                }));
            });
        });
    }
});
// get By CustomerType
router.get('/getByCustomerType/:id(\\d+)', (req, res) =>{
    let page = 0;
    if (req.query.p) page = parseInt(req.query.p);

    let pageSize = 20;
    if (req.query.s) pageSize = parseInt(req.query.s);

    let queryString = '';
    if(req.query.q) queryString = '%' + decodeURIComponent(req.query.q) +'%';

    let sortColumn = 'name';
    let sortDirection = 'ASC';
    if (req.query.so) {
        const sortStr = decodeURIComponent(req.query.so).split(' ');
        sortColumn = sortStr[0];
        if ( sortStr.length == 2) sortDirection = sortStr[1];
    }

    const offset = page * pageSize;
    // const limit = parseInt(offset) + parseInt(pageSize);
    const limit = pageSize;

    if (queryString.length <= 2 ) {
        // conditions
        const whereClause = {
            CUT_ID: req.params.id
        }
        
        Customer.count({where: whereClause}).then(numRow => {
            const totalRows = numRow;
            const totalPages = Math.ceil(totalRows/pageSize);
            Customer.findAll({
                where: whereClause,
                order: [[sortColumn, sortDirection]],
                offset: offset,
                limit: limit,
                include: [{ model: CustomerType, as: 'customerType'}]
            }).then(customers => {
                return res.json(PagingResult(customers, {
                    pageNumber: page,
                    pageSize: pageSize,
                    totalRows: totalRows,
                    totalPages: totalPages,
                }));
            });
        });
    } else { // search
        // conditions
        const whereClause = {
            CUT_ID: req.params.id,
            [Op.or]: [
                {name: { [Op.like]: queryString}},
                {email: { [Op.like]: queryString}},
                {phone: { [Op.like]: queryString}},
                {address: { [Op.like]: queryString}},
            ]
        }

        Customer.count({ where: whereClause }).then(numRow => {
            const totalRows = numRow;
            const totalPages = Math.ceil(totalRows/pageSize);
            Customer.findAll({
                where: whereClause,
                offset: offset,
                limit: limit,
                include: [{ model: CustomerType, as: 'customerType'}]
            }).then(customers => {
                return res.json(PagingResult(customers, {
                    pageNumber: page,
                    pageSize: pageSize,
                    totalRows: totalRows,
                    totalPages: totalPages,
                }));
            });
        });
    }
});

router.get('/:id(\\d+)', (req, res) =>{
    Customer.findByPk(req.params.id, 
    {include: [{ model: CustomerType, as: 'customerType'}]}
        ).then(type => {
        if(type != null){
            res.json(Result(type));
        } else{
            res.status(404).json(ErrorResult(404, 'Not Found'));
        }
    });
});

router.post('/', [
    check('CUT_ID', 'Invalid number').isNumeric(),
    check('name', 'Length from 2 to 100').isLength({min: 2, max: 100}),
    check('email', 'Invalid email').isEmail(),
    check('address', 'Is required').not().isEmpty(),
], (req, res) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json(ErrorResult(422, errors.array()));
    }

    Customer.create(req.body).then(type =>{
        res.json(Result(type));
    }).catch(err => {
        res.status(500).json(ErrorResult(500, err.errors));
    });
});

router.put('/:id(\\d+)', [
    check('CUT_ID', 'Invalid number').isNumeric(),
    check('name', 'Length from 2 to 100').isLength({min: 2, max: 100}),
    check('email', 'Invalid email').isEmail(),
    check('address', 'Is required').not().isEmpty(),
], (req, res) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json(ErrorResult(422, errors.array()));
    }

    Customer.findByPk(req.params.id).then(type =>{
        if(type !=null){
            type.update({
                CUT_ID: req.body.CUT_ID,
                name: req.body.name,
                phone: req.body.phone,
                email: req.body.email,
                address: req.body.address
            }).then(type => {
                res.json(Result(type));
            }).catch(err =>{
                res.status(500).json(ErrorResult(500, err.errors));
            });
        } else {
            res.status(404).json(ErrorResult(404, 'Not Found'));
        }
    });
});

router.delete('/:id', (req, res) =>{
    Customer.destroy({
        where: {
            id: req.params.id
        }
    }).then(type => {
        res.json(Result(type));
    }).catch(err => {
        res.status(500).json(ErrorResult(500, err.errors));
    });
});
module.exports = router;