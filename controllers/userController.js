const User =require("../models/userdata");
const bcrypt = require("bcrypt");
const session = require("express-session");







 
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
   const user =await User.findOne({email});

   //If the user is not found , return an error message
   if(!user){
    return res.render("signin",{
        messages:{
            error:"Invalid email address",
        },
    });
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


const createUser=async(req,res)=>{
  //validate the user's input
  const {first_name,other_names,email,password1,password2}  = req.body;

  
  if (!first_name || !email || !password1 || !password2) {
    // Throw an error if the user's input is invalid
    return res.status(400).json({ error: 'Invalid user input' });
  }

   // Hash the user's password
   const newHashed = await bcrypt.hash(password1, 10);
    // Create a new user account
  const newUser = new User({
    id: Date.now().toString(),
    first_name,
    other_names,
    email,
    password: newHashed,
  });

  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      await newUser.save();
    });

    // The new user account was created successfully
    res.status(201).json({ message: 'User account created successfully' });
  } catch (error) {
    // The new user account could not be created
    res.status(500).json({ error: 'An error occurred while creating the user account' });
  }

  // Close the session
  await session.endSession();

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