import { Router } from "express";
const router = Router();

import middlewareAuthentication from "../authentication.js";
import { deleteMonitoring, deleteMonitoringForPlot, getAllMonitoring, getMonitoring, getMonitoringForPlot, insertMonitoring } from "../controllers/cropMonitoring.con.js";
import { builtProjection } from "../supportiveFunctions.js";


router.get("/", middlewareAuthentication, (req, res) => {
    const query = builtProjection(req.query);

    getAllMonitoring(query)
        .then((data) => {
            console.log(data);
            res.status(200).send(data);
        })
        .catch((err) => {
            console.log(err);
            res.status(400).send({ message: err.message });
        });
});

router.get("/data/:monitoringId", middlewareAuthentication, (req, res) => {
    const query = builtProjection(req.query);
    const monitoringId = req.params.monitoringId;

    getMonitoring(monitoringId, query)
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

    getMonitoringForPlot(MHCode, query)
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
    insertMonitoring(data)
        .then((data) => {
            console.log(data);
            res.status(200).send({ message: "Monitoring data inserted successfully. " });
        })
        .catch((err) => {
            console.log(err);
            res.status(400).send({ message: err.message });
        });
});

router.delete("/:monitoringId", middlewareAuthentication, (req, res) => {
    const monitoringId = req.params.monitoringId;

    deleteMonitoring(monitoringId)
        .then((data) => {
            console.log(data);
            res.status(200).send({ message: "Monitoring data deleted successfully" });
        })
        .catch((err) => {
            console.log(err);
            res.status(400).send({ message: err.message });
        });
});

router.delete("/MHCode/:MHCode", middlewareAuthentication, (req, res) => {
    const MHCode = req.params.MHCode;

    deleteMonitoringForPlot(MHCode)
        .then((data) => {
            console.log(data);
            res.status(200).send({ message: "Monitoring data for " + MHCode + " deleted successfully" });
        })
        .catch((err) => {
            console.log(err);
            res.status(400).send({ message: err.message });
        });
});

export default router;