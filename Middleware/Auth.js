const asyncHandler = require("express-async-handler");
const jwt=require('jsonwebtoken');
const UserModel = require("../Model/User");
const isadminAuthenticated=asyncHandler(async(req,res,next)=>{
   try{ const token=req.cookies.adminToken;
    // console.log(token);
    if(!token){
        throw new Error("Admin not authenticated")
    }
    const decode=jwt.verify(token,process.env.JWTSECRET)
    req.user=await UserModel.findById(decode.id);
    if(req.user.role!=="Admin"){
        throw new Error(`${req.user.role} not authorized for this resources`)
    }
    next();}
    catch(err){
        throw new Error(err)
    }

})


const ispatientAuthenticated=asyncHandler(async(req,res,next)=>{
    try{
    // console.log(req.cookies)
    const token = req.cookies.patientToken; 
    // console.log("Patient token:", token);
    // console.log("patient token",token)
    if(!token){
        throw new Error("Patient not authenticated")
    }
    const decode=jwt.verify(token,process.env.JWTSECRET)
    req.user=await UserModel.findById(decode.id);
    if(req.user.role!=="Patient"){
        throw new Error(`${req.user.role} not authorized for this resources`)
    }
    // req.user=user;
    next();
}
catch(err){
    throw new Error(err)
}

})

module.exports={isadminAuthenticated,ispatientAuthenticated};