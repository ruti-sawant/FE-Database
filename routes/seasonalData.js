import { Router } from "express";
const router = Router();

import { getAllSeasonalData, getSeasonalData, getFarmerSeasonalData, getPlotsSeasonalData, insertSeasonalData, updateSeasonalData, deleteSeasonalData, deleteFarmerSeasonalData, getMHCodeSeasonalData, deleteSeasonalDataByYear, deleteSeasonalDataByPlotId } from "../controllers/seasonalData.con.js";
import { middlewareAuthentication } from '../authentication.js';
import { builtProjection } from '../supportiveFunctions.js';

router.get("/", middlewareAuthentication, (req, res) => {
    const query = builtProjection(req.query);
    getAllSeasonalData(query)
        .then((data) => {
            res.status(200).send(data);
        })
        .catch((err) => {
            res.status(400).send({ message: err.message });
        });
});

router.get("/:farmerId/:seasonalDataId?", middlewareAuthentication, (req, res) => {
    //to get data on basis of seasonalDataId 
    //for farmerId!=='data' I have to return considering farmerId is specified
    const query = builtProjection(req.query);
    const farmerId = req.params.farmerId;
    const seasonalDataId = req.params.seasonalDataId;

    if (farmerId === 'data') {
        // if seasonalDataId is specified then only we fetch database
        if (seasonalDataId) {
            getSeasonalData(seasonalDataId, query)
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
        getFarmerSeasonalData(farmerId, query)
            .then((data) => {
                res.status(200).send(data);
            })
            .catch((err) => {
                res.status(400).send({ message: err.message });
            })
    }
});

router.get("/farmers/plots/:plotId", middlewareAuthentication, (req, res) => {
    const plotId = req.params.plotId;
    const query = builtProjection(req.query);
    getPlotsSeasonalData(plotId, query)
        .then((data) => {
            res.status(200).send(data);
        })
        .catch((err) => {
            res.status(400).send({ message: err.message });
        });
});

router.get("/farmers/MHCode/:MHCode", middlewareAuthentication, (req, res) => {
    const MHCode = req.params.MHCode;
    const query = builtProjection(req.query);
    getMHCodeSeasonalData(MHCode, query)
        .then((data) => {
            res.status(200).send(data);
        })
        .catch((err) => {
            res.status(400).send({ message: err.message });
        });
});

router.post("/", middlewareAuthentication, (req, res) => {
    insertSeasonalData(req.body.data)
        .then((data) => {
            res.status(200).send({ message: `seasonal Data inserted with ID ${data._id}` });
        })
        .catch((err) => {
            res.status(400).send({ message: err.message });
        });
});

router.patch("/:id", middlewareAuthentication, (req, res) => {
    updateSeasonalData(req.params.id, req.body.data)
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

router.delete("/:farmerId/:seasonalDataId?", middlewareAuthentication, (req, res) => {
    //to get data on basis of seasonalDataId 
    //for farmerId!=='data' I have to return considering farmerId is specified
    const farmerId = req.params.farmerId;
    const seasonalDataId = req.params.seasonalDataId;

    if (farmerId === 'data') {
        // if seasonalDataId is specified then only we fetch database
        if (seasonalDataId) {
            deleteSeasonalData(seasonalDataId)
                .then((data) => {
                    res.status(200).send({ message: " records deleted" });
                })
                .catch((err) => {
                    res.status(400).send({ message: err.message });
                });
        } else {
            res.status(404).send({ message: "invalid route specified" });
        }
    } else {
        deleteFarmerSeasonalData(farmerId)
            .then((data) => {
                res.status(200).send({ message: " records deleted" });
            })
            .catch((err) => {
                res.status(400).send({ message: err.message });
            })
    }
});

router.delete("/deleteByYear/data/:year", middlewareAuthentication, (req, res) => {
    const year = req.params.year;
    deleteSeasonalDataByYear(year)
        .then((data) => {
            console.log("data", data);
            res.status(200).send({ message: " records deleted" });
        })
        .catch((err) => {
            console.log("err", err);
            res.status(400).send({ message: err.message });
        });
});

router.delete("/deleteByPlot/data/:plotId", middlewareAuthentication, (req, res) => {
    const plotId = req.params.plotId;
    deleteSeasonalDataByPlotId(plotId)
        .then((data) => {
            console.log("data", data);
            res.status(200).send({ message: " records deleted" });
        })
        .catch((err) => {
            console.log("err", err);
            res.status(400).send({ message: err.message });
        });
});

export default router;