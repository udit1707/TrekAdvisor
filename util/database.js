 const Sequelize = require('sequelize');
 const sequelize=new Sequelize('trek-advisor','root','5511',{dialect:'mysql',host:'localhost'});
 module.exports=sequelize;