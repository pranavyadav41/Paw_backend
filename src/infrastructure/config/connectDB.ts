import mongoose from "mongoose"
import {DB_NAME} from "./constants"


const connectDB=async ()=>{

    try {
        const connectionInstance=await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\n MogoDB connected ! ! DB HOST: ${connectionInstance.connection.host}`);
        
    } catch (error) {
        const err:Error = error as Error;
        console.log("Error connecting to MongoDB",err)
        process.exit(1)
    }
}

export {connectDB}