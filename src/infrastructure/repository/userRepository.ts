import User from "../../domain/user";
import UserModel from "../database/userModel";
import UserRepo from "../../useCase/interface/userRepo";

class UserRepository implements UserRepo {
  //saving user details to database
  async save(user: User): Promise<User> { 
    const newUser = new UserModel(user);
    const savedUser = await newUser.save(); 
    return savedUser;
  }
  async findByEmail(email: string): Promise<User | null> {
    const userData = await UserModel.findOne({ email: email });

    return userData;
  }
  async findById(_id: string): Promise<User | null> {
    const userData = await UserModel.findById(_id);

    return userData;
  }
  async changePassword(userId: string, password: string): Promise<boolean> {
    const result = await UserModel.updateOne(
      {
        _id: userId,
      },
      {$set:{password:password}}
    );

    return result.modifiedCount>0
  } 
}

export default UserRepository;
