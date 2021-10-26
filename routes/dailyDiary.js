const express = require("express");
const router = express.Router();

const controllers = require("../controllers/dailyDiary.con.js");

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
    const query = builtProjection(req.query);//building query to return only specific parts of data

    controllers.getAllDiaries(query)
        .then((data) => {
            // console.log(data);
            res.status(200).send(data);
        })
        .catch((err) => {
            // console.log(err);
            res.status(400).send({ message: err.message });
        });
});


router.get("/:farmerId/:diaryId?", (req, res) => {
    if (!validate(req.headers.apiid)) {
        res.status(401).send({ message: "Unauthosized request" });
        return;
    }
    const query = builtProjection(req.query);//building query to return only specific parts of data

    const farmerId = req.params.farmerId;
    const diaryId = req.params.diaryId;
    if (farmerId === 'data') {
        // if dairyId is specified then only we fetch database
        if (diaryId) {
            controllers.getDiary(diaryId, query)
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
        controllers.getFarmerDiaries(farmerId, query)
            .then((data) => {
                res.status(200).send(data);
            })
            .catch((err) => {
                res.status(400).send({ message: err.message });
            })
    }
});

router.post("/", async (req, res) => {
    if (!validate(req.headers.apiid)) {
        res.status(401).send({ message: "Unauthosized request" });
        return;
    }
    controllers.insertDailyDiary(req.body.data)
        .then((data) => {
            res.status(200).send({ message: `dairy inserted with ID ${data._id}` });
        })
        .catch((err) => {
            res.status(400).send({ message: err.message });
        })
});

router.delete("/:farmerId/:diaryId?", (req, res) => {
    if (!validate(req.headers.apiid)) {
        res.status(401).send({ message: "Unauthosized request" });
        return;
    }
    //to get data on basis of diaryId 
    //for farmerId!=='data' I have to return considering farmerId is specified
    const farmerId = req.params.farmerId;
    const diaryId = req.params.diaryId;

    if (farmerId === 'data') {
        // if seasonalDataId is specified then only we fetch database
        if (diaryId) {
            controllers.deleteDiary(diaryId)
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
        controllers.deleteFarmerDiary(farmerId)
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


router.patch("/:id", (req, res) => {
    if (!validate(req.headers.apiid)) {
        res.status(401).send({ message: "Unauthosized request" });
        return;
    }
    controllers.updateDiary(req.params.id, req.body.data)
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