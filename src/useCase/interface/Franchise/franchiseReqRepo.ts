import franchiseReq from "../../../domain/franchiseReq";

interface FranchiseReqRepo {
    save(franchiseReq:franchiseReq):Promise<franchiseReq>
    findByEmail(email:string): Promise<franchiseReq | null>;
}

export default FranchiseReqRepo;