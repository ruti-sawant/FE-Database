const express = require("express");

const router = express.Router();

const controllers = require("../controllers/seasonalData.con.js");

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
    const query = builtProjection(req.query);
    controllers.getAllSeasonalData(query)
        .then((data) => {
            res.status(200).send(data);
        })
        .catch((err) => {
            res.status(400).send({ message: err.message });
        });
});

router.get("/:farmerId/:seasonalDataId?", (req, res) => {
    if (!validate(req.headers.apiid)) {
        res.status(401).send({ message: "Unauthosized request" });
        return;
    }
    //to get data on basis of seasonalDataId 
    //for farmerId!=='data' I have to return considering farmerId is specified
    const query = builtProjection(req.query);
    const farmerId = req.params.farmerId;
    const seasonalDataId = req.params.seasonalDataId;

    if (farmerId === 'data') {
        // if seasonalDataId is specified then only we fetch database
        if (seasonalDataId) {
            controllers.getSeasonalData(seasonalDataId, query)
                .then((data) => {
                    res.status(200).send(data);
                })
                .catch((err) => {
                    res.status(400).send({ message: err.message });
                });
        } else {
            res.status(404).send({ message: "invalid route specified" });
        }
    } else {
        controllers.getFarmerSeasonalData(farmerId, query)
            .then((data) => {
                res.status(200).send(data);
            })
            .catch((err) => {
                res.status(400).send({ message: err.message });
            })
    }
});

router.get("/farmers/plots/:plotId", (req, res) => {
    if (!validate(req.headers.apiid)) {
        res.status(401).send({ message: "Unauthosized request" });
        return;
    }
    const plotId = req.params.plotId;
    const query = builtProjection(req.query);
    controllers.getPlotsSeasonalData(plotId, query)
        .then((data) => {
            res.status(200).send(data);
        })
        .catch((err) => {
            res.status(400).send({ message: err.message });
        });
});

router.post("/", (req, res) => {
    if (!validate(req.headers.apiid)) {
        res.status(401).send({ message: "Unauthosized request" });
        return;
    }
    controllers.insertSeasonalData(req.body.data)
        .then((data) => {
            res.status(200).send({ message: `seasonal Data inserted with ID ${data._id}` });
        })
        .catch((err) => {
            res.status(400).send({ message: err.message });
        });
});


router.patch("/:id", (req, res) => {
    if (!validate(req.headers.apiid)) {
        res.status(401).send({ message: "Unauthosized request" });
        return;
    }
    controllers.updateSeasonalData(req.params.id, req.body.data)
        .then((result) => {
            console.log(result);
            if (result.acknowledged)
                res.status(200).send({ message: "Success" });
            else {
                res.status(400).send({ message: "Failure" });
            }
        })
        .catch((err) => {
            res.status(400).send({ message: err.message });
        });
});


router.delete("/:farmerId/:seasonalDataId?", (req, res) => {
    if (!validate(req.headers.apiid)) {
        res.status(401).send({ message: "Unauthosized request" });
        return;
    }
    //to get data on basis of seasonalDataId 
    //for farmerId!=='data' I have to return considering farmerId is specified
    const farmerId = req.params.farmerId;
    const seasonalDataId = req.params.seasonalDataId;

    if (farmerId === 'data') {
        // if seasonalDataId is specified then only we fetch database
        if (seasonalDataId) {
            controllers.deleteSeasonalData(seasonalDataId)
                .then((data) => {
                    if (data.deletedCount == 0)//no document exists
                        res.status(400).send({ message: "failure" });
                    else
                        res.status(200).send({ message: "success" });
                })
                .catch((err) => {
                    res.status(400).send({ message: err.message });
                });
        } else {
            res.status(404).send({ message: "invalid route specified" });
        }
    } else {
        controllers.deleteFarmerSeasonalData(farmerId)
            .then((data) => {
                if (data.deletedCount == 0)//no document exists for farmer
                    res.status(400).send({ message: "failure" });
                else
                    res.status(200).send({ message: "success" });
            })
            .catch((err) => {
                res.status(400).send({ message: err.message });
            })
    }
});


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