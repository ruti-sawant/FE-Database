import { Broadcast } from "../models/broadcast.model.js";
import { FarmerInfo } from "../models/farmers.model.js";

export function getAllBroadcasts(fields) {
    return new Promise((resolve, reject) => {
        Broadcast.find({}, fields)
            .then(resolve)
            .catch(reject);
    })
}

export function getBroadcast(_id, fields) {
    return new Promise((resolve, reject) => {
        Broadcast.findOne({ _id }, fields)
            .then(resolve)
            .catch(reject);
    });
}

export function getBroadcastsForFarmer(farmerId, fields) {
    return new Promise((resolve, reject) => {
        Broadcast.find({}, fields)
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

//to map tags with farmers
export async function getFarmersForTags(tags) {
    let resultSet = new Set();
    await FarmerInfo.find({})
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

export async function getAllFarmersCount() {
    let farmersCount = 0;
    await FarmerInfo.find({}, { _id: 1 })
        .then((data) => {
            console.log("Data", data);
            farmersCount = data.length;
        })
        .catch((err) => {
            console.log("Error in counting farmers");
            throw err;
        });
    return farmersCount;
}

export function insertBroadcast(broadcast) {
    return new Promise((resolve, reject) => {
        const broadcastObject = new Broadcast(broadcast);
        broadcastObject.save()
            .then(resolve)
            .catch(reject);
    });
}


export function insertQuestion(_id, farmerName, question) {
    return new Promise((resolve, reject) => {
        Broadcast.updateOne({ _id }, {
            $push: { chats: { farmerName, question } }
        })
            .then(resolve)
            .catch(reject);
    })
}

export function updateAnswer(_id, chatId, adminName, answer) {
    return new Promise((resolve, reject) => {
        Broadcast.updateOne({ _id, "chats._id": chatId }, {
            $set: {
                "chats.$.adminName": adminName,
                "chats.$.answer": answer,
            }
        })
            .then(resolve)
            .catch(reject);
    })
}

export function deleteBroadcast(_id) {
    return new Promise((resolve, reject) => {
        Broadcast.deleteOne({ _id })
            .then(resolve)
            .catch(reject);
    });
}