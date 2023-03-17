const express = require("express");
const chatController = require("../controllers/chat");
const authenticatemiddleware = require("../middleware/auth");
const router = express.Router();

router.post("/chat",authenticatemiddleware.authenticate,chatController.addmessage);
router.get("/getchat",authenticatemiddleware.authenticate,chatController.getmessages)
//router.get("/getusers",authenticatemiddleware.authenticate,chatController.getChatUser)

module.exports = router;