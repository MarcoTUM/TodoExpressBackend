// Store environment data in .env file
import dotenv from "dotenv";
dotenv.config();

// Setup express webserver
import express from "express";
const app = express();

// Cross-Origin Resource Sharing
import cors from "cors";
app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true
}));

// Setup connection to MongoDb Atlas
import {connect, ConnectOptions} from "mongoose";
runMongoose().catch(error => console.log(error));

async function runMongoose() {
    if (process.env.MONGODB_URL) {
        await connect(process.env.MONGODB_URL, {useNewUrlParser: true} as ConnectOptions);
        console.log("Connected to MongoDB database.");
    } else {
        throw new Error("[Error] MONGODB_URL in .env is undefined!");
    }
}

// Use JSON requests for all API calls
app.use(express.json());

// Setup REST API
const taskRouter = require("./routes/TaskController");
app.use("/task", taskRouter);

// Listen for requests
app.listen(process.env.PORT);
console.log(`REST API is listening for requests on port ${process.env.PORT}`);