const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

const url = process.env.MONGODB_CONNECT

const connectToMongo = () => {
    mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => {
        console.log("connected to mongodb");
    }).catch(
        (err) => {
            console.log("error connecting to mongodb: ", err);
        }
    )
}

module.exports = connectToMongo;