const mongoose = require("mongoose");

const filters = {
    farmerName: [String],
    MHCode: [String],
    GGN: [String],
    village: [String],
    tag: [String]
}


module.exports.Filter = mongoose.model("filter", filters);