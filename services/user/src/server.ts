import http from "http";
import app from "./app";
import config from "./config/config";
import connectDB from "./config/connectDB";
const server = http.createServer(app);

const PORT = config.PORT;

connectDB();

server.listen(PORT, () => {
  console.log(`User server is running on the port ${PORT}`);
});
