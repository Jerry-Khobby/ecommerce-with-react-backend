
const bcrypt = require("bcrypt");
const User =require("../models/userdata");
const nodemailer = require('nodemailer');
 // trying to import the jsonwebtokens 

 const {generateToken}=require('../models/token');

// I will like to store the OTP code in a variable first 
 let codeValidations=12345;

// defining the functions for getting the email and sending the OTP codes 

function generateOTP(){
  return Math.floor(10000+Math.random()*90000);
}
// Import nodemailer if not already imported
// Function to send OTP by email
async function sendOTPByEmail(email, otp, res, user) {
  // Email sending logic here
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'jerrymardeburg@gmail.com',
      pass: 'mcor sqgq ljab zhzx',
    },
  });
  const mailOptions = {
    from: 'jerrymardeburg@gmail.com',
    to: email,
    subject: 'OTP Verification Code',
    text: `Your OTP for password reset is: ${otp}`,
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log("The OTP code has been sent successfully");
    return res.status(200).json({ message: 'The OTP verification has been sent successfully' });
  } catch (e) {
    console.log('Error sending OTP:', e);
    return res.status(500).json({ error: 'Failed to send OTP' });
  }
}

// Function to generate OTP

const emailOtpCodes = async (req, res) => {
  const { email } = req.params;
  try {
    // trying to find the user in the database
    const user = await User.findOne({ email });
    console.log(user);
    if (!user) {
      console.log('User not found');
      return res.status(401).json({ error: "You don't have an account" });
    }
    // after then we are trying to send the email message to the user to send the user the user OTP
    const otp = generateOTP();
    codeValidations = otp;
    console.log(codeValidations);
    await sendOTPByEmail(email, otp, res, user);
  } catch (error) {
    console.error('Error occurred:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Export the emailOtpCodes function if needed







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
const token=generateToken(user);
console.log("User has successfully logged in");
return res.status(200).json({success:"Login successfully",token});
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
/*       req.session.user=newUser; */
const token = generateToken(newUser);
console.log("New User is saved successfully");
    // The new user account was created successfully
    res.status(201).json({ message: 'User account created successfully',token});
    console.log("User account created successfully");
  } catch (error) {
    // The new user account could not be created
    res.status(500).json({ error: 'An error occurred while creating the user account',error});
    console.log("An error occurred while creating the user account",error);
  }
}







const forgottenPassword =async(req,res)=>{
  const {code}=req.body;
  console.log(code);
  try{
  if(code!==codeValidations){
    console.log("The OTP code sent is not the same as the one inputted ");
    return res.status(401).json({ error: 'Invalid OTP code' });
  }else{
    console.log("The OTP code sent is the same as the one inputted");
    return res.status(200).json({ message: 'The OTP has been verified successfully' });
  }
}catch(e){
  console.log('Error sending OTP:', e);
  return res.status(500).json({ error: 'Failed to send OTP' });

}
}




























const resetPasswordmiddle = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  // Validate OTP (check if it matches the stored OTP for the email)
  const storedOTP = getStoredOTP(email); // Get stored OTP from your database
  if (!storedOTP || storedOTP !== otp) {
    return res.status(400).json({ error: 'Invalid OTP' });
  }

  try {
    // Update user's password in the database
    const user = await User.findOneAndUpdate({ email }, { password: newPassword });
    
    // Generate a new JWT token for the user
    const newToken = generateToken(user); // Assuming you have a generateToken function

    // Clear the stored OTP (optional)
    clearStoredOTP(email); // Clear OTP from your database

    return res.status(200).json({ message: 'Password reset successful', token: newToken });
  } catch (error) {
    console.error('Error resetting password:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }

};













































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
    forgottenPassword,
    emailOtpCodes,
    //I can add more controllers functions as needed 
}