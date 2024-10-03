const asyncHandler = require("express-async-handler");
const MessageModel = require("../Model/Message");
const {isadminAuthenticated,ispatientAuthenticated}=require('../Middleware/Auth')

const sendmessage = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, phone, message } = req.body;
  try {
    if (!firstName || !lastName || !email || !phone || !message) {
      throw new Error("please fill full form");
    }
    await MessageModel.create({ firstName, lastName, email, phone, message });
    res.status(200).json({ success: true, message: "Message sent" });
  } catch (err) {
    throw new Error(err);
  }
});



const getallmessage = asyncHandler(async (req, res) => {
  try {
    const messages = await MessageModel.find();
    res.json({ success: true, messages });
  } catch (err) {
    throw new Error(JSON.stringify(err));
  }
});
module.exports = {
  sendmessage,
  getallmessage,
};
