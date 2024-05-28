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
  editAddress(Id: string,addressId: string,address: {name: string;houseName: string;street: string;city: string;state: string;pincode: string;}):Promise<boolean>
  deleteAddress(Id:string,addressId:string):Promise<boolean>
}

export default addressRepo;
