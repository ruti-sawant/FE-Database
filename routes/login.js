import { Router } from "express";
const router = Router();
import dotenv from 'dotenv';
dotenv.config();


import bcrypt from 'bcrypt';

import Login from "../models/login.model.js";
import middlewareAuthentication from "../authentication.js";
import FarmerInfo from "../models/farmers.model.js";
import Admin from "../models/admins.model.js";

//get all usernames their ids and names.
router.get("/usernames", middlewareAuthentication, (req, res) => {
    Login.find({})
        .then(async (data) => {
            const dataToSend = [];
            //iterate over all data find its name.
            for (let i = 0; i < data.length; i++) {
                if (data[i].userType === 'farmer') {
                    //for farmer fetch farmers collection.
                    await FarmerInfo.findOne({ _id: data[i].mongoId })
                        .then((farmer) => {
                            dataToSend.push({
                                name: farmer.personalInformation.name,
                                userId: data[i].userId,
                                userType: data[i].userType
                            });
                        })
                        .catch((err) => {
                            //console.log(err);
                            res.status(400).send({ message: err.message });
                            return;
                        });
                } else {
                    //for other fetch admins collection.
                    await Admin.findOne({ _id: data[i].mongoId })
                        .then((admin) => {
                            dataToSend.push({
                                name: admin.name,
                                userId: data[i].userId,
                                userType: data[i].userType
                            });
                        })
                        .catch((err) => {
                            //console.log(err);
                            res.status(400).send({ message: err.message });
                            return;
                        });
                }
            }
            res.status(200).send(dataToSend);
        })
        .catch((err) => {
            //console.log(err);
            res.status(400).send({ message: err.message });
        });
})

//verify credentials.
router.post("/verify", middlewareAuthentication, (req, res) => {
    const data = req.body.data;
    console.log(data);
    if (data) {
        const userId = data.userId;
        const password = data.password;
        Login.findOne({ userId: userId })
            .then(async (loginObject) => {
                if (loginObject) {
                    //hash received password and check with database.
                    bcrypt.compare(password, loginObject.password).then(function (result) {
                        if (result) {
                            console.log(data);
                            //send data to frontend.
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
                //console.log(err);
                res.status(400).send({ message: err.message });
            });
    } else {
        res.status(400).send({ message: "No data provided" });
    }
});

//method to reset password.
router.post("/forgotPassword", middlewareAuthentication, (req, res) => {
    const data = req.body.data;
    if (data) {
        const userId = data.userId;
        const password = data.password;
        Login.findOne({ userId: userId })
            .then(async (loginObject) => {
                if (loginObject) {
                    const saltRounds = Number(process.env.SALT_ROUNDS);
                    //hash password to store it in database.
                    bcrypt.hash(password, saltRounds, function (err, hash) {
                        if (err) {
                            //console.log("err", err);
                            res.status(400).send({ message: err.message });
                            return;
                        } else {
                            Login.updateOne({ userId: userId }, { password: hash })
                                .then((data) => {
                                    //console.log(data);
                                    res.status(200).send({ message: "Password updated successfully" });
                                })
                                .catch((err) => {
                                    //console.log(err);
                                    res.status(400).send({ message: err.message });
                                });
                        }
                    });
                } else {
                    res.status(400).send({ message: "User not found" });
                }
            })
            .catch((err) => {
                //console.log(err);
                res.status(400).send({ message: err.message });
            });
    } else {
        res.status(400).send({ message: "No data provided" });
    }
});


export default router;