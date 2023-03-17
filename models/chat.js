const {Sequelize}=require('sequelize')
const sequelize = require('../utils/database')

const Message=sequelize.define(`message`,{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true,
    },
    messageInp:{
        type:Sequelize.STRING,
        allowNull:false,
    },
   userName:{type:Sequelize.STRING}
})

module.exports = Message;