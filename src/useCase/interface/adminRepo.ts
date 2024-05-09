 import User from "../../domain/user"
 import franchise from "../../domain/franchise";
 
 interface adminRepo{
    getUsers():Promise<{}[] | null>;
    blockUser(userId:string):Promise<boolean>
    unBlockUser(userId:string):Promise<boolean>
    getFranchiseReqests():Promise<{}[] | null>
    approveFranchise(reqId:string):Promise<franchise |null>
    rejectFranchise(reqId:string):Promise<boolean>
    getFranchises():Promise<{}[] | null>
   
   }

 export default adminRepo