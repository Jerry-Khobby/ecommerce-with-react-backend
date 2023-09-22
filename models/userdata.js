const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    first_name:{
type:String,
required:true,
    },
    other_names:{
type:String,
required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    dateEntered:{
type:Date,// use the Date data type 
default:Date.now, //set  a default value to get the current date value 
    }

});

//Export the model
module.exports = mongoose.model('User', userSchema);