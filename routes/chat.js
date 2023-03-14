const express = require("express");
const chatController = require("../controllers/chat");
const authenticatemiddleware = require("../middleware/auth");
const router = express.Router();

router.post("/chat",authenticatemiddleware.authenticate,chatController.addmessage);

module.exports = router;