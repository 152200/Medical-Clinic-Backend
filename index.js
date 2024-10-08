import express from "express";
import { dbConnection } from "./database/dbConnection.js";
import  dotenv  from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import fileUpload from "express-fileupload";
import { errorMiddleware } from "./middlewares/error.js";
import messageRouter from "./router/messageRouter.js";
import userRouter from "./router/userRouter.js";
import appointmentRouter from "./router/appointmentRouter.js";
import mongoose from "mongoose";

const app = express();
dotenv.config()
// config({ path: "./config.env" });

app.use(
  cors({
    origin: [process.env.FRONTEND_URL_ONE,process.env.FRONTEND_URL_TWO],
    method: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
app.use("/api/v1/message", messageRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/appointment", appointmentRouter);

// dbConnection();

mongoose
    .connect(process.env.MONGO_URI, {
      dbName: "Medical-Clinic",
    })
    .then(() => {
      console.log("Connected to database!");
    })
    .catch((err) => {
      console.log("Some error occured while connecting to database ", err);
    });

app.use(errorMiddleware);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// export default app;
