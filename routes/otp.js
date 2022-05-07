import { Router } from "express";
const router = Router();
import dotenv from 'dotenv';
dotenv.config();

import axios from 'axios';
import { hotp } from "otplib";

import middlewareAuthentication from "../authentication.js";
import OTP from '../models/otp.model.js';
import Login from '../models/login.model.js';
import { FarmerInfo } from '../models/farmers.model.js';
import { Admin } from '../models/admins.model.js';

router.post("/generate", middlewareAuthentication, (req, res) => {
    const data = req.body.data;
    if (data) {
        const userId = data.userId;
        Login.findOne({ userId: userId })
            .then(async (loginObject) => {
                //check if user exists or not in logins.
                if (loginObject) {
                    //random is used 3 times for maintaining uniqueness in counter.
                    const counter = Math.floor((Math.random() + Math.random() + Math.random()) * 10000);
                    //generate OTP by using hotp library with secrete and random counter.
                    const otp = hotp.generate(process.env.OTP_SECRETE, counter);
                    //expire in 5 mins.
                    const expireIn = Date.now() + (5 * 60 * 1000);
                    let number;
                    //code to get number of user.
                    if (loginObject.userType === "farmer") {
                        await FarmerInfo.findOne({ userId: userId })
                            .then((farmerObject) => {
                                if (farmerObject && farmerObject.personalInformation.mobileNumber && farmerObject.personalInformation.mobileNumber.length > 0) {
                                    number = farmerObject.personalInformation.mobileNumber[0];
                                }
                            })
                            .catch((err) => {
                                //console.log(err);
                            });
                    } else {
                        await Admin.findOne({ userId: userId })
                            .then((adminObject) => {
                                if (adminObject && adminObject.mobileNumber && adminObject.mobileNumber) {
                                    number = adminObject.mobileNumber;
                                }
                            })
                            .catch((err) => {
                                //console.log(err);
                            });
                    }
                    number = "+91" + number;
                    //console.log(number);
                    //write code for sending this otp to user's mobile or email and you are get to go.

                    //using d7 networks library to send sms.
                    // if found any other library you can send sms using that.
                    axios.post('https://rest-api.d7networks.com/secure/send', {
                        "to": number,
                        "content": "Welcome to D7 sms , we will help you to talk with your customer effectively",
                        "from": "SMSINFO",
                    }, {
                        auth: {
                            username: "vdur5726",
                            password: "idyr4a9M"
                        }
                    })
                        .then((messageResponse) => {
                            //console.log(messageResponse);
                            //Save OTP in database.
                            const otpObject = new OTP({
                                number, otp, expireIn, counter, userId,
                            });
                            otpObject.save();
                            res.status(200).send(otp);
                        })
                        .catch((err) => {
                            //console.log(err);
                            res.status(400).send({ message: err.message });
                            return;
                        });

                    //console.log(otp, counter, expireIn, userId);

                }
                else {
                    res.status(400).send({ message: "Invalid userId or no such user exists" });
                }
            })
            .catch((err) => {
                //console.log(err);
                res.status(400).send({ message: "Error while generating Otp" });
            });
    } else {
        res.status(400).send({ message: "No data provided" });
    }
});

//function to validate data
router.post("/validate", middlewareAuthentication, (req, res) => {
    //fetch otp database.
    //check for expire time.
    //if expire time ahead of current time then validate by again generating otp by stored counter in database.
    //also delete that otp from collection.
})


export default router;