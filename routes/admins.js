import { Router } from "express";
const router = Router();

import { getAllAdmins, getAdmin, addAdmin, updateAdmin, deleteAdmin } from "../controllers/admins.con.js";
import { middlewareAuthentication } from '../authentication.js';
import { builtProjection } from '../supportiveFunctions.js';

router.get("/", middlewareAuthentication, (req, res) => {
    const query = builtProjection(req.query);
    getAllAdmins(query)
        .then((data) => {
            console.log(data);
            res.status(200).send(data);
        })
        .catch((err) => {
            console.log(err);
            res.status(400).send({ message: err.message });
        });
});


router.get("/:adminId", middlewareAuthentication, async (req, res) => {
    const query = builtProjection(req.query);
    getAdmin(req.params.adminId, query)
        .then((data) => {
            console.log(data);
            res.status(200).send(data);
        })
        .catch((err) => {
            console.log(err);
            res.status(400).send({ message: err.message });
        });
});

router.post("/", middlewareAuthentication, async (req, res) => {
    addAdmin(req.body.data)
        .then((admin) => {
            console.log(admin);
            res.status(200).send({ message: 'admin inserted successfully' });
        })
        .catch((err) => {
            console.log(err);
            res.status(400).send({ message: err.message });
        });
});

router.patch("/:adminId", middlewareAuthentication, async (req, res) => {
    updateAdmin(req.params.adminId, req.body.data)
        .then((admin) => {
            console.log(admin);
            res.status(200).send({ message: 'admin updated successfully' });
        })
        .catch((err) => {
            console.log(err);
            res.status(400).send({ message: err.message });
        });
});


router.delete("/:adminId", middlewareAuthentication, async (req, res) => {
    deleteAdmin(req.params.adminId)
        .then((admin) => {
            console.log(admin);
            res.status(200).send({ message: 'admin deleted successfully' });
        })
        .catch((err) => {
            console.log(err);
            res.status(400).send({ message: err.message });
        });
});
export default router;