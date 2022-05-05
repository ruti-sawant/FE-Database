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
                            return;
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

router.post("/forgotPassword", middlewareAuthentication, (req, res) => {
    const data = req.body.data;
    if (data) {
        const userId = data.userId;
        const password = data.password;
        Login.findOne({ userId: userId })
            .then(async (loginObject) => {
                if (loginObject) {
                    const saltRounds = Number(process.env.SALT_ROUNDS);
                    bcrypt.hash(password, saltRounds, function (err, hash) {
                        if (err) {
                            console.log("err", err);
                        } else {
                            Login.updateOne({ userId: userId }, { password: hash })
                                .then((data) => {
                                    console.log(data);
                                    res.status(200).send({ message: "Password updated successfully" });
                                })
                                .catch((err) => {
                                    res.status(400).send({ message: err.message });
                                    console.log(err);
                                });
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