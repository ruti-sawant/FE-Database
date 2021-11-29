const express = require("express");
const router = express.Router();

const controllers = require("../controllers/filter.con.js");

let apiKey;
require("../apiKey.js").getKey()
    .then((data) => {
        apiKey = data[0].apiKey;
    })
    .catch((err) => {
        console.log(err);
    });

router.get("/", (req, res) => {
    if (!validate(req.headers.apiid)) {
        res.status(401).send({ message: "Unauthosized request" });
        return;
    }
    controllers.getFilters()
        .then((data) => {
            // console.log(data);
            res.status(200).send(data);
        })
        .catch((err) => {
            // console.log(err);
            res.status(400).send({ message: err.message });
        });
});

function validate(appId) {
    return appId === apiKey;
}

module.exports = router;