const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const session = require("express-session");
const bodyParser = require("body-parser");
const dotenv = require("dotenv").config();
const db =require("./models/db");

// defining all my middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use((req, res, next) => {
  res.locals.mongoose = { error: null };
  next();
});

db.connectToDb();












const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
  console.log(`The server is listening sucessfully port ${PORT}`);
});

process.on("SIGINT", async()=>{
await db.closeDb();
process.exit(0);
})
