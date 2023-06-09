const express = require("express");
const chatController = require("../controllers/chat");
const authenticatemiddleware = require("../middleware/auth");
const router = express.Router();

router.post("/chat",authenticatemiddleware.authenticate,chatController.addmessage);
router.get("/getchat",authenticatemiddleware.authenticate,chatController.getmessages)
//router.get("/getusers",authenticatemiddleware.authenticate,chatController.getChatUser)
router.post('/sendMessage/:groupId', authorization.authentication,  chatController.sendMessageInGroup);
router.get('/getMessage/:groupId' , authorization.authentication,  chatController.getMessageInGroup);
router.get('/getUsers/:groupId' ,  chatController.getUsers);
router.post('/addUser/:groupId' , authorization.authentication ,  chatController.addUser);
router.post('/makeAdmin/:groupId' , authorization.authentication ,  chatController.makeAdmin);
router.post('/deleteUser/:groupId' , authorization.authentication ,  chatController.deleteUser);
router.post('/removeAdmin/:groupId' , authorization.authentication ,  chatController.removeAdmin);

const multer = require('multer');
const upload = multer();

router.post('/sendFile/:groupId' , authorization.authentication, upload.single('file'), chatController.sendFile);


module.exports = router;