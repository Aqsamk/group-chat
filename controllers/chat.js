const Message = require('../models/chat')
const User = require('../models/user')


const addmessage = async (req, res) => {
  const { messageInp } = req.body;

  if (messageInp === undefined) {
    return res.status(400).json({ success: false, message: 'Parameters missing' });
  }

  try {
    const message = await Message.create({ messageInp, userName: req.user.name });
    const user = await User.findByPk(req.user.id);
    console.log(req.user.name)
    await user.addMessage(message);
    res.status(200).json({ message });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error });
  }
};

const getmessages = async (req, res) => {
  try {
    const messages = await Message.findAll({ include: User });
    return res.status(200).json({ messages, success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error, success: false });
  }
};

// const getChatUser = async(req,res)=>{
//   try{
//       const userID = req.body.id;
//       const username = await User.findOne({ where : {id:userID}})
//       let name = username.name;
//       res.status(200).json({username:name});
//   }catch(err){
//       console.log(err);
//   }
// }

module.exports = { addmessage, getmessages};
