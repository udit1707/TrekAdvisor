 const Sequelize = require('sequelize');
 const sequelize=new Sequelize('trek-advisor','username','password',{dialect:'mysql',host:'localhost',storage: "./session.sqlite"});
 module.exports=sequelize;
