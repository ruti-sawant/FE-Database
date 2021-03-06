import bcrypt from 'bcrypt';

import { FarmerInfo } from "../models/farmers.model.js";
import { Filter } from "../models/filter.model.js";
import { SeasonalFarmerData } from "../models/farmers.model.js";
import { deleteFarmerSeasonalData, deleteSeasonalDataByMHCode } from './seasonalData.con.js';
import Login from "../models/login.model.js";

// const password = "somnath";
// const userId = "somnath";
// const userType = "farmer";
// const mongoId = "61811524c9c8d0cbdbcf54ca";
// const saltRounds = Number(process.env.SALT_ROUNDS);
// bcrypt.hash(password, saltRounds, function (err, hash) {
//     if (err) {
//         console.log("err", err);
//     } else {
//         const login = new Login({
//             userId, password: hash, userType, mongoId
//         });
//         console.log(userId, password, hash, userType, mongoId);
//         login.save()
//             .then((result) => {
//                 console.log(result);
//             })
//             .catch((err) => {
//                 console.log("err last", err);
//             });
//     }
// });

//get all farmers.
export function getAllFarmersData(fields) {
    return new Promise((resolve, reject) => {
        FarmerInfo.find({}, fields)
            .then(resolve)
            .catch(reject);
    });
}

//get single farmer data by its id.
export function getFarmerData(id, fields) {
    return new Promise((resolve, reject) => {
        FarmerInfo.findById(id, fields)
            .then(resolve)
            .catch(reject);
    })
}

//get farmers using GGN.
export function getFarmerDataUsingGGN(GGN, fields) {
    return new Promise((resolve, reject) => {
        FarmerInfo.find({ "personalInformation.GGN": GGN }, fields)
            .then(resolve)
            .catch(reject);
    });
}

//get farmers using MHCode.
export function getFarmerUsingMHCode(MHCode, fields) {
    return new Promise((resolve, reject) => {
        FarmerInfo.find({ "plots.farmInformation.MHCode": MHCode }, fields)
            .then(resolve)
            .catch(reject);
    });
}

//insert farmer into database api.
export function insertFarmer(farmer) {
    return new Promise((resolve, reject) => {
        const farmerObject = new FarmerInfo(farmer);
        farmerObject.save()
            .then((data) => {
                try {
                    let MHCode = undefined;
                    if (farmer.plots && farmer.plots[0]) {
                        if (farmer.plots[0].farmInformation && farmer.plots[0].farmInformation.MHCode)
                            MHCode = farmer.plots[0].farmInformation.MHCode
                    }
                    //update name GGN MHCode in filters.
                    updateFilters(farmer.personalInformation.name, farmer.personalInformation.GGN, MHCode, undefined, undefined, undefined);
                } catch (err) {
                    //console.log("Error in filter of insert of farmer", err);
                    return;
                }
                //code to create password for user.
                const userId = farmer.personalInformation.userId;
                const password = farmer.personalInformation.userId;
                const userType = "farmer";
                const mongoId = data._id;
                const saltRounds = Number(process.env.SALT_ROUNDS);
                //create hash and insert object into admin.
                bcrypt.hash(password, saltRounds, function (err, hash) {
                    if (err) {
                        //console.log("err", err);
                        return;
                    } else {
                        const login = new Login({
                            userId, password: hash, userType, mongoId
                        });
                        //console.log(userId, password, hash, userType, mongoId);
                        login.save()
                            .then((result) => {
                                //console.log(result);
                            })
                            .catch((err) => {
                                //console.log("err last", err);
                            });
                    }
                });
                resolve();
            })
            .catch(reject);
    });
}

//insert plot of farmer into database api.
export function insertPlotOfFarmer(farmerId, plot) {
    return new Promise((resolve, reject) => {
        FarmerInfo.updateOne({ _id: farmerId }, {
            $push: { plots: plot }
        })
            .then((data) => {
                try {
                    //update collection of filters.
                    updateFilters(undefined, undefined, plot.farmInformation.MHCode, undefined, undefined, undefined);
                } catch (err) {
                    //console.log("Error in filter of insert of farmer", err);
                }
                resolve(data);
            })
            .catch(reject);
    });
}

//update data of farmer into database api.
export function updateFarmer(id, data) {
    try {
        //update collection of filters.
        updateFilters(data.personalInformation.name, data.personalInformation.GGN);
    } catch (err) {
        //console.log("Error in filter of update farmer", err);
    }
    //update farmer data.
    return new Promise((resolve, reject) => {
        FarmerInfo.updateOne({ _id: id },
            { $set: data }
        )
            .then(resolve)
            .catch(reject);
    });
}

//update plot of farmer into database api.
export function updatePlotOfFarmer(_id, data) {
    try {
        //update filters.
        updateFilters(undefined, undefined, data.farmInformation.MHCode, data.address.village, data.other.tags, data.farmInformation.variety);
    } catch (err) {
        //console.log("Error in filter of update plot of farmer", err);
    }
    return new Promise((resolve, reject) => {
        FarmerInfo.updateOne({ "plots._id": _id }, {
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

//delete farmer from database api.
export function deleteFarmer(id) {
    return new Promise((resolve, reject) => {
        FarmerInfo.findByIdAndDelete(id)
            .then(async (data) => {
                //console.log(data);
                //get fields of farmer for removing it from filters.
                let GGN = null;
                if (data && data.personalInformation.name.trim() === data.personalInformation.familyName.trim()) {
                    GGN = data.personalInformation.GGN;
                }
                const MHCodes = [];
                let farmerName = null;
                if (data) {
                    farmerName = data.personalInformation.name;
                    for (let i = 0; i < data.plots.length; i++) {
                        MHCodes.push(data.plots[i].farmInformation.MHCode);
                    }
                }
                //delete seasonal data of farmer by farmer id.
                await deleteFarmerSeasonalData(id)
                    .then((data) => { })
                    .catch((err) => {
                        //console.log("err seasonal data err ", err);
                    });
                //update filters collection and remove MHCodes,GGN,farmerName from filters.
                await Filter.findOneAndUpdate({}, {
                    $pull: {
                        MHCode: { $in: MHCodes },
                        GGN: GGN,
                        farmerName: farmerName
                    }
                })
                    .then((data) => { })
                    .catch((err) => {
                        //console.log("err ggn mhcode ", err);
                    });
                //delete user from login collection.
                Login.findOneAndDelete({ mongoId: data._id })
                    .then((result) => {
                        //console.log(result);
                    })
                    .catch((err) => {
                        //console.log("err", err);
                    });
                resolve(data);
            })
            .catch(reject);
    });
}

//delete 
export function deletePlotOfFarmer(plotId) {
    return new Promise((resolve, reject) => {
        FarmerInfo.findOne({ "plots._id": plotId })
            .then((data) => {
                if (data && data.plots) {
                    //if more than one plots are there then update the object
                    if (data.plots.length > 1) {
                        //remove plot from farmer object.
                        FarmerInfo.findOneAndUpdate({ "plots._id": plotId }, {
                            $pull: {
                                plots: { _id: plotId }
                            }
                        })
                            .then(async (data) => {
                                if (data) {
                                    let MHCode = undefined;
                                    for (let i = 0; i < data.plots.length; i++) {
                                        if (data.plots[i]._id == plotId) {
                                            MHCode = data.plots[i].farmInformation.MHCode;
                                        }
                                    }
                                    if (MHCode) {
                                        //remove plot from filters.
                                        await Filter.findOneAndUpdate({}, {
                                            $pull: {
                                                MHCode: MHCode
                                            }
                                        })
                                            .then((data) => { })
                                            .catch((err) => {
                                                console.log(err);
                                            });
                                        //delete seasonal data by MHCode.
                                        await deleteSeasonalDataByMHCode(MHCode)
                                            .then((data) => { })
                                            .catch((err) => {
                                                //console.log("err seasonal data err ", err);
                                            });
                                    }
                                }
                                resolve(data);
                            })
                            .catch(reject);
                    } else {//for single plot delete whole farmer.
                        deleteFarmer(data._id)
                            .then(resolve)
                            .catch(reject);
                    }
                } else {
                    reject(new Error("Plot does not exists"));
                }
            })
            .catch(reject);
    });
}

//update filter is function 
async function updateFilters(farmerName, GGN, MHCode, village, filterTag, variety) {
    try {
        Filter.findOne({})
            .then((data) => {
                //if farmer name is valid and it is not in filter then add it.
                if (farmerName && farmerName !== "") {
                    if (!data.farmerName.includes(farmerName)) {
                        Filter.updateOne({}, {
                            $push: {
                                farmerName
                            }
                        })
                            .then((data) => {
                                //console.log("FarmerUpdated Successfully", data);
                            })
                            .catch((err) => {
                                //console.log("filter farmer", err);
                            })
                    } else {
                        //console.log("filter farmer already");
                    }
                }
                //if MHCode is valid and it is not in filter then add it.
                if (MHCode && MHCode !== "") {
                    if (!data.MHCode.includes(MHCode)) {
                        Filter.updateOne({}, {
                            $push: {
                                MHCode
                            }
                        })
                            .then((data) => {
                                //console.log("MHCodeUpdated Successfully", data);
                            })
                            .catch((err) => {
                                //console.log("filter farmer", err);
                            })
                    } else {
                        //console.log("filter MHCode already");
                    }
                }
                //if GGN is valid and it is not in filter then add it.
                if (GGN && GGN !== "") {
                    if (!data.GGN.includes(GGN)) {
                        Filter.updateOne({}, {
                            $push: {
                                GGN
                            }
                        })
                            .then((data) => {
                                //console.log("GGNUpdated Successfully", data);
                            })
                            .catch((err) => {
                                //console.log("filter GGN", err);
                            })
                    }
                    else {
                        //console.log("filter GGN already");
                    }
                }
                //if village is valid and it is not in filter then add it.
                if (village && village !== "") {
                    if (!data.village.includes(village)) {
                        Filter.updateOne({}, {
                            $push: {
                                village
                            }
                        })
                            .then((data) => {
                                //console.log("villageUpdated Successfully", data);
                            })
                            .catch((err) => {
                                //console.log("filter village", err);
                            })
                    }
                    else {
                        //console.log("filter village already");
                    }
                }
                //if filterTag is valid and it is not in filter then add it.
                if (filterTag && filterTag.length !== 0) {
                    const uniqueTagsArray = [];

                    for (let i = 0; i < filterTag.length; i++) {
                        // only take unique tags.
                        if (!data.tag.includes(filterTag[i]) && !uniqueTagsArray.includes(filterTag[i])) {
                            uniqueTagsArray.push(filterTag[i]);
                        }
                    }
                    // console.log("unique array in filterTags", uniqueTagsArray);
                    Filter.updateOne({}, {
                        $push: {
                            tag: { $each: uniqueTagsArray }
                        }
                    })
                        .then((data) => {
                            //console.log("tagUpdated Successfully", data);
                        })
                        .catch((err) => {
                            //console.log("filter tag", err);
                        })
                }
                //if variety is valid and it is not in filter then add it.
                if (variety && variety !== "") {
                    //console.log(data.variety);
                    if (!data.variety.includes(variety)) {
                        Filter.updateOne({}, {
                            $push: {
                                variety
                            }
                        })
                            .then((data) => {
                                //console.log("varietyUpdated Successfully", data);
                            })
                            .catch((err) => {
                                //console.log("filter variety", err);
                            })
                    }
                    else {
                        //console.log(" variety already");
                    }
                }
            })
            .catch((err) => {
                //console.log("Error in inserting FilterData", err);
            });
    } catch (err) {
        //console.log("Error in updating filter ", err);
    }
}