import mongoose from 'mongoose';
const adminSchema = {
    name: String,
    email: String,
    mobileNumber: String,
    role: String,
    userId: String
};
export const Admin = mongoose.model("admin", adminSchema);

export default Admin;