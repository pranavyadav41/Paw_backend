import UserModel from "../database/userModel";
import { ObjectId } from 'mongodb';
import * as mongoose from 'mongoose';
import adminRepo from "../../useCase/interface/adminRepo";

class adminRepository implements adminRepo{

    async getUsers(): Promise<{}[] | null> {

        let users=await UserModel.find({isAdmin:false})
        return users
        
    }
    async blockUser(userId: string): Promise<boolean> {   

        let result=await UserModel.updateOne(
            {_id:userId},
            {$set:{isBlocked:true}}
        )
        return result.modifiedCount>0
        
    }
    async unBlockUser(userId: string): Promise<boolean> {

        let result=await UserModel.updateOne(
            {_id:userId},
            {$set:{isBlocked:false}}

        )
        return result.modifiedCount>0
        
    }

}
export default adminRepository