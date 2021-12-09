const mongoose = require("mongoose");
const Models = require("../models/broadcast.model");
const FarmerModel = require("../models/farmers.model");

module.exports.getAllBroadcasts = function (fields) {
    return new Promise((resolve, reject) => {
        Models.Broadcast.find({}, fields)
            .then(resolve)
            .catch(reject);
    })
}

module.exports.getBroadcast = function (_id, fields) {
    return new Promise((resolve, reject) => {
        Models.Broadcast.findOne({ _id }, fields)
            .then(resolve)
            .catch(reject);
    })
}



module.exports.getBroadcastsForFarmer = function (farmerId, fields) {
    return new Promise((resolve, reject) => {
        Models.Broadcast.find({})
            .then((data) => {
                const arrayToSend = [];
                for (let i = 0; i < data.length; i++) {
                    if (data[i].toAllFarmers)
                        arrayToSend.push(data[i]);
                    else {
                        if (data[i].farmers.includes(farmerId))//if farmerId is present in farmers array then push it into output array
                            arrayToSend.push(data[i]);
                    }
                }
                resolve(arrayToSend);
            })
            .catch(reject);
    });
}

module.exports.insertBroadcast = function (broadcast) {
    return new Promise((resolve, reject) => {
        const broadcastObject = new Models.Broadcast(broadcast);
        broadcastObject.save()
            .then(resolve)
            .catch(reject);
    });
}


module.exports.insertQuestion = function (_id, farmerName, question) {
    return new Promise((resolve, reject) => {
        Models.Broadcast.updateOne({ _id }, {
            $push: { chats: { farmerName, question } }
        })
            .then(resolve)
            .catch(reject);
    })
}

module.exports.updateAnswer = function (_id, chatId, adminName, answer) {
    return new Promise((resolve, reject) => {
        Models.Broadcast.updateOne({ _id, "chats._id": chatId }, {
            $set: {
                "chats.$.adminName": adminName,
                "chats.$.answer": answer,
            }
        })
            .then(resolve)
            .catch(reject);
    })
}

module.exports.deleteBroadcast = function (_id) {
    return new Promise((resolve, reject) => {
        Models.Broadcast.deleteOne({ _id })
            .then(resolve)
            .catch(reject);
    });
}

//to map tags with farmers

module.exports.getFarmersForTags = async function (tags) {
    console.log(tags);
    let resultSet = new Set();
    await FarmerModel.FarmerInfo.find({})
        .then((data) => {
            // loop to iterate over array of tags
            for (const tag of tags) {
                for (let i = 0; i < data.length; i++) {
                    const plots = data[i].plots;
                    for (let j = 0; j < plots.length; j++) {
                        if (plots[j].other.tags.includes(tag)) {// if tag from list is inside farmers tags then push farmer into set.
                            resultSet.add(data[i]._id);
                        }
                    }
                }
            }
        })
        .catch((err) => {
            console.log("Error in mapping farmer and tags for broadcast");
            throw err;
        });
    return Array.from(resultSet);
}