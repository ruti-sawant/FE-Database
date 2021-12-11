import mongoose from 'mongoose';
const broadcastSchema = {
    topic: String,
    category: String,
    date: Date,
    description: String,
    format: String,
    link: String,
    driveId: String,
    analytics: {
        numberOfRecipients: {
            type: Number,
            default: 0
        },
        numberOfUniqueViews: {
            type: Number,
            default: 0
        }
    },
    chats: [{
        farmerName: String,
        question: String,
        adminName: {
            type: String,
            default: ""
        },
        answer: {
            type: String,
            default: ""
        }
    }],
    //if it is true then dont look for both attributes below but if false then look for non empty 
    toAllFarmers: {
        type: Boolean,
        default: false,
    },
    farmers: [String],
    tags: [String],
}

export const Broadcast = mongoose.model("broadcast", broadcastSchema);

export default Broadcast;