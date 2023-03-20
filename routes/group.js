
const express = require('express');

const router = express.Router();

const groupController = require('../controllers/group');
const authorization = require('../middleware/auth');

router.post('/createGroup', authorization.authenticate,  groupController.createGroup);

router.get('/getGroup' ,  authorization.authenticate , groupController.getGroups)

router.get('/delete/:id' ,   authorization.authenticate, groupController.deleteGroup);

router.post('/getAllGroups' , groupController.getAllGroups);

router.get('/join/:id' , authorization.authenticate , groupController.joinGroup);

module.exports = router;