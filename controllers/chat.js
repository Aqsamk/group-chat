const Message = require('../models/chat')
const User = require('../models/user')



const addmessage = (req, res) => {
    const { message } = req.body;
    
    console.log(message)
    if(message == undefined ){
        return res.status(400).json({success: false, message: 'Parameters missing'})
    }
    Message.create({message,userId:req.user.id}).then(message => {
      User.update({
        messages : message
      },{
        where:{id:req.user.id}
      }).then(async()=>{
        res.status(200).json({message:message})
      }).catch(async(err) => {
        console.log(err)
        return res.status(500).json({success:false,error:err})
      })
    }).catch(async(err) => {
      return res.status(500).json({success:false,error:err})
    })
}

module.exports = {addmessage}