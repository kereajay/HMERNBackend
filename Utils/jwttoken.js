// const { LocalStorage } = require('node-localstorage');

// Create a new instance of LocalStorage
// const localStorage = new LocalStorage('./scratch');

const generateToken=(user,message,res)=>{
    const token =  user.generateJsonWebToken();
    const cookieName= user.role==="Admin"?"adminToken":"patientToken";
    // console.log(cookieName,token)
    // localStorage.setItem("cookieName",token);
    // localStorage.setItem(cookieName,JSON.stringify(token))

     res.status(200).cookie(cookieName,token,{
        httpOnly:true,
        maxAge: 24 * 60 * 60 * 1000,
        sameSite:"none",
        secure:true,
    })
    .json({
        success:true,
        message,
        user,
        token
    }
    )
    // return token
}

module.exports={
    generateToken
}
