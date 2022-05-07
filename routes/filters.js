import { Router } from "express";
const router = Router();

import { getFilters } from "../controllers/filter.con.js";
import { middlewareAuthentication } from '../authentication.js';
import { builtProjection } from '../supportiveFunctions.js';

//get all filters.
router.get("/", middlewareAuthentication, (req, res) => {
    const query = builtProjection(req.query);//building query to return only specific parts of data
    getFilters(query)
        .then((data) => {
            res.status(200).send(data);
        })
        .catch((err) => {
            res.status(400).send({ message: err.message });
        });
});

export default router;