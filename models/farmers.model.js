import mongoose from 'mongoose';

const farmerSchema = {
    personalInformation: {
        name: {
            required: true,
            type: String
        },
        mobileNumber: {
            // required: true,
            type: [String],
        },//in case of multiple contact numbers.
        email: String,
        GGN: {
            required: true,
            type: String,
        },
        familyName: {
            type: String,
            required: true,
        },
        profileUrl: String,
        profileId: String,
        farmMap: String,//to store my map link 
        consultantName: String,
    },
    plots: [
        {
            farmInformation: {
                plotNumber: {
                    required: true,
                    type: String,
                },//starts with P
                MHCode: {
                    required: true,
                    type: String,
                },//starts with MH
                crop: {
                    type: String,
                },
                variety: {
                    type: String,
                },
                soilType: {
                    type: String,
                },
                plotArea: {
                    type: Number
                },//in acres
            },
            address: {//for storing address related information
                coordinates: {
                    latitude: {
                        type: String,
                    },
                    longitude: {
                        type: String,
                    },
                },
                mapLink: {
                    type: String,
                },//to view that on map 
                village: {
                    type: String,
                },
                taluka: {
                    type: String,
                },
                district: {
                    type: String,
                },
                pincode: {
                    type: Number,
                },
            },
            other: {
                tags: [String],//for filtering different farms from all farms
                notes: String,
            },
            cropSpacing: {//distance in feet
                betweenTwoRows: {
                    type: Number,
                },
                betweenTwoCrops: {
                    type: Number,
                },
            },
        }
    ]
}

//repetitive data that is changing yearly
const seasonalFarmerDataSchema = {
    farmerId: {
        type: mongoose.Types.ObjectId,
        required: true,
    },
    plotId: {//referring to object inside plots array of farmers.
        type: String,
        required: true,
    },
    MHCode: {
        type: String,
        required: true,
    },
    GGN: String,
    year: {
        type: Number,
        required: true,
    },
    cropMilestoneDates: {//to store milestone Dates for each event.
        plantation: Date,
        foundationPruning: Date,
        fruitPruning: Date,
        readyToHarvest: Date,
        actualHarvest: Date,
    },
    yield: {
        exportTonnage: Number,
        localTonnage: Number,
    },
    primaryQualityIssuesFaced: [String],//to store various issues faced in spreadsheet it is mentioned a true false 
    MRLResults: {
        maxIndividual: Number,  //%value
        sum: Number,     //% value
        numberOfDetection: Number,
        redListChemicals: [String],
        MRLReportLink: String,//drive link
    },
    qualityJotforms: {
        preharvestQCLink: String,
        primaryIssueFaced: String,
        invardQCLink: String,
        knittingQCLinks: [String],
        packingQCLinks: [String],
        FGQCLinks: [String],
        onArrivalQCLinks: [String],
    },
    quality: String,
}

export const FarmerInfo = mongoose.model("farmer", farmerSchema);
export const SeasonalFarmerData = mongoose.model("seasonalData", seasonalFarmerDataSchema);

export default FarmerInfo;