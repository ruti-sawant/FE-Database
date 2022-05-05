import { Router } from "express";
const router = Router();
import dotenv from 'dotenv';
dotenv.config();


import bcrypt from 'bcrypt';

import Login from "../models/login.model.js";
import middlewareAuthentication from "../authentication.js";



router.post("/verify", middlewareAuthentication, (req, res) => {
    const data = req.body.data;
    if (data) {
        const userId = data.userId;
        const password = data.password;
        Login.findOne({ userId: userId })
            .then(async (loginObject) => {
                if (loginObject) {
                    bcrypt.compare(password, loginObject.password).then(function (result) {
                        if (result) {
                            res.status(200).send({
                                loggedIn: true,
                                data: {
                                    userId: loginObject.userId,
                                    userType: loginObject.userType,
                                    mongoId: loginObject.mongoId,
                                }
                            });
                        } else {
                            res.status(200).send({ loggedIn: false });
                        }
                    });
                } else {
                    res.status(400).send({ message: "User not found" });
                }
            })
            .catch((err) => {
                console.log(err);
                res.status(400).send({ message: err.message });
            });
    } else {
        res.status(400).send({ message: "No data provided" });
    }
});




export default router;