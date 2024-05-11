interface Service {
  category: string;
  services: string[];
  price: {
      small: number;
      medium: number;
      large: number;
  };

}
  
  export default Service;