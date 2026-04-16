import express from "express";
import captainRoutes from "./routes/captain.route";

const app = express();
app.use(express.json());

app.use("/", captainRoutes);

export default app;
