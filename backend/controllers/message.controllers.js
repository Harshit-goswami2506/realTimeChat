import uploadOnCloudinary from "../config/cloudinary.js";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getSocketId, io } from "../socket/socket.js";

export const sendMessage=async(req,res)=>{
    try {
        let sender =req.userId
        let {reciver}=req.params
        let {message}=req.body
        let image;
        if(req.file){
            image=await uploadOnCloudinary(req.file.path)
        }

        let conversation=await Conversation.findOne({
            participants:{$all:[sender,reciver]}
        })
        let newMessage=await Message.create({
            sender,reciver,message,image
        })
        if(!conversation){
            conversation=await Conversation.create({
                participants:[sender,reciver],
                message:[newMessage._id]
            })
        }else{
            conversation.message.push(newMessage._id)
            await conversation.save()
        }
        const reciverSocketId=getSocketId(reciver)
        if(reciverSocketId){
            io.to(reciverSocketId).emit("newMessage",newMessage)
        }

        return res.status(201).json(newMessage)

    } catch (error) {
        return res.status(500).json({message:`error in message.controller.js in send message ${error}`})
    }
}

export const getMessages=async(req,res)=>{
    try {
         let sender =req.userId
        let {reciver}=req.params
        let conversation=await Conversation.findOne({
            participants:{$all:[sender,reciver]}
        }).populate("message")
        if(!conversation){
            return res.status(400).json({message:"no conversation found"})
        }
        return res.status(200).json(conversation?.message)
    } catch (error) {
       return res.status(500).json({message:`error in message.controller.js in get message ${error}`})
    }
}