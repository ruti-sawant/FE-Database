import { Router } from "express";
const router = Router();

import middlewareAuthentication from "../authentication.js";
import { deleteReport, deleteReportForPlot, deleteReportForPlotAndYear, getAllApprovedChemicals, getAllBannedChemicals, getAllMrlReports, getMrlReport, getMRlReportByMHCode, getMRLReportBySampleNumber, insertReport, updateAllApprovedChemicals, updateAllBannedChemicals } from "../controllers/mrl.con.js";
import { builtProjection } from "../supportiveFunctions.js";

//methods for MRL Reports.
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

router.delete("/MHCode/:MHCode/:year?", middlewareAuthentication, (req, res) => {
    const MHCode = req.params.MHCode;
    const year = req.params.year;
    if (year) {
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