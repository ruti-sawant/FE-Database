const mongoose = require("mongoose");
const Models = require("../models/dailyDiary.model.js");

module.exports.insertDailyDiary = async function (diary) {
    return new Promise((resolve, reject) => {
        const diaryObject = new Models.DailyDiary(diary);
        diaryObject.save()
            .then(resolve)
            .catch(reject);
    });
}

module.exports.getAllDiaries = function (fields) {
    return new Promise((resolve, reject) => {
        Models.DailyDiary.find({}, fields)
            .then(resolve)
            .catch(reject);
    });
}


module.exports.getDiary = function (diaryId, fields) {
    return new Promise((resolve, reject) => {
        Models.DailyDiary.findOne({ _id: diaryId }, fields)
            .then(resolve)
            .catch(reject);
    });
}
module.exports.getFarmerDiaries = function (farmerId, fields) {
    return new Promise((resolve, reject) => {
        console.log(farmerId);
        Models.DailyDiary.find({ farmerId: farmerId }, fields)
            .then(resolve)
            .catch(reject);
    });
}

module.exports.updateDiary = function (diaryId, data) {
    return new Promise((resolve, reject) => {
        Models.DailyDiary.updateOne({ _id: diaryId },
            { $set: data }
        )
            .then(resolve)
            .catch(reject);
    });
}

module.exports.deleteDiary = function (diaryId) {
    return new Promise((resolve, reject) => {
        Models.DailyDiary.deleteOne({
            _id: diaryId
        })
            .then(resolve)
            .catch(reject);
    });
}

module.exports.deleteFarmerDiary = function (farmerId) {
    return new Promise((resolve, reject) => {
        Models.DailyDiary.deleteMany({
            farmerId: farmerId
        })
            .then(resolve)
            .catch(reject);
    })
}