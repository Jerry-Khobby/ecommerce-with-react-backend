
const bcrypt = require("bcrypt");
const session = require("express-session");
const User =require("../models/userdata");









 // finding the user and the user login 
const getAllUsers= async (req, res) => {
   //Validate the user's input 
   const {email,password}=req.body;
   if(!email || !password){
    console.log("Please enter");
    return res.status(400),json({error:'Please enter your email address and password'})
   }
try{
const user =await User.findOne({email});
if(!user){
  console.log('User not found');
  return res.status(401).json({ error: "You don't have an account" });
}
const passwordMatch =await bcrypt.compare(password,user.password);
if(!passwordMatch){
  console.log("Password mismatch");
  return res.status(403).json({error: "Incorrect password"});

}
// the user has successfully logged in 
req.session.user = user;
console.log("User has successfully logged in");
return res.status(200).json({success:"Login successfully"});
}catch(e){
console.error('An error occured',e);
return res.status(500).json({error:'An error occured while logging in '});
}
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
  try{
// check if there is already an existing user account same email address 
const existingUser =await User.findOne({email});
if(existingUser){
  //send a message to the user informing them that their email address 
  console.log("There is  already an existing user account");
  return res.status(409).json({error:'Email address is already in use '});
}



   // Hash the user's password
   const newHashed = await bcrypt.hash(password1, 10);
    // Create a new user account
  const newUser = new User({
    first_name,
    other_names,
    email,
    password: newHashed,
  });
  

  console.log("New User is created: ",newUser);

      // Pass the session as an option to the save operation
      
      await newUser.save();
      console.log("New User is saved successfully");

    // The new user account was created successfully
    res.status(201).json({ message: 'User account created successfully' });
    console.log("User account created successfully");
  } catch (error) {
    // The new user account could not be created
    res.status(500).json({ error: 'An error occurred while creating the user account',error});
    console.log("An error occurred while creating the user account",error);
  }
}




const resetPassword=async(req,res)=>{
    try{
      const {email}=req.params;
      const {newPassword,confirmPassword}=req.body;


// trying to grab the user email from the link and working on finding it in the database 
const user =await User.findOne({email});
console.log(user);

if(!user){
  return res.status(404).json({error:'User not found'});
}
//check if the newPassword and t


if(newPassword!==confirmPassword) {
  return res.status(403).json({ error: 'The passwords must match' });
}
user.password = newPassword;
user.resetPasswordToken=undefined;
user.resetPasswordExpires=undefined;

if(user.resetPassword && Date.now()>user.resetPasswordExpires){
  return res.status(400).json({error:'Reset password token has expired'});
}

await user.save();
res.status(200),json({message: 'Password reset successfully'});
    }catch(error){
      console.error('An error occurred', error);
      res.status(500).json({ error: 'An error occurred while updating the password' });
    }
}


module.exports={
    getAllUsers,
    createUser,
    resetPassword,
    //I can add more controllers functions as needed 
}