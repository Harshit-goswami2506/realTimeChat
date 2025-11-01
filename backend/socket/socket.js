import http from 'http';
import express from 'express';
import { Server } from 'socket.io';
let app= express();

const server = http.createServer(app);
const io = new Server(server,{
    cors:{
        origin:"https://realtimechat-hqg0.onrender.com"
    }
})
 const userScoketMap ={}
export const getSocketId=(reciver)=>{
    return userScoketMap[reciver]
}
 io.on("connection",(socket)=>{
    const userId=socket.handshake.query.userId
    if(userId!=undefined){
        userScoketMap[userId]=socket.id
    }
    io.emit("getOnlineUsers",Object.keys(userScoketMap))


socket.on("disconnect", ()=>{
   delete userScoketMap[userId] 
   io.emit("getOnlineUsers",Object.keys(userScoketMap))
})



})




export {app, server,io};
