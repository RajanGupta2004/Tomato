import http from "http";
import app from "./app";
import config from "./config/config";
const server = http.createServer(app);

const PORT = config.PORT;

server.listen(PORT, () => {
  console.log(`Gateway is running on the port ${PORT}`);
});
