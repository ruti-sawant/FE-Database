import { CropMonitoring } from "../models/cropMonitoring.model.js";


export function getAllMonitoring(fields) {
    return new Promise((resolve, reject) => {
        CropMonitoring.find({}, fields)
            .then(resolve)
            .catch(reject);
    });
}

export function getMonitoring(_id, fields) {
    return new Promise((resolve, reject) => {
        CropMonitoring.findOne({ _id }, fields)
            .then(resolve)
            .catch(reject);
    });
}

export function getMonitoringForPlot(MHCode, fields) {
    return new Promise((resolve, reject) => {
        CropMonitoring.find({ MHCode }, fields)
            .then(resolve)
            .catch(reject);
    });
}

export function insertMonitoring(monitoring) {
    return new Promise((resolve, reject) => {
        const monitoringObject = new CropMonitoring(monitoring);
        monitoringObject.save()
            .then(resolve)
            .catch(reject);
    });
}

export function deleteMonitoring(_id) {
    return new Promise((resolve, reject) => {
        CropMonitoring.deleteOne({ _id })
            .then(resolve)
            .catch(reject);
    });
}

export function deleteMonitoringForPlot(MHCode) {
    return new Promise((resolve, reject) => {
        CropMonitoring.deleteMany({ MHCode })
            .then(resolve)
            .catch(reject);
    })
}