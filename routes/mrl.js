import { Router } from "express";
const router = Router();

import middlewareAuthentication from "../authentication.js";
import { deleteReport, deleteReportForPlot, deleteReportForPlotAndYear, getAllApprovedChemicals, getAllBannedChemicals, getAllMrlReports, getMrlReport, getMRlReportByMHCode, getMRLReportBySampleNumber, insertMultipleReports, insertReport, updateAllApprovedChemicals, updateAllBannedChemicals } from "../controllers/mrl.con.js";
import { builtProjection } from "../supportiveFunctions.js";

//get mrl reports.
router.get("/", middlewareAuthentication, (req, res) => {
    const query = builtProjection(req.query);
    getAllMrlReports(query)
        .then((data) => {
            console.log(data);
            res.status(200).send(data);
        })
        .catch((err) => {
            console.log(err);
            res.status(400).send({ message: err.message });
        });
});

//get single report by mrlId.
router.get("/data/:mrlId", middlewareAuthentication, (req, res) => {
    const query = builtProjection(req.query);
    const mrlId = req.params.mrlId;
    getMrlReport(mrlId, query)
        .then((data) => {
            console.log(data);
            res.status(200).send(data);
        })
        .catch((err) => {
            console.log(err);
            res.status(400).send({ message: err.message });
        });
});

//get mrl reports by MHCode.
router.get("/MHCode/:MHCode", middlewareAuthentication, (req, res) => {
    const query = builtProjection(req.query);
    const MHCode = req.params.MHCode;
    getMRlReportByMHCode(MHCode, query)
        .then((data) => {
            console.log(data);
            res.status(200).send(data);
        })
        .catch((err) => {
            console.log(err);
            res.status(400).send({ message: err.message });
        });
});

//get mrl by sample number.
router.get("/sampleNumber/:sampleNumber", middlewareAuthentication, (req, res) => {
    const query = builtProjection(req.query);
    const sampleNumber = req.params.sampleNumber;
    getMRLReportBySampleNumber(sampleNumber, query)
        .then((data) => {
            console.log(data);
            res.status(200).send(data);
        })
        .catch((err) => {
            console.log(err);
            res.status(400).send({ message: err.message });
        });
});

//add new mrl report.
router.post("/", middlewareAuthentication, (req, res) => {
    const data = req.body.data;
    insertReport(data)
        .then((data) => {
            console.log(data);
            res.status(200).send({ message: "Report inserted successfully" });
        })
        .catch((err) => {
            console.log(err);
            res.status(400).send({ message: err.message });
        });
});

//to add multiple reports at same time.
router.post("/postAll", middlewareAuthentication, (req, res) => {
    const data = req.body.data;
    insertMultipleReports(data)
        .then((data) => {
            console.log(data);
            res.status(200).send({ message: "Reports inserted successfully" });
        })
        .catch((err) => {
            console.log(err);
            res.status(400).send({ message: err.message });
        });
});

//delete mrl report.
router.delete("/:mrlId", middlewareAuthentication, (req, res) => {
    const mrlId = req.params.mrlId;
    deleteReport(mrlId)
        .then((data) => {
            console.log(data);
            res.status(200).send({ message: "Report deleted successfully" });
        })
        .catch((err) => {
            console.log(err);
            res.status(400).send({ message: err.message });
        });
});

//delete mrlreports for 
router.delete("/MHCode/:MHCode/:year?", middlewareAuthentication, (req, res) => {
    const MHCode = req.params.MHCode;
    const year = req.params.year;
    if (year) {
        // if year specified delete all reports for that year and MHCode
        deleteReportForPlotAndYear(MHCode, year)
            .then((data) => {
                console.log(data);
                res.status(200).send({ message: "Report deleted successfully" });
            })
            .catch((err) => {
                console.log(err);
                res.status(400).send({ message: err.message });
            });
    } else {
        //if year not specified delete all reports for that MHCode
        deleteReportForPlot(MHCode)
            .then((data) => {
                console.log(data);
                res.status(200).send({ message: "Report deleted successfully" });
            })
            .catch((err) => {
                console.log(err);
                res.status(400).send({ message: err.message });
            });
    }
});


//methods for approved Chemicals list.
//to get all approved chemicals
router.get("/approvedChemicals", middlewareAuthentication, (req, res) => {
    const query = builtProjection(req.query);
    getAllApprovedChemicals(query)
        .then((data) => {
            console.log(data);
            res.status(200).send(data);
        })
        .catch((err) => {
            console.log(err);
            res.status(400).send({ message: err.message });
        });
});

//to add approved chemicals
router.post("/approvedChemicals", middlewareAuthentication, (req, res) => {
    const data = req.body.data;
    updateAllApprovedChemicals(data)
        .then((data) => {
            console.log(data);
            res.status(200).send({ message: "Annex 9 updated successfully" });
        })
        .catch((err) => {
            console.log(err);
            res.status(400).send({ message: err.message });
        });
});


// methods for banned Chemicals list.
//to get all banned chemicals
router.get("/bannedChemicals", middlewareAuthentication, (req, res) => {
    const query = builtProjection(req.query);
    getAllBannedChemicals(query)
        .then((data) => {
            console.log(data);
            res.status(200).send(data);
        })
        .catch((err) => {
            console.log(err);
            res.status(400).send({ message: err.message });
        });
});

//to add banned chemicals
router.post("/bannedChemicals", middlewareAuthentication, (req, res) => {
    const data = req.body.data;
    updateAllBannedChemicals(data)
        .then((data) => {
            console.log(data);
            res.status(200).send({ message: "Banned chemicals updated successfully" });
        })
        .catch((err) => {
            console.log(err);
            res.status(400).send({ message: err.message });
        });
});


export default router;