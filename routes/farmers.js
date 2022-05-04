import { Router } from "express";
const router = Router();

// file to handle farmers router
import { insertFarmer, getAllFarmersData, getFarmerData, updateFarmer, updatePlotOfFarmer, insertPlotOfFarmer, deleteFarmer, getFarmerDataUsingGGN, getFarmerUsingMHCode, deletePlotOfFarmer } from "../controllers/farmers.con.js";
import { middlewareAuthentication } from '../authentication.js';
import { builtProjection } from '../supportiveFunctions.js';

router.get("/", middlewareAuthentication, (req, res) => {
    const query = builtProjection(req.query);//building query to return only specific parts of data
    // console.log(query);
    getAllFarmersData(query)
        .then((data) => {
            // console.log(data);
            res.status(200).send(data);
        })
        .catch((err) => {
            // console.log(err);
            res.status(400).send({ message: err.message });
        });
});


router.get("/plots/data", middlewareAuthentication, (req, res) => {
    const query = builtProjection(req.query);//building query to return only specific parts of data
    getAllFarmersData(query)
        .then((result) => {
            let resultLength = result.length;
            let objectToSend = [];
            for (let i = 0; i < resultLength; i++) {
                const farmerObject = {};
                farmerObject.farmerID = result[i]._id;
                farmerObject.farmerName = result[i].personalInformation.name;
                farmerObject.familyName = result[i].personalInformation.familyName;
                farmerObject.GGN = result[i].personalInformation.GGN;
                if (result[i].personalInformation.name.trim() === result[i].personalInformation.familyName.trim()) {
                    farmerObject.plots = getPlotsForHead(result, i);
                } else {
                    farmerObject.plots = getPlots(result, i);
                }
                // console.log(farmerObject.farmerName, farmerObject.plot);
                objectToSend.push(farmerObject);
            }
            // console.log(objectToSend);
            res.status(200).send(objectToSend);
        })
        .catch((err) => {

            res.status(400).send({ message: err.message });
        });
});

router.get("/:farmerId", middlewareAuthentication, async (req, res) => {
    const query = builtProjection(req.query);//building query to return only specific parts of data
    // console.log(query);
    getFarmerData(req.params.farmerId, query)
        .then((data) => {
            // console.log(data);
            res.status(200).send(data);
        })
        .catch((err) => {
            // console.log(err);
            res.status(400).send({ message: err.message });
        });
});

router.get("/MHCode/:MHCode", middlewareAuthentication, (req, res) => {
    const query = builtProjection(req.query);//building query to return only specific parts of data
    getFarmerUsingMHCode(req.params.MHCode, query)
        .then((data) => {
            // console.log(data);
            res.status(200).send(data);
        })
        .catch((err) => {
            // console.log(err);
            res.status(400).send({ message: err.message });
        });
});

router.get("/GGN/:gcnKey", middlewareAuthentication, (req, res) => {
    const query = builtProjection(req.query);//building query to return only specific parts of data
    getFarmerDataUsingGGN(req.params.gcnKey, query)
        .then((data) => {
            // console.log(data);
            res.status(200).send(data);
        })
        .catch((err) => {
            // console.log(err);
            res.status(400).send({ message: err.message });
        });
});

router.post("/", middlewareAuthentication, async (req, res) => {
    insertFarmer(req.body.data)
        .then((farmer) => {
            // console.log(farmer._id);
            res.status(200).send({ message: 'farmer inserted successfully' });
        })
        .catch((err) => {
            // console.log(err);
            res.status(400).send({ message: err.message });
        });
});

router.patch("/:farmerId", middlewareAuthentication, (req, res) => {
    updateFarmer(req.params.farmerId, req.body.data)
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

router.patch("/plots/:plotId", middlewareAuthentication, (req, res) => {
    updatePlotOfFarmer(req.params.plotId, req.body.data)
        .then((result) => {
            console.log("plot patch result", result);
            if (result.acknowledged)
                res.status(200).send({ message: "Success" });
            else {
                res.status(400).send({ message: "failure" });
            }
        })
        .catch((err) => {
            console.log("plot patch err", err);
            res.status(400).send({ message: err.message });
        });
});

router.patch("/newPlot/:farmerId", middlewareAuthentication, (req, res) => {
    const farmerId = req.params.farmerId;
    insertPlotOfFarmer(farmerId, req.body.data)
        .then((result) => {
            console.log("plot insert result", result);
            if (result.acknowledged)
                res.status(200).send({ message: "Success" });
            else {
                res.status(400).send({ message: "failure" });
            }
        })
        .catch((err) => {
            console.log("plot insert err", err);
            res.status(400).send({ message: err.message });
        });
});

router.patch("/deletePlot/:plotId", middlewareAuthentication, (req, res) => {
    const plotId = req.params.plotId;
    deletePlotOfFarmer(plotId)
        .then((data) => {
            console.log("data", data);
            res.status(200).send({ message: "plot " + plotId + " deleted" });
        })
        .catch((err) => {
            console.log("err", err);
            res.status(400).send({ message: err.message });
        });
});

router.delete("/:farmerId", middlewareAuthentication, async (req, res) => {
    deleteFarmer(req.params.farmerId)
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

export default router;


//supporting functions.
function getPlotsForHead(result, i) {
    const gcnKey = result[i].personalInformation.GGN;
    const resultLength = result.length;
    const resultantArray = [];
    for (let j = 0; j < resultLength; j++) {
        if (result[j].personalInformation.GGN === gcnKey) {
            const plots = getPlots(result, j);
            for (let k = 0; k < plots.length; k++)
                resultantArray.push(plots[k]);
        }
    }
    return resultantArray;
}

function getPlots(result, i) {
    const plotsArray = result[i].plots;
    const numberOfPlots = plotsArray.length;
    const resultantArray = [];
    for (let j = 0; j < numberOfPlots; j++) {
        console.log(plotsArray[j]);
        resultantArray.push({
            plotId: plotsArray[j]._id,
            plot: plotsArray[j].farmInformation.plotNumber,
            farmerId: result[i]._id,
            farmerName: result[i].personalInformation.name,
            MHCode: plotsArray[j].farmInformation.MHCode,
        });
    }
    return resultantArray;
}