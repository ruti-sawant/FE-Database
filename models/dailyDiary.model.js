const mongoose = require("mongoose");

const dailyDiarySchema = {
    farmerId: {
        type: mongoose.Types.ObjectId,
        required: true,
    },
    GCN: {
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
        }],
        completedDate: Date,
        isCompleted: {
            type: Boolean,
            default: false,
        },
    },
    maintainanceWork: {
        details: [{
            item: String,
            comments: String,
            imageUrl: String,
        }],
        completedDate: Date,
        isCompleted: {
            type: Boolean,
            default: false,
        },
    },
    notes: String,//for the last attribute in farm where farmer or admin can note something about work done.
}

module.exports.DailyDiary = mongoose.model("dailyDiary", dailyDiarySchema);