const mongoose = require("mongoose");
const Model = require("../models/filter.model.js");

module.exports.insertFarmerName = function (farmerName) {

}

module.exports.getFilters = function () {
    return new Promise((resolve, reject) => {
        Model.Filter.find()
            .then(resolve)
            .catch(reject);
    });
}