import { Schema } from "mongoose";
// Define the Booking interface
interface Booking {
  name: {
    type: string;
    required: true;
  };
  phone: {
    type: string;
    required: true;
  };
  franchiseId: {
    type: typeof Schema.Types.ObjectId;
    ref: string;
    required: true;
  };
  bookingDate: Date;
  startTime: string;
  endTime: string;
  userId: {
    type: typeof Schema.Types.ObjectId;
    ref: string;
    required: true;
  };
  address: any;
  serviceId: {
    type: typeof Schema.Types.ObjectId;
    ref: string;
    required: true;
  };
  sizeOfPet: {
    type: string;
    required: true;
  };
  bookingStatus: {
    type: string;
    default: "pending";
  };
  totalAmount:{
    type:string;
    required:true
  }
}

export default Booking;
