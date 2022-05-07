import bcrypt from 'bcrypt';
import Admin from '../models/admins.model.js';
import Login from '../models/login.model.js';

//to get all admins
export function getAllAdmins(fields) {
    return new Promise((resolve, reject) => {
        Admin.find({}, fields)
            .then(resolve)
            .catch(reject);
    });
}

//get single admin
export function getAdmin(adminId, fields) {
    return new Promise((resolve, reject) => {
        Admin.findOne({ _id: adminId }, fields)
            .then(resolve)
            .catch(reject);
    });
}

//add admin into database and create login account.
export function addAdmin(admin) {
    return new Promise((resolve, reject) => {
        //create admin object.
        const adminObject = new Admin(admin);
        adminObject.save()
            .then((data) => {
                //create login object.
                const userId = admin.userId;
                const password = admin.userId;
                const userType = admin.role;
                const mongoId = data._id;
                const saltRounds = Number(process.env.SALT_ROUNDS);
                //creating hashed password.
                bcrypt.hash(password, saltRounds, function (err, hash) {
                    if (err) {
                        //console.log("err", err);
                        reject(err);
                        return;
                    } else {
                        const login = new Login({
                            userId, password: hash, userType, mongoId
                        });
                        //console.log(userId, password, hash, userType, mongoId);
                        login.save()
                            .then((result) => {
                                //console.log(result);
                            })
                            .catch((err) => {
                                //console.log("err last", err);
                                reject(err);
                                return;
                            });
                    }
                });
                resolve(data);
            })
            .catch(reject);
    });
}

//update admin details.
export function updateAdmin(adminId, data) {
    return new Promise((resolve, reject) => {
        Admin.updateOne({ _id: adminId },
            { $set: data }
        )
            .then(resolve)
            .catch(reject);
    });
}

//delete admin and also delete login details.
export function deleteAdmin(adminId) {
    return new Promise((resolve, reject) => {
        Admin.findOneAndDelete({ _id: adminId })
            .then((data) => {
                //after deleting admin delete its login details.
                Login.findOneAndDelete({ mongoId: adminId })
                    .then((result) => {
                        //console.log(result);
                    })
                    .catch((err) => {
                        //console.log("err", err);
                    });


                resolve(data);
            })
            .catch(reject);
    });
}
