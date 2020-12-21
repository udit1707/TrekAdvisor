 const Sequelize = require('sequelize');
 const sequelize=new Sequelize('heroku_32ef109f1d9bc84','b92e5f9aaa362f','cd35a5e2',{dialect:'mysql',host:'us-cdbr-east-02.cleardb.com',storage: "./session.sqlite"});
 module.exports=sequelize;

// const Sequelize=require('sequelize');
// const sequelize=new Sequelize('trek-advisor','root','5511',{dialect:'mysql',host:'localhost',storage: "./session.sqlite"});
// module.exports=sequelize;