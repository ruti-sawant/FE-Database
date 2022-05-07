import mongoose from "mongoose";
//api key schema
const apiKeySchema = {
    apiKey: {
        type: String,
        required: true,
    }
}
const ApiKey = mongoose.model("apiKey", apiKeySchema);

//to get API key from database
function getKey() {
    return new Promise((resolve, reject) => {
        ApiKey.find({})
            .then(resolve)
            .catch(reject);
    });
}

//to check for authorized user only for wrong api key return 401 
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
//to compare received api key from client and in database.
async function validate(appId) {
    let apiKey;
    await getKey()
        .then((data) => {
            apiKey = data[0].apiKey;
        })
        .catch((err) => {
            //console.log(err);
        });
    return appId === apiKey;
}