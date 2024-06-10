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
    ref: 'Franchise';
    required: true;
  };
  bookingDate: Date;
  scheduledDate:Date;
  startTime: string;
  endTime: string;
  userId: {
    type: typeof Schema.Types.ObjectId;
    ref: 'User';
    required: true;
  };
  address: any;
  serviceId: {
    type: typeof Schema.Types.ObjectId;
    ref: 'Service';
    required: true;
  };
  sizeOfPet: {
    type: string;
    required: true;
  };
  bookingStatus: {
    type: string;
    default: "Pending";
  };
  totalAmount:{
    type:string;
    required:true
  }
}

export default Booking;
