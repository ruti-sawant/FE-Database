import mongoose from "mongoose";

const apiKeySchema = {
    apiKey: {
        type: String,
        required: true,
    }
}
const ApiKey = mongoose.model("apiKey", apiKeySchema);

function getKey() {
    return new Promise((resolve, reject) => {
        ApiKey.find({})
            .then(resolve)
            .catch(reject);
    });
}

export async function middlewareAuthentication(req, res, next) {
    //checks if apiid is valid or not if not sends back 401.
    if (! await validate(req.headers.apiid)) {
        res.status(401).send({ message: "Unauthorized request" });
        return;
    }
    next();
}

export default middlewareAuthentication;

//supportive function
async function validate(appId) {
    let apiKey;
    await getKey()
        .then((data) => {
            apiKey = data[0].apiKey;
        })
        .catch((err) => {
            console.log(err);
        });
    return appId === apiKey;
}