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

        const token =this.JwtToken.generateToken(userData._id,'user')

        return {
            status:200,
            data:userData,
            token
        }
    }
    async login(email:string,password:string){
        
        const user=await this.UserRepository.findByEmail(email)
        let token=''

        if(user){

            if(user.isBlocked){
                return {
                    status:400,
                    data: {
                        status:false,
                        message:'You have been blocked by admin!',
                        token:''
                    }

                }

            }

            const passwordMatch=await this.EncryptPassword.compare(password,user.password)

            if(passwordMatch && user.isAdmin){
                token=this.JwtToken.generateToken(user._id,'admin')

                return {
                    status:200,
                    data:{
                        status:true,
                        message:user,
                        token,
                        isAdmin:true
                    }
                }
            }

            if(passwordMatch){
                token=this.JwtToken.generateToken(user._id,'user')

                return {
                    status:200,
                    data:{
                        status:true,
                        message:user,
                        token
                    }
                }
            }else{
                return {
                    status:400,
                    data:{
                        status:false,
                        message:"Invalid email or password",
                        token:''
                    }
                }
            }
        }else{

            return {
                status:400,
                data:{
                    status:false,
                    message:"Invalid email or password",
                    token:''
                }
            }
        }
    }
    async forgotPassword(email:string){
        let userExist=await this.UserRepository.findByEmail(email)

        if(userExist){
            return{
                status:200,
                data:{
                    status:true,
                    message:"Verification otp sent to your Email",
                    userId:userExist._id
                }
            }
        }else{
            return{
                status:400,
                data:{
                    status:false,
                    message:"Email not registered!"
                }
            }
        }

    }
    async resetPassword(password:string,userId:string){
        const hashedPassword = await this.EncryptPassword.encryptPassword(password)
        const changePassword = await this.UserRepository.changePassword(userId,hashedPassword)
        if(changePassword){
            return {
                status:200,
                message:"Password changed successfully"
            }
        }else{
            return {
                status:400,
                message:"Failed please try again !"
            }
        }

    }
}

export default UserUseCase