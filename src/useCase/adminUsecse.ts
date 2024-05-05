 import adminRepo from "../infrastructure/repository/adminRepository";

 class adminUseCase{

    private AdminRepo:adminRepo
    
    constructor(AdminRepo:adminRepo){
        this.AdminRepo=AdminRepo
    }
    
    async getUsers(){
        const data=await this.AdminRepo.getUsers()

        if(data){ 
            return {
                status:200,
                data:data

            }
        }else{
            return {
                status:400,
                message:"failed to fetch data!please try again"
            }
        }
    }
    async blockUser(userId:string){
        const result=await this.AdminRepo.blockUser(userId)

        if(result){
            return {
                status:200,
                data:{
                    status:true,
                    message:"blocked user successfully"
                }
            }
        }else{
            return {
                status:400,
                data:{
                    status:false,
                    messaged:"failed to block user! please try later"
                }
            }
        }
    }
    async unBlockUser(userId:string){
        const result=await this.AdminRepo.unBlockUser(userId)

        if(result){
            return {
                status:200,
                data:{
                    status:true,
                    message:"Unblocked user successfully"
                }
            }

        }else{
            return {
                status:400,
                data:{
                    status:false,
                    messaged:"failed to block user! please try later"
                }
            }
        }
    }

 }
 export default adminUseCase