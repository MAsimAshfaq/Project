// Imports
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import vehicleRoutes from "./routes/vehiclesRoute.js";
import ApiError from "./utils/ApiError.js";
import { errorConverter, errorHandler } from "./middlewares/error.js";
import httpStatus from "http-status";
import http from "http";

/**
 * CONFIGURATIONS
 */
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

let server = http.createServer(app);

/**
 * ROUTES
 */

app.use("/vehicle", vehicleRoutes);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

/**
 * MONGOOSE SETUP
 */
mongoose.set("strictQuery", false);
const PORT = process.env.PORT || 3001;
const DB_URI = process.env.MONGO_DB_URI || "mongodb://localhost:27017/vehicles";
mongoose
  .connect(DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(function () {
    app.listen(PORT, function () {
      console.log("Connected to mongo_db on port :" + PORT);
    });
  })
  .catch(function (error) {
    console.log("Error while connecting to mongo_db : ", error);
  });

/* PROCESS ERROR HANDLE */
const exitHandler = () => {
  if (server) {
    server.close(() => {
      console.log("Server closed");
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  console.error("Uncaught exception occurred: ", error);
  console.error(" >> Uncaught exception occurred <<", error);
  exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);
process.on("SIGTERM", () => {
  console.log("SIGTERM received");
  if (server) {
    server.close();
  }
});
