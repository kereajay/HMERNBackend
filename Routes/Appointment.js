const express=require('express');
const AppointmentRouter=express.Router();
const {postAppointment,getallappointments,updateappointment,deleteappointment}=require('../Controller/Appointment')
const {isadminAuthenticated,ispatientAuthenticated}=require('../Middleware/Auth')

AppointmentRouter.post('/bookAppointment',ispatientAuthenticated,postAppointment)
AppointmentRouter.get('/allAppointments',isadminAuthenticated,getallappointments)
AppointmentRouter.put('/update/:id',isadminAuthenticated,updateappointment)
AppointmentRouter.delete('/delete/:id',isadminAuthenticated,deleteappointment)
module.exports=AppointmentRouter;