import express from "express";
import proxy from "express-http-proxy";

const app = express();
app.use(express.json());

app.use("/user", proxy("http://localhost:8001"));
app.use("/captain", proxy("http://localhost:8002"));

export default app;
