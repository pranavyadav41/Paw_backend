import User from "../domain/user";
import UserRepository from "../infrastructure/repository/userRepository";
import EncryptPassword from "../infrastructure/services/bcryptPassword";
import JWTToken from "../infrastructure/services/generateToken";

class UserUseCase{
    private UserRepository:UserRepository
    private EncryptPassword:EncryptPassword
    private JwtToken:JWTToken

    constructor(UserRepository:UserRepository,encryptPassword:EncryptPassword,jwtToken:JWTToken){
        this.UserRepository=UserRepository
        this.EncryptPassword=encryptPassword
        this.JwtToken=jwtToken
    }

    async signup(email:string){
        const userExist=await this.UserRepository.findByEmail(email)

        if(userExist){
            return {
                status:400,
                data:{
                    status:false,
                    message:'User already exists'
                }
            }
        }
        return {
            status:200,
            data: {
                status:true,
                message:'Verification otp sent to your email'
            }
        }
    }
    async verifyOtpUser(user:User){

        const hashedPassword = await this.EncryptPassword.encryptPassword(user.password)

        const newUser={...user,password:hashedPassword}

        const userData=await this.UserRepository.save(newUser)

        return {
            status:200,
            data:userData
        }




    }
}

export default UserUseCase