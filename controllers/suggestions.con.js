import Suggestions from "../models/suggestions.model.js";

//get all suggestions.
export function getSuggestions() {
    return new Promise((resolve, reject) => {
        Suggestions.findOne({})
            .then(resolve)
            .catch(reject);
    });
}

//to add any suggestion into database with its key and data array to insert.
export function pushData(key, data) {
    return new Promise((resolve, reject) => {

        switch (key) {
            case "sprayFertilizer":
                Suggestions.updateOne({}, { $push: { sprayFertilizer: { $each: data } } })
                    .then(resolve)
                    .catch(reject);
                break;
            case "fungicide":
                Suggestions.updateOne({}, { $push: { fungicide: { $each: data } } })
                    .then(resolve)
                    .catch(reject);
                break;
            case "insecticide":
                Suggestions.updateOne({}, { $push: { insecticide: { $each: data } } })

                    .then(resolve)
                    .catch(reject);
                break;
            case "organic":
                Suggestions.updateOne({}, { $push: { organic: { $each: data } } })
                    .then(resolve)
                    .catch(reject);
                break;
            case "plantGrowthRegulator":
                Suggestions.updateOne({}, { $push: { plantGrowthRegulator: { $each: data } } })
                    .then(resolve)
                    .catch(reject);
                break;
            case "fertilizer":
                Suggestions.updateOne({}, { $push: { fertilizer: { $each: data } } })
                    .then(resolve)
                    .catch(reject);
                break;
            case "farmWork":
                Suggestions.updateOne({}, { $push: { farmWork: { $each: data } } })
                    .then(resolve)
                    .catch(reject);
                break;
            case "soilWork":
                Suggestions.updateOne({}, { $push: { soilWork: { $each: data } } })
                    .then(resolve)
                    .catch(reject);
                break;
            case "maintenance":
                Suggestions.updateOne({}, { $push: { maintenance: { $each: data } } })
                    .then(resolve)
                    .catch(reject);
                break;
            default:
                reject({ message: "Invalid key" });
        }
    });
}