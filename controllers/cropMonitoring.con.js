import { CropMonitoring } from "../models/cropMonitoring.model.js";

//to get all crop monitoring
export function getAllMonitoring(fields) {
    return new Promise((resolve, reject) => {
        CropMonitoring.find({}, fields)
            .then(resolve)
            .catch(reject);
    });
}

//get single crop monitoring
export function getMonitoring(_id, fields) {
    return new Promise((resolve, reject) => {
        CropMonitoring.findOne({ _id }, fields)
            .then(resolve)
            .catch(reject);
    });
}

//get crop monitoring related to single plot
export function getMonitoringForPlot(MHCode, fields) {
    return new Promise((resolve, reject) => {
        CropMonitoring.find({ MHCode }, fields)
            .then(resolve)
            .catch(reject);
    });
}

//insert crop monitoring.
export function insertMonitoring(monitoring) {
    return new Promise((resolve, reject) => {
        const monitoringObject = new CropMonitoring(monitoring);
        monitoringObject.save()
            .then(resolve)
            .catch(reject);
    });
}

//delete crop monitoring by its id.
export function deleteMonitoring(_id) {
    return new Promise((resolve, reject) => {
        CropMonitoring.deleteOne({ _id })
            .then(resolve)
            .catch(reject);
    });
}

//delete crop monitoring for any plot by MHCode.
export function deleteMonitoringForPlot(MHCode) {
    return new Promise((resolve, reject) => {
        CropMonitoring.deleteMany({ MHCode })
            .then(resolve)
            .catch(reject);
    })
}