const Sequelize=require('sequelize');

const sequelize=require('../util/database');

const Comment=sequelize.define('comment',{
    id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
          },
    text:Sequelize.STRING,
    creator:Sequelize.STRING,
    createdAt:Sequelize.STRING
});
module.exports=Comment;







// var mongoose = require("mongoose");
// var commentSchema = new mongoose.Schema({
//     text: String,
//     author: {
//         id: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "User"
//         },
//         username: String

//     }
// });
// module.exports = mongoose.model("Comment", commentSchema);