import address from "../../domain/address";

interface Address {
  name: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
}

interface addressRepo {
  save(address: address, userId: string): Promise<boolean>;
  getAddress(Id: string): Promise<Address[]>;
}

export default addressRepo;
