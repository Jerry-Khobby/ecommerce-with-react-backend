const express =require('express');

const app =express();
const mongoose=require('mongoose');
const bcrypt = require("bcrypt");
const session = require("express-session");
const bodyParser = require("body-parser");
const dotenv =require('dotenv').config();


const PORT =process.env.PORT||5500;


app.listen(PORT,()=>{
    console.log(`The server is listening sucessfully port ${PORT}`);
});

