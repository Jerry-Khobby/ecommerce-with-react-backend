const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const dotenv = require("dotenv").config();
const db =require("./models/db");
const userRouter=require("./routes/userRoutes");
const errorHandler = require("./controllers/errorHandler");

// defining all my middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


db.connectToDb();

// defining a method  to check the session system  and login and logout 
app.use(errorHandler);

//using the errorHandler as a middleware in my app 


//use the router 
app.use("/",userRouter);










const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
  console.log(`The server is listening sucessfully port ${PORT}`);
});

process.on("SIGINT", async()=>{
await db.closeDb();
process.exit(0);
})
