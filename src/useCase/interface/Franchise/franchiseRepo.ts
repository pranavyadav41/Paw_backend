import Franchise from "../../../domain/franchise";

interface FranchiseRepo {
    save(franchise:Franchise):Promise<Franchise>
    findByEmail(email:string): Promise<Franchise | null>;
}

export default FranchiseRepo;