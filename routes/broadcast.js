const express = require("express");
const router = express.Router();

// file to handle farmers router

const controllers = require("../controllers/broadcast.con");

let apiKey;
require("../apiKey.js").getKey()
    .then((data) => {
        apiKey = data[0].apiKey;
    })
    .catch((err) => {
        console.log(err);
    });

//function to get farmer ids according to tags.
// controllers.getFarmersForTags(["Long"])
//     .then((farmers) => {
//         console.log(farmers);
//     });


//supporting functions 
function builtProjection(object) {
    for (let attribute in object) {
        if (object[attribute] === '1') {
            object[attribute] = 1;
        } else {
            delete object[attribute];// if value is not 1 then consider that query parameter as invalid
        }
    }
    return object;
}

function validate(appId) {
    return appId === apiKey;
}

module.exports = router;