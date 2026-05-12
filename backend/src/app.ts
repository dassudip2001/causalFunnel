import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import analyticsRouter from "./routers/analytics.routers";
import helth from "./routers/heldth.router";
const app = express();

/* The code snippet is setting up middleware for an Express application in a TypeScript environment.
Here's what each line is doing: */
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));

// Registering the analytics router
app.use("/api/v1/analytics", analyticsRouter);
app.use("/", helth);

export default app;
