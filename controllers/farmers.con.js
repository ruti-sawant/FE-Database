const mongoose = require("mongoose");
const Models = require("../models/farmers.model.js");


module.exports.insertFarmer = function (farmer) {
    return new Promise((resolve, reject) => {
        const farmerObject = new Models.FarmerInfo(farmer);
        farmerObject.save()
            .then(resolve)
            .catch(reject);
    })
}



module.exports.getAllFarmersData = function (fields) {
    return new Promise((resolve, reject) => {
        Models.FarmerInfo.find({}, fields)
            .then(resolve)
            .catch(reject);
    });
}

module.exports.getFarmerData = function (id, fields) {
    return new Promise((resolve, reject) => {
        Models.FarmerInfo.findById(id, fields)
            .then(resolve)
            .catch(reject);
    })
}


module.exports.getFarmerDataUsingGGN = function (id, fields) {
    return new Promise((resolve, reject) => {
        Models.FarmerInfo.find({ "personalInformation.GGN": id }, fields)
            .then(resolve)
            .catch(reject);
    });
}

module.exports.getFarmerUsingMHCode = function (id, fields) {
    return new Promise((resolve, reject) => {
        Models.FarmerInfo.find({ "plots.farmInformation.MHCode": id }, fields)
            .then(resolve)
            .catch(reject);
    });
}

module.exports.updateFarmer = function (id, data) {
    return new Promise((resolve, reject) => {
        Models.FarmerInfo.updateOne({ _id: id },
            { $set: data }
        )
            .then(resolve)
            .catch(reject);
    });
}

module.exports.updatePlotOfFarmer = function (_id, data) {
    return new Promise((resolve, reject) => {
        Models.FarmerInfo.updateOne({ "plots._id": _id }, {
            $set: {
                "plots.$.farmInformation": data.farmInformation,
                "plots.$.address": data.address,
                "plots.$.other": data.other,
                "plots.$.cropSpacing": data.cropSpacing
            }
        })
            .then(resolve)
            .catch(reject);
    });
}

module.exports.deleteFarmer = function (id) {
    return new Promise((resolve, reject) => {
        Models.FarmerInfo.deleteOne({
            _id: id
        })
            .then(resolve)
            .catch(reject);
    });
}