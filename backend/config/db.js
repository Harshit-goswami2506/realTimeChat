import mongoose from "mongoose";

const connectDb=async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL)
        console.log("Connected to mongoDB");
    }catch(err){
        console.log("Error while connecting to mongoDB",err);
    }  
}
export default connectDb;