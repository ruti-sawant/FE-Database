import mongoose from 'mongoose';

const mrlReportSchema = {
    year: Number,//todo: to be handled.
    sealNumber: String,
    sampleNumber: String,
    labName: String,
    farmerName: String,
    dateOfSampling: Date,
    address: String,
    MHCode: String,
    variety: String,
    quantityMT: Number,
    brix: String,
    fePoRef: String,
    samplerName: String,
    chemicals: [{
        srNo: Number,
        detectedPesticide: String,
        result: Number,
        EUMRL: Number,
        LOQ: Number,
        ArFD: String,
        intake: String,
        ArFDPercent: String,
        remark: String,
        partOfAnnex9: String,
        redList: String,//have to automatically decide by fetching banned list.
    }],
};

const approvedChemicalsSchema = {
    srNo: Number,
    chemicalName: String,
    EULimit: Number,
};

const bannedChemicalsSchema = {
    srNo: Number,
    chemicalName: String,
    fairTrade_PPO: String,
    EUG_Germany: String,
    MMUK_MS: String,
    MMUK_COOP_UK: String,
    global2000: String,
    EUMRL: String,
};

export const MrlReportModel = mongoose.model("mrlReport", mrlReportSchema);
export const ApprovedChemicalsModel = mongoose.model("approvedChemical", approvedChemicalsSchema);
export const BannedChemicalsModel = mongoose.model("bannedChemical", bannedChemicalsSchema);


