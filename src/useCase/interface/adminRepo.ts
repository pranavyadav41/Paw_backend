 import User from "../../domain/user"
 import franchise from "../../domain/franchise";
 import approve from "../../domain/approval";
 import Service from "../../domain/service";
 
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
    addService(service:Service):Promise<boolean>
    editService(service:Service):Promise<boolean>
    deleteService(serviceId:string):Promise<boolean>


   
   }

 export default adminRepo