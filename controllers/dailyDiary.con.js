import { DailyDiary } from "../models/dailyDiary.model.js";

export function getAllDiaries(fields) {
    return new Promise((resolve, reject) => {
        DailyDiary.find({}, fields)
            .then(resolve)
            .catch(reject);
    });
}

export function getDiary(diaryId, fields) {
    return new Promise((resolve, reject) => {
        DailyDiary.findOne({ _id: diaryId }, fields)
            .then(resolve)
            .catch(reject);
    });
}

export function getFarmerDiaries(farmerId, fields) {
    return new Promise((resolve, reject) => {
        console.log("farmerId", farmerId);
        DailyDiary.find({ farmerId: farmerId }, fields)
            .then(resolve)
            .catch(reject);
    });
}

export function getMHCodeDiaries(MHCode, fields) {
    return new Promise((resolve, reject) => {
        console.log("mhcode", MHCode);
        DailyDiary.find({ MHCode: MHCode }, fields)
            .then(resolve)
            .catch(reject);
    })
}

export function insertDailyDiary(diary) {
    return new Promise((resolve, reject) => {
        const diaryObject = new DailyDiary(diary);
        diaryObject.save()
            .then(resolve)
            .catch(reject);
    });
}

export function insertMultipleDailyDiaries(diaries) {
    return new Promise((resolve, reject) => {
        DailyDiary.insertMany(diaries)
            .then(resolve)
            .catch(reject);
    })
}

export function updateDiary(diaryId, data) {
    return new Promise((resolve, reject) => {
        DailyDiary.updateOne({ _id: diaryId },
            { $set: data }
        )
            .then(resolve)
            .catch(reject);
    });
}

export function markDiaryAsComplete(_id, updateData) {
    return new Promise((resolve, reject) => {
        let updateQuery;
        console.log(_id, updateData);
        switch (updateData.type) {
            case "spraying":
                updateQuery = {
                    $set: {
                        "spraying.isCompleted": true,
                        "spraying.completedDate": updateData.completedDate
                    }
                }
                break;
            case "irrigation":
                updateQuery = {
                    $set: {
                        "irrigation.isCompleted": true,
                        "irrigation.completedDate": updateData.completedDate
                    }
                }
                break;
            case "farmWork":
                updateQuery = {
                    $set: {
                        "farmWork.isCompleted": true,
                        "farmWork.completedDate": updateData.completedDate
                    }
                }
                break;
            case "soilWork":
                updateQuery = {
                    $set: {
                        "soilWork.isCompleted": true,
                        "soilWork.completedDate": updateData.completedDate
                    }
                }
                break;
            case "maintenanceWork":
                updateQuery = {
                    $set: {
                        "maintenanceWork.isCompleted": true,
                        "maintenanceWork.completedDate": updateData.completedDate
                    }
                }
                break;
            default:
                console.log("Wrong type is specified");
                reject(new Error("wrong type is specified"));
                return;
        }
        DailyDiary.updateOne({ _id }, updateQuery)
            .then(resolve)
            .catch(reject);
    });
}

export function deleteDiary(diaryId) {
    return new Promise((resolve, reject) => {
        DailyDiary.deleteOne({
            _id: diaryId
        })
            .then(resolve)
            .catch(reject);
    });
}

export function deleteFarmerDiary(farmerId) {
    return new Promise((resolve, reject) => {
        DailyDiary.deleteMany({
            farmerId: farmerId
        })
            .then(resolve)
            .catch(reject);
    })
}