# client.js
 `client.js` file contains the **client-side logic** for a **1-to-1 WebRTC video chat** that uses a **room-based signaling system** over WebSockets. 
 
 Let’s break it down step-by-step so you can understand how it works.

---

## 🧠 Purpose

The code allows:

* Two users to enter the same **room name**
* Exchange **WebRTC signaling** messages (`offer`, `answer`, `ICE candidates`) via a WebSocket server
* Establish a **peer-to-peer video call**

---

## 🔍 Full Code Explanation

### 🔹 Get DOM Elements

```js
const roomInput = document.getElementById("roomInput");
const joinBtn = document.getElementById("joinBtn");
const localVideo = document.getElementById("localVideo");
const remoteVideo = document.getElementById("remoteVideo");
```

These are HTML elements:

* `roomInput`: Text box where the user enters a room name
* `joinBtn`: Button to join the room
* `localVideo`: Video element showing the local webcam
* `remoteVideo`: Video element showing the remote stream

---

### 🔹 Create WebSocket Connection

```js
const socket = new WebSocket("wss://yourdomain.com/ws");
```

* Connects to the signaling server via secure WebSocket (`wss`)
* This is how messages like `offer`, `answer`, and `candidate` are exchanged between users

---

### 🔹 ICE Server Configuration (STUN)

```js
const config = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
};
```

* Defines STUN server used to discover public IPs behind NAT
* Google’s public STUN server is used here

---

### 🔹 Join Button Click Logic

```js
joinBtn.onclick = async () => {
  room = roomInput.value.trim();
  if (!room) return alert("Room name required");
  socket.send(JSON.stringify({ type: "join", room }));
```

* On click, gets the room name
* Sends a `"join"` message via WebSocket to join the room on the server

---

### 🔹 Get Local Stream

```js
  const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  localVideo.srcObject = stream;
```

* Prompts the user to allow webcam and microphone access
* Displays the local video stream

---

### 🔹 Set Up RTCPeerConnection

```js
  pc = new RTCPeerConnection(config);
  stream.getTracks().forEach(track => pc.addTrack(track, stream));
```

* Creates a new peer connection using STUN config
* Adds the audio/video tracks to the connection

---

### 🔹 Handle ICE Candidates

```js
  pc.onicecandidate = e => {
    if (e.candidate) {
      socket.send(JSON.stringify({ type: "candidate", candidate: e.candidate, room }));
    }
  };
```

* As the browser discovers connection paths (candidates), they are sent to the signaling server

---

### 🔹 Display Remote Stream

```js
  pc.ontrack = e => {
    remoteVideo.srcObject = e.streams[0];
  };
```

* When a remote track is received, display it in the `remoteVideo` element

---

## 📩 Handle Incoming Signaling Messages

```js
socket.onmessage = async ({ data }) => {
  const msg = JSON.parse(data);
  if (msg.room !== room) return;
```

* Listens for messages from the WebSocket server
* Ignores messages from other rooms

---

### 🔸 "ready" → Create Offer (Caller)

```js
  if (msg.type === "ready") {
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    socket.send(JSON.stringify({ type: "offer", offer, room }));
  }
```

* If two users are in the room, the server sends `"ready"`
* The first user to join sends an `offer` to the second user

---

### 🔸 "offer" → Set Remote and Respond with Answer (Callee)

```js
  else if (msg.type === "offer") {
    await pc.setRemoteDescription(new RTCSessionDescription(msg.offer));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    socket.send(JSON.stringify({ type: "answer", answer, room }));
  }
```

* The second user receives the `offer`, sets it as the remote description
* Then creates an `answer` and sends it back

---

### 🔸 "answer" → Set Remote Description (Caller)

```js
  else if (msg.type === "answer") {
    await pc.setRemoteDescription(new RTCSessionDescription(msg.answer));
  }
```

* The first user sets the remote description with the received `answer`

---

### 🔸 "candidate" → Add ICE Candidate (Both Sides)

```js
  else if (msg.type === "candidate") {
    if (msg.candidate) {
      await pc.addIceCandidate(new RTCIceCandidate(msg.candidate));
    }
  }
```

* As ICE candidates are exchanged, each client adds the candidates to their peer connection

---

## ✅ Final Result

Once signaling is complete:

* A **direct peer-to-peer connection** is established
* Audio/video is streamed **without going through the server**

---

## Future extensions

* A React or Vue version
* Integration with authentication (so users don’t need to manually enter room IDs)
