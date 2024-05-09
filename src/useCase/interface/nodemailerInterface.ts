interface Nodemailer{
    sendConfirmation(email:string):void
    sendMail(email:string,otp:number):void
}
export default Nodemailer