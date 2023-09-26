
const bcrypt = require("bcrypt");
const expressSession = require("express-session");
const mongoose=require("mongoose");
const argon2 = require("argon2");
const User =require("../models/userdata");




 // finding the user and the user login 
const getAllUsers= async (req, res) => {
   //Validate the user's input 
   const {email,password}=req.body;
   if(!email || !password){
    return res.render("signin",{
        messages:{
            error:"Please enter your email address and password",
        }
    })
   }
   //trying to find the user in the database 
   const user =await User.findOne({email},{timeout:20000});

   //If the user is not found , return an error message
   // just trying to redirect on my local host site foor the frontend of my react app 
   if(!user){
    return res.redirect("http://localhost:3000/signup",{
        messages:{
            error:"There is no email account",
        },
    })
   }

   const passwordMatch =await argon2.verify(user.password,password);
   if(!passwordMatch){
    return res.render("signin",{
        messages:{
            error:"Incorrect password , try again",
        }
    })
   }
   //The user has successfully loged in 
   req.session.user = user;


   return res.redirect("/",{
    messages: {
        success:"Logged in successfully",
    }
   })
}




//creating a new user accounts 
const createUser=async(req,res)=>{
  //validate the user's input
  const {first_name,other_names,email,password1,password2}  = req.body;

  
  if (!first_name || !other_names, !email || !password1 || !password2) {
    // Throw an error if the user's input is invalid
    return res.status(400).json({ error: 'Invalid user input' });
  }
  if(password1!==password2) {
    return res.status(403).json({ error: 'The passwords must match' });
  }

   // Hash the user's password
   console.log("Received request body:", req.body);
   const newHashed = await bcrypt.hash(password1, 10);
    // Create a new user account
  const newUser = new User({
    id: Date.now().toString(),
    first_name,
    other_names,
    email,
    password: newHashed,
    date:Date.now()
  });
  console.log("New User is created: ",newUser);
  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      // Pass the session as an option to the save operation
      await newUser.save({ session: session });
      console.log("New User is saved successfully");
    });

    // The new user account was created successfully
    res.status(201).json({ message: 'User account created successfully' });
    console.log("User account created successfully");
  } catch (error) {
    // The new user account could not be created
    res.status(500).json({ error: 'An error occurred while creating the user account' });
    console.log("An error occurred while creating the user account");
  }finally{
// Close the session
await session.endSession();
  }
}




const confirmUser=async(req,res)=>{
    console.log("Miracles are happening");
}


module.exports={
    getAllUsers,
    createUser,
    confirmUser,
    //I can add more controllers functions as needed 
}