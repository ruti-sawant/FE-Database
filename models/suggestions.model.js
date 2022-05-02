import mongoose from 'mongoose';

const suggestionSchema = {
    sprayFertilizer: [String],
    fungicide: [String],
    insecticide: [String],
    organic: [String],
    plantGrowthRegulator: [String],
    fertilizer: [String],
    farmWork: [String],
    soilWork: [String],
    maintenance: [String],
};

export const Suggestions = mongoose.model("suggestion", suggestionSchema);

export default Suggestions;