import express, { json } from "express";
import dotenv from 'dotenv';
dotenv.config();
const app = express();

import mongoose from "mongoose";

mongoose.connect(process.env.URL + '/' + process.env.DB_NAME)
    .then(() => console.log("Connected to Database"))
    .catch(() => console.log("Error in connecting to database"));

import farmers from "./routes/farmers.js";
import dailyDiary from "./routes/dailyDiary.js";
import seasonalData from "./routes/seasonalData.js";
import filters from "./routes/filters.js";
import broadcast from "./routes/broadcast.js";
import mrlReport from './routes/mrl.js';

app.use(json());//to access data in raw query (postman).

app.use("/farmers", farmers);
app.use("/dailyDiary", dailyDiary);
app.use("/seasonalData", seasonalData);
app.use("/filters", filters);
app.use("/broadcasts", broadcast);
app.use("/mrlReports", mrlReport);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log("Started on port " + PORT);
})

