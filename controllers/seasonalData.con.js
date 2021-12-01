const mongoose = require("mongoose");
const Models = require("../models/farmers.model");

module.exports.getAllSeasonalData = function (fields) {
    return new Promise((resolve, reject) => {
        Models.SeasonalFarmerData.find({}, fields)
            .then(resolve)
            .catch(reject);
    })
}

module.exports.getFarmerSeasonalData = function (farmerId, fields) {
    return new Promise((resolve, reject) => {
        Models.SeasonalFarmerData.find({
            farmerId: farmerId
        }, fields)
            .then(resolve)
            .catch(reject);
    });
}

module.exports.getPlotsSeasonalData = function (plotId, fields) {
    return new Promise((resolve, reject) => {
        Models.SeasonalFarmerData.find({
            plotId: plotId
        }, fields)
            .then(resolve)
            .catch(reject);
    });
}

module.exports.getSeasonalData = function (id, fields) {
    return new Promise((resolve, reject) => {
        Models.SeasonalFarmerData.findOne({
            _id: id
        }, fields)
            .then(resolve)
            .catch(reject);
    });
}

module.exports.insertSeasonalData = function (seasonalData) {
    return new Promise((resolve, reject) => {
        const data = new Models.SeasonalFarmerData(seasonalData);
        data.save()
            .then(resolve)
            .catch(reject);
    });
}

module.exports.updateSeasonalData = function (id, data) {
    return new Promise((resolve, reject) => {
        Models.SeasonalFarmerData.updateOne({ _id: id },
            { $set: data }
        )
            .then(resolve)
            .catch(reject);
    });
}

module.exports.deleteFarmerSeasonalData = function (farmerId) {
    return new Promise((resolve, reject) => {
        Models.SeasonalFarmerData.deleteMany({
            farmerId: farmerId
        })
            .then(resolve)
            .catch(reject);
    });
}

module.exports.deleteSeasonalData = function (id) {
    return new Promise((resolve, reject) => {
        Models.SeasonalFarmerData.deleteOne({
            _id: id
        })
            .then(resolve)
            .catch(reject);
    });
}