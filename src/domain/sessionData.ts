interface SessionData {
  userData: {
    email: string;
    name: string;
    password: string;
    phone: string;
  } | null;
  otp: number | null;
  otpGeneratedAt: number | null;
}

export default SessionData;
