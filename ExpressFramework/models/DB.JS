const Sequelize = require('sequelize');
const UserModel = require('./USER');
const CustomerTypeModel = require('./CUSTOMER_TYPE');
const CustomerModel = require('./CUSTOMER');

const sequelize = new Sequelize('USER_MANAGER', 'sa', 'nguyendat260298', {
    dialect: 'mssql',
    host: 'localhost',
    dialectOptions: {
        "options": {
            "instanceName": "SQLEXPRESS"
        }
    },
    pool: { max: 20, min:0, acquire: 30000, idle: 10000 },
    logging: true

});

const User = UserModel(sequelize, Sequelize);
const CustomerType = CustomerTypeModel(sequelize, Sequelize);
const Customer = CustomerModel(sequelize, Sequelize);

Customer.belongsTo(CustomerType, {foreignKey: 'CUT_ID', as: 'customerType'});
CustomerType.hasMany(Customer, {foreignKey: 'CUT_ID', as: 'customers'});

// sequelize.sync({ force: true }).then(() => {
//     console.log('Database & tables created!');
// });

module.exports = {
    User,
    CustomerType,
    Customer
}