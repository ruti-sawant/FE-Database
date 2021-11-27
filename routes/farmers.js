const express = require("express");
const router = express.Router();

// file to handle farmers router

const controllers = require("../controllers/farmers.con.js");

let apiKey;
require("../apiKey.js").getKey()
    .then((data) => {
        apiKey = data[0].apiKey;
    })
    .catch((err) => {
        console.log(err);
    });


router.post("/", async (req, res) => {
    if (!validate(req.headers.apiid)) {
        res.status(401).send({ message: "Unauthosized request" });
        return;
    }
    controllers.insertFarmer(req.body.data)
        .then((farmer) => {
            // console.log(farmer._id);
            res.status(200).send({ message: `farmer inserted with ID ${farmer._id}` });
        })
        .catch((err) => {
            res.status(400).send({ message: err.message });
        });
});

router.get("/", (req, res) => {
    if (!validate(req.headers.apiid)) {
        res.status(401).send({ message: "Unauthosized request" });
        return;
    }
    const query = builtProjection(req.query);//building query to return only specific parts of data
    // console.log(query);
    controllers.getAllFarmersData(query)
        .then((data) => {
            // console.log(data);
            res.status(200).send(data);
        })
        .catch((err) => {
            // console.log(err);
            res.status(400).send({ message: err.message });
        });
});

router.get("/:farmerId", async (req, res) => {
    if (!validate(req.headers.apiid)) {
        res.status(401).send({ message: "Unauthosized request" });
        return;
    }
    const query = builtProjection(req.query);//building query to return only specific parts of data
    // console.log(query);
    controllers.getFarmerData(req.params.farmerId, query)
        .then((data) => {
            // console.log(data);
            res.status(200).send(data);
        })
        .catch((err) => {
            // console.log(err);
            res.status(400).send({ message: err.message });
        });
});

router.patch("/:farmerId", (req, res) => {
    if (!validate(req.headers.apiid)) {
        res.status(401).send({ message: "Unauthosized request" });
        return;
    }
    controllers.updateFarmer(req.params.farmerId, req.body.data)
        .then((result) => {
            if (result.acknowledged)
                res.status(200).send({ message: "Success" });
            else {
                res.status(400).send({ message: "failure" });
            }
        })
        .catch((err) => {
            res.status(400).send({ message: err.message });
        });
})

router.delete("/:farmerId", async (req, res) => {
    if (!validate(req.headers.apiid)) {
        res.status(401).send({ message: "Unauthosized request" });
        return;
    }
    controllers.deleteFarmer(req.params.farmerId)
        .then((data) => {
            if (data.deletedCount == 1)
                res.status(200).send({ message: "success" });
            else
                res.status(400).send({ message: "Not exist" });
        })
        .catch((err) => {
            res.status(400).send({ message: err.message });
        })
});

router.get("/GGN/:gcnKey", (req, res) => {
    if (!validate(req.headers.apiid)) {
        res.status(401).send({ message: "Unauthosized request" });
        return;
    }
    const query = builtProjection(req.query);//building query to return only specific parts of data
    controllers.getFarmerDataUsingGGN(req.params.gcnKey, query)
        .then((data) => {
            // console.log(data);
            res.status(200).send(data);
        })
        .catch((err) => {
            // console.log(err);
            res.status(400).send({ message: err.message });
        });
});


router.get("/MHCode/:MHCode", (req, res) => {
    if (!validate(req.headers.apiid)) {
        res.status(401).send({ message: "Unauthosized request" });
        return;
    }
    const query = builtProjection(req.query);//building query to return only specific parts of data
    controllers.getFarmerUsingMHCode(req.params.MHCode, query)
        .then((data) => {
            // console.log(data);
            res.status(200).send(data);
        })
        .catch((err) => {
            // console.log(err);
            res.status(400).send({ message: err.message });
        });
})

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