import { ApprovedChemicalsModel, BannedChemicalsModel, MrlReportModel } from "../models/mrl.model.js";


export function getAllMrlReports(fields) {
    return new Promise((resolve, reject) => {
        MrlReportModel.find({}, fields)
            .then(resolve)
            .catch(reject);
    });
}

export function getMrlReport(_id, fields) {
    return new Promise((resolve, reject) => {
        MrlReportModel.findOne({ _id }, fields)
            .then(resolve)
            .catch(reject);
    });
}

export function getMRLReportBySampleNumber(sampleNumber, fields) {
    return new Promise((resolve, reject) => {
        MrlReportModel.findOne({ sampleNumber }, fields)
            .then(resolve)
            .catch(reject);
    });
}

export function getMRlReportByMHCode(MHCode, fields) {
    return new Promise((resolve, reject) => {
        MrlReportModel.find({ MHCode }, fields)
            .then(resolve)
            .catch(reject);
    });
}

export function insertReport(mrl) {
    return new Promise((resolve, reject) => {
        const chemicals = mrl.chemicals;
        BannedChemicalsModel.find({})
            .then((bannedChemicalsData) => {
                //todo: to search into banned list and put it into redList.
                console.log(bannedChemicalsData);
                for (let i = 0; i < chemicals.length; i++) {
                    mrl.chemicals[i].redList = "No";
                    if (chemicals[i].srNo && chemicals[i].srNo > 0) {// if there is valid srNo
                        let j = 0;
                        for (; j < bannedChemicalsData.length; j++) {//iterate banned chemicals 
                            if (chemicals[i].srNo === bannedChemicalsData[j].srNo) {// if serial number matches in banned chemicals
                                if (isRedListChemical(bannedChemicalsData[j])) {
                                    mrl.chemicals[i].redList = "Yes";
                                }
                            }
                        }
                    }
                }
                //after marking certain chemicals as redList then put mrl record into database.
                const mrlObject = new MrlReportModel(mrl);
                mrlObject.save()
                    .then(resolve)
                    .catch(reject);
            })
            .catch(reject);
    });
}



export function insertMultipleReports(mrlReports) {
    return new Promise(async (resolve, reject) => {
        let bannedChemicals = [];
        await BannedChemicalsModel.find({})
            .then((data) => {
                bannedChemicals = data;
            })
            .catch((err) => {
                reject(err);
                return;
            });
        MrlReportModel.find({})
            .then((mrlFromDatabase) => {
                bannedChemicals.sort((a, b) => { return a.srNo - b.srNo; });
                mrlFromDatabase.sort(compare);
                const distinctReports = [];
                for (let i = 0; i < mrlReports.length; i++) {
                    if (sampleNumberBinarySearch(mrlFromDatabase, mrlReports[i].sampleNumber) == -1) {
                        const chemicals = mrlReports[i].chemicals;
                        for (let j = 0; j < chemicals.length; j++) {
                            if (chemicals[j].srNo && chemicals[j].srNo != 0) {
                                chemicals[j].partOfAnnex9 = "Yes";
                                if (bannedChemicalBinarySearch(bannedChemicals, chemicals[j].srNo) != -1)
                                    chemicals[j].redList = "Yes";
                                else
                                    chemicals[j].redList = "No";
                            } else {
                                chemicals[j].partOfAnnex9 = "No";
                                chemicals[j].redList = "No";
                            }
                        }
                        distinctReports.push(mrlReports[i]);
                    } else
                        console.log(mrlReports[i].sampleNumber, "already exists");
                }
                MrlReportModel.insertMany(distinctReports)
                    .then(resolve)
                    .catch(reject);
            })
            .catch(reject);
    });
}


export function deleteReport(_id) {
    return new Promise((resolve, reject) => {
        MrlReportModel.deleteOne({ _id })
            .then(resolve)
            .catch(reject);
    });
}

export function deleteReportForPlot(MHCode) {
    return new Promise((resolve, reject) => {
        MrlReportModel.deleteMany({ MHCode })
            .then(resolve)
            .catch(reject);
    });
}

export function deleteReportForPlotAndYear(MHCode, year) {
    return new Promise((resolve, reject) => {
        MrlReportModel.deleteMany({ MHCode, year })
            .then(resolve)
            .catch(reject);
    });
}

//functions to handle approved chemicals collection.

export function getAllApprovedChemicals(fields) {
    return new Promise((resolve, reject) => {
        ApprovedChemicalsModel.find({}, fields)
            .then(resolve)
            .catch(reject);
    });
}


export function updateAllApprovedChemicals(approvedChemicals) {
    return new Promise((resolve, reject) => {
        ApprovedChemicalsModel.deleteMany({})
            .then((deleted) => {
                console.log("deletedData in approved chemicals", deleted);
                ApprovedChemicalsModel.insertMany(approvedChemicals)
                    .then(resolve)
                    .catch(reject);
            })
            .catch((err) => {
                console.log("error in deleting approved chemicals");
                reject(err);
            });
    });
}


//functions to handle banned chemicals collection.

export function getAllBannedChemicals(fields) {
    return new Promise((resolve, reject) => {
        BannedChemicalsModel.find({}, fields)
            .then(resolve)
            .catch(reject);
    });
}

export function updateAllBannedChemicals(bannedChemicals) {
    return new Promise((resolve, reject) => {
        BannedChemicalsModel.deleteMany({})
            .then((deleted) => {
                console.log("deletedData in banned chemicals", deleted);
                BannedChemicalsModel.insertMany(bannedChemicals)
                    .then(resolve)
                    .catch(reject);
            })
            .catch((err) => {
                console.log("error in deleting banned chemicals");
                reject(err);
            });
    });
}



//supportive functions

function isRedListChemical(bannedChemical) {// if any chemical is redList then return true.
    return (bannedChemical.fairTrade_PPO.toUpperCase() == "RED"
        || bannedChemical.EUG_Germany.toUpperCase() == "RED"
        || bannedChemical.MMUK_MS.toUpperCase() == "RED"
        || bannedChemical.MMUK_COOP_UK.toUpperCase() == "RED"
        || bannedChemical.global2000.toUpperCase() == "RED"
        || bannedChemical.EUMRL.toUpperCase() == "RED");
}

function compare(a, b) {//lexicographical sorting
    return a.sampleNumber.localeCompare(b.sampleNumber);
};

function sampleNumberBinarySearch(list, key) {//binary search for sample number in stored collection
    let low = 0, high = list.length - 1;
    // console.log(list);
    while (low <= high) {
        let mid = Math.floor((low + high) / 2);
        // console.log(mid);
        const compareResult = list[mid].sampleNumber.localeCompare(key);
        if (compareResult == 0)
            return mid;
        else if (compareResult < 0)
            low = mid + 1;
        else
            high = mid - 1;
    }
    return -1;
}

function bannedChemicalBinarySearch(list, key) {//binary search for banned chemical srNo.
    let low = 0, high = list.length - 1;
    // console.log(list);
    while (low <= high) {
        let mid = Math.floor((low + high) / 2);
        // console.log(list[mid].srNo);
        // console.log(mid);
        if (list[mid].srNo == key)
            return mid;
        else if (list[mid].srNo < key)
            low = mid + 1;
        else
            high = mid - 1;
    }
    return -1;
}