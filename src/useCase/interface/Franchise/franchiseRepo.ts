import Franchise from "../../../domain/franchise";
import approve from "../../../domain/approval";

interface FranchiseRepo {
    save(franchise:any):Promise<Franchise>
    findByEmail(email:string): Promise<Franchise | null>;
}

export default FranchiseRepo;