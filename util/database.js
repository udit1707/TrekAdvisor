 const Sequelize = require('sequelize');
 const sequelize=new Sequelize('Database','Username','password',{dialect:'mysql',host:'{Host name}',storage: "./session.sqlite"});
 module.exports=sequelize;

