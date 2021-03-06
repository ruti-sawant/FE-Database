import mongoose from 'mongoose';

const dailyDiarySchema = {
    farmerId: {
        type: mongoose.Types.ObjectId,
        required: true,
    },
    GGN: {
        type: String,
        required: true,
    },
    MHCode: {
        type: String,
        required: true,
    },
    plot: {
        type: String,
        required: true,
    },
    proposedDate: {
        type: Date,
        required: true
    },
    spraying: {
        details: [{
            category: String,
            chemical: String,
            quantity: Number,
            imageUrl: String,
            imageId: String,
        }],
        completedDate: Date,
        isCompleted: {
            type: Boolean,
            default: false,
        },
    },
    irrigation: {
        numberOfHours: Number,
        details: [{
            fertilizer: String,
            quantity: Number,
            imageUrl: String,
            imageId: String,
        }],
        completedDate: Date,
        isCompleted: {
            type: Boolean,
            default: false,
        },
    },
    farmWork: {
        details: [{
            work: String,
            comments: String,
            imageUrl: String,
            imageId: String,
        }],
        completedDate: Date,
        isCompleted: {
            type: Boolean,
            default: false,
        },
    },
    soilWork: {
        details: [{
            work: String,
            area: Number,//has to be confirmed because if client wants units then it is preferable to directly store string.
            imageUrl: String,
            imageId: String,
        }],
        completedDate: Date,
        isCompleted: {
            type: Boolean,
            default: false,
        },
    },
    maintenanceWork: {
        details: [{
            item: String,
            comments: String,
            imageUrl: String,
            imageId: String,
        }],
        completedDate: Date,
        isCompleted: {
            type: Boolean,
            default: false,
        },
    },
    notes: String,//for the last attribute in farm where farmer or admin can note something about work done.
}

export const DailyDiary = mongoose.model("dailyDiary", dailyDiarySchema);

export default DailyDiary;