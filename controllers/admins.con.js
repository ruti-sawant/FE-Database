import Admin from '../models/admins.model.js';

export function getAllAdmins(fields) {
    return new Promise((resolve, reject) => {
        Admin.find({}, fields)
            .then(resolve)
            .catch(reject);
    });
}

export function getAdmin(adminId, fields) {
    return new Promise((resolve, reject) => {
        Admin.findOne({ _id: adminId }, fields)
            .then(resolve)
            .catch(reject);
    });
}

export function addAdmin(admin) {
    return new Promise((resolve, reject) => {
        const adminObject = new Admin(admin);
        adminObject.save()
            .then(resolve)
            .catch(reject);
    });
}

export function updateAdmin(adminId, data) {
    return new Promise((resolve, reject) => {
        Admin.updateOne({ _id: adminId },
            { $set: data }
        )
            .then(resolve)
            .catch(reject);
    });
}

export function deleteAdmin(adminId) {
    return new Promise((resolve, reject) => {
        Admin.deleteOne({ _id: adminId })
            .then(resolve)
            .catch(reject);
    });
}
