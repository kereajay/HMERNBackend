const express=require('express');
const UserRouter=express.Router();
const {patientregister,login,addnewadmin,getalldoctors,getuserdetails,logoutadmin,logoutpatient,registerdoctor}=require('../Controller/User')
const {isadminAuthenticated,ispatientAuthenticated}=require('../Middleware/Auth')
UserRouter.post('/patient/signup',patientregister)
UserRouter.post('/login',login)
UserRouter.post('/admin/addnew',isadminAuthenticated,addnewadmin)
UserRouter.get('/getalldoctors',getalldoctors);
UserRouter.get('/admin/details',isadminAuthenticated,getuserdetails);
UserRouter.get('/patient/details',ispatientAuthenticated,getuserdetails);
UserRouter.get('/adminlogout',isadminAuthenticated,logoutadmin);
UserRouter.get('/patientlogout',ispatientAuthenticated,logoutpatient);
UserRouter.post('/doctor/signup',isadminAuthenticated,registerdoctor)
module.exports=UserRouter;