import nodemailer from "nodemailer";
import Nodemailer from "../../useCase/interface/nodemailerInterface";
import dotenv from 'dotenv'
dotenv.config()

class sendOtp{
    private transporter : nodemailer.Transporter
    constructor(){
        this.transporter = nodemailer.createTransport({
            service:'gmail',
            auth:{
                user:'akpranavyadav@gmail.com',
                pass:process.env.MAILER,
            },
        })
    }

    sendMail(email:string,verif_code:number):void{
        const mailOptions :nodemailer.SendMailOptions = {
            from:'akpranavyadav@gmail.com',
            to:email,
            subject:'Paw Email Verification',
            text: `${email},your verification code is: ${verif_code}`
        }
        this.transporter.sendMail(mailOptions,(err)=>{
            if(err){
                console.log(err)
            }else{
                console.log('verification code sent successfully')
            }
        })
    }
}

export default sendOtp

