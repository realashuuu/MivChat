import mongoose from "mongoose";

//function to connect to the mongoDB database
export const connectDB = async()=>{
  try{
    //event listener for successful connection
    mongoose.connection.on("connected", ()=>
      console.log("database connected"));
    
    await mongoose.connect(`${process.env.MONGODB_URI}/chat-app`)
  }catch(error){
    console.log("Error conneting to the Database", error);
  }
}