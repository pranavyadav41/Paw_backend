 import User from "../../domain/user"
 import franchise from "../../domain/franchise";
 import approve from "../../domain/approval";
 
 interface adminRepo{
    getUsers():Promise<{}[] | null>;
    blockUser(userId:string):Promise<boolean>
    unBlockUser(userId:string):Promise<boolean>
    getFranchiseReqests():Promise<{}[] | null>
    approveFranchise(reqId:string):Promise<approve | boolean>
    findByEmail(email:string):Promise<franchise | null>
    rejectFranchise(reqId:string):Promise<{status:boolean;email:string}>
    getFranchises():Promise<{}[] | null>
    blockFranchise(franchiseId:string):Promise<boolean>
    unBlockFranchise(franchiseId:string):Promise<boolean>
   
   }

 export default adminRepo