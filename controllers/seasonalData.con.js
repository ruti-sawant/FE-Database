import { SeasonalFarmerData } from "../models/farmers.model.js";

export function getAllSeasonalData(fields) {
    return new Promise((resolve, reject) => {
        SeasonalFarmerData.find({}, fields)
            .then(resolve)
            .catch(reject);
    })
}

export function getFarmerSeasonalData(farmerId, fields) {
    return new Promise((resolve, reject) => {
        SeasonalFarmerData.find({ farmerId }, fields)
            .then(resolve)
            .catch(reject);
    });
}

export function getPlotsSeasonalData(plotId, fields) {
    return new Promise((resolve, reject) => {
        SeasonalFarmerData.find({ plotId }, fields)
            .then(resolve)
            .catch(reject);
    });
}

export function getMHCodeSeasonalData(MHCode, fields) {
    return new Promise((resolve, reject) => {
        SeasonalFarmerData.find({ MHCode }, fields)
            .then(resolve)
            .catch(reject);
    });
}

export function getSeasonalData(id, fields) {
    return new Promise((resolve, reject) => {
        SeasonalFarmerData.findOne({
            _id: id
        }, fields)
            .then(resolve)
            .catch(reject);
    });
}

export function insertSeasonalData(seasonalData) {
    return new Promise((resolve, reject) => {
        const data = new SeasonalFarmerData(seasonalData);
        data.save()
            .then(resolve)
            .catch(reject);
    });
}

export function updateSeasonalData(id, data) {
    return new Promise((resolve, reject) => {
        SeasonalFarmerData.updateOne({ _id: id },
            { $set: data }
        )
            .then(resolve)
            .catch(reject);
    });
}

export function deleteFarmerSeasonalData(farmerId) {
    return new Promise((resolve, reject) => {
        SeasonalFarmerData.deleteMany({
            farmerId: farmerId
        })
            .then(resolve)
            .catch(reject);
    });
}

export function deleteSeasonalData(id) {
    return new Promise((resolve, reject) => {
        SeasonalFarmerData.deleteOne({
            _id: id
        })
            .then(resolve)
            .catch(reject);
    });
}