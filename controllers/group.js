const Group = require('../models/group');
const UserGroup = require('../models/usergroup');
const Chat = require('../models/chat');
const User = require('../models/user');


const createGroup = async (req, res, next) => {
    try{
        const {group_name} = req.body;
    
        const group = await req.user.createGroup({
            name: group_name
        }, {through: {isAdmin : true}})
    
        console.log(`success ===>group`);
        return res.status(200).json({success : true, name: group.name , id:group.id});
    }catch(err){
        console.log(err);
        return res.status(500).json({success : false, message: 'Something went wrong !'});
    }
}


const getGroups= async (req, res, next) => {

    try{
        const arrayOfGroups = await req.user.getGroups({
            attributes : ["id" , "name"]
        });
    
        const groups = arrayOfGroups.map(ele => {
            return {id : ele.id, name: ele.name};
        });
        
        console.table(groups);
    
        res.status(200).json({success : true, groups});
    }catch(err) {
        console.log(err);
        res.status(500).json({success : false , message : `Something went wrong !`});
    }
   
}


const deleteGroup = async (req, res, next) => {
    try{
        const {id} = req.params;
        console.log(req.params, req.user.id);
        
        const memberIsAdmin = await UserGroup.findOne({where : {groupId: id, userId : req.user.id , isAdmin: true}});
        if(!memberIsAdmin){
            return res.status(400).json({success : false ,message : `Only Admin can delete group !`});
        }

        if(memberIsAdmin){
            const group = await Group.destroy({where : { id : id}});
            return res.status(200).json({success : true ,message : `Group has deleted sucessfully`});
        }
    }catch(err){
        console.log(err);
        return res.status(500).json({success: false, message : `Something went wrong !`});
    }
}

const {Sequelize, Op} = require('sequelize');

const getAllGroups = async (req, res, next) => {
    try{
        console.log(req.body);
        const {groupsId} = req.body;
    
        const allOtherGroups = await Group.findAll({
            where: {
                id: { [Sequelize.Op.notIn]: groupsId}
            },
            attributes : ['id' , 'name']
    
        })
    
        console.table(allOtherGroups);
        
        res.status(200).json({success:true , allOtherGroups});
    }catch(err){
        console.log(err);
        res.status(500).json({success:false , message: `Something went wrong !`});
    }
}


const joinGroup = async (req, res, next) => {
    try{
        console.log(req.params);

        const update = await UserGroup.create({
            groupId : req.params.id,
            userId : req.user.id,
            isAdmin : false
        })
    
        res.status(200).json({success: true , message : `Congratulations ! Now you are in the group`});
    }catch(err){
        console.log(err);
        res.status(500).json({success:false , message: `Something went wrong !`});
    }
    
}
module.exports = {createGroup,getGroups,deleteGroup,getAllGroups,joinGroup}