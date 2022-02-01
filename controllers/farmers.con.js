import { FarmerInfo } from "../models/farmers.model.js";
import { Filter } from "../models/filter.model.js";

export function getAllFarmersData(fields) {
    return new Promise((resolve, reject) => {
        FarmerInfo.find({}, fields)
            .then(resolve)
            .catch(reject);
    });
}

export function getFarmerData(id, fields) {
    return new Promise((resolve, reject) => {
        FarmerInfo.findById(id, fields)
            .then(resolve)
            .catch(reject);
    })
}


export function getFarmerDataUsingGGN(GGN, fields) {
    return new Promise((resolve, reject) => {
        FarmerInfo.find({ "personalInformation.GGN": GGN }, fields)
            .then(resolve)
            .catch(reject);
    });
}

export function getFarmerUsingMHCode(MHCode, fields) {
    return new Promise((resolve, reject) => {
        FarmerInfo.find({ "plots.farmInformation.MHCode": MHCode }, fields)
            .then(resolve)
            .catch(reject);
    });
}

export function insertFarmer(farmer) {

    return new Promise((resolve, reject) => {
        const farmerObject = new FarmerInfo(farmer);
        farmerObject.save()
            .then(() => {
                try {
                    let MHCode = undefined;
                    if (farmer.plots && farmer.plots[0]) {
                        if (farmer.plots[0].farmInformation && farmer.plots[0].farmInformation.MHCode)
                            MHCode = farmer.plots[0].farmInformation.MHCode
                    }
                    updateFilters(farmer.personalInformation.name, farmer.personalInformation.GGN, MHCode, undefined, undefined, undefined);
                } catch (err) {
                    console.log("Error in filter of insert of farmer", err);
                }
                resolve();
            })
            .catch(reject);
    });
}

export function insertPlotOfFarmer(farmerId, plot) {

    return new Promise((resolve, reject) => {
        FarmerInfo.updateOne({ _id: farmerId }, {
            $push: { plots: plot }
        })
            .then((data) => {
                try {
                    updateFilters(undefined, undefined, plot.farmInformation.MHCode, undefined, undefined, undefined);
                } catch (err) {
                    console.log("Error in filter of insert of farmer", err);
                }
                resolve(data);
            })
            .catch(reject);
    });
}

export function updateFarmer(id, data) {
    try {
        updateFilters(data.personalInformation.name, data.personalInformation.GGN);
    } catch (err) {
        console.log("Error in filter of update farmer", err);
    }
    return new Promise((resolve, reject) => {
        FarmerInfo.updateOne({ _id: id },
            { $set: data }
        )
            .then(resolve)
            .catch(reject);
    });
}

export function updatePlotOfFarmer(_id, data) {
    try {
        updateFilters(undefined, undefined, data.farmInformation.MHCode, data.address.village, data.other.tags, data.farmInformation.variety);
    } catch (err) {
        console.log("Error in filter of update plot of farmer", err);
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

export function deleteFarmer(id) {
    return new Promise((resolve, reject) => {
        FarmerInfo.deleteOne({
            _id: id
        })
            .then(resolve)
            .catch(reject);
    });
}

async function updateFilters(farmerName, GGN, MHCode, village, filterTag, variety) {
    try {
        Filter.findOne({})
            .then((data) => {
                if (farmerName && farmerName !== "") {
                    if (!data.farmerName.includes(farmerName)) {
                        Filter.updateOne({}, {
                            $push: {
                                farmerName
                            }
                        })
                            .then((data) => {
                                console.log("FarmerUpdated Successfully", data);
                            })
                            .catch((err) => {
                                console.log("filter farmer", err);
                            })
                    } else {
                        console.log("filter farmer already");
                    }
                } if (MHCode && MHCode !== "") {
                    if (!data.MHCode.includes(MHCode)) {
                        Filter.updateOne({}, {
                            $push: {
                                MHCode
                            }
                        })
                            .then((data) => {
                                console.log("MHCodeUpdated Successfully", data);
                            })
                            .catch((err) => {
                                console.log("filter farmer", err);
                            })
                    } else {
                        console.log("filter MHCode already");
                    }
                } if (GGN && GGN !== "") {
                    if (!data.GGN.includes(GGN)) {
                        Filter.updateOne({}, {
                            $push: {
                                GGN
                            }
                        })
                            .then((data) => {
                                console.log("GGNUpdated Successfully", data);
                            })
                            .catch((err) => {
                                console.log("filter GGN", err);
                            })
                    }
                    else {
                        console.log("filter GGN already");
                    }
                } if (village && village !== "") {
                    if (!data.village.includes(village)) {
                        Filter.updateOne({}, {
                            $push: {
                                village
                            }
                        })
                            .then((data) => {
                                console.log("villageUpdated Successfully", data);
                            })
                            .catch((err) => {
                                console.log("filter village", err);
                            })
                    }
                    else {
                        console.log("filter village already");
                    }
                } if (filterTag && filterTag.length !== 0) {
                    const uniqueTagsArray = [];
                    for (let i = 0; i < filterTag.length; i++) {
                        if (!data.tag.includes(filterTag[i]) && !uniqueTagsArray.includes(filterTag[i])) {
                            uniqueTagsArray.push(filterTag[i]);
                        }
                    }
                    console.log("unique array in filterTags", uniqueTagsArray);
                    Filter.updateOne({}, {
                        $push: {
                            tag: { $each: uniqueTagsArray }
                        }
                    })
                        .then((data) => {
                            console.log("tagUpdated Successfully", data);
                        })
                        .catch((err) => {
                            console.log("filter tag", err);
                        })
                } if (variety && variety !== "") {
                    console.log(data.variety);
                    if (!data.variety.includes(variety)) {
                        Filter.updateOne({}, {
                            $push: {
                                variety
                            }
                        })
                            .then((data) => {
                                console.log("varietyUpdated Successfully", data);
                            })
                            .catch((err) => {
                                console.log("filter variety", err);
                            })
                    }
                    else {
                        console.log(" variety already");
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