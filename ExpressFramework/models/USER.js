module.exports = (sequelize, type) =>{
    return sequelize.define('Users', {
        id: {
            field: 'USE_ID',
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userName: type.STRING,
        password: type.STRING,
        fullName: type.STRING
    }, {timestamps: false})
}