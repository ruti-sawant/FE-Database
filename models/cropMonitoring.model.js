import mongoose from 'mongoose';


const cropMonitoringSchema = {
    farmerId: {
        type: String,
        required: true
    },
    GGN: {
        type: String,
        required: true
    },
    MHCode: {
        type: String,
        required: true
    },
    plotNumber: String,
    date: Date,
    pest: {
        insectName: String,
        severityType: String,
        location: {
            latitude: String,
            longitude: String,
        },
        correctiveAction: [{
            chemical: String,
            quantity: String,
        }],
        pestPhoto1: String,
        pestPhotoId1: String,
        pestPhoto2: String,
        pestPhotoId2: String,
    },
    disease: {
        diseaseName: String,
        severityType: String,
        location: {
            latitude: String,
            longitude: String,
        },
        correctiveAction: [{
            chemical: String,
            quantity: String,
        }],
        diseasePhoto1: String,
        diseasePhotoId1: String,
        diseasePhoto2: String,
        diseasePhotoId2: String,
    },
    plantHealth: {
        severityType: String,
        location: {
            latitude: String,
            longitude: String,
        },
        correctiveAction: String,
        plantHealthPhoto1: String,
        plantHealthPhotoId1: String,
        plantHealthPhoto2: String,
        plantHealthPhotoId2: String,
    },
    soilHealth: {
        severityType: String,
        location: {
            latitude: String,
            longitude: String,
        },
        correctiveAction: [{
            chemical: String,
            quantity: String,
        }],
        soilHealthPhoto1: String,
        soilHealthPhotoId1: String,
        soilHealthPhoto2: String,
        soilHealthPhotoId2: String,
    },
    other: {
        severityType: String,
        description: String,
        correctiveAction: [{
            chemical: String,
            quantity: String,
        }],
        otherPhoto1: String,
        otherPhotoId1: String,
        otherPhoto2: String,
        otherPhotoId2: String,
    }
}

export const CropMonitoring = mongoose.model("cropMonitoring", cropMonitoringSchema);