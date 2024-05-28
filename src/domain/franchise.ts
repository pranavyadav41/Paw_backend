interface franchise {
  _id:string
  name: string;
  email: string;
  password: string;
  phone: string;
  area:string;
  district: string;
  city: string;
  pincode: string;
  state: string;
  isBlocked:boolean;
  openingTime:string;
  closingTime:string;
  services: Service[];
  location: {
    type: {
      type: String,
      default: "Point",
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
}

interface Service {
  serviceName: string;
  serviceId: string;
  timeToComplete: any;
  _id: string;
}

export default franchise;
