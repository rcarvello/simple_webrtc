const roomInput = document.getElementById("roomInput");
const joinBtn = document.getElementById("joinBtn");
const localVideo = document.getElementById("localVideo");
const remoteVideo = document.getElementById("remoteVideo");

const socket = new WebSocket("wss://yourdomain.com/ws");
let room = "";
let pc;

const config = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
};

joinBtn.onclick = async () => {
  room = roomInput.value.trim();
  if (!room) return alert("Room name required");
  socket.send(JSON.stringify({ type: "join", room }));

  const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  localVideo.srcObject = stream;

  pc = new RTCPeerConnection(config);
  stream.getTracks().forEach(track => pc.addTrack(track, stream));

  pc.onicecandidate = e => {
    if (e.candidate) {
      socket.send(JSON.stringify({ type: "candidate", candidate: e.candidate, room }));
    }
  };

  pc.ontrack = e => {
    remoteVideo.srcObject = e.streams[0];
  };
};

socket.onmessage = async ({ data }) => {
  const msg = JSON.parse(data);
  if (msg.room !== room) return;

  if (msg.type === "ready") {
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    socket.send(JSON.stringify({ type: "offer", offer, room }));
  } else if (msg.type === "offer") {
    await pc.setRemoteDescription(new RTCSessionDescription(msg.offer));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    socket.send(JSON.stringify({ type: "answer", answer, room }));
  } else if (msg.type === "answer") {
    await pc.setRemoteDescription(new RTCSessionDescription(msg.answer));
  } else if (msg.type === "candidate") {
    if (msg.candidate) {
      await pc.addIceCandidate(new RTCIceCandidate(msg.candidate));
    }
  }
};
