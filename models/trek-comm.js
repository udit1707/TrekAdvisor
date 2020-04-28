const Sequelize=require('sequelize');

const sequelize=require('../util/database');

const TrekComm=sequelize.define('trekComm',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey: true
    }
});
module.exports=TrekComm;