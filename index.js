const express=require('express');
const cors=require('cors')
const dotenv=require('dotenv')
const cookieParser=require('cookie-parser')
const mongoose = require('mongoose');
const fileUpload=require('express-fileupload')
const messageRouter=require('./Routes/Message')
const UserRouter=require('./Routes/User')
const AppointmentRouter=require('./Routes/Appointment')
const {errorHandler,notfound} =require('./Middleware/Error')
const {v2 : cloudinary}=require("cloudinary")


dotenv.config();
const app=express();

mongoose.connect(process.env.DATABASEURI).then(()=>console.log('database connected successfully')).catch((err)=>console.log(err));

cloudinary.config({
    cloud_name:process.env.CLOUDINARYCLOUDNAME,
    api_key:process.env.CLOUDINARYAPIKEY,
    api_secret:process.env.CLOUDINARYAPISECRET
})

app.use(cors(
   { 
    origin: ['https://hmern-frontend.vercel.app', 'https://hmern-dashboard.vercel.app'],
    credentials: true,}
));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir :"/tmp/"
}));


app.use('/api/v1/message',messageRouter)
app.use('/api/v1/user',UserRouter)
app.use('/api/v1/Appointment',AppointmentRouter)



app.use(notfound);
app.use(errorHandler);
app.listen(9000,console.log("server is live"));