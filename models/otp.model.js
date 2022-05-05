import mongoose from 'mongoose';


const otpSchema = {
    number: String,
    otp: Number,
    expireIn: Number,
    counter: Number,
    userId: String,
}

export const OTP = mongoose.model("otp", otpSchema);

export default OTP;