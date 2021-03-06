

const Sequelize=require('sequelize');

const sequelize=require('../util/database');//database connection pool i.e. managed by sequelize is imported in this line 
const Trek = sequelize.define('trek', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  name: Sequelize.STRING,
  price: {
    type: Sequelize.DOUBLE,
    allowNull: false
  },
  location: Sequelize.STRING,
  image: {
    type: Sequelize.STRING,
    allowNull: false
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  mean_rating:{
    type:Sequelize.DOUBLE,
    defaultValue: 0.0
  },
  count_ratings:{
     type:Sequelize.INTEGER,
     defaultValue:0
  },
  creator:Sequelize.STRING
});

module.exports = Trek;



















// var mongoose = require("mongoose");
// var campgroundSchema = new mongoose.Schema({
//     name: String,
//     price: String,
//     image: String,
//     description: String,
//     author: {
//         id: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "User"
//         },
//         username: String

//     },
//     comments: [{
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Comment"
//     }]
// });
// module.exports = mongoose.model("Campground", campgroundSchema);