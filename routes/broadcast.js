import { Router } from "express";
const router = Router();

// file to handle farmers router
import { deleteBroadcast, getAllBroadcasts, getAllFarmersCount, getBroadcast, getBroadcastsForFarmer, getFarmersForTags, insertBroadcast, insertQuestion, updateAnswer } from '../controllers/broadcast.con.js';
import { middlewareAuthentication } from '../authentication.js';
import { builtProjection } from '../supportiveFunctions.js';

router.get("/", middlewareAuthentication, (req, res) => {
    const query = builtProjection(req.query);

    getAllBroadcasts(query)
        .then((data) => {
            console.log("data getAllBroadcasts", data);
            res.status(200).send(data);
        })
        .catch((err) => {
            console.log("err getAllBroadcasts", err);
            res.status(400).send({ message: err.message });
        });
});

router.get("/:broadcastId", middlewareAuthentication, (req, res) => {
    const query = builtProjection(req.query);

    const broadcastId = req.params.broadcastId;
    getBroadcast(broadcastId, query)
        .then((data) => {
            console.log("data getBroadcast", data);
            res.status(200).send(data);
        })
        .catch((err) => {
            console.log("err getBroadcast", err);
            res.status(400).send({ message: err.message });
        });
});

router.get("/farmer/:farmerId", middlewareAuthentication, (req, res) => {
    const query = builtProjection(req.query);

    const farmerId = req.params.farmerId;
    getBroadcastsForFarmer(farmerId, query)
        .then((data) => {
            console.log("data getBroadcastsForFarmer", data);
            res.status(200).send(data);
        })
        .catch((err) => {
            console.log("err getBroadcastsForFarmer", err);
            res.status(400).send({ message: err.message });
        });
});

router.post("/", middlewareAuthentication, async (req, res) => {
    const data = req.body.data;
    console.log(data);
    if (data) {
        console.log("Data before processing tags farmers and toAllFarmers", data);
        const toAllFarmers = data.toAllFarmers;
        const tagsArray = data.tags;
        const farmersArray = data.farmers;
        data.analytics = {};
        if (toAllFarmers) {//setting empty arrays to other two attributes.
            data.tags = [];
            data.farmers = [];
            await getAllFarmersCount()
                .then((count) => {
                    data.analytics.numberOfRecipients = count;
                })
                .catch((err) => {
                    console.log("Error in mapping farmers and tags", err);
                    return;
                });
        } else if (tagsArray && tagsArray.length > 0) {
            data.toAllFarmers = false;
            await getFarmersForTags(tagsArray)
                .then((farmersFromTags) => {
                    data.farmers = farmersFromTags;
                    data.analytics.numberOfRecipients = farmersFromTags.length;
                })
                .catch((err) => {
                    console.log("Error in mapping farmers and tags", err);
                    return;
                });
        } else if (farmersArray && farmersArray.length > 0) {
            data.toAllFarmers = false;
            data.analytics.numberOfRecipients = farmersArray.length;
            data.tags = [];
        } else {
            res.status(400).send({ message: "Failed to insert question whom to send not specified" });
            return;
        }
        console.log("Data after processing tags farmers and toAllFarmers", data);
        insertBroadcast(data)
            .then((resData) => {
                console.log("data insertBroadcast", resData);
                res.status(200).send({ message: "Broadcast inserted successfully" });
            })
            .catch((err) => {
                console.log("err insertBroadcast", err);
                res.status(400).send({ message: err.message });
            });
    } else {
        res.status(400).send({ message: "Failed to insert question no body" });
    }
});

router.patch("/:broadcastId", middlewareAuthentication, (req, res) => {
    const broadcastId = req.params.broadcastId;
    if (req.body.data) {
        const farmerName = req.body.data.farmerName;
        const question = req.body.data.question;
        insertQuestion(broadcastId, farmerName, question)
            .then((data) => {
                console.log("data insertQuestion", data);
                res.status(200).send({ message: "Broadcast chat inserted successfully" });
            })
            .catch((err) => {
                console.log("err insertQuestion", err);
                res.status(400).send({ message: err.message });
            });
    } else {
        res.status(400).send({ message: "Failed to insert question no body" });
    }
});

router.patch("/:broadcastId/:chatId", middlewareAuthentication, (req, res) => {
    const broadcastId = req.params.broadcastId;
    const chatId = req.params.chatId;
    if (req.body.data) {
        const adminName = req.body.data.adminName;
        const answer = req.body.data.answer;
        updateAnswer(broadcastId, chatId, adminName, answer)
            .then((data) => {
                console.log("data updateAnswer", data);
                res.status(200).send({ message: "Broadcast answer inserted successfully" });
            })
            .catch((err) => {
                console.log("err updateAnswer", err);
                res.status(400).send({ message: err.message });
            });
    } else {
        res.status(400).send({ message: "Failed to insert answer no body" });
    }
});

router.delete("/:broadcastId", middlewareAuthentication, (req, res) => {
    const broadcastId = req.params.broadcastId;
    deleteBroadcast(broadcastId)
        .then((data) => {
            console.log("data deleteBroadcast", data);
            res.status(200).send({ message: "Broadcast deleted successfully" });
        })
        .catch((err) => {
            console.log("err deleteBroadcast", err);
            res.status(400).send({ message: err.message });
        });
});

export default router;