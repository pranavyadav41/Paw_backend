 import User from "../../domain/user"
 
 interface adminRepo{
    getUsers():Promise<{}[] | null>;
    blockUser(userId:string):Promise<boolean>
    unBlockUser(userId:string):Promise<boolean>

 }

 export default adminRepo