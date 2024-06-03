import { Schema } from "mongoose";
// Define the Booking interface
interface Booking {
    franchiseId:{
        type: typeof Schema.Types.ObjectId;
        ref: string;
        required: true;
    }
    bookingDate: Date;
    startTime: string;
    endTime: string;
    userId: {
        type: typeof Schema.Types.ObjectId;
        ref: string;
        required: true;
    }
    address: any;
    serviceId:{
        type: typeof Schema.Types.ObjectId;
        ref: string;
        required: true;
    }
  }

export default Booking