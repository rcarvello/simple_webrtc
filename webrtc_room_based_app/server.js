const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8080 });
const rooms = {};

wss.on("connection", ws => {
  ws.on("message", message => {
    const data = JSON.parse(message);
    const { type, room } = data;

    if (!rooms[room]) rooms[room] = [];
    if (type === "join") {
      rooms[room].push(ws);
      if (rooms[room].length === 2) {
        rooms[room].forEach(s => s.send(JSON.stringify({ type: "ready", room })));
      }
    } else if (["offer", "answer", "candidate"].includes(type)) {
      rooms[room].forEach(s => {
        if (s !== ws && s.readyState === WebSocket.OPEN) {
          s.send(JSON.stringify(data));
        }
      });
    }
  });

  ws.on("close", () => {
    for (const room in rooms) {
      rooms[room] = rooms[room].filter(s => s !== ws);
      if (rooms[room].length === 0) delete rooms[room];
    }
  });
});
