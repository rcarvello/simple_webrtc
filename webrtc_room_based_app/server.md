# server.js

## Introduction
Code for  **Node.js signaling server** using the `ws` WebSocket library. 
It supports **1-to-1 WebRTC video calls** by allowing two users to join a common **room** and 
exchange connection details needed to establish a peer-to-peer connection.

---

### ✅ **Code Explained Step-by-Step**

```js
const WebSocket = require("ws");
```

* Imports the WebSocket library (make sure it's installed with `npm install ws`).

---

```js
const wss = new WebSocket.Server({ port: 8080 });
```

* Starts a WebSocket server listening on port `8080`.

---

```js
const rooms = {};
```

* A JavaScript object used to keep track of rooms.
* Each `room` holds an array of connected clients (up to 2 peers per room).

---

### 🔌 **Connection Event**

```js
wss.on("connection", ws => {
```

* Triggered when a client connects to the server (`ws` is the client socket).

---

### 💬 **Message Handler**

```js
ws.on("message", message => {
  const data = JSON.parse(message);
  const { type, room } = data;
```

* Listens for messages from the client.
* Each message must be a JSON string, parsed into `data`.
* The expected format includes `type` (e.g., `"join"`, `"offer"`, `"answer"`, `"candidate"`) and a `room` identifier.

---

### 🧩 **Room Join Logic**

```js
  if (!rooms[room]) rooms[room] = [];
  if (type === "join") {
    rooms[room].push(ws);
    if (rooms[room].length === 2) {
      rooms[room].forEach(s => s.send(JSON.stringify({ type: "ready", room })));
    }
  }
```

* If the room doesn't exist, it's created as an empty array.
* On `"join"`, the client socket is added to the room.
* If **two users** are in the same room, both are notified with a `"ready"` message, triggering WebRTC negotiation.

---

### 🔁 **Relay Offer/Answer/Candidates**

```js
} else if (["offer", "answer", "candidate"].includes(type)) {
  rooms[room].forEach(s => {
    if (s !== ws && s.readyState === WebSocket.OPEN) {
      s.send(JSON.stringify(data));
    }
  });
}
```

* For `offer`, `answer`, or `candidate` messages:

  * The server **forwards the message to the other peer** in the room (not back to the sender).
  * This is the signaling step that allows WebRTC peers to negotiate a connection.

---

### 🔌 **Client Disconnect Handler**

```js
ws.on("close", () => {
  for (const room in rooms) {
    rooms[room] = rooms[room].filter(s => s !== ws);
    if (rooms[room].length === 0) delete rooms[room];
  }
});
```

* When a client disconnects:

  * It is removed from any rooms it belonged to.
  * If a room becomes empty, it is deleted from memory.

---

### 🧠 Summary

| Component                        | Role                                                            |
| -------------------------------- | --------------------------------------------------------------- |
| `rooms`                          | Keeps track of clients in rooms.                                |
| `join`                           | Adds client to room. Triggers "ready" if two users are present. |
| `offer` / `answer` / `candidate` | Relayed between peers to negotiate WebRTC connection.           |
| `close`                          | Removes disconnected users from rooms.                          |

---
## Diagram

Below the  **diagram** and a **client-side flow breakdown** to help you understand how the **WebRTC room-based app** works with this signaling server.

---

## 🔄 **WebRTC 1-to-1 Room-Based App Flow**

### 🧩 Key Components

* **Browser A / B**: WebRTC clients (users in browsers)
* **WebSocket Server**: Handles signaling (e.g., `offer`, `answer`, `ICE candidates`)
* **STUN Server**: Helps each peer find its public IP address behind NAT
* **WebRTC PeerConnection**: Direct connection between browsers for media (video/audio)

---

## 📈 Diagram: Room-Based WebRTC Signaling Flow

```
+-----------+         WebSocket Signaling         +-----------+
| Browser A | <---------------------------------> | Browser B |
|           |              Server                |           |
+-----------+                                     +-----------+
      |                                                |
      |---------- Join Room (e.g., "room123") -------->|
      |<--------------- "ready" if two peers ----------|
      |                                                |
      |----- getUserMedia + createOffer (WebRTC) ----->|
      |<----------- Answer + setRemoteDescription -----|
      |------ ICE candidates (network discovery) ----->|
      |<----------- ICE candidates (peer B) -----------|
      |                                                |
      |====== Direct P2P video/audio over WebRTC ======|
```

---

## 💻 Client-Side Flow (JavaScript in `client.js`)

### 1. **Join a Room**

```js
socket.send({ type: "join", room });
```

* User enters a room name and clicks **Join Room**.
* This sends a `"join"` event to the WebSocket server.

---

### 2. **Receive "ready" Signal**

```js
if (msg.type === "ready") { ... }
```

* When **two users are in the same room**, the server broadcasts a `"ready"` event.
* This triggers WebRTC peer connection setup on both clients.

---

### 3. **Start Media & Create Offer**

```js
navigator.mediaDevices.getUserMedia(...)
pc.createOffer() → pc.setLocalDescription()
socket.send({ type: "offer", offer, room })
```

* The caller sends a WebRTC offer to the server.
* The server forwards it to the second user in the same room.

---

### 4. **Receive Offer, Send Answer**

```js
pc.setRemoteDescription(msg.offer)
pc.createAnswer() → pc.setLocalDescription()
socket.send({ type: "answer", answer, room })
```

* The second user responds with an answer.
* The signaling server relays it back to the first user.

---

### 5. **Exchange ICE Candidates**

```js
pc.onicecandidate = e => {
  socket.send({ type: "candidate", candidate: e.candidate, room });
};
```

* Both browsers find optimal network routes (NAT traversal).
* ICE candidates are exchanged via the signaling server.

---

### 6. **Direct WebRTC Connection**

* Once negotiation is complete and ICE candidates are set:

  * Browsers establish a **direct peer-to-peer connection** for media streaming.
  * No server handles the video after this point—it's P2P.

---

## 🧠 Recap

| Step | Action                        | Who Does It?           |
| ---- | ----------------------------- | ---------------------- |
| 1    | Enter room name, click "Join" | User                   |
| 2    | Send `"join"` via WebSocket   | Client                 |
| 3    | Receive `"ready"` if 2 users  | Server                 |
| 4    | Offer/Answer exchange         | WebRTC via signaling   |
| 5    | ICE candidate exchange        | WebRTC via signaling   |
| 6    | Direct media stream           | WebRTC peer connection |

---


