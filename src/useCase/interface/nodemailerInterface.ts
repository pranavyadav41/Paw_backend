interface Nodemailer{
    sendConfirmation(email:string):void
    sendRejection(email:string):void
    sendMail(email:string,otp:number):void
}
export default Nodemailer