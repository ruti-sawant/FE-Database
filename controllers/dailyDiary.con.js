import { DailyDiary } from "../models/dailyDiary.model.js";

//get All daily diaries
export function getAllDiaries(fields) {
    return new Promise((resolve, reject) => {
        DailyDiary.find({}, fields)
            .then(resolve)
            .catch(reject);
    });
}

//get single daily diary
export function getDiary(diaryId, fields) {
    return new Promise((resolve, reject) => {
        DailyDiary.findOne({ _id: diaryId }, fields)
            .then(resolve)
            .catch(reject);
    });
}

//get diaries for any single farmer.
export function getFarmerDiaries(farmerId, fields) {
    return new Promise((resolve, reject) => {
        //console.log("farmerId", farmerId);
        DailyDiary.find({ farmerId: farmerId }, fields)
            .then(resolve)
            .catch(reject);
    });
}

//get diaries for any single plot by MHCode.
export function getMHCodeDiaries(MHCode, fields) {
    return new Promise((resolve, reject) => {
        //console.log("mhcode", MHCode);
        DailyDiary.find({ MHCode: MHCode }, fields)
            .then(resolve)
            .catch(reject);
    })
}

//add new single daily diary into database.
export function insertDailyDiary(diary) {
    return new Promise((resolve, reject) => {
        const diaryObject = new DailyDiary(diary);
        diaryObject.save()
            .then(resolve)
            .catch(reject);
    });
}

//insert multiple daily diaries into database.
export function insertMultipleDailyDiaries(diaries) {
    return new Promise((resolve, reject) => {
        DailyDiary.insertMany(diaries)
            .then(resolve)
            .catch(reject);
    })
}

//update daily diary by its id.
export function updateDiary(diaryId, data) {
    return new Promise((resolve, reject) => {
        DailyDiary.updateOne({ _id: diaryId },
            { $set: data }
        )
            .then(resolve)
            .catch(reject);
    });
}

//mark daily diary as complete by type of completion.
export function markDiaryAsComplete(_id, updateData) {
    return new Promise((resolve, reject) => {
        let updateQuery;
        //console.log(_id, updateData);
        //for any type update it as complete.
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
                //console.log("Wrong type is specified");
                reject(new Error("wrong type is specified"));
                return;
        }
        DailyDiary.updateOne({ _id }, updateQuery)
            .then(resolve)
            .catch(reject);
    });
}

//delete daily diary by its id.
export function deleteDiary(diaryId) {
    return new Promise((resolve, reject) => {
        DailyDiary.deleteOne({
            _id: diaryId
        })
            .then(resolve)
            .catch(reject);
    });
}

// delete diaries for any single farmer by farmerId.
export function deleteFarmerDiary(farmerId) {
    return new Promise((resolve, reject) => {
        DailyDiary.deleteMany({
            farmerId: farmerId
        })
            .then(resolve)
            .catch(reject);
    })
}