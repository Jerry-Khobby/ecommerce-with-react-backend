const bcrypt = require("bcrypt");
const User =require("../models/userdata");
const nodemailer = require('nodemailer');
 // trying to import the jsonwebtokens 
 const {generateToken}=require('../models/token');
// I will like to store the OTP code in a variable first 
 let codeValidations=0;
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
    console.log(otp);
    await sendOTPByEmail(email, otp, res, user);
    codeValidations = otp;
    console.log(codeValidations);
    const resetToken = generateToken(user._id);
    user.resetToken = resetToken;
    await user.save();
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
const token=generateToken(user._id);
res.cookie("token",token,{
  withCredentials: true,
  httpOnly: false,
})
console.log(token);

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
const token = generateToken(newUser._id);
res.cookie("token",token,{
  withCredentials: true,
  httpOnly: false,
});
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
const codeValidationsString = codeValidations.toString();
  if(code!==codeValidationsString){
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




const resetPassword=async(req,res)=>{
  try{
    const {newPassword,confirmPassword} =req.body;
    const {email} =req.params;
if(newPassword!==confirmPassword){
  console.log("The passwords you entered are not matching");
  return res.status(400).json({error:'Passwords do not match'});
}

console.log(email);

//search for the user in the database by using the email of the user 
const user =await User.findOne({email});
if(!user){
  console.log("User does not exist in the database ")
  return res.status(404).json({error:'User not found'});

}
// if the user is in the database and we have also confirm the matching of the password , then we have to harsh the password and save it 
const harshedPassword = await  bcrypt.hash(newPassword,10);// 10 is the number of the salt rounds 
user.password=harshedPassword;//
await user.save();

// generate the token again 
return res.status(200).json({message:'Password have been updated successfully and will be saved'});
  }catch(error){
console.log("There is an error with the code in the backend");
return res.status(500).json({error:'I dont know what to do again'});
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