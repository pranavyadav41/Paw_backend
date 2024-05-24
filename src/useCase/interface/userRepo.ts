import User from '../../domain/user'


interface UserRepo {

    save(user:User):Promise<User>;
    findByEmail(email:string): Promise<User | null>;
    findById(_id:string): Promise<User | null>
    getService(Id:string):Promise<any>
    editProfile(Id:string,data:{name:string,email:string,phone:string}):Promise<boolean>
}

export default UserRepo;   