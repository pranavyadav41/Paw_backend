import User from "../domain/user";
import UserRepository from "../infrastructure/repository/userRepository";
import EncryptPassword from "../infrastructure/services/bcryptPassword";
import JWTToken from "../infrastructure/services/generateToken";

class UserUseCase {
  private UserRepository: UserRepository;
  private EncryptPassword: EncryptPassword;
  private JwtToken: JWTToken;

  constructor(
    UserRepository: UserRepository,
    encryptPassword: EncryptPassword,
    jwtToken: JWTToken
  ) {
    this.UserRepository = UserRepository;
    this.EncryptPassword = encryptPassword;
    this.JwtToken = jwtToken;
  }
  async signup(email: string) {
    const userExist = await this.UserRepository.findByEmail(email);

    if (userExist) {
      return {
        status: 400,
        data: {
          status: false,
          message: "User already exists",
        },
      };
    }
    return {
      status: 200,
      data: {
        status: true,
        message: "Verification otp sent to your email",
      },
    };
  }
  async verifyOtpUser(user: User) {
    const hashedPassword = await this.EncryptPassword.encryptPassword(
      user.password
    );

    const newUser = { ...user, password: hashedPassword };

    const userData = await this.UserRepository.save(newUser);

    let data = {
      _id: userData._id,
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      isBlocked: userData.isBlocked,
    };

    const token = this.JwtToken.generateToken(userData._id, "user");

    return {
      status: 200,
      data: data,
      token,
    };
  }
  async login(email: string, password: string) {
    const user = await this.UserRepository.findByEmail(email);
    let token = "";

    if (user) {
      let data = {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isBlocked: user.isBlocked,
      };

      if (user.isBlocked) {
        return {
          status: 400,
          data: {
            status: false,
            message: "You have been blocked by admin!",
            token: "",
          },
        };
      }

      const passwordMatch = await this.EncryptPassword.compare(
        password,
        user.password
      );

      if (passwordMatch && user.isAdmin) {
        token = this.JwtToken.generateToken(user._id, "admin");

        return {
          status: 200,
          data: {
            status: true,
            message: data,
            token,
            isAdmin: true,
          },
        };
      }

      if (passwordMatch) {
        token = this.JwtToken.generateToken(user._id, "user");

        return {
          status: 200,
          data: {
            status: true,
            message: data,
            token,
          },
        };
      } else {
        return {
          status: 400,
          data: {
            status: false,
            message: "Invalid email or password",
            token: "",
          },
        };
      }
    } else {
      return {
        status: 400,
        data: {
          status: false,
          message: "Invalid email or password",
          token: "",
        },
      };
    }
  }
  async forgotPassword(email: string) {
    let userExist = await this.UserRepository.findByEmail(email);

    if (userExist) {
      return {
        status: 200,
        data: {
          status: true,
          message: "Verification otp sent to your Email",
          userId: userExist._id,
        },
      };
    } else {
      return {
        status: 400,
        data: {
          status: false,
          message: "Email not registered!",
        },
      };
    }
  }
  async resetPassword(password: string, userId: string) {
    const hashedPassword = await this.EncryptPassword.encryptPassword(password);
    const changePassword = await this.UserRepository.changePassword(
      userId,
      hashedPassword
    );
    if (changePassword) {
      return {
        status: 200,
        message: "Password changed successfully",
      };
    } else {
      return {
        status: 400,
        message: "Failed please try again !",
      };
    }
  }
  async getService(Id: string) {
    const service = await this.UserRepository.getService(Id);

    return {
      status: 200,
      data: service,
    };
  }
  async editProfile(
    Id: string,
    data: { name: string; email: string; phone: string }
  ) {
    const profile = await this.UserRepository.editProfile(Id, data);

    if (profile) {
      const data = await this.UserRepository.findById(Id);

      const profileData = {
        _id: data?._id,
        name: data?.name,
        email: data?.email,
        phone: data?.phone,
        isBlocked: data?.isBlocked,
      };

      return {
        status: 200,
        data: {
          message: "Profile updated successfully",
          user: profileData,
        },
      };
    } else {
      return {
        status: 400,
        message: "Failed to update the data Please try again",
      };
    }
  }
  async getProfile(Id: string) {
    const profile = await this.UserRepository.findById(Id);

    let data = {
      _id: profile?._id,
      name: profile?.name, 
      email: profile?.email,
      phone: profile?.phone,
      isBlocked: profile?.isBlocked,
    };

    return {
      status: 200,
      data: data,
    };
  }

  async updatePassword(Id: string, password: string) {
    const hashedPassword = await this.EncryptPassword.encryptPassword(password);
    const changePassword = await this.UserRepository.changePassword(
      Id,
      hashedPassword
    );
    if (changePassword) {
      return {
        status: 200,
        message: "Password changed successfully",
      };
    } else {
      return {
        status: 400,
        message: "Failed please try again !",
      };
    }
  }
}

export default UserUseCase;
