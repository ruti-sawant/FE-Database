import mongoose from 'mongoose';

const loginSchema = {
    userId: String,
    password: String,
    userType: String,
    mongoId: String,
};


export const Login = mongoose.model("login", loginSchema);
export default Login;