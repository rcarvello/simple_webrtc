const fs = require("fs");
const https = require("https");
const WebSocket = require("ws");
const users = {};

const server = https.createServer({
  cert: fs.readFileSync("cert.pem"),
  key: fs.readFileSync("key.pem")
});

const wss = new WebSocket.Server({ server });

wss.on("connection", ws => {
  let userName = null;

  ws.on("message", message => {
    const data = JSON.parse(message);
    if (data.type === "register") {
      userName = data.name;
      users[userName] = ws;
      ws.send(JSON.stringify({ type: "registered", payload: userName }));
    } else if (data.to && users[data.to]) {
      users[data.to].send(JSON.stringify({ ...data, from: userName }));
    }
  });

  ws.on("close", () => {
    if (userName) delete users[userName];
  });
});

server.listen(443, () => console.log("Signaling server running on port 443"));