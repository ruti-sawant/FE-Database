import { google } from "googleapis";
import dotenv from 'dotenv'
dotenv.config();

import { SeasonalFarmerData } from "../models/farmers.model.js";

//google api keys
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

//creating drive object.
const drive = google.drive({
    version: 'v3',
    auth: oauth2Client,
});

//get all seasonal data's
export function getAllSeasonalData(fields) {
    return new Promise((resolve, reject) => {
        SeasonalFarmerData.find({}, fields)
            .then(resolve)
            .catch(reject);
    })
}

//get seasonal data for farmerId
export function getFarmerSeasonalData(farmerId, fields) {
    return new Promise((resolve, reject) => {
        SeasonalFarmerData.find({ farmerId }, fields)
            .then(resolve)
            .catch(reject);
    });
}

//get seasonal data for plot by plotId
export function getPlotsSeasonalData(plotId, fields) {
    return new Promise((resolve, reject) => {
        SeasonalFarmerData.find({ plotId }, fields)
            .then(resolve)
            .catch(reject);
    });
}

//get seasonal data for MHCode.
export function getMHCodeSeasonalData(MHCode, fields) {
    return new Promise((resolve, reject) => {
        SeasonalFarmerData.find({ MHCode }, fields)
            .then(resolve)
            .catch(reject);
    });
}

//get seasonal data by its id.
export function getSeasonalData(id, fields) {
    return new Promise((resolve, reject) => {
        SeasonalFarmerData.findOne({
            _id: id
        }, fields)
            .then(resolve)
            .catch(reject);
    });
}

// insert seasonal data
export function insertSeasonalData(seasonalData) {
    return new Promise((resolve, reject) => {
        const data = new SeasonalFarmerData(seasonalData);
        data.save()
            .then(resolve)
            .catch(reject);
    });
}

//update seasonal data by its id.
export function updateSeasonalData(id, data) {
    return new Promise((resolve, reject) => {
        SeasonalFarmerData.updateOne({ _id: id },
            { $set: data }
        )
            .then(resolve)
            .catch(reject);
    });
}

//delete seasonal data for farmerId.
export function deleteFarmerSeasonalData(farmerId) {
    return new Promise((resolve, reject) => {
        SeasonalFarmerData.find({
            farmerId: farmerId
        })
            .then(async (data) => {
                for (let i = 0; i < data.length; i++) {
                    if (data[i] && data[i].reports) {
                        //delete reports from drive if their id exists.
                        if (data[i].reports.petioleReportId)
                            await deleteFileFromDrive(data[i].reports.petioleReportId);
                        if (data[i].reports.soilReportId)
                            await deleteFileFromDrive(data[i].reports.soilReportId);
                        if (data[i].reports.waterReportId)
                            await deleteFileFromDrive(data[i].reports.waterReportId);
                    }
                }
            })
            .catch(reject);
        //delete seasonal data for farmerId.
        SeasonalFarmerData.deleteMany({ farmerId })
            .then(resolve)
            .catch(reject);
    });
}

//delete seasonal data by its id.
export function deleteSeasonalData(id) {
    return new Promise((resolve, reject) => {
        SeasonalFarmerData.findOneAndDelete({
            _id: id
        })
            .then(async (data) => {
                if (data && data.reports) {
                    //delete reports from drive if their id exists.
                    if (data.reports.petioleReportId)
                        await deleteFileFromDrive(data.reports.petioleReportId);
                    if (data.reports.soilReportId)
                        await deleteFileFromDrive(data.reports.soilReportId);
                    if (data.reports.waterReportId)
                        await deleteFileFromDrive(data.reports.waterReportId);
                }
                resolve(data);
            })
            .catch(reject);
    });
}

//delete seasonal data by year
export function deleteSeasonalDataByYear(year) {
    return new Promise((resolve, reject) => {
        SeasonalFarmerData.find({ year })
            .then(async (data) => {
                for (let i = 0; i < data.length; i++) {
                    if (data[i] && data[i].reports) {
                        //delete reports from drive if their id exists.
                        if (data[i].reports.petioleReportId)
                            await deleteFileFromDrive(data[i].reports.petioleReportId);
                        if (data[i].reports.soilReportId)
                            await deleteFileFromDrive(data[i].reports.soilReportId);
                        if (data[i].reports.waterReportId)
                            await deleteFileFromDrive(data[i].reports.waterReportId);
                    }
                }
            })
            .catch(reject);
        //delete seasonal data for year.
        SeasonalFarmerData.deleteMany({ year })
            .then(resolve)
            .catch(reject);
    });
}

//delete seasonal data by plotId.
export function deleteSeasonalDataByPlotId(plotId) {
    return new Promise((resolve, reject) => {
        SeasonalFarmerData.find({ plotId })
            .then(async (data) => {
                for (let i = 0; i < data.length; i++) {
                    if (data[i] && data[i].reports) {
                        //delete reports from drive if their id exists.
                        if (data[i].reports.petioleReportId)
                            await deleteFileFromDrive(data[i].reports.petioleReportId);
                        if (data[i].reports.soilReportId)
                            await deleteFileFromDrive(data[i].reports.soilReportId);
                        if (data[i].reports.waterReportId)
                            await deleteFileFromDrive(data[i].reports.waterReportId);
                    }
                }
            })
            .catch(reject);
        //delete seasonal data for plotId.
        SeasonalFarmerData.deleteMany({ plotId })
            .then(resolve)
            .catch(reject);

    });
}

//delete seasonal data by MHCode.
export function deleteSeasonalDataByMHCode(MHCode) {
    return new Promise((resolve, reject) => {
        SeasonalFarmerData.deleteMany({ MHCode })
            .then(async (data) => {
                for (let i = 0; i < data.length; i++) {
                    if (data[i] && data[i].reports) {
                        //delete reports from drive if their id exists.
                        if (data[i].reports.petioleReportId)
                            await deleteFileFromDrive(data[i].reports.petioleReportId);
                        if (data[i].reports.soilReportId)
                            await deleteFileFromDrive(data[i].reports.soilReportId);
                        if (data[i].reports.waterReportId)
                            await deleteFileFromDrive(data[i].reports.waterReportId);
                    }
                }
            })
            .catch(reject);
        //delete seasonal data for MHCode.
        SeasonalFarmerData.deleteMany({ MHCode })
            .then(resolve)
            .catch(reject);

    });
}

//delete file from drive.
async function deleteFileFromDrive(fileId) {
    drive.files.delete({
        'fileId': fileId
    })
        .then((res) => {
            // console.log(res);
            console.log("file deleted ", fileId);
        }).catch((err) => {
            console.log(err);
        });
}