import Franchise from "../../../domain/franchise";
import approve from "../../../domain/approval";

interface FranchiseRepo {
    save(franchise:any):Promise<Franchise>
    findByEmail(email:string): Promise<Franchise | null>;
    findById(Id:string):Promise<Franchise | null>
    changePassword(Id:string,password:string):Promise<boolean>
    updateProfile(Id:string,data:{name:string,phone:string,email:string}):Promise<boolean>
    updateAddress(Id:string,address:{city:string,state:string,district:string,pincode:string}):Promise<boolean>
}

export default FranchiseRepo;