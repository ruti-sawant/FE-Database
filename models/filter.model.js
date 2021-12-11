import mongoose from 'mongoose';

const filters = {
    farmerName: [String],
    MHCode: [String],
    GGN: [String],
    village: [String],
    tag: [String],
    variety: [String],
    broadcastCategory: [String]
}


export const Filter = mongoose.model("filter", filters);

export default Filter;