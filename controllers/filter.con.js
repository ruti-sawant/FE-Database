import { Filter } from "../models/filter.model.js";


export function getFilters(fields) {
    return new Promise((resolve, reject) => {
        Filter.find({}, fields)
            .then(resolve)
            .catch(reject);
    });
}
