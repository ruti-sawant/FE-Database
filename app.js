const express = require("express");
const dotenv = require("dotenv").config();

const app = express();

const mongoose = require("mongoose");

mongoose.connect(process.env.URL + '/' + process.env.DB_NAME);

const farmers = require("./routes/farmers.js");

const dailyDiary = require("./routes/dailyDiary.js");

const seasonalData = require("./routes/seasonalData.js");



app.use(express.json());//to access data in raw query (postman).

app.use("/farmers", farmers);

app.use("/dailyDiary", dailyDiary);

app.use("/seasonalData", seasonalData);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log("Started on port " + PORT);
})

