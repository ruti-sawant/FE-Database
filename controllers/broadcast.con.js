import { google } from "googleapis";
import dotenv from 'dotenv'
dotenv.config();

import { Broadcast } from "../models/broadcast.model.js";
import { FarmerInfo } from "../models/farmers.model.js";
import Filter from "../models/filter.model.js";


const clientID = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRETE;
const redirectUri = process.env.REDIRECT_URI;
const refreshToken = process.env.REFRESH_TOKEN;

const oauth2Client = new google.auth.OAuth2(
    clientID,
    clientSecret,
    redirectUri
);
oauth2Client.setCredentials({ refresh_token: refreshToken });

const drive = google.drive({
    version: 'v3',
    auth: oauth2Client,
});

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
        const newCategory = { ...broadcast }.newCategory;
        if (newCategory)
            delete broadcast.newCategory;
        broadcastObject.save()
            .then((data) => {
                updateFilters(newCategory);
                resolve(data);
            })
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
        Broadcast.findByIdAndDelete(_id)
            .then((data) => {
                if (data.driveId) {
                    deleteFileFromDrive(data.driveId);
                }
                resolve(data);
            })
            .catch(reject);
    });
}

async function deleteFileFromDrive(fileId) {
    drive.files.delete({
        'fileId': fileId
    })
        .then((res) => {
            // console.log(res);
            console.log("file deleted ", fileId);
        }).catch((err) => {
            console.log(err);
        })
}

async function updateFilters(category) {
    try {
        Filter.findOne({})
            .then((data) => {
                console.log(data.broadcastCategory);
                if (category && category !== "") {
                    if (!data.broadcastCategory.includes(category)) {
                        Filter.updateOne({}, {
                            $push: {
                                broadcastCategory: category
                            }
                        })
                            .then((data) => {
                                console.log("category Updated Successfully");
                            })
                            .catch((err) => {
                                console.log("filter category", err);
                            })
                    } else {
                        console.log("filter category already");
                    }
                }
            })
            .catch((err) => {
                console.log("Error in inserting FilterData", err);
            });
    } catch (err) {
        console.log("Error in updating filter ", err);
    }
}