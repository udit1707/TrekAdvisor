const Sequelize=require('sequelize');

const sequelize=require('../util/database');

const User = sequelize.define('user', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  email : Sequelize.STRING,
  username : Sequelize.STRING,
  password: Sequelize.STRING
});

module.exports = User;


// var mongoose = require("mongoose");
// var passportLocalMongoose = require("passport-local-mongoose");
// var userSchema = new mongoose.Schema({ username: String, password: String });
// userSchema.plugin(passportLocalMongoose);
// module.exports = mongoose.model("User", userSchema);