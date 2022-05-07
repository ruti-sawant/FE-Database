import { Router } from "express";
const router = Router();

import { getAllDiaries, getMHCodeDiaries, getDiary, getFarmerDiaries, insertDailyDiary, insertMultipleDailyDiaries, deleteDiary, deleteFarmerDiary, updateDiary, markDiaryAsComplete } from "../controllers/dailyDiary.con.js";
import { middlewareAuthentication } from '../authentication.js';
import { builtProjection } from '../supportiveFunctions.js';

//to get all daily diaries.
router.get("/", middlewareAuthentication, (req, res) => {
    const query = builtProjection(req.query);//building query to return only specific parts of data

    getAllDiaries(query)
        .then((data) => {
            // console.log(data);
            res.status(200).send(data);
        })
        .catch((err) => {
            // console.log(err);
            res.status(400).send({ message: err.message });
        });
});

//to get all daily diaries for a single plot by MHCode.
router.get("/MHCode/:MHCode", middlewareAuthentication, (req, res) => {
    const query = builtProjection(req.query);

    const MHCode = req.params.MHCode;
    getMHCodeDiaries(MHCode, query)
        .then((data) => {
            res.status(200).send(data);
        }).catch((err) => {
            res.status(400).send({ message: err.message });
        })
})

//
router.get("/:farmerId/:diaryId?", middlewareAuthentication, (req, res) => {
    const query = builtProjection(req.query);//building query to return only specific parts of data

    const farmerId = req.params.farmerId;
    const diaryId = req.params.diaryId;
    //to data by diaryId.
    if (farmerId === 'data') {
        // if dairyId is specified then only we fetch database
        if (diaryId) {
            getDiary(diaryId, query)
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
        //to get data by farmerId.
        getFarmerDiaries(farmerId, query)
            .then((data) => {
                res.status(200).send(data);
            })
            .catch((err) => {
                res.status(400).send({ message: err.message });
            })
    }
});

//to add new daily diary.
router.post("/", middlewareAuthentication, (req, res) => {
    insertDailyDiary(req.body.data)
        .then((data) => {
            res.status(200).send({ message: `dairy inserted with ID ${data._id}` });
        })
        .catch((err) => {
            res.status(400).send({ message: err.message });
        })
});

//to add multiple daily diaries.
router.post("/all", middlewareAuthentication, (req, res) => {
    insertMultipleDailyDiaries(req.body.data)
        .then((data) => {
            res.status(200).send({ message: "All diaries inserted" });
        })
        .catch((err) => {
            //console.log("err", err);
            res.status(400).send({ message: err.message });
        })
});

//to update daily diary.
router.patch("/:id", middlewareAuthentication, (req, res) => {
    updateDiary(req.params.id, req.body.data)
        .then((result) => {
            //console.log(result);
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

//to mark any daily diary as complete.
router.patch("/markComplete/:id", middlewareAuthentication, (req, res) => {
    if (req.body.data) {
        markDiaryAsComplete(req.params.id, req.body.data)
            .then((result) => {
                //console.log(result);
                res.status(200).send({ message: "Diary " + req.body.data.type + " completed successfully" });
            })
            .catch((err) => {
                res.status(400).send({ message: err.message });
            });
    } else {
        res.status(400).send({ message: "Data is insufficient for updating" });
    }
});

router.delete("/:farmerId/:diaryId?", middlewareAuthentication, (req, res) => {
    //to get data on basis of diaryId 
    //for farmerId!=='data' I have to build logic considering farmerId is specified
    const farmerId = req.params.farmerId;
    const diaryId = req.params.diaryId;
    //delete 
    if (farmerId === 'data') {
        //delete individual diary
        if (diaryId) {
            deleteDiary(diaryId)
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
        //delete all diaries for a single farmer by farmerId.
        deleteFarmerDiary(farmerId)
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


export default router;