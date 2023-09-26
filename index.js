const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const dotenv = require("dotenv").config();
const db =require("./models/db");
const userRouter=require("./routes/userRoutes");
const errorHandler = require("./controllers/errorHandler");
const cors =require("cors");


// defining all my middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


db.connectToDb();
//using the errorHandler as a middleware in my app 
app.use(errorHandler);
//Defining   how long the session must take 
app.use(cors());

/* const corsOptions={
  origin: 'http://localhost:3000/',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}
app.use(corsOptions); */


//use the router 
app.use("/auth",userRouter);










const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
  console.log(`The server is listening sucessfully port ${PORT}`);
});

process.on("SIGINT", async()=>{
await db.closeDb();
process.exit(0);
})
