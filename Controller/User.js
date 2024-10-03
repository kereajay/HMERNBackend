const asyncHandler = require("express-async-handler");
const UserModel = require("../Model/User");
const { generateToken } = require("../Utils/jwttoken");
const { v2: cloudinary } = require("cloudinary");

const patientregister = asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    password,
    role,
  } = req.body;
  try {
    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !nic ||
      !dob ||
      !gender ||
      !password ||
      !role
    ) {
      throw new Error("Fill the form full");
    }
    let user = await UserModel.findOne({ email: email });
    // console.log(user)
    if (user) {
      throw new Error("user already exist with this mail");
    }
    user = await UserModel.create({
      firstName,
      lastName,
      email,
      phone,
      nic,
      dob,
      gender,
      password,
      role,
    });
    res.json({ success: true, message: "user registered successfully", user });
    // generateToken(user, "User Registered successfully", res);
  } catch (err) {
    throw new Error(err);
  }
});

const login = asyncHandler(async (req, res) => {
  const { email, password, confirmpassword, role } = req.body;
  try {
    if (!email || !password || !confirmpassword || !role) {
      throw new Error("complete the  details ");
    }

    if (password !== confirmpassword) {
      throw new Error("password not matching");
    }
    const user = await UserModel.findOne({ email }).select("+password");
    if (!user) {
      throw new Error("invalid password or email");
    }
    const ispasswordmatching = await user.comparePassword(password);
    if (!ispasswordmatching) {
      throw new Error("invalid password or email");
    }
    if (role !== user.role) {
      throw new Error("User with this role is not found");
    }
    // localStorage.setItem("co",JSON.stringify("cookie"))
    // res.json({success:true,message:"user logged in successfully"})
    generateToken(user, "Logged in successfully", res);

  } catch (err) {
    throw new Error(err);
  }
});

//add new admin
const addnewadmin = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, phone, nic, dob, gender, password } =
    req.body;
  try {
    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !nic ||
      !dob ||
      !gender ||
      !password
    ) {
      throw new Error("Fill the form full");
    }
    const isregistered = await UserModel.findOne({ email });
    if (isregistered) {
      throw new Error(
        `${isregistered.role} with this email already registered`
      );
    }
    const admin = await UserModel.create({
      firstName,
      lastName,
      email,
      phone,
      nic,
      dob,
      gender,
      password,
      role: "Admin",
    });
    res.json({ success: true, message: "admin registered successfully" });
  } catch (err) {
    throw new Error(err);
  }
});

//get all doctors
const getalldoctors = asyncHandler(async (req, res) => {
  try {
    const doctors = await UserModel.find({ role: "Doctor" });
    res.json({ success: true, doctors });
  } catch (err) {
    throw new Error(err);
  }
});

//get userdetails
const getuserdetails = asyncHandler(async (req, res) => {
  try {
    const user = req.user;
    res.json({ success: true, user });
  } catch (err) {
    throw new Error(err);
  }
});
//admin logout
const logoutadmin = asyncHandler(async (req, res) => {
  try {
    res
      .cookie("adminToken", "", {
        httpOnly: true,
        expires: new Date(Date.now()),
      })
      .json({ success: true, message: "admin logout successfully" });
  } catch (err) {
    throw new Error(err);
  }
});

//patient logout
const logoutpatient = asyncHandler(async (req, res) => {
  try {
    res
      .cookie("patientToken", "", {
        // httpOnly: true,
        expires: new Date(0), 
        sameSite: "none", 
        secure: true,
      })
      .json({ success: true, message: "patient logout successfully" });
  } catch (err) {
    throw new Error(err);
  }
});

//add new doctor
const registerdoctor = asyncHandler(async (req, res) => {
  // console.log(req.files,req.body)
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
     throw new Error("Doctor Avatar Required!");
    }
    const { docAvatar } = req.files;
    const allowedFormats = ["image/png", "image/jpeg","image/jpg", "image/webp"];
    if (!allowedFormats.includes(docAvatar.mimetype)) {
      throw new Error("File Format Not Supported!");
    }
    const { firstName, lastName, email, phone, nic, dob, gender, password, doctorDepartment } = req.body;
   
  
    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !nic ||
      !dob ||
      !gender ||
      !password ||
      !doctorDepartment ||
      !docAvatar
    ) {
      throw new Error("Please Fill Full Form");
    }
    const isRegistered = await UserModel.findOne({ email });
    if (isRegistered) {
      throw new Error("Doctor With This Email Already Exists!");
    }
    const cloudinaryResponse = await cloudinary.uploader.upload(
      docAvatar.tempFilePath
    );
    if (!cloudinaryResponse || cloudinaryResponse.error) {
      console.error(
        "Cloudinary Error:",
        cloudinaryResponse.error || "Unknown Cloudinary error"
      );

      throw new Error("Failed To Upload Doctor Avatar To Cloudinar");
    }
    const doctor = await UserModel.create({
      firstName,
      lastName,
      email,
      phone,
      nic,
      dob,
      gender,
      password,
      role: "Doctor",
      doctorDepartment,
      docAvatar: {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.secure_url,
      },
    });
    res.status(200).json({
      success: true,
      message: "New Doctor Registered Successfully",
      doctor,
    });
  } catch (err) {
    throw new Error(err);
  }
});

module.exports = {
  patientregister,
  login,
  addnewadmin,
  getalldoctors,
  getuserdetails,
  logoutadmin,
  logoutpatient,
  registerdoctor,
  registerdoctor,
};
