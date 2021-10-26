const mongoose = require("mongoose");

const apiKeySchema = {
    apiKey: {
        type: String,
        required: true,
    }
}

const ApiKey = mongoose.model("apiKey", apiKeySchema);

module.exports.getKey = async function () {
    return new Promise((resolve, reject) => {
        ApiKey.find({})
            .then(resolve)
            .catch(reject);
    });
    // try {
    //     const data = await ApiKey.find({});
    //     return data[0].apiKey;
    // } catch (err) {
    //     console.log(err);
    // }
}